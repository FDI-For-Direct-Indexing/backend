const { mongo, default: mongoose } = require("mongoose");

const StockSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    return_on_equity: {
      type: Number,
      required: false,
    },
    gross_profit_margin: {
      type: Number,
      required: false,
    },
    net_profit_margin: {
      type: Number,
      required: false,
    },
    debt_to_equity_ratio: {
      type: Number,
      required: false,
    },
    quick_ratio: {
      type: Number,
      required: false,
    },
    current_ratio: {
      type: Number,
      required: false,
    },
    equity_ratio: {
      type: Number,
      required: false,
    },
    interest_coverage_ratio: {
      type: Number,
      required: false,
    },
    asset_turnover_ratio: {
      type: Number,
      required: false,
    },
    inventory_turnover_ratio: {
      type: Number,
      required: false,
    },
    accounts_receivable_turnover_ratio: {
      type: Number,
      required: false,
    },
    sales_growth_rate: {
      type: Number,
      required: false,
    },
    profit_growth_rate: {
      type: Number,
      required: false,
    },
    asset_growth_rate: {
      type: Number,
      required: false,
    },
    ogong_rate: {
      type: Number,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
