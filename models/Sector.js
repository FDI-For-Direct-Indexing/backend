const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const SectorSchema = new mongoose.Schema(
  {
    corporates_code: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sector = monkeyRankingDbConnection.model("Sector", SectorSchema);
SectorSchema.index({ code: 1 });

module.exports = Sector;
