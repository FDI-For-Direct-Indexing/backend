var cron = require("node-cron");
const Price = require("../../models/Price");
const ws = require("./kisSocket");
const codeList = require("./stockCodeList");
const { currentPrice } = require("./realtimePrice");
const Corporate = require("../../models/Corporate");
const { getWsStatus, setWsStatus } = require("../stocksDetail");

// 장 시작 시 전날 데이터 삭제 및 웹소켓 연결 시작
cron.schedule("0 9 * * 1-5", async () => {
  console.log("Starting market day: Deleting previous day data");
  await Price.deleteMany({});
  console.log("Previous day data deleted");
  if (!getWsStatus()) {
    setWsStatus(true);
  }
});

// 장 마감 10분 전, 웹소켓 연결 종료
cron.schedule("20 15 * * 1-5", async () => {
  if (ws) {
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
    ws.close();
  }
  if (getWsStatus()) {
    setWsStatus(false);
  }
});
