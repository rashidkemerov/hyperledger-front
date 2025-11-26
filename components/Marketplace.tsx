
import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const Marketplace: React.FC = () => {
  const [assets, setAssets] = useState<RealEstateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<RealEstateAsset | null>(null);
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
    if (!selectedAsset || !recipient || transferAmount <= 0) return;

    setIsTransacting(true);
    try {
      await FabricService.transferShares(selectedAsset.id, recipient, transferAmount);
      setSelectedAsset(null);
      setTransferAmount(0);
      setRecipient('');
      loadData();
      alert("Транзакция отправлена в блокчейн");
    } catch (e: any) {
      alert(`Ошибка: ${e.message}`);
    } finally {
      setIsTransacting(false);
    }
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="space-y-[5px] animate-in fade-in zoom-in-95 duration-500 h-full">
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm mb-[5px]">
        <h2 className="text-4xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent w-fit">
            Маркетплейс
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
            Инвестируйте в проверенные элитные объекты недвижимости.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset, index) => {
           const myShares = asset.ownerDistribution[currentUser] || 0;
           return (
            <Card key={asset.id} className="group overflow-hidden flex flex-col border-white/20 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500">
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80" />
                <img 
                  src={`https://picsum.photos/seed/${asset.id}/800/600`} 
                  alt="property" 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                />
                <div className="absolute top-4 right-4 z-20">
                    <Badge className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg px-3 py-1">
                        ${asset.pricePerShare} <span className="text-slate-300 font-normal ml-1">/ доля</span>
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <h3 className="font-heading font-bold text-2xl leading-tight mb-1">{asset.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-300 uppercase tracking-wide">
                        <MapPin size={12} className="text-cyan-400" /> {asset.location}
                    </div>
                </div>
              </div>
              
              <CardContent className="flex-1 pt-6 px-6">
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 leading-relaxed font-medium">
                    {asset.description}
                </p>
                <div className="space-y-[5px]">
                    <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Капитализация</span>
                        <span className="font-heading font-bold text-slate-900 dark:text-slate-200">${asset.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Ваш портфель</span>
                        <div className="flex items-center gap-2">
                             {myShares > 0 && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                            <span className={`font-heading font-bold ${myShares > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                                {myShares} шт.
                            </span>
                        </div>
                    </div>
                </div>
              </CardContent>

              <CardFooter className="pb-6 pt-2 px-6">
                  <Button 
                    className={`w-full h-12 rounded-xl text-base font-medium group-hover:translate-y-0 transition-all duration-300 ${
                        myShares > 0 
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25" 
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg"
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    {myShares > 0 ? 'Управление активами' : 'Инвестировать'}
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
         {selectedAsset && (
            <DialogContent className="sm:max-w-[425px] border-white/20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Перевод активов</DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Трансфер цифровых прав собственности "{selectedAsset.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-[20px] py-6">
                    <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center text-violet-700 dark:text-violet-200">
                             <TrendingUp size={20} />
                         </div>
                         <div>
                             <p className="text-xs text-violet-600 dark:text-violet-400 font-bold uppercase">Доступно</p>
                             <p className="text-lg font-heading font-bold text-slate-900 dark:text-white">{selectedAsset.ownerDistribution[currentUser]} TOKENS</p>
                         </div>
                    </div>

                    <div className="grid gap-[5px]">
                        <Label htmlFor="recipient" className="text-slate-700 dark:text-slate-300 font-medium">ID Получателя</Label>
                        <Input 
                            id="recipient" 
                            value={recipient} 
                            onChange={(e) => setRecipient(e.target.value)} 
                            placeholder="Например: user_investor_1"
                            className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 h-11"
                        />
                    </div>
                    <div className="grid gap-[5px]">
                        <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-medium">Количество</Label>
                        <div className="relative">
                            <Input 
                                id="amount" 
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(Number(e.target.value))}
                                max={selectedAsset.ownerDistribution[currentUser]}
                                className="bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 pr-20 h-11 font-heading font-bold text-lg"
                            />
                            <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Tokens</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedAsset(null)} className="h-11 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Отмена</Button>
                    <Button onClick={handleTransfer} disabled={isTransacting} className="h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
                        {isTransacting && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
                        Подтвердить перевод
                    </Button>
                </DialogFooter>
            </DialogContent>
         )}
      </Dialog>
    </div>
  );
};
