const Corporate = require('../models/Corporate');

// 실시간 오공지수 업데이트
const socketConnect = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // 1초마다 오공지수를 조회하여 소켓으로 전송
  io.setInterval(async () => {
    const ogongRate = await Corporate.findOne({ogong_rate})
    io.emit('ogongRate', ogongRate);
  }, 1000);
}