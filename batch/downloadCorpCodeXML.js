const axios = require("axios");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
require("dotenv").config(); // .env 파일에서 환경 변수를 로드합니다.

// DART API로부터 기업 코드를 다운로드하는 함수
async function downloadCorpCode() {
  const url = "https://opendart.fss.or.kr/api/corpCode.xml";
  const params = {
    crtfc_key: process.env.DART_API_KEY,
  };

  try {
    const response = await axios.get(url, {
      params: params,
      responseType: "arraybuffer", // 바이너리 데이터로 응답을 받습니다.
    });

    if (response.data.byteLength === 0) {
      console.error("Received empty response");
      return;
    }

    // ZIP 파일을 해제하여 XML 파일로 저장
    const bufferStream = require("stream").Readable.from(response.data);

    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(unzipper.Parse())
        .on("entry", function (entry) {
          const fileName = entry.path;
          if (fileName.endsWith(".xml")) {
            const filePath = path.resolve(__dirname, "data", fileName);
            entry.pipe(fs.createWriteStream(filePath));
          } else {
            entry.autodrain();
          }
        })
        .on("close", resolve)
        .on("error", reject);
    });

    console.log("File downloaded and extracted successfully");
  } catch (error) {
    throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 합니다.
  }
}

// 메인 함수 실행
async function downloadCorpCodeXML() {
  try {
    await downloadCorpCode();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// 메인 함수 호출
module.exports = { downloadCorpCodeXML };
