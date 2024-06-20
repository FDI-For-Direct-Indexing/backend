var express = require("express");
var router = express.Router();
const { currentPrice } = require("../service/koreainvestmentAPI/realtimePrice");

// 클라이언트 요청 처리 (하루치 데이터 전송)
router.get('/price/:stockCode', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const stockPrices = await StockPrice.find({
    timestamp: { $gte: today, $lt: tomorrow },
  });
  res.json(stockPrices);
});

// 주식현재가 시세
// const connectPriceSocket () => {
router.get("/:stockCode", async (req, res) => {
  const { stockCode } = req.params;
  const cp = await currentPrice(stockCode);
  res.json(cp);
});

  // // 실시간 체결가 (소켓 연결)
// // const connectPriceSocket () => {
// router.get("/:stockCode", async (req, res) => {
//   const { stockCode } = req.params;

//   // 9 ~ 3시 장 중에만 소켓 연결
//   // 이외 시간에는 DB에서 가격 가져오기

//   let approval_key = await getStoredApprovalKey();

//   // oauth 토큰이 없으면 새로 발급
//   if (!approval_key) {
//     approval_key = await getApprovalKey();
//   }

//   console.log("approval_key", approval_key);

//   const ws = await connectWebSocket(stockCode, approval_key);

//   var iv = null;
//   var key = null;
//   var isFirstMessage = true;

//   // 소켓 연결 후 '주가' 메시지를 받으면 처리
//   ws.on("message", function incoming(data) {
//     console.log('Socket message: ', data);
//     const jsonData = JSON.parse(data);

//     if (isFirstMessage){
//       iv = jsonData.body.output.iv;
//       key = jsonData.body.output.key;
//       // console.log('msg1: !!! : ',jsonData.body.msg1);
//       isFirstMessage = false;
//     }
//     // else if (jsonData.body.output && jsonData.body.output.iv && jsonData.body.output.key) {
//     else if (iv && key) {
//       // const decryptedData = decryptData(data, jsonData.body.output.iv, jsonData.body.output.key);
//       const decryptedData = decryptData(data, iv, key);
//       res.json({ data: decryptedData });
//     } else {
//       res.json({ data: jsonData }); // 비암호화 데이터 혹은 기타 메시지 처리
//     }
//     // ws.close(); // 메시지를 받은 후 연결을 닫습니다.
//   });

//   ws.on("error", function error(error) {
//     res.status(500).json({ error: "WebSocket error" });
//   });
// });

module.exports = router;