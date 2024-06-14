const Corporate = require("../models/Corporate");
const CustomError = require("../common/error/CustomError");

const searchCorporate = async (keyword) => {
  const corporate = await Corporate.find({ name: keyword });

  if (corporate.length === 0) {
    return new CustomError(404, "Corporate is not found");
  }
  return { code: corporate[0].code };
};

const searchIncludedCorporate = async (keyword) => {
  if (keyword === null || keyword === "" || keyword === undefined) {
    return [];
  }
  const regex = new RegExp(keyword, "i");
  const corporates = await Corporate.find({ name: regex });

  let response = [];
  corporates.forEach((corporate) => {
    response.push(corporate.name);
  });

  return response;
};

const getCorporates = async () => {
  const corporates = await Corporate.find();
  let response = [];
  corporates.forEach((corporate) => {
    response.push({
      id: corporate.code,
      name: corporate.name,
      profit: corporate.profitability,
      growth: corporate.growth,
      safety: corporate.stability,
      efficiency: corporate.efficiency,
      oogong_rate: corporate.ogong_rate,
    });
  });

  return response;
};

module.exports = {
  searchCorporate,
  searchIncludedCorporate,
  getCorporates,
};
