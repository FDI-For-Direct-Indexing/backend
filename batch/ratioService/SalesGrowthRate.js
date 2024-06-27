// 매출액 증가율 계산 함수
function calculateSalesGrowthRate(data) {
  let currentSales = 0;
  let previousSales = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '매출액') {
      currentSales = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      previousSales = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (currentSales === 0 || previousSales === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '매출액') {
        if (currentSales === 0) {
          currentSales = parseFloat(item.thstrm_amount.replace(/,/g, ''));
        }
        if (previousSales === 0) {
          previousSales = parseFloat(item.frmtrm_amount.replace(/,/g, ''));
        }
      }
    });
  }

  if (previousSales === 0) {
    return 0; // 전기 매출액이 0이면 매출액 증가율을 계산할 수 없음
  }

  const salesGrowthRate = ((currentSales / previousSales) - 1) * 100;
  return salesGrowthRate;
}

module.exports = { calculateSalesGrowthRate };
