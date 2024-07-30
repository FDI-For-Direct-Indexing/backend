var express = require("express");
const sector = require("../service/sector");
const router = express.Router();

router.get("/all", async (req, res) => {
  const reqSector = req.query.sector;
  const sectors = await sector.getStocksBySector(reqSector);
  res.json(sectors);
});

router.get("/cart", async (req, res) => {
  const userId = req.query.id;
  const reqSector = req.query.sector;
  const cartItems = await sector.getCartItemsBySector(userId, reqSector);
  res.json(cartItems);
});

router.get("/:code", async (req, res) => {
  const response = await sector.getStockSector(req.params.code);
  res.json(response);
});

module.exports = router;
