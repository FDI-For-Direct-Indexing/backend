function calculateGrowth(values) {
  const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
  return (sum / values.length).toFixed(2);
}

module.exports = calculateGrowth;
