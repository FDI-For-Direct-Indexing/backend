const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const CartSchema = new mongoose.Schema(
  {
    corporate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporate",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = monkeyRankingDbConnection.model("Cart", CartSchema);
CartSchema.index({ code: 1 });

module.exports = Cart;
