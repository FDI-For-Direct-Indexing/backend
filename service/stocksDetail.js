const Stock = require("../models/Stock");
const Corporate = require("../models/Corporate");
const axios = require("axios");
const cheerio = require("cheerio");

const getStockFundamentals = async (code) => {
  try {
    const corporate = await Corporate.findOne({ code: code });
    const stock = await Stock.findOne({ corporate_id: corporate.id });

    const profit_key = ["영업이익률", "ROA", "ROE"];
    const stability_key = ["유동비율", "부채비율"];
    const growth_key = ["매출액증가율", "영업이익증가율"];
    const efficiency_key = ["총자산회전율", "총부채회전율", "총자본회전율"];

    const profit_value = [
      stock.op_profit_margin.toFixed(1),
      stock.roa.toFixed(1),
      stock.roe.toFixed(1),
    ];
    const stability_value = [
      stock.cur_ratio.toFixed(1),
      stock.debt_eq_ratio.toFixed(1),
    ];
    const growth_value = [
      stock.sales_growth_rate.toFixed(1),
      stock.op_income_growth_rate.toFixed(1),
    ];
    const efficiency_value = [
      stock.asset_turnover.toFixed(1),
      stock.debt_turnover.toFixed(1),
      stock.capital_turnover.toFixed(1),
    ];

    const profit = [];
    for (let i = 0; i < profit_key.length; i++) {
      profit.push({
        matrix: profit_key[i],
        rates: profit_value[i],
      });
    }

    const stability = [];
    for (let i = 0; i < stability_key.length; i++) {
      stability.push({
        matrix: stability_key[i],
        rates: stability_value[i],
      });
    }

    const growth = [];
    for (let i = 0; i < growth_key.length; i++) {
      growth.push({
        matrix: growth_key[i],
        rates: growth_value[i],
      });
    }

    const efficiency = [];
    for (let i = 0; i < efficiency_key.length; i++) {
      efficiency.push({
        matrix: efficiency_key[i],
        rates: efficiency_value[i],
      });
    }

    const result = {
      code: corporate.code,
      name: corporate.name,
      price: corporate.price,
      ogong_rate: corporate.ogong_rate,

      profit: profit,
      stability: stability,
      growth: growth,
      efficiency: efficiency,
    };

    return result;
  } catch (error) {
    return error;
  }
};

const getStockNews = async (stockName) => {
  try {
    const response = await axios.get("https://search.daum.net/search", {
      params: {
        w: "news",
        cluster: "y",
        q: stockName,
        p: 1,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    console.log("Response data saved to response.html");

    const data = response.data;
    const $ = cheerio.load(data);
    const newsList = $("ul.c-list-basic > li");
    console.log("newsList length:", newsList.length); // 뉴스 리스트의 길이 확인

    const newsParsed = newsList
      .map((i, el) => {
        return parseNews($(el));
      })
      .get();
    console.log("newsParsed:", newsParsed); // 파싱된 뉴스 목록 확인

    return newsParsed.slice(0, 5);
  } catch (error) {
    console.error("Error in getStockNews:", error);
    return error;
  }
};

function parseNews(newsElem) {
  const press = newsElem.find(".c-tit-doc .tit_item").text().trim();
  const titleAnchor = newsElem.find(".item-title a");
  const title = titleAnchor.text().trim();
  const url = titleAnchor.prop("href");
  const date = newsElem
    .find(".c-item-content .item-contents .txt_info")
    .text()
    .trim();

  return {
    press,
    title,
    url,
    date,
  };
}

module.exports = {
  getStockFundamentals,
  getStockNews,
};
