const Room = require("../models/Room");
const Message = require("../models/Message");
const Corporate = require("../models/Corporate");
const Price = require("../models/Price");
const { accessComment } = require("./ogongRate");
const {
  getPriceOfStock,
  getCompareOfStock,
} = require("./koreainvestmentAPI/kisSocket");
const { updateOgongRate } = require("./clusterCache");

const handleChatSocketConnection = (io) => {
  io.on("connection", (socket) => {
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

        io.to(roomCode).emit("receive message", message);

        if (content.length > 5) {
          const updatedOgong = await accessComment(roomCode, content);
          if (updatedOgong) {
            io.to(roomCode).emit("update ogong rate", updatedOgong);
          }
          await updateOgongRate(roomCode, updatedOgong);
        }

        socket.emit("message sent", {
          status: "success",
          messageId: message._id,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Error sending message");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const handlePriceSocketConnection = (io) => {
  io.on("connection", (socket) => {
    socket.on("join price room", async ({ roomCode }) => {
      socket.join(roomCode);
      const corporate = await Corporate.findOne({ code: roomCode });
      const loadedPrice = await Price.findOne({ corporate_id: corporate._id });
      if (!loadedPrice) {
        return socket.emit("error", "Failed to get loaded price");
      }

      socket.emit("load price", loadedPrice);
    });

    // 현재가 요청
    socket.on("request current price", async ({ stockCode }) => {
      let status = false;
      if (getPriceOfStock(stockCode)) {
        status = true;
      }

      try {
        setInterval(async () => {
          if (!status) {
            const corporate = await Corporate.findOne({ code: stockCode });
            const price = await Price.findOne({ corporate_id: corporate._id });
            if (!price) {
              return socket.emit("error", "Failed to get current price");
            }
            socket.emit("current price", {
              status: "success",
              price: price.price,
              compare: price.compare,
            });
          } else {
            const price = getPriceOfStock(stockCode);
            const compare = getCompareOfStock(stockCode);
            if (!price) {
              return socket.emit("error", "Failed to get current price");
            }
            socket.emit("current price", {
              status: "success",
              price: price,
              compare: compare,
            });
          }
        }, 1000);
      } catch (error) {
        console.error("Error requesting current price:", error);
        socket.emit("error", "Error requesting current price");
      }
    });

    // 클라이언트 연결 해제 시
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = { handleChatSocketConnection, handlePriceSocketConnection };
