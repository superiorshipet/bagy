'use client';

import React, { useState } from 'react';
import {
  X,
  Gift,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  EyeOff,
  Check,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

interface GiftServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGiftBag: () => void;
}

export const GiftServiceModal: React.FC<GiftServiceModalProps> = ({
  isOpen,
  onClose,
  onStartGiftBag,
}) => {
  const [sampleRecipient, setSampleRecipient] = useState('سارة أحمد');
  const [sampleMessage, setSampleMessage] = useState(
    'ألف مبروك التخرج يا أجمل سارة، عقبال أعلى المناصب والنجاحات دائماً ❤️'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#161622] text-stone-900 dark:text-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 transition-all max-h-[92vh] flex flex-col"
        dir="rtl"
      >
        {/* Top Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#2c1825] via-[#5c1b48] to-[#9b287b] text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              خدمة الإهداء الملكية الخاصة
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            هدية فاخرة تُصنع خصيصاً لمن تحب
          </h2>
          <p className="text-xs sm:text-sm text-stone-200/90 mt-1.5 max-w-lg leading-relaxed">
            نوصل الشنطة في علبة هدايا مغناطيسية مقواة مع شريطة ستان ملكية وختم شمعي، مع كارت مطبوع بكلماتك وإخفاء الأسعار تماماً.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* 4 Core Gift Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1f1f2e] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-[#9b287b] flex items-center justify-center font-bold text-lg">
                🎁
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                بوكس هدايا صلب وشريطة ستان
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                علبة هدايا مقواة بقفل مغناطيسي مع شريطة ستان عريضة وختم شمعي أحمر أنيق.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1f1f2e] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 flex items-center justify-center font-bold text-lg">
                💌
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                كارت إهداء بكلماتك الشخصية
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                نطبع رسالتك الخاصة واسمك واسم المهدى إليه على كارت قطني فاخر يوضع داخل الصندوق.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1f1f2e] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 flex items-center justify-center font-bold text-lg">
                <EyeOff className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                إخفاء الفاتورة والأسعار تماماً
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                يصل الطرد مباشرة لصاحب الهدية دون أي ذكر للأسعار، وتصلك أنت الفاتورة الإلكترونية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1f1f2e] border border-stone-200/80 dark:border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                حفر اسم المهدى إليه بالذهب
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                نقش حراري بحروف الذهب أو الفضة على جلد الشنطة أو الميدالية ليظل ذكرى خالدة.
              </p>
            </div>
          </div>

          {/* Interactive Gift Card Live Preview */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-pink-50/60 dark:from-[#211a24] dark:to-[#17141f] border border-amber-200/70 dark:border-amber-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                  معاينة كارت الإهداء المرفق بالصندوق
                </span>
              </div>
              <span className="text-[11px] text-stone-500">مجاناً مع الصندوق</span>
            </div>

            {/* Simulated Luxury Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#181824] shadow-md border border-stone-200 dark:border-stone-700 relative overflow-hidden">
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-red-700/90 text-amber-100 flex items-center justify-center text-[10px] font-bold shadow-inner">
                ✦
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#9b287b] dark:text-[#be3999]">
                  إلى: {sampleRecipient || 'اسم المستلم'}
                </p>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-serif leading-relaxed italic pr-2 border-r-2 border-[#9b287b]">
                  &ldquo;{sampleMessage || 'اكتب رسالتك الخاصة هنا...'}&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
                  <span>صُنعت خصيصاً بكل حب عبر BAGY</span>
                  <span>Cairo, Egypt</span>
                </div>
              </div>
            </div>

            {/* Inputs to try out */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  جربي كتابة اسم المهدي إليه:
                </label>
                <input
                  type="text"
                  value={sampleRecipient}
                  onChange={(e) => setSampleRecipient(e.target.value)}
                  placeholder="مثال: منى إبراهيم"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#12121c] border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#9b287b]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  جربي نص رسالة الإهداء:
                </label>
                <textarea
                  rows={2}
                  value={sampleMessage}
                  onChange={(e) => setSampleMessage(e.target.value)}
                  placeholder="اكتبي كلماتك اللطيفة هنا..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#12121c] border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#9b287b]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 dark:bg-[#13131c] border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3 justify-between flex-shrink-0">
          <div className="text-xs text-stone-500 hidden sm:block">
            <span>يمكنك تفعيل خيار الهدية أيضاً أثناء الدفع في سلة الشراء.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              إغلاق
            </button>

            <button
              onClick={() => {
                onClose();
                onStartGiftBag();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9b287b] to-[#8a1d63] text-white text-xs font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>ابدأ تفصيل شنطة هدية الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
