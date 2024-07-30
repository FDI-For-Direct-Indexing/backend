const express = require("express");
const { default: axios } = require("axios");
const router = express.Router();

async function fetchKeyword(body) {
  const baseURL =
    "https://m.some.co.kr/sometrend/analysis/composite/v2/association-transition";
  const headers = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  };
  try {
    const response = await axios.post(baseURL, body, { headers });
    const respdata = response.data.item.dataList[0].data.rows[0];
    return respdata.associationData.slice(0, 20);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

router.get("/", async function (req, res, next) {
  const keywords = req.query.keywords;

  if (!keywords) {
    return res
      .status(400)
      .json({ error: "keywords query parameter is required" });
  }

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const startDate = formatDate(sevenDaysAgo);
  const endDate = formatDate(today);

  const keywordBody = {
    keyword: keywords.toLowerCase(),
    scoringKeyword: keywords.toLowerCase(),
    startDate,
    endDate,
    analysisMonth: 0,
    categoryList:
      "politician,celebrity,sportsman,characterEtc,government,business,agency,groupEtc,tourism,restaurant,shopping,scene,placeEtc,brandFood,cafe,brandBeverage,brandElectronics,brandFurniture,brandBeauty,brandFashion,brandEtc,productFood,productBeverage,productElectronics,productFurniture,productBeauty,productFashion,productEtc,economy,social,medicine,education,culture,sports,cultureEtc,animal,plant,naturalPhenomenon,naturalEtc",
    categorySetName: "SMT",
    exForHash: "",
    excludeWordOperators: "||",
    includeWordOperators: "||",
    keywordFilterExcludes: null,
    keywordFilterIncludes: null,
    period: "1",
    sources: "news",
    synonym: null,
    topN: 500,
  };

  return res.json(await fetchKeyword(keywordBody));
});

module.exports = router;
