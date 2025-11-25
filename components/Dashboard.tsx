import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
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
    <div className="flex h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600 dark:border-slate-800 dark:border-t-violet-500"></div>
    </div>
  );

  return (
    <div className="space-y-[30px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Портфель Активов
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Обзор и аналитика ваших цифровых инвестиций.</p>
      </div>

      {/* Stats Cards with Gradients */}
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
        <Card className="relative overflow-hidden border-none shadow-lg shadow-violet-500/10 bg-white dark:bg-slate-900">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="h-24 w-24 text-violet-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Общая стоимость</CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">${totalValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                    <ArrowUpRight size={12} /> +20.1%
                </span>
                <span className="text-xs text-slate-400">с прошлого месяца</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg shadow-cyan-500/10 bg-white dark:bg-slate-900">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building2 className="h-24 w-24 text-cyan-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Объекты</CardTitle>
            <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                 <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{myAssets.length}</div>
            <p className="text-xs text-slate-400 mt-1">Активных контрактов</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg shadow-pink-500/10 bg-white dark:bg-slate-900">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-24 w-24 text-pink-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">APY Доходность</CardTitle>
            <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">8.5%</div>
             <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-bold text-emerald-500 flex items-center">
                    <ArrowUpRight size={12} /> +1.2%
                </span>
                <span className="text-xs text-slate-400">рост ставки</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-7">
        {/* Interactive Area Chart */}
        <Card className="col-span-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Динамика Портфеля</CardTitle>
            <CardDescription>
              Рост стоимости активов за 30 дней
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`} 
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: '#0f172a'
                        }}
                        itemStyle={{ color: '#7c3aed', fontWeight: 600 }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Стоимость"]}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#7c3aed" 
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

        {/* Assets List */}
        <Card className="col-span-3 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Ваши активы</CardTitle>
            <CardDescription>
              Детализация владения по объектам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {myAssets.map((asset) => (
                <div key={asset.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none group-hover:text-violet-600 transition-colors">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${(asset.ownerDistribution[userId] * asset.pricePerShare).toLocaleString()}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {asset.ownerDistribution[userId]} долей
                    </Badge>
                  </div>
                </div>
              ))}
              {myAssets.length === 0 && (
                 <div className="text-center text-sm text-slate-500 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
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