const axios = require("axios");

const getCurrentPrice = async (stockCode, accessToken) => {
  const devEnv = 29443;
  const prodEnv = 9443;
  const url = `https://openapivts.koreainvestment.com:${devEnv}/uapi/domestic-stock/v1/quotations/inquire-price`;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    authorization: `Bearer ${accessToken}`,
    appkey: process.env.APP_KEY,
    appsecret: process.env.SECRET_KEY,
    tr_id: "FHKST01010100",
    custtype: "P",
  };
  const queryParams = {
    FID_COND_MRKT_DIV_CODE: "J",
    FID_INPUT_ISCD: stockCode,
  };

  try {
    const response = await axios.get(url, { headers, params: queryParams });

    console.log(
      "요청 종목",
      stockCode,
      "현재가: ",
      response.data.output.stck_prpr
    );
    const price = response.data.output.stck_prpr;
    const compare = response.data.output.prdy_vrss;
    return { price, compare };
  } catch (error) {
    console.error(
      "Error fetching current price:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = { getCurrentPrice };
