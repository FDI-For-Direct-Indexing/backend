const WebSocket = require("ws");
const CryptoJS = require("crypto-js");
const Price = require("../../models/Price");
const Corporate = require("../../models/Corporate");
const { getStoredApprovalKey } = require("./oauth");
const {
  getCurrentStockCode,
  saveStockPrice,
  setCurrentStockCode,
  setPriceCompare,
  getWsStatus,
} = require("../stocksDetail");

const ws = new WebSocket(
  "ws://ops.koreainvestment.com:21000/tryitout/H0STCNT0"
);

let code = null;
let resolveCodePromise;
let codePromise = new Promise((resolve) => {
  resolveCodePromise = resolve;
});

async function waitForCode() {
  if (!code) {
    await codePromise;
  }
  return code;
}

ws.on("open", async function open() {
  console.log("KIS WebSocket connection opened");

  const approval_key = await getStoredApprovalKey();
  const code = await waitForCode();

  if (!code) {
    console.error("No stock code found");
    return;
  } else {
    const message = JSON.stringify({
      header: {
        approval_key: approval_key,
        custtype: "P",
        tr_type: "1",
        "content-type": "application/json; charset=UTF-8",
      },
      body: {
        input: {
          tr_id: "H0STCNT0",
          tr_key: code, // 임의로 삼성전자 코드 넣음
        },
      },
    });
    ws.send(message);
  }
});

var firstConnection = true;
var iv = null;
var key = null;

ws.on("message", async function incoming(data) {
  const responseData = data.toString("utf8");
  if (firstConnection) {
    const parsedData = JSON.parse(responseData);
    if (parsedData.header.tr_id === "PINGPONG") {
      console.log("Received PINGPONG");
      ws.close();
      return;
    } else if (parsedData.body.msg1 === "SUBSCRIBE SUCCESS") {
      console.log("Subscription successful");
      iv = parsedData.body.output.iv;
      key = parsedData.body.output.key;
      firstConnection = false;
    }
  } else {
    const fields = responseData.split("|");
    if (fields[1] === "H0STCNT0" && fields.length > 3) {
      let stockData = null;

      if (fields[0] === "0") {
        // 암호화되지 않은 데이터
        stockData = await processStockData(fields[3]);
      } else {
        // 암호화된 데이터
        const decryptedData = decryptData(fields[3], key, iv);
        if (decryptedData) {
          stockData = await processStockData(decryptedData);
        } else {
          console.error("Failed to decrypt data");
        }
      }

      if (stockData) {
        saveStockPrice(stockData[0]);
        setPriceCompare(stockData[1]);
      }
    } else {
      console.log("Received non-trading data, ignoring:", responseData);
      ws.close();
    }
  }
});

ws.on("error", function error(error) {
  console.error("KIS WebSocket error:", error);
});

ws.on("close", function close() {
  console.log("KIS WebSocket connection closed");
  setCurrentStockCode(null);
});

// return ws;

function decryptData(data, key, iv) {
  try {
    // AES-256 암호화된 데이터를 String 으로 복호화
    const bytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Base64.parse(key), {
      iv: CryptoJS.enc.Base64.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
}

async function processStockData(data) {
  if (!data) {
    console.error("No data to process");
    return null;
  }

  const response = data.split("^");
  if (response.length < 5) {
    console.error("Invalid stock data format:", data);
    return null;
  }

  const stockCode = response[0];
  const price = parseInt(response[2], 10);
  const compare = parseInt(response[4], 10);

  setCurrentStockCode(stockCode);
  saveStockPrice(price);
  setPriceCompare(compare);

  return [price, compare];
}

function onCodeRetrieved(retrievedCode) {
  code = retrievedCode;
  if (resolveCodePromise) {
    resolveCodePromise();
  }
}

module.exports = ws;
module.exports.onCodeRetrieved = onCodeRetrieved;
