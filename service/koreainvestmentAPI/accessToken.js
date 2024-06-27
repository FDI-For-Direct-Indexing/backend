const axios = require("axios");

// 실전 Domain URL
const apiURL = "https://openapi.koreainvestment.com:9443/oauth2/tokenP";

// 요청 본문 데이터
const requestData = {
  grant_type: "client_credentials",
  appkey: process.env.APP_KEY,
  appsecret: process.env.SECRET_KEY,
};

// 요청 헤더 설정
const headers = {
  "Content-Type": "application/json; charset=UTF-8",
};

var accessToken = null;

// 접근 토큰 발급 함수
async function getAccessToken() {
  try {
    if (accessToken) {
      return accessToken;
    }
    const response = await axios.post(apiURL, requestData, { headers });
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { getAccessToken };
