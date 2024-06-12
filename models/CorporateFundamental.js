const { mongo, default: mongoose } = require("mongoose");

const CorporateFundamentalSchema = new mongoose.Schema(
  {
    code: {
      type: String,
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

const CorporateFundamental = mongoose.model("CorporateFundamental", CorporateFundamentalSchema);

module.exports = CorporateFundamental;
