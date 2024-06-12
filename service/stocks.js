const Corporate = require("../models/Corporate");
const CustomError = require("../common/error/CustomError");

const searchCorporate = async (keyword) => {
  const corporate = await Corporate.find({ name: keyword });
  console.log(corporate);

  if (corporate.length === 0) {
    return new CustomError(404, "Corporate is not found");
  }
  return { code: corporate[0].code };
};

const searchIncludedCorporate = async (keyword) => {
  const regex = new RegExp(keyword, "i");
  const corporate = await Corporate.find({ name: regex });
  console.log(corporate);

  return corporate;
};

module.exports = {
  searchCorporate,
  searchIncludedCorporate,
};
