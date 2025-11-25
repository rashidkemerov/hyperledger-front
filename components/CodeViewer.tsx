import React from 'react';
import { GO_CONTRACT_CODE } from '../constants';
import { Copy } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(GO_CONTRACT_CODE);
    alert("Код скопирован!");
  };

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-start">
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Chaincode (Golang)</h2>
            <p className="text-slate-500">Исходный код смарт-контракта для Hyperledger Fabric</p>
        </div>
        <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-sm font-medium text-sm"
        >
            <Copy size={16} />
            Копировать
        </button>
      </header>

      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs font-mono text-slate-400">chaincode/token_contract.go</span>
        </div>
        <div className="p-0 overflow-x-auto">
            <pre className="p-6 text-sm font-mono leading-relaxed text-slate-300">
                <code>
                    {GO_CONTRACT_CODE}
                </code>
            </pre>
        </div>
      </div>
    </div>
  );
};