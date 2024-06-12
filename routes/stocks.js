const express = require("express");
const router = express.Router();
const stocks = require("../service/stocks");


router.get("/search/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchCorporate(keyword));
});

router.get("/include/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchIncludedCorporate(keyword));
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
