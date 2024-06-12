class CustomError extends Error {
  constructor(code, message, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.code = code;
    this.message = message;
  }
}

module.exports = CustomError;
