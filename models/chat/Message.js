const mongoose = require("mongoose");
const { chatDbConnection } = require("../db");

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  sendTime: { type: Date, default: Date.now },
  content: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // Room을 참조하는 필드 추가
});

const Message = chatDbConnection.model("Message", messageSchema);
module.exports = Message;
