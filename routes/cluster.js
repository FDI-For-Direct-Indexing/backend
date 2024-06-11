const express = require("express");
const router = express.Router();
const cluster = require("../service/cluster");

router.post("/", async (req, res) => {
  const { stockList } = req.body;

  return res.json(await cluster.getClusterResult(stockList));
});

module.exports = router;
