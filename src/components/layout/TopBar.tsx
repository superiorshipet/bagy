'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShoppingBag,
  Sparkles,
  Compass,
  Gift,
  Home,
  Moon,
  Sun,
  User,
  ShieldCheck,
  LogIn,
  Bell,
  CheckCheck,
  X,
} from 'lucide-react';
import { NavTab } from './BottomNav';
import { useAppSettings } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

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
  const { theme, toggleTheme } = useAppSettings();
  const { user, isAdmin, openAuthModal } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadNotifications = async () => {
    try {
      const query = user?.id ? `?userId=${user.id}` : '';
      const res = await fetch(`/api/notifications${query}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true, userId: user?.id }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      if (onOpenAdmin) onOpenAdmin();
    } else {
      openAuthModal();
    }
  };

  const handleProfileClick = () => {
    if (user) {
      if (onOpenProfile) onOpenProfile();
    } else {
      openAuthModal();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#15151e]/95 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800 px-3 sm:px-6 lg:px-10 py-3 sm:py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1536px] mx-auto w-full">
        {/* Left: Location Delivery Selector & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
          <button
            onClick={() => onChangeTab && onChangeTab('home')}
            className="flex items-center gap-1.5 focus:outline-none group"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#9b287b] dark:text-[#be3999] group-hover:opacity-90 transition-opacity">
              BAGY
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c69b59] inline-block shadow-sm" />
          </button>

          {/* Location Delivery Selector */}
          <button
            onClick={onOpenLocationSelector}
            className="flex items-center gap-1.5 sm:gap-2 text-right hover:opacity-85 transition-opacity bg-stone-50 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 px-2 sm:px-3 py-1.5 rounded-full border border-stone-200/60 dark:border-stone-800"
          >
            <div className="w-7 h-7 rounded-full bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-right hidden min-[480px]:block">
              <span className="text-[10px] text-stone-400 block font-medium">التوصيل إلى</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-200 line-clamp-1 max-w-[120px] sm:max-w-[170px] lg:max-w-[220px]">
                {deliveryLocation}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-stone-600 dark:text-stone-300">
          <button
            onClick={() => onChangeTab && onChangeTab('home')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'home' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </button>

          <button
            onClick={() => onChangeTab && onChangeTab('catalog')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'catalog' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            الموديلات والقصات
          </button>

          <button
            onClick={onOpenCustomize}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#9b287b] to-[#8a1d63] text-white hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-sm font-black"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            صمم شنطتك الآن
          </button>

          <button
            onClick={() => onChangeTab && onChangeTab('gifts')}
            className={`hover:text-[#9b287b] transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'gifts' ? 'text-[#9b287b] dark:text-[#be3999] font-black' : ''
            }`}
          >
            <Gift className="w-4 h-4" />
            خدمة الهدايا
          </button>
        </nav>

        {/* Right: Actions (Theme Toggle, Admin Panel, Profile, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Admin Control Button */}
          <button
            onClick={handleAdminClick}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isAdmin
                ? 'bg-amber-500 text-stone-950 font-black hover:bg-amber-400'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
            title={isAdmin ? 'لوحة تحكم الأدمن (مفعل)' : 'تسجيل دخول الأدمن'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">الأدمن</span>
          </button>

          {/* Night / Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex-shrink-0"
            title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي (Dark Mode)'}
            aria-label="تبديل المظهر الليلي"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-700" />
            )}
          </button>

          {/* Notification Bell Button & Drawer */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex-shrink-0"
              title="مركز الإشعارات والتنبيهات"
              aria-label="مركز التنبيهات"
            >
              <Bell className="w-4 h-4 text-stone-700 dark:text-stone-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9b287b] text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-stone-800 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer / Popover */}
            {isNotifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                  onClick={() => setIsNotifOpen(false)}
                />
                <div
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2.5 w-[320px] sm:w-[380px] bg-white dark:bg-[#1a1a26] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 z-50 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150"
                  dir="rtl"
                >
                  <div className="p-3.5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#fdf2f8] dark:bg-[#2e1327] text-[#9b287b] dark:text-[#f472b6] flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-stone-900 dark:text-white">مركز التنبيهات</h3>
                        <p className="text-[10px] text-stone-400">تحديثات حالة الطلبات ورسائل الإدارة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-[#9b287b] dark:text-[#f472b6] font-bold hover:underline flex items-center gap-1 px-2 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>قراءة الكل</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsNotifOpen(false)}
                        className="w-6 h-6 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <span className="text-2xl">✨</span>
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-300">لا توجد إشعارات جديدة</p>
                        <p className="text-[10px] text-stone-400">أي تحديث لحالة تفصيل شنطتك أو عروض مميزة ستصلك هنا.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-2xl transition-colors space-y-1 ${
                            notif.isRead
                              ? 'bg-transparent text-stone-600 dark:text-stone-400'
                              : 'bg-[#fdf2f8]/70 dark:bg-[#281223]/60 text-stone-900 dark:text-white border border-[#9b287b]/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {notif.type === 'order'
                                  ? '🧵'
                                  : notif.type === 'promo'
                                  ? '🏷️'
                                  : '📢'}
                              </span>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                                {notif.title}
                              </h4>
                            </div>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#9b287b] animate-pulse" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed pr-6">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between pt-1 pr-6 text-[10px] text-stone-400">
                            <span>
                              {new Date(notif.createdAt).toLocaleDateString('ar-EG', {
                                day: 'numeric',
                                month: 'short',
                                hour: 'numeric',
                                minute: 'numeric',
                              })}
                            </span>
                            {notif.userId === null && (
                              <span className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                إشعار عام
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <button
              onClick={handleProfileClick}
              className="px-2.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center gap-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex-shrink-0"
              title="الملف الشخصي وسجل الطلبات"
            >
              <div className="w-6 h-6 rounded-full bg-[#9b287b] text-white flex items-center justify-center text-[11px] font-black shadow-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-bold hidden md:inline">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] hover:bg-[#fae8f3] text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-2.5 sm:px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
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
