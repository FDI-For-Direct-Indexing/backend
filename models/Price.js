const { mongo, default: mongoose } = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const PriceSchema = new mongoose.Schema(
  {
    corporate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporate",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    compare: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Price = monkeyRankingDbConnection.model("Price", PriceSchema);

module.exports = Price;
