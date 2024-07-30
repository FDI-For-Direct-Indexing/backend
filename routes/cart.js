const express = require("express");
const cart = require("../service/cart");
const router = express.Router();

router.get("/", async (req, res) => {
  const cartList = await cart.getCartList(req.query.id);
  return res.json(cartList);
});

router.get("/:code", async (req, res) => {
  const cartItem = await cart.getStockFromCart(req.params.code, req.query.id);
  return res.json(cartItem);
});

router.get("/recent", async (req, res) => {
  const userId = req.query.id;
  const cartItems = await cart.getRecentCart(userId);
  return res.json(cartItems);
});

router.post("/", async (req, res) => {
  const savedCart = await cart.addCart(req.body.code, req.body.userId);
  return res.status(201).json(savedCart);
});

router.delete("/", async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({
      error:
        "Invalid input. Request body should be an array of objects with 'code' and 'userId' properties.",
    });
  }

  try {
    const deletePromises = items.map((item) =>
      cart.deleteCart(item.code, item.userId)
    );
    const deletedCarts = await Promise.all(deletePromises);

    return res.json(deletedCarts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
