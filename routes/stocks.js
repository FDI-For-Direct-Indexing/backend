const express = require("express");
const router = express.Router();
const stocks = require("../service/stocks");

/**
 * 수익성: proTotalproROE, proTotalproOperatingProfitMargin, prototalproNetProfitMargin
 * 성장성: groTotalInventoryTurnoverPeriod, groTotalisNetIncomeYoY, groTotalisOperatingProfitLossYoY, groTotalisReveneueYoY
 * 안정성: saAverageStaDebtRatio, saAverageStaCurrentRatio
 * 효율성: effInventoryTurnoverPeriod, effPayablesTurnoverPeriod, effReceivablesTurnoverPeriod
 */

/* GET stock */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/search/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchCorporate(keyword));
});

router.get("/include/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchIncludedCorporate(keyword));
});

module.exports = router;
