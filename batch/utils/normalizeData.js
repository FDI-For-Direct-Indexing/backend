function normalizeData(data, key) {
  const values = data.map(item => item[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return data.map(item => ({
    ...item,
    [key]: ((item[key] - min) / (max - min)) * (100 - 0.01) + 0.01 // 0.01~100 사이 값으로 정규화
  }));
}

module.exports = { normalizeData };