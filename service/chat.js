const Room = require("../models/Room");
const Message = require("../models/Message");
const { accessComment } = require("./ogongRate");

const handleSocketConnection = io => {
  io.on("connection", socket => {
    console.log("New client connected");

    // 클라이언트가 방에 참여할 때
    socket.on("join room", async ({ roomCode, roomName }) => {
      socket.join(roomCode);
      console.log(`Client joined room ${roomCode}`);

      let room = await Room.findOne({ roomCode }).populate("messages");

      if (!room) {
        // 방이 없으면 새로 생성
        room = new Room({
          roomName: roomName || "Default Room Name",
          roomCode,
        });
        await room.save();
        console.log(`New room created with roomCode: ${roomCode}`);
      }

      socket.emit("load messages", room.messages || []);
    });

    // 클라이언트가 메시지를 보낼 때
    socket.on("send message", async ({ roomCode, senderId, content }) => {
      try {
        const room = await Room.findOne({ roomCode });

        if (!room) {
          // 방이 없으면 에러 처리
          return socket.emit("error", "Room does not exist");
        }

        const message = new Message({ senderId, content, roomId: room._id });
        await message.save();

        // 방에 있는 모든 클라이언트에게 새 메시지 전송
        io.to(roomCode).emit("receive message", message);

        // 짧은 메세지는 감정분석을 거치지 않는다
        if (content.length > 10){
          // 메시지를 받은 방에 있는 모든 클라이언트에게 오공지수 업데이트
          const updatedOgong = await accessComment(roomCode, content);
          io.to(roomCode).emit("update ogong rate", updatedOgong);
        }

        // 메시지를 보낸 클라이언트에게 전송 완료 피드백
        socket.emit("message sent", {
          status: "success",
          messageId: message._id,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Error sending message");
      }
    });

    // 클라이언트 연결 해제 시
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = { handleSocketConnection };
