const Corporate = require("../models/Corporate");
const Price = require("../models/Price");
const Cart = require("../models/Cart");

const getCartList = async (user_id) => {
  try {
    // user_id에 해당하는 모든 카트를 찾음
    const carts = await Cart.find({ user_id });

    // 각 카트의 corporate_id로 Corporate 모델 객체를 가져옴
    const cartItems = await Promise.all(
      carts.map(async (cart) => {
        const corporate = await Corporate.findById(cart.corporate_id);
        const price = await Price.findOne({ corporate_id: corporate._id });

        return {
          code: corporate.code,
          name: corporate.name,
          price: price.price,
          compare: price.compare,
        };
      })
    );

    return cartItems;
  } catch (error) {
    return error;
  }
};

const getRecentCart = async (userId) => {
  try {
    const cartItems = await Cart.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(2);

    const items = await Promise.all(
      cartItems.map(async (cart) => {
        const corporate = await Corporate.findById(cart.corporate_id);
        const price = await Price.findOne({ corporate_id: corporate._id });

        return {
          name: corporate.name,
          price: price.price,
        };
      })
    );
    return items;
  } catch (error) {
    return error;
  }
};

const addCart = async (code, user_id) => {
  try {
    // code에 해당하는 Corporate 객체를 가져옴
    const corporate = await Corporate.findOne({ code });
    const cart = await Cart.create({
      corporate_id: corporate._id,
      user_id: user_id,
    });

    return cart;
  } catch (error) {
    return error;
  }
};
module.exports = {
  getCartList,
};
