import type { Holding } from '../types/portfolio';

export const mockHoldings: Holding[] = [
  {
    id: '1',
    name: 'Vanguard S&P 500 ETF',
    ticker: 'VOO',
    category: 'MARKET_TRADED',
    unitsOwned: 5.5,
    averageCostBasis: 450.00,
    currentPrice: 512.30, 
    yieldRate: 1.35, // 1.35% dividend yield
    payoutFrequency: 'QUARTERLY'
  },
  {
    id: '2',
    name: 'Amanah Saham Malaysia',
    category: 'FIXED_FUND',
    unitsOwned: 10000,
    averageCostBasis: 1.00,
    currentPrice: 1.00, // Fixed price
    yieldRate: 4.75, // 4.75% declared dividend
    payoutFrequency: 'ANNUALLY'
  },
  {
    id: '3',
    name: 'GXBank Savings',
    category: 'CASH_SAVINGS',
    unitsOwned: 5000,
    averageCostBasis: 1.00,
    currentPrice: 1.00, 
    yieldRate: 3.00, // 3.00% APY
    payoutFrequency: 'DAILY'
  }
];