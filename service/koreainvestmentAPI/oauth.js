const { APP_KEY, SECRET_KEY } = process.env;
const axios = require("axios");

let approval_key = null;
async function getApprovalKey() {
  const url = "https://openapi.koreainvestment.com:9443/oauth2/Approval";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
  };
  const body = {
    grant_type: "client_credentials",
    appkey: APP_KEY,
    secretkey: SECRET_KEY,
  };

  const response = await axios.post(url, body, { headers: headers });
  approval_key = response.data.approval_key;
  return approval_key;
}

function getStoredApprovalKey(approval_key) {
  return approval_key;
}

async function issueApprovalKey() {
  const approval_key = await getApprovalKey();
  return approval_key;
}

module.exports = { getApprovalKey, getStoredApprovalKey, issueApprovalKey };
