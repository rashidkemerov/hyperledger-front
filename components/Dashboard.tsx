import React, { useEffect, useState } from 'react';
import { RealEstateAsset } from '../types';
import { FabricService } from '../services/mockFabricService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Building2, TrendingUp, DollarSign } from 'lucide-react';

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

  const chartData = myAssets.map(asset => ({
    name: asset.name,
    value: asset.ownerDistribution[userId] * asset.pricePerShare
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  if (loading) return <div className="text-center py-20 text-slate-500">Загрузка данных блокчейна...</div>;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Мой Портфель</h2>
        <p className="text-slate-500">Обзор ваших цифровых активов недвижимости</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Общая стоимость</p>
            <p className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Активов во владении</p>
            <p className="text-2xl font-bold text-slate-900">{myAssets.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Средняя доходность</p>
            <p className="text-2xl font-bold text-slate-900">~8.5%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Assets List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-4">Детализация активов</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Актив</th>
                  <th className="pb-3 font-medium">Долей</th>
                  <th className="pb-3 font-medium">Цена доли</th>
                  <th className="pb-3 font-medium text-right">Стоимость</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myAssets.map(asset => (
                  <tr key={asset.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <p className="font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.location}</p>
                    </td>
                    <td className="py-4 text-slate-600">{asset.ownerDistribution[userId]}</td>
                    <td className="py-4 text-slate-600">${asset.pricePerShare.toLocaleString()}</td>
                    <td className="py-4 text-right font-medium text-blue-600">
                      ${(asset.ownerDistribution[userId] * asset.pricePerShare).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {myAssets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      У вас пока нет активов. Перейдите в маркетплейс.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold mb-4 w-full text-left">Структура</h3>
            <div className="h-64 w-full">
              {myAssets.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300">
                   Нет данных для графика
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};