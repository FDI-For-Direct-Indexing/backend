var express = require("express");
const stocks = require("../service/stocksDetail");
const router = express.Router();
const { setCurrentStockCode } = require("../service/stocksDetail");
const { onCodeRetrieved } = require("../service/koreainvestmentAPI/kisSocket");

/**
 * 수익성: proTotalproROE, proTotalproOperatingProfitMargin, prototalproNetProfitMargin
 * 성장성: groTotalInventoryTurnoverPeriod, groTotalisNetIncomeYoY, groTotalisOperatingProfitLossYoY, groTotalisReveneueYoY
 * 안정성: saAverageStaDebtRatio, saAverageStaCurrentRatio
 * 효율성: effInventoryTurnoverPeriod, effPayablesTurnoverPeriod, effReceivablesTurnoverPeriod
 */

/* GET stock */
router.get("/:code", async function (req, res, next) {
  const stockCode = req.params.code;
  setCurrentStockCode(stockCode);
  onCodeRetrieved(stockCode);
  const stockInfo = await stocks.getStockFundamentals(req.params.code);
  return res.json(stockInfo);
});

module.exports = router;
