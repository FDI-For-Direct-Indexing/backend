const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const xml2js = require("xml2js");
require("dotenv").config();

const { calculateCurRatio } = require("./ratioService/CurRatio");
const { calculateDebtEqRatio } = require("./ratioService/DebtEqRatio");
const { calculateSalesGrowthRate } = require("./ratioService/SalesGrowthRate");
const {
  calculateOpIncomeGrowthRate,
} = require("./ratioService/OpIncomeGrowthRate");
const { calculateOpProfitMargin } = require("./ratioService/OpProfitMargin");
const { calculateROA } = require("./ratioService/ROA");
const { calculateROE } = require("./ratioService/ROE");
const { calculateAssetTurnover } = require("./ratioService/AssetTurnover");
const { calculateDebtTurnover } = require("./ratioService/DebtTurnover");
const { calculateCapitalTurnover } = require("./ratioService/CapitalTurnover");
const { logTransform } = require("./utils/logTransform");
const { normalizeData } = require("./utils/normalizeData");

const ogongCorpListPath = path.resolve(__dirname, "data", "ogongCorpList.json");
const outputFilePath = path.resolve(__dirname, "data", "ogongDetailData.csv");

const apiUrl = "https://opendart.fss.or.kr/api/fnlttSinglAcnt.json";
const apiKey = process.env.DART_API_KEY;
const reprtCode = "11011";

const currentYear = new Date().getFullYear();
const bsnsYear = currentYear - 1;

function readFile(filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function writeCSV(filePath, data) {
  return new Promise((resolve, reject) => {
    const fields = [
      { label: "corp_code", value: "corp_code" },
      { label: "stock_code", value: "stock_code" },
      { label: "corp_name", value: "corp_name" },
      { label: "cur_ratio", value: "cur_ratio" },
      { label: "debt_eq_ratio", value: "debt_eq_ratio" },
      { label: "sales_growth_rate", value: "sales_growth_rate" },
      { label: "op_income_growth_rate", value: "op_income_growth_rate" },
      { label: "op_profit_margin", value: "op_profit_margin" },
      { label: "roa", value: "roa" },
      { label: "roe", value: "roe" },
      { label: "asset_turnover", value: "asset_turnover" },
      { label: "debt_turnover", value: "debt_turnover" },
      { label: "capital_turnover", value: "capital_turnover" },
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

    fs.writeFile(filePath, csv, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// fetch 재무 데이터
async function fetchFinancialData(kospi200Code) {
  let results = [];

  for (const company of kospi200Code) {
    const url = `${apiUrl}?crtfc_key=${apiKey}&corp_code=${company.corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`;

    try {
      const response = await axios.get(url);

      if (response.data.status === "000") {
        const list = response.data.list;

        const curRatio = calculateCurRatio(list);
        const debtEqRatio = calculateDebtEqRatio(list);
        const salesGrowthRate = calculateSalesGrowthRate(list);
        const opIncomeGrowthRate = calculateOpIncomeGrowthRate(list);
        const opProfitMargin = calculateOpProfitMargin(list);
        const roa = calculateROA(list);
        const roe = calculateROE(list);
        const assetTurnover = calculateAssetTurnover(list);
        const debtTurnover = calculateDebtTurnover(list);
        const capitalTurnover = calculateCapitalTurnover(list);

        const result = {
          corp_code: company.corpCode,
          stock_code: company.stockCode,
          corp_name: company.corpName,
          cur_ratio: logTransform(curRatio),
          debt_eq_ratio: logTransform(debtEqRatio),
          sales_growth_rate: logTransform(salesGrowthRate),
          op_income_growth_rate: logTransform(opIncomeGrowthRate),
          op_profit_margin: logTransform(opProfitMargin),
          roa: logTransform(roa),
          roe: logTransform(roe),
          asset_turnover: logTransform(assetTurnover),
          debt_turnover: logTransform(debtTurnover),
          capital_turnover: logTransform(capitalTurnover),
        };

        results.push(result);
      } else {
        console.log(
          `API 응답 오류 for ${company.corpName}: ${response.data.message}`
        );
        break;
      }
    } catch (error) {
      throw error;
    }
  }

  const columnsToNormalize = [
    "cur_ratio",
    "debt_eq_ratio",
    "sales_growth_rate",
    "op_income_growth_rate",
    "op_profit_margin",
    "roa",
    "roe",
    "asset_turnover",
    "debt_turnover",
    "capital_turnover",
  ];

  // 각 컬럼 정규화
  columnsToNormalize.forEach(column => {
    results = normalizeData(results, column);
  });

  return results;
}

async function configureOgongDetailCSV() {
  try {
    const kospi200CodeData = await readFile(ogongCorpListPath, "utf-8");
    const kospi200Code = JSON.parse(kospi200CodeData);

    const financialData = await fetchFinancialData(kospi200Code);

    await writeCSV(outputFilePath, financialData);
    console.log("OgongData.csv file has been successfully saved.");
  } catch (err) {
    throw err;
  }
}

module.exports = { configureOgongDetailCSV };
