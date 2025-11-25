import React, { useState } from 'react';
import { FabricService } from '../services/mockFabricService';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Loader2, Database, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-[30px] animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Токенизация</h2>
        <p className="text-slate-500 dark:text-slate-400">Создание цифрового двойника недвижимости в сети Hyperledger Fabric.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px]">
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="text-violet-500" size={20}/>
                    Параметры объекта
                </CardTitle>
                <CardDescription>Введите данные о недвижимости для смарт-контракта</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
                         <div className="space-y-[5px] col-span-2">
                            <Label htmlFor="name">Название объекта</Label>
                            <Input 
                                id="name"
                                placeholder="Например: Офисный центр 'Север'"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                                className="dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-[5px] col-span-2">
                            <Label htmlFor="location">Локация</Label>
                            <Input 
                                id="location"
                                placeholder="Город, Улица"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                required
                                className="dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-[5px]">
                            <Label htmlFor="value">Оценка стоимости ($)</Label>
                            <Input 
                                id="value"
                                type="number"
                                min="0"
                                value={formData.totalValue || ''}
                                onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})}
                                required
                                className="dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-[5px]">
                            <Label htmlFor="shares">Количество долей</Label>
                            <Input 
                                id="shares"
                                type="number"
                                min="1"
                                value={formData.totalShares}
                                onChange={e => setFormData({...formData, totalShares: Number(e.target.value)})}
                                required
                                className="dark:bg-slate-950 dark:border-slate-800"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-6">
                    <div className="text-sm text-slate-500">
                         Цена доли: <span className="font-bold text-slate-900 dark:text-white">${formData.totalValue && formData.totalShares ? (formData.totalValue / formData.totalShares).toLocaleString() : 0}</span>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Выпустить токены
                    </Button>
                </CardFooter>
            </form>
        </Card>

        {/* AI Sidebar */}
        <div className="space-y-[20px]">
            <Card className="border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden relative shadow-lg shadow-indigo-500/10">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-200 dark:bg-indigo-900/30 blur-3xl animate-pulse" />
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        AI Аудит
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Используйте Gemini 2.5 Flash для анализа привлекательности и рисков.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing} 
                        variant="secondary"
                        className="w-full bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-indigo-100 dark:border-slate-700"
                    >
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isAnalyzing ? 'Анализ...' : 'Запустить анализ'}
                    </Button>
                </CardContent>
            </Card>

            {aiAnalysis && (
                <Card className="animate-in slide-in-from-right-4 duration-500 dark:bg-slate-900 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500"/>
                            Результат
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Badge variant="outline" className="mb-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900">Описание</Badge>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{aiAnalysis.description}</p>
                        </div>
                        <div>
                            <Badge variant="outline" className="mb-2 border-pink-200 dark:border-pink-900 text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/30">Риски</Badge>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{aiAnalysis.risk}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
};