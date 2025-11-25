// Определение структуры актива недвижимости в сети
export interface RealEstateAsset {
  id: string;
  name: string;
  location: string;
  totalValue: number;
  totalShares: number;
  pricePerShare: number;
  ownerDistribution: Record<string, number>; // Map: UserID -> ShareCount
  description?: string; // AI Generated description
  riskAnalysis?: string; // AI Generated risk
}

export interface User {
  id: string;
  name: string;
  balance: number; // Fiat balance for simulation
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  TOKENIZE = 'TOKENIZE',
  CONTRACT_CODE = 'CONTRACT_CODE',
}