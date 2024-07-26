const express = require("express");
const cart = require("../service/cart");
const router = express.Router();

router.get("/", async (req, res) => {
  const cartList = await cart.getCartList(req.query.id);
  return res.json(cartList);
});

router.get("/recent", async (req, res) => {
  const userId = req.query.id;
  const cartItems = await cart.getRecentCart(userId);
  return res.json(cartItems);
});

module.exports = router;
