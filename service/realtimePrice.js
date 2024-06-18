const WebSocket = require("ws");
const crypto = require("crypto");

function connectWebSocket(stockCode, approval_key) {
  const ws = new WebSocket(
    "ws://ops.koreainvestment.com:21000/tryitout/H0STCNT0"
  );

  ws.on("open", function open() {
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
          tr_key: stockCode,
        },
      },
    });
    console.log("Sending message:", message);
    ws.send(message);
  });

  ws.on("message", function incoming(data) {
    console.log("message Received:", data.toString());
    // 다음 단계: 데이터를 파싱하고 필요한 작업 수행
  });

  ws.on("error", function error(error) {
    console.error("WebSocket error:", error);
  });

  ws.on("close", function close() {
    console.log("WebSocket connection closed");
  });

  return ws;
}

function decryptData(encryptedData, iv, key) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { connectWebSocket, decryptData };
