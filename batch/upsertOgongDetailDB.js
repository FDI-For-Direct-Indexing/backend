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

async function deleteAllStockData() {
  try {
    await Stock.deleteMany({});
    console.log("All existing Stock data has been deleted.");
  } catch (error) {
    console.error("An error occurred while deleting the Stock data:", error);
    throw error;
  }
}

async function saveStockData(data) {
  const session = await monkeyRankingDbConnection.startSession();
  session.startTransaction();

  try {
    const operations = [];

    for (const item of data) {
      // Corporate 컬렉션에서 stock_code로 문서 찾기
      const corporate = await Corporate.findOne({
        code: item.stock_code,
      }).session(session);

      if (!corporate) {
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
        corporate_id: corporate._id, // Corporate 컬렉션의 _id 값을 설정
      });

      operations.push(stock.save({ session }));
    }

    await Promise.all(operations); // 모든 저장 작업을 병렬로 실행
    await session.commitTransaction();
    console.log("All stock data has been successfully saved to the database.");
  } catch (error) {
    await session.abortTransaction();
    console.error(
      "An error occurred while saving stock data to the database:",
      error
    );
    throw error;
  } finally {
    session.endSession();
  }
}

async function upsertOgongDetailDataToMongo() {
  try {
    await deleteAllStockData();
    const data = await readCSV(inputFilePath);
    await saveStockData(data);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

module.exports = { upsertOgongDetailDataToMongo };
