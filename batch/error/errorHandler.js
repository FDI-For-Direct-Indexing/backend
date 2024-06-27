function handleError(error) {
  console.error("An error occurred:", error.message);
  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Headers:", error.response.headers);
    console.error("Data:", error.response.data);
  }
}

module.exports = { handleError };
