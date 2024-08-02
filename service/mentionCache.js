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
    const mentions = await Mention.find({});
    mentions.map(async (mention, index) => {
      mentionCache.mentionData[mention.corporate_id] = mention.amount;
      const corp = await Corporate.findById(mention.corporate_id);
      mentionCache.mentionData[corp.code] = mention.amount;
    })
    mentionCache.lastFetch = now;
  }
}

const getMention = async (id) => {
  return mentionCache.mentionData[id];
}

module.exports = { mentionCache, getMention, updateMention }