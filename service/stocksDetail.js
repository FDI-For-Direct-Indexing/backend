const Stock = require('../models/Stock');
const Corporate = require('../models/Corporate');

const getStockFundamentals = async (code) =>{
  try {
    const corporate = await Corporate.findOne({ code: code });
    const stock = await Stock.findOne({ stock: corporate.code });
    
    const profit_key = ['ROE', '영업이익률', '순이익률'];
    const growth_key = ['자기자본비율', '영업이익', '영업이익률', '매출액'];
    const stability_key = ['부채비율', '유동비율'];
    const efficiency_key = ['재고자산회전일수', '매입채무회전일수', '매출채권회전일수'];

    const profit_value = [stock.pro_roe, stock.pro_operating_profit_margin, stock.pro_net_profit_margin];
    const growth_value = [stock.gro_inventory_turnover_period, stock.gro_is_net_income_yoy, stock.gro_is_operatingprofit_loss_yoy, stock.gro_is_reveneue_yoy];
    const stability_value = [stock.sta_debt_ratio, stock.sta_current_ratio];
    const efficiency_value = [stock.eff_inventory_turnover_period, stock.eff_payables_turnover_period, stock.eff_receivables_turnover_period];

    const profit = new Object();
    for (let i = 0; i < profit_key.length; i++) {
      profit[i] = {
        matrix: profit_key[i],
        rates: profit_value[i]
      };
    }
    
    const growth = new Object();
    for (let i = 0; i < growth_key.length; i++) {
      growth[i] = {
        matrix: growth_key[i],
        rates: growth_value[i]
      }
    }

    const stability = new Object();
    for (let i = 0; i < stability_key.length; i++) {
      stability[i] = {
        matrix: stability_key[i],
        rates: stability_value[i]
      }
    }

    const efficiency = new Object();
    for (let i = 0; i < efficiency_key.length; i++) {
      efficiency[i] = {
        matrix: efficiency_key[i],
        rates: efficiency_value[i]
      }
    }

    const result = {
      code: corporate.code,
      name: corporate.name,
      price: corporate.price,
      ogong_rate: corporate.ogong_rate,

      profit: profit,
      growth: growth,
      stability: stability,
      efficiency: efficiency,
    };
    
    return result;
    
  } catch (error) {
    return error;
  }
}

module.exports = {
  getStockFundamentals
};