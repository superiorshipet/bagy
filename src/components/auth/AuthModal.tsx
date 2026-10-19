'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, ChevronLeft, ArrowRight, ShieldCheck, Lock, Smartphone, User, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithPhone, loginAsAdmin } = useAuth();
  const [authMode, setAuthMode] = useState<'customer_phone' | 'admin_login' | 'signup'>('customer_phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const success = await loginWithPhone(phoneNumber.trim(), customerName.trim() || undefined);
    setIsLoading(false);
    if (!success) {
      setErrorMessage('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setErrorMessage('يرجى إدخال كلمة مرور الأدمن');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const success = await loginAsAdmin(adminPassword);
    setIsLoading(false);
    if (!success) {
      setErrorMessage('كلمة المرور غير صحيحة (جرب: admin123)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container Styled Exactly like Lola.do Screenshot */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#fce7f3] via-[#fdf2f8] to-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200/60 p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
        {/* Top Back / Close Button */}
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={closeAuthModal}
            className="w-10 h-10 rounded-full bg-white/90 text-stone-700 flex items-center justify-center hover:bg-white shadow-sm transition-all"
            aria-label="رجوع"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Switch to Admin / Customer Tab */}
          <button
            onClick={() => {
              setErrorMessage('');
              setAuthMode(authMode === 'admin_login' ? 'customer_phone' : 'admin_login');
            }}
            className="text-xs font-bold text-[#9b287b] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-pink-200/80 shadow-sm flex items-center gap-1.5 transition-all"
          >
            {authMode === 'admin_login' ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                دخول العميل
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                دخول الأدمن 🛠️
              </>
            )}
          </button>
        </div>

        {/* 1. Customer Phone Login (Lola Style) */}
        {authMode === 'customer_phone' && (
          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Login</h2>
              <p className="text-xs text-stone-500 mt-1">Please enter your mobile to continue</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {/* Phone Input with Egypt Flag +20 */}
              <div className="relative flex items-center bg-white rounded-2xl border border-pink-200 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-[#9b287b]">
                <div className="flex items-center gap-2 pr-3 border-r border-stone-200 flex-shrink-0" dir="ltr">
                  <span className="text-xl">🇪🇬</span>
                  <span className="text-xs font-bold text-stone-800">+20</span>
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  placeholder="01xxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-3 text-sm font-bold text-stone-900 bg-transparent focus:outline-none tracking-wider"
                  dir="ltr"
                />
              </div>

              {errorMessage && <p className="text-xs text-red-500 font-bold">{errorMessage}</p>}

              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-xs font-bold text-[#9b287b] hover:underline block"
              >
                New to BAGY? Sign up instead 👜
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white font-black text-sm shadow-lg shadow-[#9b287b]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'جاري التحقق...' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-stone-400">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-[#9b287b] font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        {/* 2. Customer Sign Up (New Account) */}
        {authMode === 'signup' && (
          <div className="flex-1 flex flex-col justify-center text-center space-y-5">
            <div>
              <h2 className="text-2xl font-black text-stone-900">Sign Up</h2>
              <p className="text-xs text-stone-500 mt-0.5">أنشئ حسابك لحفظ شنطك ومتابعة الطلبات</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
              <input
                type="text"
                required
                placeholder="اسمك بالكامل (Full Name)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-white text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#9b287b]"
              />

              <div className="relative flex items-center bg-white rounded-2xl border border-pink-200 px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-[#9b287b]">
                <div className="flex items-center gap-2 pr-3 border-r border-stone-200 flex-shrink-0" dir="ltr">
                  <span className="text-xl">🇪🇬</span>
                  <span className="text-xs font-bold text-stone-800">+20</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-3 text-sm font-bold text-stone-900 bg-transparent focus:outline-none tracking-wider"
                  dir="ltr"
                />
              </div>

              {errorMessage && <p className="text-xs text-red-500 font-bold">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white font-black text-sm shadow-lg shadow-[#9b287b]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'جاري إنشاء الحساب...' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setAuthMode('customer_phone')}
              className="text-xs font-bold text-stone-600 hover:text-[#9b287b]"
            >
              لديك حساب بالفعل؟ تسجيل الدخول
            </button>
          </div>
        )}

        {/* 3. Admin Login */}
        {authMode === 'admin_login' && (
          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center mx-auto text-2xl shadow-sm">
              🛡️
            </div>
            <div>
              <h2 className="text-2xl font-black text-stone-900">تسجيل دخول المسؤول (Admin)</h2>
              <p className="text-xs text-stone-500 mt-1">حساب الإدارة: admin@bagy.eg</p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="كلمة مرور الأدمن (admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-amber-300 bg-white text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-widest"
                />
              </div>

              {errorMessage && <p className="text-xs text-red-500 font-bold">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </button>
            </form>

            <button
              onClick={() => setAuthMode('customer_phone')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800"
            >
              الرجوع لتسجيل دخول العميل
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
