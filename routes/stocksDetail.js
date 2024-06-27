var express = require("express");
const stocks = require("../service/stocksDetail");
const router = express.Router();
const { setCurrentStockCode } = require("../service/stocksDetail");
const { onCodeRetrieved } = require("../service/koreainvestmentAPI/kisSocket");

/* GET stock */
router.get("/:code", async function (req, res, next) {
  const stockInfo = await stocks.getStockFundamentals(req.params.code);
  return res.json(stockInfo);
});

module.exports = router;
