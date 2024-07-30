var express = require("express");
const sector = require("../service/sector");
const router = express.Router();

router.get("/all", async (req, res) => {
  const reqSector = req.query.sector;
  const sectors = await sector.getStocksBySector(reqSector);
  res.json(sectors);
});

module.exports = router;
