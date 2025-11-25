import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, ShoppingBag, PlusCircle, FileCode } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Портфель', icon: LayoutDashboard },
    { id: ViewState.MARKETPLACE, label: 'Маркетплейс', icon: ShoppingBag },
    { id: ViewState.TOKENIZE, label: 'Токенизация', icon: PlusCircle },
    { id: ViewState.CONTRACT_CODE, label: 'Смарт-контракт', icon: FileCode },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-mono">E</div>
            ESTATE CHAIN
          </h1>
          <p className="text-xs text-slate-400 mt-2">Hyperledger Fabric v2.4</p>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">
              ADM
            </div>
            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-green-400">● Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};