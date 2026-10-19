'use client';

import React from 'react';
import { MapPin, ShoppingBag, Globe, Search, Heart } from 'lucide-react';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  locale?: 'ar' | 'en';
  onToggleLocale?: () => void;
  deliveryLocation?: string;
  onOpenLocationSelector?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  locale = 'ar',
  onToggleLocale,
  deliveryLocation = 'القاهرة الجديدة، التجمع',
  onOpenLocationSelector,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-100 px-4 py-2.5">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Left: Location Delivery Selector (Just like Lola's header) */}
        <button
          onClick={onOpenLocationSelector}
          className="flex items-center gap-1.5 text-right hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[#fdf2f8] text-[#9b287b] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="leading-tight text-right">
            <span className="text-[10px] text-stone-400 block font-medium">التوصيل إلى</span>
            <span className="text-xs font-bold text-stone-900 line-clamp-1 max-w-[130px] sm:max-w-[180px]">
              {deliveryLocation}
            </span>
          </div>
        </button>

        {/* Center: Brand Logo */}
        <div className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tight text-[#9b287b]">BAGY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c69b59] inline-block" />
        </div>

        {/* Right: Actions (Language + Cart) */}
        <div className="flex items-center gap-2">
          {onToggleLocale && (
            <button
              onClick={onToggleLocale}
              className="px-2 py-1 rounded-full bg-stone-100 text-[11px] font-bold text-stone-700 hover:bg-stone-200 transition-colors"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative w-9 h-9 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center hover:bg-stone-200 transition-colors"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-[#9b287b]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#9b287b] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
