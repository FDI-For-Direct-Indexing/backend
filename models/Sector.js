const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const SectorSchema = new mongoose.Schema(
  {
    corporate_id: {
      type: Number,
      require: true,
    },
    sector: {
      type: Number,
      require: true,
    },
  }
);

const Sector = monkeyRankingDbConnection.model("Sector", SectorSchema);
module.exports = Sector;