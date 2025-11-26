
import React, { useState } from 'react';
import { FabricService } from '../services/mockFabricService';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Loader2, Database, ShieldCheck, Box } from 'lucide-react';
import { RealEstateAsset } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
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
        alert("Актив успешно создан!");
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
    <div className="space-y-[5px] animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-sm mb-[5px]">
        <h2 className="text-4xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">Токенизация</h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Создание цифрового двойника недвижимости в сети Hyperledger Fabric.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[5px]">
        <Card className="lg:col-span-2 border-white/20 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl shadow-xl">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
                <CardTitle className="flex items-center gap-3 font-heading text-xl">
                    <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                        <Box size={24} />
                    </div>
                    Параметры объекта
                </CardTitle>
                <CardDescription className="ml-11">Введите данные о недвижимости для смарт-контракта</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                         <div className="space-y-[5px] col-span-2">
                            <Label htmlFor="name" className="text-slate-600 dark:text-slate-300">Название объекта</Label>
                            <Input 
                                id="name"
                                placeholder="Например: Офисный центр 'Север'"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                                className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-violet-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-[5px] col-span-2">
                            <Label htmlFor="location" className="text-slate-600 dark:text-slate-300">Локация</Label>
                            <Input 
                                id="location"
                                placeholder="Город, Улица"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                required
                                className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 transition-all"
                            />
                        </div>
                        <div className="space-y-[5px]">
                            <Label htmlFor="value" className="text-slate-600 dark:text-slate-300">Оценка стоимости ($)</Label>
                            <Input 
                                id="value"
                                type="number"
                                min="0"
                                value={formData.totalValue || ''}
                                onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})}
                                required
                                className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 transition-all font-heading font-bold"
                            />
                        </div>
                        <div className="space-y-[5px]">
                            <Label htmlFor="shares" className="text-slate-600 dark:text-slate-300">Количество долей</Label>
                            <Input 
                                id="shares"
                                type="number"
                                min="1"
                                value={formData.totalShares}
                                onChange={e => setFormData({...formData, totalShares: Number(e.target.value)})}
                                required
                                className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 transition-all font-heading font-bold"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 p-6 backdrop-blur-sm rounded-b-xl">
                    <div className="flex flex-col">
                         <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Цена за долю</span>
                         <span className="font-heading font-bold text-xl text-slate-900 dark:text-white">${formData.totalValue && formData.totalShares ? (formData.totalValue / formData.totalShares).toLocaleString() : 0}</span>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Выпустить токены
                    </Button>
                </CardFooter>
            </form>
        </Card>

        {/* AI Sidebar */}
        <div className="space-y-[5px]">
            <Card className="border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden relative shadow-lg shadow-indigo-500/20 h-auto">
                <div className="absolute top-0 right-0 p-20 bg-white/10 blur-3xl rounded-full" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading">
                        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                        AI Аудит
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                        Используйте Gemini 2.5 Flash для анализа привлекательности и рисков.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing} 
                        className="w-full bg-white text-indigo-900 hover:bg-white/90 border-0 shadow-xl"
                    >
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isAnalyzing ? 'Анализ...' : 'Запустить анализ'}
                    </Button>
                </CardContent>
            </Card>

            {aiAnalysis && (
                <Card className="animate-in slide-in-from-right-4 duration-500 bg-white/80 dark:bg-slate-950/80 border-white/20 dark:border-slate-800 backdrop-blur-xl">
                    <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800/50">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500"/>
                            Результат
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Описание</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{aiAnalysis.description}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30">
                            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase mb-1">Риски</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{aiAnalysis.risk}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
};
