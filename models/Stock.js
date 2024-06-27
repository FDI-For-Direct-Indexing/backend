const { mongo, default: mongoose } = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const StockSchema = new mongoose.Schema(
  {
    cur_ratio: {
      type: Number,
      required: false,
    },
    debt_eq_ratio: {
      type: Number,
      required: false,
    },
    sales_growth_rate: {
      type: Number,
      required: false,
    },
    op_income_growth_rate: {
      type: Number,
      required: false,
    },
    op_profit_margin: {
      type: Number,
      required: false,
    },
    roa: {
      type: Number,
      required: false,
    },
    roe: {
      type: Number,
      required: false,
    },
    asset_turnover: {
      type: Number,
      required: false,
    },
    debt_turnover: {
      type: Number,
      required: false,
    },
    capital_turnover: {
      type: Number,
      required: false,
    },

    corporate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporate",
    },
  },
  {
    timestamps: true,
  }
);

const Stock = monkeyRankingDbConnection.model("Stock", StockSchema);

module.exports = Stock;
