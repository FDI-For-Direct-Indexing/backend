const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { monkeyRankingDbConnection } = require("../models/db");
const Corporate = require("../models/Corporate");
const Stock = require("../models/Stock");

const inputFilePath = path.resolve(__dirname, "data", "ogongDetailData.csv"); // 입력 CSV 파일 경로

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

async function deleteAllStockData(session) {
  try {
    await Stock.deleteMany({}).session(session);
    console.log("All existing Stock data has been deleted.");
  } catch (error) {
    console.error("An error occurred while deleting the Stock data:", error);
    throw error;
  }
}

async function saveStockData(data, session) {
  try {
    // 모든 Corporate 문서를 메모리에 로드
    const corporates = await Corporate.find().session(session);
    const corporateMap = new Map();
    corporates.forEach(corporate => {
      corporateMap.set(corporate.code, corporate._id);
    });

    for (const item of data) {
      const corporateId = corporateMap.get(item.stock_code);

      if (!corporateId) {
        console.error(
          `No matching corporate found for stock_code: ${item.stock_code}`
        );
        continue; // 매칭되는 corporate이 없으면 다음 항목으로 넘어감
      }

      const stock = new Stock({
        cur_ratio: parseFloat(item.cur_ratio),
        debt_eq_ratio: parseFloat(item.debt_eq_ratio),
        sales_growth_rate: parseFloat(item.sales_growth_rate),
        op_income_growth_rate: parseFloat(item.op_income_growth_rate),
        op_profit_margin: parseFloat(item.op_profit_margin),
        roa: parseFloat(item.roa),
        roe: parseFloat(item.roe),
        asset_turnover: parseFloat(item.asset_turnover),
        debt_turnover: parseFloat(item.debt_turnover),
        capital_turnover: parseFloat(item.capital_turnover),
        corporate_id: corporateId, // Corporate 컬렉션의 _id 값을 설정
      });

      await stock.save({ session }); // 각 항목을 순차적으로 저장
    }

    console.log("All stock data has been successfully saved to the database.");
  } catch (error) {
    console.error(
      "An error occurred while saving stock data to the database:",
      error
    );
    throw error;
  }
}

async function upsertOgongDetailDataToMongo() {
  const session = await monkeyRankingDbConnection.startSession();
  session.startTransaction();

  try {
    await deleteAllStockData(session);
    const data = await readCSV(inputFilePath);
    await saveStockData(data, session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error("An error occurred:", error);
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { upsertOgongDetailDataToMongo };
