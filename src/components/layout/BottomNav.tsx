'use client';

import React from 'react';
import { Home, Compass, Sparkles, Gift, User } from 'lucide-react';

export type NavTab = 'home' | 'catalog' | 'customize' | 'gifts' | 'orders';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenCustomize: () => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenCustomize,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-4 py-2" dir="rtl">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Tab 1: Home */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'home' ? 'text-[#9b287b] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">الرئيسية</span>
        </button>

        {/* Tab 2: Catalog */}
        <button
          onClick={() => onChangeTab('catalog')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'catalog' ? 'text-[#9b287b] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">الموديلات</span>
        </button>

        {/* Center Tab: Floating Glow Customize Button (Signature Lola feature) */}
        <div className="relative -top-5">
          <button
            onClick={onOpenCustomize}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#9b287b] to-[#c69b59] text-white shadow-xl shadow-[#9b287b]/40 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform border-4 border-white"
            aria-label="صمم شنطتك الآن"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] font-black tracking-tight mt-0.5">فصّل</span>
          </button>
        </div>

        {/* Tab 4: Gifts / Occasions */}
        <button
          onClick={() => onChangeTab('gifts')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'gifts' ? 'text-[#9b287b] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px]">الهدايا</span>
        </button>

        {/* Tab 5: Account / Orders */}
        <button
          onClick={() => onChangeTab('orders')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'orders' ? 'text-[#9b287b] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">حسابي</span>
        </button>
      </div>
    </div>
  );
};
