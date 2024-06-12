var express = require("express");
const stocks = require("../service/stocksDetail");
var router = express.Router();

/**
 * 수익성: proTotalproROE, proTotalproOperatingProfitMargin, prototalproNetProfitMargin
 * 성장성: groTotalInventoryTurnoverPeriod, groTotalisNetIncomeYoY, groTotalisOperatingProfitLossYoY, groTotalisReveneueYoY
 * 안정성: saAverageStaDebtRatio, saAverageStaCurrentRatio
 * 효율성: effInventoryTurnoverPeriod, effPayablesTurnoverPeriod, effReceivablesTurnoverPeriod
 */

/* GET stock */
router.get("/:code", function (req, res, next) {
  console.log(req.params);

  return res.json(stocks.getStockFundamentals(req.params.code));
});

module.exports = router;
