const express = require("express");
const router = express.Router();
const { getNaverChart } = require("../service/trendMention");

router.get("/", async function (req, res, next) {
  const keywords = req.query.keywords;

  if (!keywords) {
    return res
      .status(400)
      .json({ error: "keywords query parameter is required" });
  }
  
  await getNaverChart([keywords], 30).then((obj) => {
    res.json(obj[0].data);
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
  
});

module.exports = router;
