const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = monkeyRankingDbConnection.model("User", UserSchema);

module.exports = User;
