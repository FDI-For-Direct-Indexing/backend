const Mention = require("../models/Mention");
const Corporate = require("../models/Corporate");

const mentionCache = {
  mentionData: {},
  lastFetch: 0,
  ttl: 1000 * 60 * 24,
};

const updateMention = async () => {
  const now = Date.now();
  if (!mentionCache.mentionData || (now - mentionCache.lastFetch) > mentionCache.ttl) {
    console.log("mention db 에서 얻어올게");
    const mentions = await Mention.find({});
    mentions.map(async (mention, index) => {
      mentionCache.mentionData[mention.corporate_id] = mention.amount;
      const corp = await Corporate.findById(mention.corporate_id);
      mentionCache.mentionData[corp.code] = mention.amount;
    })
    // mentionCache.mentionData = mentions.reduce(async (map, men) => {
    //   map[men.corporate_id] = men.amount;
    //   const corp = await Corporate.findById(men.corporate_id);
    //   // console.log(corp.code, "fff 양양양", map[men.corporate_id]);
    //   map[corp.code] = men.amount;
    //   return map;
    // }, {});
    mentionCache.lastFetch = now;
  }
}

const getMention = async (id) => {
  console.log("얻어왓 ? 암튼 ", mentionCache.mentionData[id]);
  return mentionCache.mentionData[id];
}

module.exports = { mentionCache, getMention, updateMention }