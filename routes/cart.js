const express = require("express");
const cart = require("../service/cart");
const router = express.Router();

router.get("/", async (req, res) => {
  const cartList = await cart.getCartList(req.query.id);
  return res.json(cartList);
});

module.exports = router;
