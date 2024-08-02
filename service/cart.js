const Corporate = require("../models/Corporate");
const Sector = require("../models/Sector");
const Price = require("../models/Price");
const Cart = require("../models/Cart");

const getCartList = async (user_id) => {
  try {
    const carts = await Cart.find({ user_id });

    const cartItems = await Promise.all(
      carts.map(async (cart) => {
        const corporate = await Corporate.findById(cart.corporate_id);
        if (!corporate) {
          return null;
        }
        const sector = await Sector.findOne({
          corporates_code: corporate.code,
        });
        const price = await Price.findOne({ corporate_id: corporate._id });

        return {
          sector: sector.sector,
          code: corporate.code,
          name: corporate.name,
          price: price ? price.price : null,
          compare: price ? price.compare : null,
        };
      })
    );

    return cartItems.filter((item) => item !== null);
  } catch (error) {
    console.error("Error in getCartList:", error);
    throw error;
  }
};

const getStockFromCart = async (code, user_id) => {
  try {
    const corporate = await Corporate.findOne({ code });
    if (!corporate) {
      throw new Error(`Corporate not found for code: ${code}`);
    }

    const cart = await Cart.findOne({
      corporate_id: corporate._id,
      user_id,
    });

    if (!cart) {
      throw new Error(
        `Cart not found for user_id: ${user_id} and corporate_id: ${corporate._id}`
      );
    }

    const price = await Price.findOne({ corporate_id: corporate._id });

    return {
      code: corporate.code,
      name: corporate.name,
      price: price.price,
      compare: price.compare,
    };
  } catch (error) {
    return { error: error.message };
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

const addCart = async (code, userId) => {
  try {
    // code에 해당하는 Corporate 객체를 가져옴
    const corporate = await Corporate.findOne({ code });
    const cart = await Cart.create({
      corporate_id: corporate._id,
      user_id: userId,
    });

    return cart;
  } catch (error) {
    return error;
  }
};

const deleteCart = async (code, user_id) => {
  try {
    const corporate = await Corporate.findOne({ code });
    if (!corporate) {
      throw new Error(`Corporate not found for code: ${code}`);
    }

    const cart = await Cart.findOneAndDelete({
      corporate_id: corporate._id,
      user_id: user_id,
    });

    if (!cart) {
      throw new Error(
        `Cart not found for user_id: ${user_id} and corporate_id: ${corporate._id}`
      );
    }

    return cart;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  getCartList,
  getStockFromCart,
  getRecentCart,
  addCart,
  deleteCart,
};
