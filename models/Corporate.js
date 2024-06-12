const { mongo, default: mongoose } = require("mongoose");

const CorporateSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
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

const Corporate = mongoose.model("corporates", CorporateSchema);

module.exports = Corporate;
