const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// MongoDB 연결 설정
const monkeyRankingDbConnection = mongoose.createConnection(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    dbName: "MonkeyRanking",
  }
);

const chatDbConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  dbName: "Chat",
});

// 연결 확인
monkeyRankingDbConnection.on("connected", () => {
  console.log();
});

monkeyRankingDbConnection.on("error", err => {
  console.log(`MongoDB connection error to monkeyRanking DB:${err}`);
});

chatDbConnection.on("connected", () => {
  console.log("MongoDB connection to chat DB successfully established");
});

chatDbConnection.on("error", err => {
  console.log(`MongoDB connection error to chat DB:${err}`);
});

module.exports.monkeyRankingDbConnection = monkeyRankingDbConnection;
module.exports.chatDbConnection = chatDbConnection;
