import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { ArrowRightLeft, ShieldCheck, MapPin } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [assets, setAssets] = useState<RealEstateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferModal, setTransferModal] = useState<{ asset: RealEstateAsset, isOpen: boolean } | null>(null);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>('');
  const [isTransacting, setIsTransacting] = useState(false);

  const currentUser = FabricService.getCurrentUser();

  const loadData = async () => {
    setLoading(true);
    try {
      const allAssets = await FabricService.getAllAssets();
      setAssets(allAssets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransfer = async () => {
    if (!transferModal || !recipient || transferAmount <= 0) return;

    setIsTransacting(true);
    try {
      await FabricService.transferShares(transferModal.asset.id, recipient, transferAmount);
      alert("Транзакция успешно записана в блокчейн!");
      setTransferModal(null);
      loadData(); // Refresh
    } catch (e: any) {
      alert(`Ошибка транзакции: ${e.message}`);
    } finally {
      setIsTransacting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Синхронизация с леджером...</div>;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Маркетплейс</h2>
        <p className="text-slate-500">Все токенизированные объекты в сети EstateChain</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map(asset => {
           const myShares = asset.ownerDistribution[currentUser] || 0;
           return (
            <div key={asset.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="h-32 bg-slate-200 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${asset.id}/800/400`} alt="property" className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono">
                  ID: {asset.id.slice(0, 8)}...
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{asset.name}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    {asset.location}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-100">
                      ${asset.pricePerShare}/доля
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-200">
                      Всего: {asset.totalShares} долей
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{asset.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-slate-500">Ваше владение:</span>
                      <span className="font-bold text-slate-900">{myShares} долей</span>
                   </div>
                   
                   {myShares > 0 ? (
                     <button 
                       onClick={() => setTransferModal({ asset, isOpen: true })}
                       className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 text-sm font-medium"
                     >
                       <ArrowRightLeft size={16} />
                       Передать / Продать
                     </button>
                   ) : (
                     <button disabled className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed text-sm font-medium">
                       Нет долей для перевода
                     </button>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
             <h3 className="text-xl font-bold mb-4">Перевод долей</h3>
             <p className="text-sm text-slate-500 mb-6">
               Вы собираетесь перевести доли актива <span className="font-bold text-slate-900">{transferModal.asset.name}</span>.
               Это действие необратимо и будет записано в блокчейн.
             </p>

             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ID Получателя</label>
                 <input 
                   type="text" 
                   value={recipient}
                   onChange={(e) => setRecipient(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="user_investor_1"
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Количество долей</label>
                 <input 
                   type="number" 
                   value={transferAmount}
                   onChange={(e) => setTransferAmount(Number(e.target.value))}
                   className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                   max={transferModal.asset.ownerDistribution[currentUser]}
                 />
                 <p className="text-xs text-right mt-1 text-slate-400">Доступно: {transferModal.asset.ownerDistribution[currentUser]}</p>
               </div>
             </div>

             <div className="flex gap-3 mt-8">
               <button 
                 onClick={() => setTransferModal(null)}
                 className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
               >
                 Отмена
               </button>
               <button 
                 onClick={handleTransfer}
                 disabled={isTransacting}
                 className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex justify-center items-center gap-2"
               >
                 {isTransacting ? (
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 ) : (
                    <>
                      <ShieldCheck size={16} />
                      Подтвердить
                    </>
                 )}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};