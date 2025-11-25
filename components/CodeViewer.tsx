import React from 'react';
import { GO_CONTRACT_CODE } from '../constants';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

export const CodeViewer: React.FC = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(GO_CONTRACT_CODE);
    alert("Код скопирован!");
  };

  return (
    <div className="space-y-[30px] animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Смарт-контракт</h2>
                <p className="text-slate-500 dark:text-slate-400">Исходный код Chaincode на Go для Hyperledger Fabric.</p>
            </div>
            <Button variant="outline" onClick={copyToClipboard} className="gap-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Copy size={16} />
                Копировать
            </Button>
       </div>

      <Card className="bg-slate-950 text-slate-50 border-slate-800 shadow-2xl">
        <CardHeader className="border-b border-slate-800 bg-slate-900/50 py-4">
             <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                <span className="ml-4 font-mono text-xs text-slate-400">contract/smart_contract.go</span>
             </div>
        </CardHeader>
        <CardContent className="p-0">
             <div className="overflow-x-auto p-6 max-h-[70vh]">
                <pre className="text-sm font-mono leading-relaxed text-slate-300">
                    <code>{GO_CONTRACT_CODE}</code>
                </pre>
             </div>
        </CardContent>
      </Card>
    </div>
  );
};