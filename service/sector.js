const Corporate = require("../models/Corporate");
const Sector = require("../models/Sector");
const Price = require("../models/Price");
const Cart = require("../models/Cart");
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
