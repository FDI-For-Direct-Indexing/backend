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
    profitability: {
      type: Number,
      required: false,
    },
    stability: {
      type: Number,
      required: false,
    },
    efficiency: {
      type: Number,
      required: false,
    },
    growth: {
      type: Number,
      required: false,
    },
    ogong_rate: {
      type: Number,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
