const express = require("express");
const router = express.Router();
const corporates = require("../service/corporates");

router.get("/search", async function (req, res, next) {
  const keyword = req.query.keyword;
  return res.json(await corporates.searchCorporate(keyword));
});

router.get("/include", async function (req, res, next) {
  const keyword = req.query.keyword;
  return res.json(await corporates.searchIncludedCorporate(keyword));
});

router.get("/list", async function (req, res, next) {
  return res.json(await corporates.getCorporates());
});
module.exports = router;
