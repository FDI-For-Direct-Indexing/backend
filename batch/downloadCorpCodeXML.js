const axios = require("axios");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
require("dotenv").config();

// DART API에서 기업 코드 다운로드
async function downloadCorpCode() {
  const url = "https://opendart.fss.or.kr/api/corpCode.xml";
  const params = {
    crtfc_key: process.env.DART_API_KEY,
  };

  try {
    const response = await axios.get(url, {
      params: params,
      responseType: "arraybuffer",
    });

    if (response.data.byteLength === 0) {
      console.error("Received empty response");
      return;
    }

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
    throw error;
  }
}

async function downloadCorpCodeXML() {
  try {
    await downloadCorpCode();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { downloadCorpCodeXML };
