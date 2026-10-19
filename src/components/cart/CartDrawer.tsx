'use client';

import React, { useState } from 'react';
import { CartItem } from '@/types/bag';
import { formatPrice } from '@/lib/utils';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Gift,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
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
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('التجمع الخامس / القاهرة الجديدة');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'vodafone' | 'cod'>('apple_pay');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 75;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BAGY10' || promoCode.trim().toUpperCase() === 'LOLA') {
      setDiscountPercent(10);
      setPromoError('');
    } else {
      setPromoError('كود الخصم غير صالح أو منتهي الصلاحية');
    }
  };

  const handlePlaceOrder = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#9b287b', '#c69b59', '#2dd36f', '#ffffff'],
      });
    } catch (e) {
      // ignore
    }
    setIsOrderPlaced(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9b287b]" />
            <h2 className="text-base font-bold text-stone-900">حقيبة التسوق ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success screen after order placed */}
        {isOrderPlaced ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#fdf2f8] text-[#9b287b] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-stone-900">تم استلام طلبك بنجاح! 🎉</h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs">
              رقم الطلب: <strong className="text-stone-900">#BGY-{Math.floor(100000 + Math.random() * 900000)}</strong>
              <br />
              تم إرسال تفاصيل التصنيع والتوصيل إلى هاتفك عبر رسالة SMS وواتساب.
            </p>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-right w-full text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">منطقة التوصيل:</span>
                <span className="font-bold text-stone-800">{deliveryArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">طريقة الدفع:</span>
                <span className="font-bold text-stone-800">
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
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800">حقيبتك فارغة حالياً</h3>
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
            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        {item.customSummaryText}
                      </h4>
                      <p className="text-[11px] text-[#9b287b] font-semibold mt-0.5">
                        {formatPrice(item.calculatedPrice, 'EGP', 'ar')}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-[10px] text-stone-500">الكمية:</span>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-stone-200">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-stone-900 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-stone-600 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Options (Like Lola) */}
            <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-200/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#9b287b]" />
                  <span className="text-xs font-bold text-stone-900">إرسال كهدية لشخص عزيز؟</span>
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="اكتب كارت إهداء لطيف (نطبعه ونضعه داخل البوكس)..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Delivery Location Selector */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <MapPin className="w-4 h-4 text-[#9b287b]" />
                <span>عنوان التوصيل (مصر):</span>
              </div>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 bg-white text-stone-800"
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
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
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
                        ? 'border-[#9b287b] bg-[#fdf2f8] text-[#9b287b]'
                        : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود الخصم (جرب: LOLA أو BAGY10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  تطبيق
                </button>
              </div>
              {discountPercent > 0 && (
                <p className="text-[11px] text-green-600 font-bold">
                  ✓ تم تفعيل خصم {discountPercent}% بنجاح!
                </p>
              )}
              {promoError && <p className="text-[11px] text-red-500">{promoError}</p>}
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي:</span>
                <span className="font-semibold">{formatPrice(subtotal, 'EGP', 'ar')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>الخصم ({discountPercent}%):</span>
                  <span>-{formatPrice(discountAmount, 'EGP', 'ar')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>رسوم التوصيل:</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? 'شحن مجاني 🎁' : formatPrice(deliveryFee, 'EGP', 'ar')}
                </span>
              </div>
              <div className="flex justify-between text-stone-950 font-black text-sm pt-2 border-t border-stone-200">
                <span>الإجمالي النهائي:</span>
                <span className="text-[#9b287b]">{formatPrice(total, 'EGP', 'ar')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Checkout CTA */}
        {!isOrderPlaced && items.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-white sticky bottom-0 z-10">
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3.5 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white font-bold text-sm shadow-lg shadow-[#9b287b]/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>تأكيد الطلب ودفع</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                {formatPrice(total, 'EGP', 'ar')}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
