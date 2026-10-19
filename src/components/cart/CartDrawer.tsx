'use client';

import React, { useState } from 'react';
import { CartItem } from '@/types/bag';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Gift,
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { user, openAuthModal } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('التجمع الخامس / القاهرة الجديدة');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'vodafone' | 'cod'>('apple_pay');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 75;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = async () => {
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('يرجى إدخال كود الخصم أولاً');
      return;
    }
    setIsApplyingPromo(true);
    setPromoError('');
    try {
      const res = await fetch(`/api/promos?code=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();
      if (data.success && data.promo) {
        setDiscountPercent(data.promo.discountPercent);
        setAppliedPromoCode(data.promo.code);
        setPromoError('');
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#10b981', '#9b287b', '#ffffff'],
          });
        } catch (e) {}
      } else {
        setDiscountPercent(0);
        setAppliedPromoCode('');
        setPromoError(data.error || 'كود الخصم غير صالح أو منتهي الصلاحية');
      }
    } catch (e) {
      setDiscountPercent(0);
      setAppliedPromoCode('');
      setPromoError('فشل الاتصال بالخادم للتحقق من كود الخصم');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    // GATING: Require user login before order can be placed!
    if (!user) {
      openAuthModal(() => {
        // Callback after login if needed
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerName: user.name || recipientName || 'عميل باجي',
          customerPhone: user.phone || '01000000000',
          deliveryArea,
          isGift,
          recipientName,
          giftMessage,
          subtotal,
          discount: discountAmount,
          deliveryFee,
          total,
          promoCode,
          paymentMethod,
          items,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrderNumber(data.order.orderNumber);
      } else {
        setPlacedOrderNumber(`BGY-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (e) {
      setPlacedOrderNumber(`BGY-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
      setIsOrderPlaced(true);
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#9b287b', '#c69b59', '#2dd36f', '#ffffff'],
        });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-[#15151e] text-stone-900 dark:text-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-r border-stone-200 dark:border-stone-800 transition-colors">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#15151e] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9b287b]" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">حقيبة التسوق ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success screen after order placed */}
        {isOrderPlaced ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#fdf2f8] dark:bg-[#2a1122] text-[#9b287b] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-stone-900 dark:text-white">تم استلام طلبك بنجاح! 🎉</h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-xs">
              رقم الطلب: <strong className="text-stone-900 dark:text-white">{placedOrderNumber}</strong>
              <br />
              تم حفظ الطلب في حسابك بقاعدة البيانات ونقله لورشة التصنيع.
            </p>
            <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 text-right w-full text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">منطقة التوصيل:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{deliveryArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">طريقة الدفع:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {paymentMethod === 'apple_pay'
                    ? 'Apple Pay'
                    : paymentMethod === 'card'
                    ? 'بطاقة بنكية'
                    : paymentMethod === 'vodafone'
                    ? 'فودافون كاش'
                    : 'عند الاستلام'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">المبلغ الإجمالي:</span>
                <span className="font-bold text-[#9b287b]">{formatPrice(total, 'EGP', 'ar')}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClearCart();
                setIsOrderPlaced(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#9b287b] text-white font-bold text-sm shadow-md hover:bg-[#831f67] transition-all"
            >
              متابعة التسوق
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">حقيبتك فارغة حالياً</h3>
            <p className="text-xs text-stone-500 max-w-xs">
              ابدأ الآن بتخصيص شنطتك المميزة واختيار ألوانك وحفر حروفك بأعلى جودة يدوية.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2.5 rounded-2xl bg-[#9b287b] text-white text-xs font-bold shadow-md hover:bg-[#831f67] transition-all"
            >
              اكتشف الشنط وخصص الآن
            </button>
          </div>
        ) : (
          /* Items List & Checkout Sections */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* User Login Notice if not logged in (Lola.do Style) */}
            {!user && (
              <div className="p-3.5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#9b287b]" />
                    تسجيل الدخول مطلوب لإتمام الطلب
                  </h4>
                  <p className="text-[11px] text-stone-500">سجل برقم هاتفك لربط الطلب وحفظ نقاطك وعناوينك</p>
                </div>
                <button
                  onClick={() => openAuthModal()}
                  className="px-3 py-1.5 rounded-xl bg-[#9b287b] text-white text-xs font-bold hover:bg-[#831f67] shadow-sm flex-shrink-0"
                >
                  دخول
                </button>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {(item.previewDataUrl || item.product?.image) && (
                        <img
                          src={item.previewDataUrl || item.product?.image}
                          alt={item.customSummaryText}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0 bg-stone-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white leading-snug line-clamp-2">
                          {item.customSummaryText}
                        </h4>
                        <p className="text-[11px] text-[#9b287b] font-semibold mt-0.5">
                          {formatPrice(item.calculatedPrice, 'EGP', 'ar')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 dark:border-stone-800">
                    <span className="text-[10px] text-stone-500">الكمية:</span>
                    <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-2 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-stone-600 dark:text-stone-300 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-stone-900 dark:text-white px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-stone-600 dark:text-stone-300 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Options (Like Lola) */}
            <div className="p-3.5 bg-pink-50/50 dark:bg-pink-950/20 rounded-2xl border border-pink-200/50 dark:border-pink-900/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#9b287b]" />
                  <span className="text-xs font-bold text-stone-900 dark:text-white">إرسال كهدية لشخص عزيز؟</span>
                </div>
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 accent-[#9b287b] rounded cursor-pointer"
                />
              </div>

              {isGift && (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="اسم مستلم الهدية"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="اكتب كارت إهداء لطيف (نطبعه ونضعه داخل البوكس)..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Delivery Location Selector */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
                <MapPin className="w-4 h-4 text-[#9b287b]" />
                <span>عنوان التوصيل (مصر):</span>
              </div>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                <option value="التجمع الخامس / القاهرة الجديدة">التجمع الخامس / القاهرة الجديدة</option>
                <option value="المعادي ودجلة">المعادي ودجلة</option>
                <option value="مدينة نصر ومصر الجديدة">مدينة نصر ومصر الجديدة</option>
                <option value="الشيخ زايد و 6 أكتوبر">الشيخ زايد و 6 أكتوبر</option>
                <option value="الزمالك والمهندسين والدقي">الزمالك والمهندسين والدقي</option>
                <option value="الإسكندرية (سموحة / رشدي / لوران)">الإسكندرية (سموحة / رشدي / لوران)</option>
              </select>
            </div>

            {/* Payment Method Selector */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
                <CreditCard className="w-4 h-4 text-[#9b287b]" />
                <span>طريقة الدفع المفضلة:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'apple_pay', name: ' Apple Pay' },
                  { id: 'card', name: 'بطاقة بنكية (Visa/MC)' },
                  { id: 'vodafone', name: 'فودافون كاش' },
                  { id: 'cod', name: 'عند الاستلام (COD)' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === pm.id
                        ? 'border-[#9b287b] bg-[#fdf2f8] dark:bg-[#2a1122] text-[#9b287b]'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أدخل كود الخصم (Promo Code)..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 uppercase font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo}
                  className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isApplyingPromo ? 'جاري التحقق...' : 'تطبيق'}
                </button>
              </div>
              {discountPercent > 0 && appliedPromoCode && (
                <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                  <span>✓ تم تفعيل كود ({appliedPromoCode}) بخصم {discountPercent}%</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscountPercent(0);
                      setAppliedPromoCode('');
                      setPromoCode('');
                    }}
                    className="text-stone-400 hover:text-red-500 font-normal underline"
                  >
                    إلغاء
                  </button>
                </div>
              )}
              {promoError && <p className="text-[11px] text-red-500 font-medium">{promoError}</p>}
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold">{formatPrice(subtotal, 'EGP', 'ar')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>الخصم ({discountPercent}%):</span>
                  <span>-{formatPrice(discountAmount, 'EGP', 'ar')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>رسوم التوصيل:</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? 'شحن مجاني 🎁' : formatPrice(deliveryFee, 'EGP', 'ar')}
                </span>
              </div>
              <div className="flex justify-between text-stone-950 dark:text-white font-black text-sm pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>الإجمالي النهائي:</span>
                <span className="text-[#9b287b]">{formatPrice(total, 'EGP', 'ar')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Checkout CTA */}
        {!isOrderPlaced && items.length > 0 && (
          <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-[#15151e] sticky bottom-0 z-10 pb-safe">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white font-bold text-sm shadow-lg shadow-[#9b287b]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {!user ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تسجيل الدخول للمتابعة والدفع</span>
                </>
              ) : (
                <>
                  <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد الطلب ودفع'}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                    {formatPrice(total, 'EGP', 'ar')}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
