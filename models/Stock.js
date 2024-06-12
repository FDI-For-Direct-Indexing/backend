const { mongo, default: mongoose } = require("mongoose");

/**
 * @swagger
 * components:
 *  schemas:
 *   Stock:
 *    properties:
 *      code:
 *        type: number
 *        description: 종목 코드
 *      name:
 *        type: string
 *        description: 종목 이름
 *      return_on_equity:
 *        type: number
 *        description: 자기자본이익률
 *      gross_profit_margin:
 *        type: number
 *        description: 매출총이익률
 *      net_profit_margin:
 *        type: number
 *        description: 순이익률
 *      debt_to_equity_ratio:
 *        type: number
 *        description: 부채비율
 *      quick_ratio:
 *        type: number
 *        description: 당좌비율
 *      current_ratio:
 *        type: number
 *        description: 유동비율
 *      equity_ratio:
 *        type: number
 *        description: 자기자본비율
 *      interest_coverage_ratio:
 *        type: number
 *        description: 이자보호비율
 *      asset_turnover_ratio:
 *        type: number
 *        description: 총자산회전율
 *      inventory_turnover_ratio:
 *        type: number
 *        description: 재고자산회전율
 *      accounts_receivable_turnover_ratio:
 *        type: number
 *        description: 매출채권회전율
 *      sales_growth_rate:
 *        type: number
 *        description: 매출액증가율
 *      profit_growth_rate:
 *        type: number
 *        description: 순이익증가율
 *      asset_growth_rate:
 *        type: number
 *        description: 자산증가율
 *      ogong_rate:
 *        type: number
 *        description: 오공률
 *      post:
 *        type: object
 *        properties:
 *          content:
 *            type: string
 *            description: 내용
 *          created_date:
 *            type: Date
 *            description: 생성일
 *
 */

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

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
