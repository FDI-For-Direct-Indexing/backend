function logTransform(value) {
  if (value > 0) {
    return Math.log(value);
  } else if (value < 0) {
    return -Math.log(Math.abs(value));
  } else {
    return 0; // 로그 변환을 할 수 없는 경우
  }
}

module.exports = { logTransform };