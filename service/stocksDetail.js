const Stock = require("../models/Stock");
const Corporate = require("../models/Corporate");
const Price = require("../models/Price");

const getStockFundamentals = async (code) => {
  try {
    const corporate = await Corporate.findOne({ code: code });
    const stock = await Stock.findOne({ corporate_id: corporate.id });

    const profit_key = ["영업이익률", "ROA", "ROE"];
    const stability_key = ["유동비율", "부채비율"];
    const growth_key = ["매출액증가율", "영업이익증가율"];
    const efficiency_key = [
      "총자산회전율",
      "총부채회전율",
      "총자본회전율",
    ];

    const profit_value = [
      (stock.op_profit_margin).toFixed(1),
      (stock.roa).toFixed(1),
      (stock.roe).toFixed(1),
    ];
    const stability_value = [
      (stock.cur_ratio).toFixed(1),
      (stock.debt_eq_ratio).toFixed(1)
    ];
    const growth_value = [
      (stock.sales_growth_rate).toFixed(1),
      (stock.op_income_growth_rate).toFixed(1)
    ];
    const efficiency_value = [
      (stock.asset_turnover).toFixed(1),
      (stock.debt_turnover).toFixed(1),
      (stock.capital_turnover).toFixed(1)
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
      growth: growth,
      stability: stability,
      efficiency: efficiency,
    };

    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getStockFundamentals,
};
