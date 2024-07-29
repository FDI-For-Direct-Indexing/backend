const Corporate = require("../models/Corporate");
const Sector = require("../models/Sector");
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

  const responsePromises = corporates.map(async (corporate) => {
    const savedSector = await Sector.findOne({ corporates_code: corporate.code });
    return {
      id: corporate.code,
      name: corporate.name,
      sector: savedSector ? savedSector.sector: "기타",
      profit: corporate.profitability,
      growth: corporate.growth,
      safety: corporate.stability,
      efficiency: corporate.efficiency,
      oogong_rate: corporate.ogong_rate,
      mention: corporate.mention,
    };
  });
  
  const response = await Promise.all(responsePromises);
  return response;
};

module.exports = {
  searchCorporate,
  searchIncludedCorporate,
  getCorporates,
};
