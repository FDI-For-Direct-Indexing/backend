const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const SectorSchema = new mongoose.Schema(
  {
    corporates_code: {
      type: String,
      require: true,
    },
    sector: {
      type: String,
      require: true,
    },
  }
);

const Sector = monkeyRankingDbConnection.model("Sector", SectorSchema);
SectorSchema.index({ corporates_code: 1 });

module.exports = Sector;