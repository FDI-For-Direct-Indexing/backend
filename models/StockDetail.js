const { mongo, default: mongoose } = require("mongoose");


const StockDetailSchema = new mongoose.Schema(
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
      ref: "CorporateFundamental",
    },

  },
  {
    timestamps: true,
  }
);

const StockDetail = mongoose.model("Stock", StockDetailSchema);

module.exports = StockDetail;
