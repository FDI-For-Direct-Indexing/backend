const WebSocket = require("ws");
const CryptoJS = require("crypto-js");
const { getStoredApprovalKey, issueApprovalKey } = require("./oauth");
const codeList = require("./stockCodeList");

const ws = new WebSocket(
  "ws://ops.koreainvestment.com:21000/tryitout/H0STCNT0"
);

let prices = [{}];
let compares = [{}];

ws.on("open", async function open() {
  console.log("KIS WebSocket connection opened");

  const batchSize = 40;
  const numBatches = Math.ceil(codeList.length / batchSize);

  for (let batch = 0; batch < numBatches; batch++) {
    const startIndex = batch * batchSize;
    const endIndex = Math.min((batch + 1) * batchSize, codeList.length);
    const currentBatch = codeList.slice(startIndex, endIndex);

    const approval_key = await issueApprovalKey();

    for (let code of currentBatch) {
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
            tr_key: code,
          },
        },
      });
      ws.send(message);
    }
  }
});

var firstConnection = true;
var iv = null;
var key = null;

ws.on("message", async function incoming(data) {
  const responseData = data.toString("utf8");

  if (responseData.startsWith("{") && responseData.endsWith("}")) {
    try {
      const parsedData = JSON.parse(responseData);

      if (firstConnection) {
        if (parsedData.header.tr_id === "PINGPONG") {
          console.log("Received PINGPONG");
        } else if (parsedData.body.msg1 === "SUBSCRIBE SUCCESS") {
          iv = parsedData.body.output.iv;
          key = parsedData.body.output.key;
          firstConnection = false;
        }
      } else {
        if (parsedData.header.tr_id === "PINGPONG") {
          console.log("Received PINGPONG");
        }
      }
    } catch (jsonError) {
      console.error("Failed to parse JSON:", responseData, jsonError);
    }
  } else {
    let fields = responseData.split("|");
    if (fields[1] === "H0STCNT0" && fields.length > 3) {
      let stockData;
      if (fields[0] === "0") {
        stockData = await processStockData(fields[3]);
      } else {
        const decryptedData = decryptData(fields[3], key, iv);
        if (decryptedData) {
          stockData = await processStockData(decryptedData);
        } else {
          console.error("Failed to decrypt data");
        }
      }

      if (stockData) {
        prices[stockData[0]] = stockData[1];
        compares[stockData[0]] = stockData[2];
      }
    } else {
      console.log("Received non-trading data");
    }
  }
});

ws.on("error", function error(error) {
  console.error("KIS WebSocket error:", error);
});

ws.on("close", function close() {
  console.log("KIS WebSocket connection closed");
});

function decryptData(data, key, iv) {
  try {
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

  return [stockCode, price, compare];
}

getPriceOfStock = (stockCode) => {
  return prices[stockCode];
};

getCompareOfStock = (stockCode) => {
  return compares[stockCode];
};

resetStockData = () => {
  prices = [{}];
  compares = [{}];
};

module.exports = { ws, getPriceOfStock, getCompareOfStock, resetStockData };
