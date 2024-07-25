const express = require("express");
const { default: axios } = require("axios");
const router = express.Router();

async function getNaverChart(request_body) {
  try {
    const response = await axios.post(
      "https://openapi.naver.com/v1/datalab/search",
      JSON.stringify(request_body),
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_TREND_API_ID,
          "X-Naver-Client-Secret": process.env.NAVER_TREND_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(JSON.stringify(response.data.results[0].data));
    return response.data.results[0].data;
  } catch (err) {
    throw err;
  }
}

router.get("/", async function (req, res, next) {
  const keywords = req.query.keywords;

  if (!keywords) {
    return res
      .status(400)
      .json({ error: "keywords query parameter is required" });
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const endDateString = endDate.toISOString().split("T")[0];
  const startDateString = startDate.toISOString().split("T")[0];

  var request_body = {
    startDate: startDateString,
    endDate: endDateString,
    timeUnit: "date",
    keywordGroups: [
      {
        groupName: keywords,
        keywords: [keywords],
      },
    ],
  };

  return res.json(await getNaverChart(request_body));
});

module.exports = router;
