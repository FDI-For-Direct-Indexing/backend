const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { monkeyRankingDbConnection } = require("../models/db");
const Corporate = require("../models/Corporate");

const inputFilePath = path.resolve(__dirname, "data", "ogongData.csv"); // 입력 CSV 파일 경로

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", data => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", error => {
        reject(error);
      });
  });
}

async function deleteAllCorporateData() {
  try {
    await Corporate.deleteMany({});
    console.log("All existing Corporate data has been deleted.");
  } catch (error) {
    console.error(
      "An error occurred while deleting the Corporate data:",
      error
    );
    throw error;
  }
}

async function saveToDatabase(data) {
  const session = await monkeyRankingDbConnection.startSession();
  session.startTransaction();

  try {
    for (const item of data) {
      const corporate = new Corporate({
        code: item.stock_code,
        name: item.corp_name,
        price: 0,
        profitability: parseFloat(item.profitability),
        stability: parseFloat(item.stability),
        efficiency: parseFloat(item.efficiency),
        growth: parseFloat(item.growth),
        ogong_rate: 50,
        ogong_cnt: 0,
      });

      await corporate.save({ session });
    }

    await session.commitTransaction();
    console.log("All data has been successfully saved to the Ogong database.");
  } catch (error) {
    await session.abortTransaction();
    console.error("An error occurred while saving to the database:", error);
    throw error;
  } finally {
    session.endSession();
  }
}

async function upsertOgongDataToMongo() {
  try {
    await deleteAllCorporateData();
    const data = await readCSV(inputFilePath);
    await saveToDatabase(data);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

module.exports = { upsertOgongDataToMongo };
