import { RealEstateAsset } from '../types';

// Mock DB in memory
let assets: RealEstateAsset[] = [
  {
    id: "asset_001",
    name: "Business Center 'Moscow City Tower A'",
    location: "Moscow, Presnenskaya Naberezhnaya",
    totalValue: 50000000, // $50M
    totalShares: 10000,
    pricePerShare: 5000,
    ownerDistribution: {
      "user_admin": 8000,
      "user_investor_1": 2000
    },
    description: "Премиальный офисный центр в сердце делового района. Высокая доходность от аренды.",
    riskAnalysis: "Низкий риск. Стабильный поток арендаторов."
  },
  {
    id: "asset_002",
    name: "Luxury Villa Sochi",
    location: "Sochi, Kurortny Prospekt",
    totalValue: 2000000,
    totalShares: 2000,
    pricePerShare: 1000,
    ownerDistribution: {
      "user_admin": 2000
    },
    description: "Элитная вилла на побережье Черного моря.",
    riskAnalysis: "Средний риск. Зависимость от туристического сезона."
  }
];

const CURRENT_USER_ID = "user_admin"; // Simulating logged in user

export const FabricService = {
  getCurrentUser: () => CURRENT_USER_ID,

  getAllAssets: async (): Promise<RealEstateAsset[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600)); 
    return [...assets];
  },

  tokenizeAsset: async (newAsset: RealEstateAsset): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Check if ID exists
    if (assets.find(a => a.id === newAsset.id)) {
      throw new Error("Актив с таким ID уже существует");
    }
    
    // Initial distribution: Creator owns 100%
    const assetWithOwnership = {
      ...newAsset,
      ownerDistribution: {
        [CURRENT_USER_ID]: newAsset.totalShares
      }
    };
    
    assets.push(assetWithOwnership);
  },

  transferShares: async (assetId: string, recipientId: string, amount: number): Promise<void> => {
     await new Promise(resolve => setTimeout(resolve, 800));
     
     const assetIndex = assets.findIndex(a => a.id === assetId);
     if (assetIndex === -1) throw new Error("Актив не найден");

     const asset = assets[assetIndex];
     const senderBalance = asset.ownerDistribution[CURRENT_USER_ID] || 0;

     if (senderBalance < amount) {
       throw new Error(`Недостаточно долей. У вас: ${senderBalance}, требуется: ${amount}`);
     }

     // Update balances
     const newDistribution = { ...asset.ownerDistribution };
     
     newDistribution[CURRENT_USER_ID] -= amount;
     if (newDistribution[CURRENT_USER_ID] === 0) delete newDistribution[CURRENT_USER_ID];

     newDistribution[recipientId] = (newDistribution[recipientId] || 0) + amount;

     // Commit update
     assets[assetIndex] = {
       ...asset,
       ownerDistribution: newDistribution
     };
  }
};