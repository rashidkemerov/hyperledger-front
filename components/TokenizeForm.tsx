import React, { useState } from 'react';
import { FabricService } from '../services/mockFabricService';
import { GeminiService } from '../services/geminiService';
import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { RealEstateAsset } from '../types';

export const TokenizeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    id: `asset_${Math.floor(Math.random() * 10000)}`,
    name: '',
    location: '',
    totalValue: 0,
    totalShares: 1000,
  });

  const [aiAnalysis, setAiAnalysis] = useState<{ description: string; risk: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyze = async () => {
    if (!formData.name || !formData.totalValue) {
        alert("Заполните название и стоимость для AI анализа");
        return;
    }
    setIsAnalyzing(true);
    try {
        const result = await GeminiService.analyzeProperty(formData.name, formData.location, formData.totalValue);
        setAiAnalysis(result);
    } catch (e) {
        alert("Ошибка AI анализа");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const newAsset: RealEstateAsset = {
            ...formData,
            pricePerShare: formData.totalValue / formData.totalShares,
            ownerDistribution: {},
            description: aiAnalysis?.description || "Нет описания",
            riskAnalysis: aiAnalysis?.risk || "Риск не оценен"
        };
        await FabricService.tokenizeAsset(newAsset);
        alert("Актив успешно создан и записан в леджер!");
        setFormData({
            id: `asset_${Math.floor(Math.random() * 10000)}`,
            name: '',
            location: '',
            totalValue: 0,
            totalShares: 1000,
        });
        setAiAnalysis(null);
    } catch (err: any) {
        alert(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Токенизация Объекта</h2>
        <p className="text-slate-500">Выпуск цифровых долей недвижимости (Asset Minting)</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Название объекта</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Например: Офисный центр 'Север'"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Локация</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Город, Улица"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Оценка ($)</label>
                        <input 
                            required
                            type="number" 
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            min="0"
                            value={formData.totalValue || ''}
                            onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Кол-во долей</label>
                        <input 
                            required
                            type="number" 
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            min="1"
                            value={formData.totalShares}
                            onChange={e => setFormData({...formData, totalShares: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                     <div className="text-sm text-slate-500">
                        Цена за долю: <span className="font-bold text-slate-900">
                            ${formData.totalValue && formData.totalShares ? (formData.totalValue / formData.totalShares).toLocaleString() : 0}
                        </span>
                     </div>
                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition disabled:bg-blue-400 flex items-center gap-2"
                     >
                        {isSubmitting ? 'Минтинг...' : 'Выпустить токены'}
                     </button>
                </div>
            </form>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Sparkles className="text-yellow-400" size={20} />
                    AI Ассистент
                </h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Используйте Gemini 2.5 Flash для автоматического аудита данных объекта перед записью в блокчейн.
                </p>

                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                    {isAnalyzing ? (
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : 'Запустить анализ'}
                </button>
            </div>

            {aiAnalysis && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
                    <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Описание</h4>
                        <p className="text-sm text-slate-800 italic">"{aiAnalysis.description}"</p>
                    </div>
                    <div>
                         <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-2">
                            <AlertTriangle size={12} className="text-orange-500"/>
                            Риски
                         </h4>
                        <p className="text-sm text-slate-800">{aiAnalysis.risk}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-green-600 text-xs font-medium">
                        <CheckCircle size={14} />
                        Аудит завершен
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};