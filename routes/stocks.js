var express = require("express");
var router = express.Router();

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

module.exports = router;
