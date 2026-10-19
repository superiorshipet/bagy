'use client';

import React from 'react';
import { MapPin, ShoppingBag, Sparkles, Compass, Gift, Home } from 'lucide-react';
import { NavTab } from './BottomNav';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  locale?: 'ar' | 'en';
  onToggleLocale?: () => void;
  deliveryLocation?: string;
  onOpenLocationSelector?: () => void;
  activeTab?: NavTab;
  onChangeTab?: (tab: NavTab) => void;
  onOpenCustomize?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  locale = 'ar',
  onToggleLocale,
  deliveryLocation = 'القاهرة الجديدة، التجمع',
  onOpenLocationSelector,
  activeTab = 'home',
  onChangeTab,
  onOpenCustomize,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-100 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Location Delivery Selector (Just like Lola's header) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLocationSelector}
            className="flex items-center gap-2 text-right hover:opacity-85 transition-opacity bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60"
          >
            <div className="w-7 h-7 rounded-full bg-[#fdf2f8] text-[#9b287b] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-right">
              <span className="text-[10px] text-stone-400 block font-medium">التوصيل إلى</span>
              <span className="text-xs font-bold text-stone-900 line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                {deliveryLocation}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onChangeTab && onChangeTab('home')}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            <span className="text-2xl font-black tracking-tight text-[#9b287b]">BAGY</span>
            <span className="w-2 h-2 rounded-full bg-[#c69b59] inline-block" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-stone-600">
            <button
              onClick={() => onChangeTab && onChangeTab('home')}
              className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
                activeTab === 'home' ? 'text-[#9b287b] font-black' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </button>
            <button
              onClick={() => onChangeTab && onChangeTab('catalog')}
              className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
                activeTab === 'catalog' ? 'text-[#9b287b] font-black' : ''
              }`}
            >
              <Compass className="w-4 h-4" />
              الموديلات والقصات
            </button>
            <button
              onClick={onOpenCustomize}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#9b287b] to-[#8a1d63] text-white hover:shadow-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              صمم شنطتك الآن
            </button>
            <button
              onClick={() => onChangeTab && onChangeTab('gifts')}
              className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
                activeTab === 'gifts' ? 'text-[#9b287b] font-black' : ''
              }`}
            >
              <Gift className="w-4 h-4" />
              خدمة الهدايا
            </button>
          </nav>
        </div>

        {/* Right: Actions (Language + Cart) */}
        <div className="flex items-center gap-3">
          {onToggleLocale && (
            <button
              onClick={onToggleLocale}
              className="px-3 py-1.5 rounded-full bg-stone-100 text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors"
            >
              {locale === 'ar' ? 'English' : 'عربي'}
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-2"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-[#9b287b]" />
            <span className="text-xs font-bold text-stone-800 hidden sm:inline">الحقيبة</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#9b287b] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
