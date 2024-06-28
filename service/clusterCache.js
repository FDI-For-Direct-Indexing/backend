const Corporate = require("../models/Corporate");

const cache = {
  corporateData: null,
  lastFetch: 0,
  ttl: 1000 * 60 * 5, // 5 min
};

const getCorporateData = async () => {
  const now = Date.now();
  if (!cache.corporateData || (now - cache.lastFetch) > cache.ttl) {
    const corporates = await Corporate.find({});
    cache.corporateData = corporates.reduce((map, corp) => {
      map[corp.code] = corp;
      return map;
    }, {});
    cache.lastFetch = now;
  }
  return cache.corporateData;
};

const updateOgongRate = async (code, ogongValue) => {
  await getCorporateData();

  // Update cache
  if (cache.corporateData[code]) {
    cache.corporateData[code].ogong_rate = ogongValue;
  }
}

module.exports = { cache, getCorporateData, updateOgongRate }