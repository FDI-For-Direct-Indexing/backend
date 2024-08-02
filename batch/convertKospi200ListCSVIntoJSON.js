const fs = require("fs");
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const path = require("path");

const inputFilePath = path.resolve(__dirname, "data", "kospi200list.csv");
const outputFilePath = path.resolve(__dirname, "data", "kospi200list.json");

async function convertCsvToJson() {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFilePath)
      .pipe(iconv.decodeStream("euc-kr"))
      .pipe(iconv.encodeStream("utf-8"))
      .pipe(csv())
      .on("data", data => {
        results.push({
          종목코드: data["종목코드"],
          종목명: data["종목명"],
        });
      })
      .on("end", async () => {
        try {
          await fs.promises.writeFile(
            outputFilePath,
            JSON.stringify(results, null, 2),
            "utf-8"
          );
          console.log(`JSON file successfully saved to ${outputFilePath}`);
          resolve(results);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", err => {
        reject(err);
      });
  });
}

module.exports = { convertCsvToJson };