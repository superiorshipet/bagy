'use client';

import React from 'react';
import { MapPin, ShoppingBag, Sparkles, Compass, Gift, Home, Moon, Sun, User, ShieldCheck } from 'lucide-react';
import { NavTab } from './BottomNav';
import { useAppSettings } from '@/context/ThemeContext';

interface TopBarProps {
  cartCount: number;
  onOpenCart: () => void;
  deliveryLocation?: string;
  onOpenLocationSelector?: () => void;
  activeTab?: NavTab;
  onChangeTab?: (tab: NavTab) => void;
  onOpenCustomize?: () => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartCount,
  onOpenCart,
  deliveryLocation = 'القاهرة الجديدة، التجمع',
  onOpenLocationSelector,
  activeTab = 'home',
  onChangeTab,
  onOpenCustomize,
  onOpenProfile,
  onOpenAdmin,
}) => {
  const { theme, toggleTheme, locale, toggleLocale } = useAppSettings();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#15151e]/95 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Location Delivery Selector & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => onChangeTab && onChangeTab('home')}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            <span className="text-2xl font-black tracking-tight text-[#9b287b] dark:text-[#be3999]">
              BAGY
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c69b59] inline-block" />
          </button>

          {/* Location Delivery Selector */}
          <button
            onClick={onOpenLocationSelector}
            className="flex items-center gap-2 text-right hover:opacity-85 transition-opacity bg-stone-50 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 px-3 py-1.5 rounded-full border border-stone-200/60 dark:border-stone-800"
          >
            <div className="w-7 h-7 rounded-full bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-right hidden sm:block">
              <span className="text-[10px] text-stone-400 block font-medium">التوصيل إلى</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-200 line-clamp-1 max-w-[150px] lg:max-w-[200px]">
                {deliveryLocation}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-stone-600 dark:text-stone-300">
          <button
            onClick={() => onChangeTab && onChangeTab('home')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
              activeTab === 'home' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </button>

          <button
            onClick={() => onChangeTab && onChangeTab('catalog')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
              activeTab === 'catalog' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            الموديلات والقصات
          </button>

          <button
            onClick={onOpenCustomize}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#9b287b] to-[#8a1d63] text-white hover:shadow-md transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            صمم شنطتك الآن
          </button>

          <button
            onClick={() => onChangeTab && onChangeTab('gifts')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 ${
              activeTab === 'gifts' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Gift className="w-4 h-4" />
            خدمة الهدايا
          </button>
        </nav>

        {/* Right: Actions (Theme Toggle, Admin Panel, Profile, Cart) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Admin Shortcut */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-sm"
              title="لوحة تحكم الأدمن"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">الأدمن</span>
            </button>
          )}

          {/* Night / Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي (Dark Mode)'}
            aria-label="تبديل المظهر الليلي"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-700" />
            )}
          </button>

          {/* User Profile / History Button */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="الملف الشخصي وسجل الطلبات"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 text-[#9b287b] dark:text-[#be3999]" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 hidden sm:inline">الحقيبة</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#9b287b] text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-stone-800 shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
