const mongoose = require("mongoose");
const { chatDbConnection } = require("../db");

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  roomCode: { type: String, required: true, unique: true },
});

// Virtual 필드 설정
roomSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "roomId",
});

roomSchema.set("toObject", { virtuals: true });
roomSchema.set("toJSON", { virtuals: true });

const Room = chatDbConnection.model("Room", roomSchema);
module.exports = Room;
