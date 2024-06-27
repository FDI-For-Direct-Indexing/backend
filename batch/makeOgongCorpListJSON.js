const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

// 파일 경로
const kospiListPath = path.resolve(__dirname, "data", "kospi200list.json");
const xmlFilePath = path.resolve(__dirname, "data", "CORPCODE.xml");
const outputFilePath = path.resolve(__dirname, "data", "ogongCorpList.json");

// 제외할 기업 코드 목록
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

// 파일을 읽는 함수를 Promise로 감싸기
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

// 파일을 쓰는 함수를 Promise로 감싸기
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
    // JSON 파일 읽기
    const kospiListData = await readFile(kospiListPath, "utf-8");
    const kospiList = JSON.parse(kospiListData);
    const kospiCodes = kospiList.map(item => item.종목코드);

    // XML 파일 읽기 및 파싱
    const xmlData = await readFile(xmlFilePath, "utf-8");
    const result = await xml2js.parseStringPromise(xmlData);

    const matchedCorps = [];

    // corpCode.xml에서 종목코드와 매칭되는 항목 찾기
    result.result.list.forEach(item => {
      const stockCode = item.stock_code[0].trim(); // XML 파일 내 종목코드는 공백이 있을 수 있으므로 트림 처리
      const corpCode = item.corp_code[0];
      const corpName = item.corp_name[0];

      // 제외할 기업 코드 목록에 포함되지 않는 항목만 추가
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

    // JSON 파일로 저장
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
