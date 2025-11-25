
import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, ShoppingBag, PlusCircle, FileCode, Moon, Sun, Wallet, Book, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, isDarkMode, toggleTheme, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Портфель', icon: LayoutDashboard },
    { id: ViewState.MARKETPLACE, label: 'Маркетплейс', icon: ShoppingBag },
    { id: ViewState.TOKENIZE, label: 'Токенизация', icon: PlusCircle },
    { id: ViewState.CONTRACT_CODE, label: 'Смарт-контракт', icon: FileCode },
    { id: ViewState.DOCUMENTATION, label: 'Документация', icon: Book },
  ];

  const handleNavClick = (id: ViewState) => {
    onChangeView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-[10px] bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
         <div className="flex items-center gap-3 font-bold text-lg tracking-tight">
             <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
               E
             </div>
             <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
               EstateChain
             </span>
         </div>
         <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
         </Button>
      </div>

      {/* Sidebar - Desktop Fixed / Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex h-20 items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
           <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
               E
             </div>
             <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
               EstateChain
             </span>
           </div>
        </div>
        
        <div className="flex flex-col gap-2 p-4 md:p-6 h-[calc(100vh-5rem)] md:h-auto overflow-y-auto">
          <div className="mb-2 px-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
             Меню
          </div>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 transition-all duration-200 ${
                currentView === item.id 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-90 dark:text-white" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={20} className={currentView === item.id ? "text-white" : "text-slate-500 dark:text-slate-400"} />
              {item.label}
            </Button>
          ))}
          
          <div className="mt-auto pt-6">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-4 text-white shadow-xl shadow-slate-900/10">
                <div className="flex items-center justify-between mb-2">
                    <Wallet size={16} className="text-emerald-400"/>
                    <span className="text-xs font-medium text-slate-400">Баланс</span>
                </div>
                <div className="text-lg font-bold tracking-tight">$142,500.00</div>
                <div className="text-xs text-slate-400 mt-1">+2.4% за неделю</div>
            </div>

           <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
             <div className="flex items-center gap-3">
               <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                 <div className="h-full w-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center font-bold text-xs">
                   AD
                 </div>
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-semibold">Admin</span>
                 <span className="text-[10px] text-slate-500">Pro Plan</span>
               </div>
             </div>
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </Button>
           </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto transition-all duration-300">
        <div className="container mx-auto max-w-7xl p-[10px] md:p-8 lg:p-10">
           {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
