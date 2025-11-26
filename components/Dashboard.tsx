
import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, DollarSign, ArrowUpRight, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

// Generate mock historical data
const generateData = () => {
  const data = [];
  let baseValue = 40000;
  for (let i = 1; i <= 30; i++) {
    const change = Math.floor(Math.random() * 2000) - 800;
    baseValue += change;
    data.push({
      name: `${i} Mar`,
      value: baseValue,
    });
  }
  return data;
};

const mockChartData = generateData();

export const Dashboard: React.FC = () => {
  const [myAssets, setMyAssets] = useState<RealEstateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = FabricService.getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        const allAssets = await FabricService.getAllAssets();
        const owned = allAssets.filter(a => (a.ownerDistribution[userId] || 0) > 0);
        setMyAssets(owned);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const totalValue = myAssets.reduce((sum, asset) => {
    return sum + (asset.ownerDistribution[userId] * asset.pricePerShare);
  }, 0);

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600 dark:border-slate-800 dark:border-t-violet-500"></div>
    </div>
  );

  return (
    <div className="space-y-[5px] animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      {/* Header Section */}
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm">
        <h2 className="text-4xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Портфель Активов
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
            Аналитика цифровых инвестиций в реальном времени.
        </p>
      </div>

      {/* Stats Cards - Grid gap 5px */}
      <div className="grid grid-cols-1 gap-[5px] md:grid-cols-3">
        <Card className="relative overflow-hidden border-white/20 dark:border-white/5 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl shadow-lg shadow-violet-500/5">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Общая стоимость</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center ring-1 ring-violet-500/20">
                <DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-4xl font-heading font-bold text-slate-900 dark:text-white mt-2">${totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center">
                    <ArrowUpRight size={12} className="mr-1" /> 20.1%
                </span>
                <span className="text-xs text-slate-400 font-medium">за 30 дней</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/20 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
           <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Объекты</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center ring-1 ring-cyan-500/20">
                 <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-4xl font-heading font-bold text-slate-900 dark:text-white mt-2">{myAssets.length}</div>
            <div className="flex items-center gap-2 mt-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-xs text-slate-400 font-medium">Активных контрактов</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-white/20 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-pink-500/5">
           <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">APY Доходность</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center ring-1 ring-pink-500/20">
                <Zap className="h-5 w-5 text-pink-600 dark:text-pink-300" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-4xl font-heading font-bold text-slate-900 dark:text-white mt-2">8.5%</div>
             <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center">
                    <ArrowUpRight size={12} className="mr-1" /> 1.2%
                </span>
                <span className="text-xs text-slate-400 font-medium">прогноз роста</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-[5px] lg:grid-cols-7 flex-1">
        {/* Interactive Area Chart */}
        <Card className="col-span-1 lg:col-span-4 shadow-xl shadow-indigo-500/5 border-white/20 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="font-heading">Динамика Портфеля</CardTitle>
            <CardDescription>
              Историческая стоимость активов (USD)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0 pb-0">
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        minTickGap={30}
                        fontFamily="Inter"
                        fontWeight={500}
                    />
                    <YAxis 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`}
                        fontFamily="Inter"
                        fontWeight={500}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/50" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                            backdropFilter: 'blur(12px)',
                            borderRadius: '12px', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            color: '#fff',
                            fontFamily: 'Inter',
                            padding: '10px 15px'
                        }}
                        itemStyle={{ color: '#c4b5fd', fontWeight: 600 }}
                        cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Стоимость"]}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assets List - Scrollable */}
        <Card className="col-span-1 lg:col-span-3 shadow-xl shadow-indigo-500/5 border-white/20 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading">Ваши активы</CardTitle>
            <CardDescription>
              Детализация владения по объектам
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
            <div className="space-y-[5px]">
              {myAssets.map((asset) => (
                <div key={asset.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-violet-200 dark:hover:border-violet-900 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-inner">
                        <Building2 className="h-6 w-6 text-slate-500 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold font-heading leading-none group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{asset.name}</p>
                        <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">{asset.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-heading">${(asset.ownerDistribution[userId] * asset.pricePerShare).toLocaleString()}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1 bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-0">
                        {asset.ownerDistribution[userId]} долей
                    </Badge>
                  </div>
                </div>
              ))}
              {myAssets.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-40 text-center text-sm text-slate-500 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Building2 className="mb-2 opacity-20" size={32} />
                    Нет активов. <br/>Перейдите в маркетплейс.
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
