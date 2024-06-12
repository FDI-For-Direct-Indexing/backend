const CustomError = require("./CustomError");

module.exports = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.code).json(err);
  }
  console.log(err);
  return res.status(500).json(err);
};
