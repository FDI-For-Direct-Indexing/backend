var express = require("express");
const Price = require("../models/Price");
var router = express.Router();

// 클라이언트 요청 처리 (하루치 데이터 전송)
router.get("/price/:stockCode", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const stockPrices = await Price.find({
    timestamp: { $gte: today, $lt: tomorrow },
  });

  res.json(stockPrices);
});

module.exports = router;
