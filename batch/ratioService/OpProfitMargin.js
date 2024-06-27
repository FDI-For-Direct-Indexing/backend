// 영업이익률 계산 함수
function calculateOpProfitMargin(data) {
  let operatingIncome = 0;
  let sales = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '영업이익') {
      operatingIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
    if (item.fs_nm === '재무제표' && item.account_nm === '매출액') {
      sales = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (operatingIncome === 0 || sales === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '영업이익' && operatingIncome === 0) {
        operatingIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
      if (item.fs_nm === '연결재무제표' && item.account_nm === '매출액' && sales === 0) {
        sales = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
    });
  }

  if (sales === 0) {
    return 0; // 매출액이 0이면 영업이익률을 계산할 수 없음
  }

  const opProfitMargin = (operatingIncome / sales) * 100;
  return opProfitMargin;
}

module.exports = { calculateOpProfitMargin };