// ROE 계산 함수
function calculateROE(data) {
  let netIncome = 0;
  let currentTotalEquity = 0;
  let previousTotalEquity = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '당기순이익') {
      netIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
    if (item.fs_nm === '재무제표' && item.account_nm === '자본총계') {
      currentTotalEquity = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      previousTotalEquity = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (netIncome === 0 || currentTotalEquity === 0 || previousTotalEquity === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '당기순이익' && netIncome === 0) {
        netIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
      if (item.fs_nm === '연결재무제표' && item.account_nm === '자본총계') {
        if (currentTotalEquity === 0) {
          currentTotalEquity = parseFloat(item.thstrm_amount.replace(/,/g, ''));
        }
        if (previousTotalEquity === 0) {
          previousTotalEquity = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
        }
      }
    });
  }

  if (currentTotalEquity === 0 && previousTotalEquity === 0) {
    return 0; // 자본총계가 0이면 ROE를 계산할 수 없음
  }

  const averageEquity = (currentTotalEquity + previousTotalEquity) / 2;
  const roe = (netIncome / averageEquity) * 100;
  return roe;
}

module.exports = { calculateROE };
