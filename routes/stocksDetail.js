var express = require("express");
const stocks = require("../service/stocksDetail");
const router = express.Router();

/**
 * 수익성: proTotalproROE, proTotalproOperatingProfitMargin, prototalproNetProfitMargin
 * 성장성: groTotalInventoryTurnoverPeriod, groTotalisNetIncomeYoY, groTotalisOperatingProfitLossYoY, groTotalisReveneueYoY
 * 안정성: saAverageStaDebtRatio, saAverageStaCurrentRatio
 * 효율성: effInventoryTurnoverPeriod, effPayablesTurnoverPeriod, effReceivablesTurnoverPeriod
 */

/* GET stock */
router.get("/:code", async function (req, res, next) {
  return res.json(await stocks.getStockFundamentals(req.params.code));
});


module.exports = router;
