const WebSocket = require("ws");
const crypto = require("crypto");
const { getAccessToken } = require("./accessToken");
const { getCurrentPrice } = require("./currentPrice");

// 현재가 받아오는 함수 
const currentPrice = async (stockCode) => {
  try {
    // 접근 토큰 발급
    const accessToken = await getAccessToken();
    
    // 현재가 POST 요청
    return getCurrentPrice(stockCode, accessToken);

  } catch (error) {
    console.error('Error fetching current price:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { currentPrice };
