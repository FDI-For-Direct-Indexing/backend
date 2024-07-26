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
module.exports = {
  getCartList,
};
