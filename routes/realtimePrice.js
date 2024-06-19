var express = require("express");
var router = express.Router();
const { getStoredApprovalKey, getApprovalKey } = require("../service/oauth");
const { connectWebSocket, decryptData } = require("../service/realtimePrice");

router.get("/:stockCode", async (req, res) => {
  const { stockCode } = req.params;
  let approval_key = await getStoredApprovalKey();

  // oauth 토큰이 없으면 새로 발급
  if (!approval_key) {
    approval_key = await getApprovalKey();
  }

  console.log("approval_key", approval_key);

  const ws = await connectWebSocket(stockCode, approval_key);

  // 소켓 연결 후 '주가' 메시지를 받으면 처리
  ws.on("message", function incoming(data) {
    console.log(data);
    const jsonData = JSON.parse(data);
    if (jsonData.body.output && jsonData.body.output.iv && jsonData.body.output.key) {
      const decryptedData = decryptData(data, jsonData.body.output.iv, jsonData.body.output.key);
      res.json({ data: decryptedData });
    } else {
      res.json({ data: jsonData }); // 비암호화 데이터 혹은 기타 메시지 처리
    }
    ws.close(); // 메시지를 받은 후 연결을 닫습니다.
  });

  ws.on("error", function error(error) {
    res.status(500).json({ error: "WebSocket error" });
  });
});

module.exports = router;
