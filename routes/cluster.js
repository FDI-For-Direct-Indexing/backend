const express = require("express");
const router = express.Router();
const cluster = require("../service/cluster");

router.post("/", async (req, res) => {
  const { stockList, sliderValues } = req.body;

  return res.json(await cluster.getClusterResult(stockList, sliderValues));
});

module.exports = router;
