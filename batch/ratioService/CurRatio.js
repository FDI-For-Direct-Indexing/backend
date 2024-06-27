// 유동비율 계산 함수
function calculateCurRatio(data) {
  let currentAssets = 0;
  let currentLiabilities = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '유동자산') {
      currentAssets = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
    if (item.fs_nm === '재무제표' && item.account_nm === '유동부채') {
      currentLiabilities = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (currentAssets === 0 || currentLiabilities === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '유동자산' && currentAssets === 0) {
        currentAssets = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
      if (item.fs_nm === '연결재무제표' && item.account_nm === '유동부채' && currentLiabilities === 0) {
        currentLiabilities = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
    });
  }

  if (currentLiabilities === 0) {
    return 0; // 유동부채가 0이면 유동비율을 계산할 수 없음
  }

  const curRatio = (currentAssets / currentLiabilities) * 100;
  return curRatio;
}

module.exports = { calculateCurRatio };