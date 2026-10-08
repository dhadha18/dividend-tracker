// types/portfolio.ts

export type AssetCategory = 'MARKET_TRADED' | 'FIXED_FUND' | 'CASH_SAVINGS' | 'CUSTOM';

export interface Holding {
  id: string;                  
  name: string;                
  ticker?: string;             
  category: AssetCategory;     
  
  tags?: string[];             

  isUserManaged?: boolean;     

  unitsOwned: number;          
  averageCostBasis: number;    
  currentPrice: number;        
  yieldRate: number;           
  payoutFrequency: 'DAILY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}