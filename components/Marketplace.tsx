import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
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
    <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="space-y-[30px] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent w-fit">
            Маркетплейс
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Инвестируйте в проверенные элитные объекты недвижимости.</p>
      </div>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset, index) => {
           const myShares = asset.ownerDistribution[currentUser] || 0;
           return (
            <Card key={asset.id} className="group overflow-hidden flex flex-col border-none shadow-lg hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 bg-white dark:bg-slate-900">
              <div className="relative h-56 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={`https://picsum.photos/seed/${asset.id}/800/600`} 
                  alt="property" 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 z-20">
                    <Badge className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm">
                        ${asset.pricePerShare} / доля
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                    <p className="font-bold text-lg">{asset.name}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-200 mt-1">
                        <MapPin size={12} /> {asset.location}
                    </div>
                </div>
              </div>
              
              <CardContent className="flex-1 pt-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                    {asset.description}
                </p>
                <div className="space-y-[5px]">
                    <div className="flex items-center justify-between text-sm p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-slate-500 dark:text-slate-400">Капитализация</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200">${asset.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-slate-500 dark:text-slate-400">Ваш портфель</span>
                        <span className={`font-semibold ${myShares > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                            {myShares} шт.
                        </span>
                    </div>
                </div>
              </CardContent>

              <CardFooter className="pb-6 pt-2">
                  <Button 
                    className={`w-full group-hover:translate-y-0 transition-all ${
                        myShares > 0 
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25" 
                        : "bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white"
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    {myShares > 0 ? 'Управление активами' : 'Инвестировать'}
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
         {selectedAsset && (
            <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-slate-900 dark:text-white">Перевод активов</DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Трансфер цифровых прав собственности "{selectedAsset.name}".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-[20px] py-4">
                    <div className="grid gap-[5px]">
                        <Label htmlFor="recipient" className="text-slate-700 dark:text-slate-300">ID Получателя</Label>
                        <Input 
                            id="recipient" 
                            value={recipient} 
                            onChange={(e) => setRecipient(e.target.value)} 
                            placeholder="Например: user_investor_1"
                            className="dark:bg-slate-950 dark:border-slate-800"
                        />
                    </div>
                    <div className="grid gap-[5px]">
                        <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">Количество</Label>
                        <div className="relative">
                            <Input 
                                id="amount" 
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(Number(e.target.value))}
                                max={selectedAsset.ownerDistribution[currentUser]}
                                className="dark:bg-slate-950 dark:border-slate-800 pr-16"
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-400">TOKENS</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">
                           Доступно: <span className="font-bold text-emerald-500">{selectedAsset.ownerDistribution[currentUser]}</span>
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedAsset(null)} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Отмена</Button>
                    <Button onClick={handleTransfer} disabled={isTransacting} className="bg-violet-600 hover:bg-violet-700 text-white">
                        {isTransacting && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
                        Подтвердить
                    </Button>
                </DialogFooter>
            </DialogContent>
         )}
      </Dialog>
    </div>
  );
};