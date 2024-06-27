const axios = require("axios");
const fs = require("fs");
const path = require("path");

// OTP 생성 요청
async function generateOTP() {
  const url = "http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd";
  const data = new URLSearchParams({
    locale: "ko_KR",
    tboxindIdx_finder_equidx0_0: "코스피 200",
    indIdx: "1",
    indIdx2: "028",
    codeNmindIdx_finder_equidx0_0: "코스피 200",
    param1indIdx_finder_equidx0_0: "",
    trdDd: "20240625",
    money: "3",
    csvxls_isNo: "false",
    name: "fileDown",
    url: "dbms/MDC/STAT/standard/MDCSTAT00601",
  });

  const headers = {
    Accept: "text/plain, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Cookie:
      "__smVisitorID=ZhaxH4L4Nul; JSESSIONID=8j94ws51WjZqBv5YsvsFUFG7YpXjBm3xfGgFwIbyCbLdUei0zZCjV6x9DQ2C2mCv.bWRjX2RvbWFpbi9tZGNvd2FwMi1tZGNhcHAxMQ==",
    Host: "data.krx.co.kr",
    Origin: "http://data.krx.co.kr",
    Referer:
      "http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201010106",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    const response = await axios.post(url, data, { headers: headers });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 파일 다운로드 요청
async function downloadFile(otp) {
  const url = "http://data.krx.co.kr/comm/fileDn/download_csv/download.cmd";
  const data = new URLSearchParams({
    code: otp,
  });

  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie:
      "__smVisitorID=ZhaxH4L4Nul; JSESSIONID=NKrTvslBW8w5joJASYbqZjSpyRNaLMgbmRrnAwTjY232jmcMzOwA0gKoIUOacWIu.bWRjX2RvbWFpbi9tZGNvd2FwMi1tZGNhcHAxMQ==",
    Host: "data.krx.co.kr",
    Origin: "http://data.krx.co.kr",
    Referer:
      "http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201010106",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  };

  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: "stream",
    });

    if (response.headers["content-length"] === "0") {
      console.error("Received empty response");
      return;
    }

    const outputDir = path.resolve(__dirname, "data");
    const outputPath = path.join(outputDir, "kospi200list.csv");

    // 디렉토리가 없는 경우 생성 (비동기)
    if (!fs.existsSync(outputDir)) {
      await fs.promises.mkdir(outputDir, { recursive: true });
    }

    const writer = fs.createWriteStream(outputPath);

    // 스트림 완료를 기다리기 위한 Promise 사용
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("File downloaded successfully");
  } catch (error) {
    throw error;
  }
}

// 메인 함수 실행
async function downloadKopi200ListCSV() {
  try {
    const otp = await generateOTP();
    await downloadFile(otp);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// 메인 함수 호출
module.exports = { downloadKopi200ListCSV };
