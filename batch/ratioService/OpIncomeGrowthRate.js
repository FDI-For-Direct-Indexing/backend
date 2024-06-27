// 영업이익 증가율 계산 함수
function calculateOpIncomeGrowthRate(data) {
  let currentOpIncome = 0;
  let previousOpIncome = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '영업이익') {
      currentOpIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      previousOpIncome = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (currentOpIncome === 0 || previousOpIncome === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '영업이익') {
        if (currentOpIncome === 0) {
          currentOpIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
        }
        if (previousOpIncome === 0) {
          previousOpIncome = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
        }
      }
    });
  }

  if (previousOpIncome === 0) {
    return 0; // 전기 영업이익이 0이면 영업이익 증가율을 계산할 수 없음
  }

  const opIncomeGrowthRate = ((currentOpIncome / previousOpIncome) - 1) * 100;
  return opIncomeGrowthRate;
}

module.exports = { calculateOpIncomeGrowthRate };
