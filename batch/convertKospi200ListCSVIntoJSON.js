const fs = require("fs");
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const path = require("path");

// 파일 경로 설정
const inputFilePath = path.resolve(__dirname, "data", "kospi200list.csv");
const outputFilePath = path.resolve(__dirname, "data", "kospi200list.json");

// CSV 파일을 JSON 파일로 변환하는 함수
async function convertCsvToJson() {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFilePath)
      .pipe(iconv.decodeStream("euc-kr")) // euc-kr 인코딩을 utf-8로 변환
      .pipe(iconv.encodeStream("utf-8"))
      .pipe(csv())
      .on("data", data => {
        // 종목코드와 종목명만 추출하여 results 배열에 추가
        results.push({
          종목코드: data["종목코드"],
          종목명: data["종목명"],
        });
      })
      .on("end", async () => {
        try {
          // results 배열을 JSON 파일로 저장
          await fs.promises.writeFile(
            outputFilePath,
            JSON.stringify(results, null, 2),
            "utf-8"
          );
          console.log(`JSON file successfully saved to ${outputFilePath}`);
          resolve(results); // results 배열 반환
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

// const fs = require("fs");
// const csv = require("csv-parser");
// const iconv = require("iconv-lite");
// const path = require("path");

// // 파일 경로 설정
// const inputFilePath = path.resolve(__dirname, "data", "kospi200list.csv");
// const outputFilePath = path.resolve(__dirname, "data", "kospi200list.json");

// // CSV 파일을 JSON 파일로 변환하는 함수
// async function convertCsvToJson() {
//   console.log("이거 실행중?");
//   const results = [];

//   // 파일 존재 여부 확인
//   if (!fs.existsSync(inputFilePath)) {
//     console.error(`File not found: ${inputFilePath}`);
//     return;
//   }

//   console.log(`Reading file from: ${inputFilePath}`);

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(inputFilePath)
//       .on("error", err => {
//         console.error(`Error reading file: ${err.message}`);
//         reject(err);
//       })
//       .pipe(iconv.decodeStream("euc-kr")) // euc-kr 인코딩을 utf-8로 변환
//       .pipe(iconv.encodeStream("utf-8"))
//       .pipe(csv())
//       .on("data", data => {
//         // 데이터 로깅
//         console.log("Data received:", data);

//         // 종목코드와 종목명만 추출하여 results 배열에 추가
//         results.push({
//           종목코드: data["종목코드"],
//           종목명: data["종목명"],
//         });
//       })
//       .on("end", async () => {
//         try {
//           // results 배열을 JSON 파일로 저장
//           await fs.promises.writeFile(
//             outputFilePath,
//             JSON.stringify(results, null, 2),
//             "utf-8"
//           );
//           console.log(`JSON file successfully saved to ${outputFilePath}`);
//           resolve(results); // results 배열 반환
//         } catch (err) {
//           reject(err);
//         }
//       })
//       .on("error", err => {
//         console.error(`Error during CSV parsing: ${err.message}`);
//         reject(err);
//       });
//   });
// }

// module.exports = { convertCsvToJson };
