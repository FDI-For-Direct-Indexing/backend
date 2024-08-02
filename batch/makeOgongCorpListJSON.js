const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const kospiListPath = path.resolve(__dirname, "data", "kospi200list.json");
const xmlFilePath = path.resolve(__dirname, "data", "CORPCODE.xml");
const outputFilePath = path.resolve(__dirname, "data", "ogongCorpList.json");

const excludedCorpCodes = [
  "00113058",
  "00159102",
  "00111810",
  "00164973",
  "00980122",
  "01350869",
  "00688996",
  "00547583",
  "00858364",
  "00139214",
  "00382199",
  "00120182",
  "00878915",
  "00149646",
  "00104856",
  "00126256",
  "00860332",
  "01133217",
  "00126292",
  "00432102",
  "00111722",
  "00296290",
  "01412725",
  "01762569",
];

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

function writeFile(filePath, data, encoding) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, encoding, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function combineData() {
  try {
    const kospiListData = await readFile(kospiListPath, "utf-8");
    const kospiList = JSON.parse(kospiListData);
    const kospiCodes = kospiList.map(item => item.종목코드);

    const xmlData = await readFile(xmlFilePath, "utf-8");
    const result = await xml2js.parseStringPromise(xmlData);

    const matchedCorps = [];

    result.result.list.forEach(item => {
      const stockCode = item.stock_code[0].trim();
      const corpCode = item.corp_code[0];
      const corpName = item.corp_name[0];

      if (
        kospiCodes.includes(stockCode) &&
        !excludedCorpCodes.includes(corpCode)
      ) {
        matchedCorps.push({
          stockCode: stockCode,
          corpName: corpName,
          corpCode: corpCode,
        });
      }
    });

    await writeFile(
      outputFilePath,
      JSON.stringify(matchedCorps, null, 2),
      "utf-8"
    );
    console.log(`Matched items successfully saved to ${outputFilePath}.`);
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

module.exports = { combineData };
