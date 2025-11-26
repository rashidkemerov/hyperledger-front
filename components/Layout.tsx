
import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, ShoppingBag, PlusCircle, FileCode, Moon, Sun, Wallet, Book, Menu, X, Globe } from 'lucide-react';
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
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative">
      
      {/* Animated Background */}
      <div className="bg-blob-container transition-colors duration-700">
        <div className="blob-1 top-0 -left-20 w-96 h-96 bg-purple-300 dark:bg-purple-900 mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="blob-2 top-0 -right-20 w-96 h-96 bg-cyan-300 dark:bg-cyan-900 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="blob-3 -bottom-32 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-900 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-[10px] m-[5px] rounded-xl bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg sticky top-[5px] z-50">
         <div className="flex items-center gap-3 font-heading font-bold text-lg tracking-tight">
             <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
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

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-[5px] left-[5px] z-40 w-72 rounded-2xl bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border border-white/40 dark:border-white/5 shadow-2xl shadow-indigo-500/5 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-10px)] md:my-[5px] md:ml-[5px]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-20 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
           <div className="flex items-center gap-3 font-heading font-bold text-xl tracking-tight">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
               E
             </div>
             <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
               EstateChain
             </span>
           </div>
        </div>
        
        <div className="flex flex-col gap-[5px] p-[10px] h-[calc(100%-5rem)] overflow-y-auto">
          <div className="mb-2 px-4 py-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
             Навигация
          </div>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 text-sm font-medium transition-all duration-300 rounded-xl ${
                currentView === item.id 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:translate-x-1"
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={18} className={currentView === item.id ? "text-violet-400 dark:text-violet-600" : "text-slate-400"} />
              {item.label}
            </Button>
          ))}
          
          <div className="mt-auto pt-4">
            <div className="mb-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900 p-5 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Globe size={40} />
                </div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                      <Wallet size={16} className="text-emerald-400"/>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Баланс</span>
                </div>
                <div className="text-2xl font-heading font-bold tracking-tight relative z-10">$142,500.00</div>
                <div className="text-xs text-emerald-400 mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-1 rounded-md border border-emerald-400/20">
                    +2.4% APR
                </div>
            </div>

           <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4 px-2">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center font-heading font-bold text-xs">
                    AD
                    </div>
                 </div>
                 <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950"></div>
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-bold font-heading">Admin</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-wide">Enterprise</span>
               </div>
             </div>
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-white/50 dark:hover:bg-slate-800 backdrop-blur-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-600" />}
             </Button>
           </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper - The 5px padding is applied here for the inner content */}
      <main className="flex-1 w-full md:w-auto h-auto md:h-screen overflow-hidden">
        <div className="h-full overflow-y-auto p-[5px]">
           {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/20 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
