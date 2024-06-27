var cron = require("node-cron");
const Price = require("../../models/Price");
const { resetStockData } = require("./kisSocket");
const codeList = require("./stockCodeList");
const { currentPrice } = require("./realtimePrice");
const Corporate = require("../../models/Corporate");

const updatePrices = async () => {
  await Price.deleteMany({});
  for (let code of codeList) {
    const cp = await currentPrice(code);
    const price = cp.price;
    const compare = cp.compare;
    const corporate = await Corporate.findOne({ code: code });
    const corporate_id = corporate._id;
    Price.create({
      corporate_id: corporate_id,
      price: price,
      compare: compare,
    });
  }
  resetStockData();
});

// 장 마감 시, 최종 현재가 데이터 저장
cron.schedule("32 15 * * 1-5", async () => {
  console.log("Ending market day: Saving final price data");
  await Price.deleteMany({});
  for (let code of codeList) {
    const cp = await currentPrice(code);
    const price = cp.price;
    const compare = cp.compare;
    const corporate = await Corporate.findOne({ code: code });
    const corporate_id = corporate._id;
    Price.create({
      corporate_id: corporate_id,
      price: price,
      compare: compare,
    });
  }
  resetStockData();
});
