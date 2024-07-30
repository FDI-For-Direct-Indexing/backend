const Corporate = require("../models/Corporate");
const Sector = require("../models/Sector");
const Price = require("../models/Price");
const Cart = require("../models/Cart");

const getStockSector = async (code) => {
  try {
    const sector = await Sector.findOne({ corporates_code: code });

    const response = {
      code: sector.corporates_code,
      sector: sector.sector,
    };

    return response;
  } catch (error) {
    return error;
  }
};

const getStocksBySector = async (sector) => {
  try {
    const sectors = await Sector.find({ sector: sector });
    const response = await Promise.all(
      sectors.map(async (sector) => {
        const corporate = await Corporate.findOne({
          code: sector.corporates_code,
        });

        return {
          id: corporate.code,
          name: corporate.name,
          profit: corporate.profitability,
          growth: corporate.growth,
          safety: corporate.stability,
          efficiency: corporate.efficiency,
          oogong_rate: corporate.ogong_rate,
        };
      })
    );

    return response;
  } catch (error) {
    return error;
  }
};

const getCartItemsBySector = async (userId, reqSector) => {
  try {
    const cartItems = await Cart.find({ user_id: userId });
    const response = await Promise.all(
      cartItems.map(async (cart) => {
        const corporate = await Corporate.findOne({ _id: cart.corporate_id });
        const sector = await Sector.findOne({
          corporates_code: corporate.code,
        });
        if (sector.sector !== reqSector) {
          return null;
        }
        const price = await Price.findOne({ corporate_id: corporate._id });

        return {
          code: corporate.code,
          name: corporate.name,
          price: price.price,
          compare: price.compare,
        };
      })
    );

    return response.filter((item) => item !== null);
  } catch (error) {
    return error;
  }
};

module.exports = { getStockSector, getStocksBySector, getCartItemsBySector };
