var cron = require('node-cron');
const Price = require('../../models/Price');
const { connectWebSocket } = require('./realtimePrice');

// 장 시작 시 전날 데이터 삭제 및 웹소켓 연결 시작
cron.schedule('0 9 * * 1-5', async () => {
  console.log('Starting market day: Deleting previous day data');
  await Price.deleteMany({});
  console.log('Previous day data deleted');
  connectWebSocket();
});

// 장 종료 시 웹소켓 연결 종료
cron.schedule('0 15 * * 1-5', ()=>{
  console.log('Ending market day: Closing WebSocket connection');
  if (ws) {
    ws.close();
  }
})