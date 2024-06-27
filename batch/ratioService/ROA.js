// ROA 계산 함수
function calculateROA(data) {
  let netIncome = 0;
  let totalAssets = 0;

  // 우선적으로 '재무제표'에서 찾기
  data.forEach(item => {
    if (item.fs_nm === '재무제표' && item.account_nm === '당기순이익') {
      netIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
    if (item.fs_nm === '재무제표' && item.account_nm === '자산총계') {
      totalAssets = parseFloat(item.thstrm_amount.replace(/,/g, ''));
    }
  });

  // '재무제표'에서 찾지 못한 경우 '연결재무제표'에서 찾기
  if (netIncome === 0 || totalAssets === 0) {
    data.forEach(item => {
      if (item.fs_nm === '연결재무제표' && item.account_nm === '당기순이익' && netIncome === 0) {
        netIncome = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
      if (item.fs_nm === '연결재무제표' && item.account_nm === '자산총계' && totalAssets === 0) {
        totalAssets = parseFloat(item.thstrm_amount.replace(/,/g, ''));
      }
    });
  }

  if (totalAssets === 0) {
    return 0; // 자산총계가 0이면 ROA를 계산할 수 없음
  }

  const roa = (netIncome / totalAssets) * 100;
  return roa;
}

module.exports = { calculateROA };
