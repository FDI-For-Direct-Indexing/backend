const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

const inputFilePath = path.resolve(__dirname, "data", "ogongDetailData.csv"); // 입력 CSV 파일 경로
const outputFilePath = path.resolve(__dirname, "data", "ogongData.csv"); // 출력 CSV 파일 경로

const calculateStability = require("./ogongService/Stability");
const calculateGrowth = require("./ogongService/Growth");
const calculateProfitability = require("./ogongService/Profitability");
const calculateEfficiency = require("./ogongService/Efficiency");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", data => {
        // 안정성 계산
        const debtEqRatio = parseFloat(data.debt_eq_ratio);
        const stabilityValue = 100 - debtEqRatio;
        const stability = calculateStability([
          data.cur_ratio,
          stabilityValue.toString(),
        ]);
        // 성장성 계산
        const growth = calculateGrowth([
          data.sales_growth_rate,
          data.op_income_growth_rate,
        ]);
        // 수익성 계산
        const profitability = calculateProfitability([
          data.op_profit_margin,
          data.roa,
          data.roe,
        ]);
        // 활동성 계산
        const efficiency = calculateEfficiency([
          data.asset_turnover,
          data.debt_turnover,
          data.capital_turnover,
        ]);

        results.push({
          corp_code: data.corp_code,
          stock_code: data.stock_code,
          corp_name: data.corp_name,
          stability, // 이미 소수점 2자리로 고정됨
          growth, // 이미 소수점 2자리로 고정됨
          profitability, // 이미 소수점 2자리로 고정됨
          efficiency, // 이미 소수점 2자리로 고정됨
        });
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", error => {
        reject(error);
      });
  });
}

function writeCSV(filePath, data) {
  return new Promise((resolve, reject) => {
    const fields = [
      { label: "corp_code", value: "corp_code" },
      { label: "stock_code", value: "stock_code" },
      { label: "corp_name", value: "corp_name" },
      { label: "stability", value: "stability" },
      { label: "growth", value: "growth" },
      { label: "profitability", value: "profitability" },
      { label: "efficiency", value: "efficiency" },
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csvData = parser.parse(data);

    fs.writeFile(filePath, csvData, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function configureOgongDataCSV() {
  try {
    const data = await readCSV(inputFilePath);
    await writeCSV(outputFilePath, data);
    console.log("OgongData has been successfully saved.");
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

module.exports = { configureOgongDataCSV };
