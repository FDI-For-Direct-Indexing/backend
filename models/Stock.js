const { mongo, default: mongoose } = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const StockSchema = new mongoose.Schema(
  {
    stock: {
      type: String,
      required: true,
    },
    ogong_rate: {
      type: Number,
      required: false,
    },
    pro_roe: {
      type: Number,
      required: false,
    },
    pro_operating_profit_margin: {
      type: Number,
      required: false,
    },
    pro_net_profit_margin: {
      type: Number,
      required: false,
    },
    gro_inventory_turnover_period: {
      type: Number,
      required: false,
    },
    gro_is_net_income_yoy: {
      type: Number,
      required: false,
    },
    gro_is_operatingprofit_loss_yoy: {
      type: Number,
      required: false,
    },
    gro_is_reveneue_yoy: {
      type: Number,
      required: false,
    },
    sta_debt_ratio: {
      type: Number,
      required: false,
    },
    sta_current_ratio: {
      type: Number,
      required: false,
    },
    eff_inventory_turnover_period: {
      type: Number,
      required: false,
    },
    eff_payables_turnover_period: {
      type: Number,
      required: false,
    },
    eff_receivables_turnover_period: {
      type: Number,
      required: false,
    },
    asset_growth_rate: {
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

/**
{
  "corporate_id":"66694560075a9e615dbe4195",
  "stock":"삼성전자?",
  "ogong_rate": 24.3,
  "pro_roe":33,
 	"pro_operating_profit_margin" :87,
  "pro_net_profit_margin":33,
  "gro_inventory_turnover_period":33,
  "gro_is_net_income_yoy":22,
  "gro_is_operatingprofit_loss_yoy":22,
  "gro_is_reveneue_yoy":64,
  "sta_debt_ratio":64,
  "sta_current_ratio":98,
  "eff_inventory_turnover_period":63,
  "eff_payables_turnover_period":66,
  "eff_receivables_turnover_period":55,
  "asset_growth_rate":42 
}
 */
