'use client';

import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Settings,
  Moon,
  Sun,
  Bell,
  Package,
  CreditCard,
  Edit2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const { theme, toggleTheme, currency, setCurrency, notificationsEnabled, toggleNotifications } =
    useAppSettings();
  const { user: authUser, logout, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and orders from API
  useEffect(() => {
    if (isOpen && authUser) {
      setLoading(true);
      const queryParam = authUser.id
        ? `userId=${authUser.id}`
        : authUser.phone
        ? `phone=${encodeURIComponent(authUser.phone)}`
        : `email=${encodeURIComponent(authUser.email)}`;
      fetch(`/api/user/profile?${queryParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setProfileData(data.user);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, authUser]);

  if (!isOpen) return null;

  const currentUser = profileData || authUser;
  const orders = profileData?.orders || [];
  const addresses = profileData?.addresses || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PRODUCTION':
        return { label: 'في خط التصنيع اليدوي 🧵', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'SHIPPED':
        return { label: 'في الطريق للتوصيل 🚚', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'DELIVERED':
        return { label: 'تم التسليم بنجاح ✓', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'CANCELLED':
        return { label: 'ملغي', color: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: 'قيد المراجعة والتأكيد ⏳', color: 'bg-stone-100 text-stone-800 border-stone-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#15151e] rounded-3xl shadow-2xl flex flex-col h-[90vh] max-h-[820px] overflow-hidden border border-stone-200 dark:border-stone-800 transition-colors">
        {/* Top Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#15151e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#9b287b] to-[#c69b59] text-white flex items-center justify-center font-black text-base shadow-md">
              {currentUser?.name ? currentUser.name.charAt(0) : 'ع'}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                {currentUser?.name || 'عميل باجي'}
                {isAdmin && (
                  <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-full">
                    مدير النظام (Admin)
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                {currentUser?.phone ? `هاتف: ${currentUser.phone}` : currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onOpenAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                لوحة الأدمن 🛠️
              </button>
            )}

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar scroll-touch border-b border-stone-100 dark:border-stone-800 px-3 sm:px-6 bg-stone-50/60 dark:bg-stone-900/40">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Package className="w-4 h-4" />
            سجل العمليات والطلبات ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'addresses'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <MapPin className="w-4 h-4" />
            عناوين التوصيل ({addresses.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Settings className="w-4 h-4" />
            الإعدادات والمظهر
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 no-scrollbar">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">طلباتك الحالية والسابقة</h3>
                <span className="text-xs text-stone-400">تحديث لحظي من قاعدة البيانات</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">لا توجد طلبات سابقة في حسابك</h4>
                  <p className="text-xs text-stone-400">ابدأ الآن بتفصيل أول شنطة خاصة بك وسجل طلبك لتتابعه هنا.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {orders.map((order: any) => {
                    const statusObj = getStatusBadge(order.status);
                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 space-y-3 hover:border-[#9b287b]/40 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-stone-900 dark:text-white">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusObj.color}`}
                          >
                            {statusObj.label}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#9b287b]" />
                                <span className="font-bold text-stone-800 dark:text-stone-200">
                                  {item.summaryText}
                                </span>
                                <span className="text-stone-400">×{item.quantity}</span>
                              </div>
                              <span className="font-semibold text-stone-700 dark:text-stone-300">
                                {formatPrice(item.unitPrice * item.quantity, 'EGP', 'ar')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Gift Note if present */}
                        {order.isGift && (
                          <div className="p-2.5 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200/60 dark:border-pink-900/40 text-[11px] space-y-0.5">
                            <span className="font-bold text-[#9b287b] block">🎁 هدية لـ: {order.recipientName}</span>
                            {order.giftMessage && (
                              <p className="text-stone-600 dark:text-stone-400 italic">"{order.giftMessage}"</p>
                            )}
                          </div>
                        )}

                        {/* Order Footer & Price */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-stone-400">
                            منطقة التوصيل: <strong className="text-stone-700 dark:text-stone-300">{order.deliveryArea}</strong>
                          </span>
                          <div>
                            <span className="text-stone-400 text-[11px]">الإجمالي: </span>
                            <span className="font-black text-[#9b287b] dark:text-[#be3999] text-sm">
                              {formatPrice(order.total, 'EGP', 'ar')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">عناوين التوصيل المحفوظة</h3>
                <button className="text-xs font-bold text-[#9b287b] hover:underline">
                  + إضافة عنوان جديد
                </button>
              </div>

              {addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">{addr.label}</h4>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                            العنوان الافتراضي
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                        {addr.area} - {addr.street} {addr.building ? `(${addr.building})` : ''}
                      </p>
                    </div>
                  </div>

                  <button className="text-stone-400 hover:text-stone-600 p-1">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SETTINGS & NIGHT THEME */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">إعدادات الحساب والمظهر</h3>

              {/* Dark / Night Mode Toggle */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">الوضع الليلي (Night Theme)</h4>
                    <p className="text-[11px] text-stone-400">تفعيل المظهر الليلي الفاخر المريح للعينين</p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    theme === 'dark' ? 'bg-[#9b287b] justify-end' : 'bg-stone-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Currency Selector */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">عملة العرض</h4>
                    <p className="text-[11px] text-stone-400">الجنيه المصري (EGP) أو العملات الإقليمية</p>
                  </div>
                </div>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="EGP">EGP - ج.م</option>
                  <option value="SAR">SAR - ر.س</option>
                  <option value="USD">USD - $</option>
                </select>
              </div>

              {/* Notifications Toggle */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">إشعارات تتبع تصنيع الشنطة</h4>
                    <p className="text-[11px] text-stone-400">تحديثات فورية عبر الرسائل عند دخول مرحلة الخياطة والشحن</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                  className="w-5 h-5 accent-[#9b287b] rounded cursor-pointer"
                />
              </div>

              {/* Logout Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
