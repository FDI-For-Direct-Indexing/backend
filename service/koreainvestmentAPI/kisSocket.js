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

  const batchSize = 41; // 한 번에 요청할 종목 수
  const numBatches = Math.ceil(codeList.length / batchSize); // 필요한 배치 수 계산

  for (let batch = 0; batch < numBatches; batch++) {
    const startIndex = batch * batchSize;
    const endIndex = Math.min((batch + 1) * batchSize, codeList.length);
    const currentBatch = codeList.slice(startIndex, endIndex);

    // 새로운 접근키를 가져오는 함수 호출
    const approval_key = await (batch === 0
      ? getStoredApprovalKey()
      : issueApprovalKey());

    for (let code of currentBatch) {
      console.log("Requesting stock data for code:", code);

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
  const parsedData = JSON.parse(responseData);

  if (firstConnection) {
    if (parsedData.header.tr_id === "PINGPONG") {
      console.log("Received PINGPONG");
    } else if (parsedData.body.msg1 === "SUBSCRIBE SUCCESS") {
      console.log("Subscription successful");
      iv = parsedData.body.output.iv;
      key = parsedData.body.output.key;
      firstConnection = false;
    }
  } else {
    const fields = responseData.split("|");

    if (fields[1] === "H0STCNT0" && fields.length > 3) {
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
        prices[stockData[0]] = stockData[1];
        compares[stockData[0]] = stockData[2];
      }
    } else {
      console.log("Received non-trading data, ignoring:", responseData);
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
