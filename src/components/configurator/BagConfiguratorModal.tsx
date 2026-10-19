'use client';

import React, { useState, useMemo } from 'react';
import {
  CustomBagConfiguration,
  BagCategory,
  BagSize,
  MonogramConfig,
  CartItem,
} from '@/types/bag';
import {
  BAG_TYPES,
  SIZES,
  MATERIALS,
  COLORS,
  HARDWARE_OPTIONS,
  STRAPS,
  ADDONS,
} from '@/data/bagOptions';
import { BagCanvasPreview } from './BagCanvasPreview';
import { formatPrice } from '@/lib/utils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  ShoppingBag,
  Info,
  Layers,
  Palette,
  Maximize2,
  Type,
  Gift,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BagConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  initialBagType?: BagCategory;
  locale?: 'ar' | 'en';
}

const STEPS = [
  { id: 1, titleAr: 'النوع والقصة', titleEn: 'Bag Silhouette', icon: Layers },
  { id: 2, titleAr: 'المقاس المناسب', titleEn: 'Size & Dimensions', icon: Maximize2 },
  { id: 3, titleAr: 'الخامة والملمس', titleEn: 'Leather & Material', icon: ShieldCheck },
  { id: 4, titleAr: 'لون الشنطة', titleEn: 'Exterior Color', icon: Palette },
  { id: 5, titleAr: 'الإكسسوارات المعدنية', titleEn: 'Metallic Hardware', icon: Sparkles },
  { id: 6, titleAr: 'حزام الشنطة', titleEn: 'Strap Style', icon: Layers },
  { id: 7, titleAr: 'حفر الاسم الشخصي', titleEn: 'Monogramming', icon: Type },
  { id: 8, titleAr: 'الإضافات والهدية', titleEn: 'Add-ons & Gifting', icon: Gift },
];

export const BagConfiguratorModal: React.FC<BagConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  initialBagType = 'tote',
  locale = 'ar',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Configuration state
  const [config, setConfig] = useState<CustomBagConfiguration>({
    bagType: initialBagType,
    size: 'small',
    materialId: 'smooth_calfskin',
    primaryColorId: 'onyx_black',
    accentColorId: 'sand_beige',
    hardware: 'gold',
    strapId: 'matching_leather',
    monogram: {
      enabled: false,
      text: '',
      style: 'gold_foil',
      font: 'serif',
      placement: 'front_center',
    },
    selectedAddonIds: [],
  });

  // Calculate live total price
  const totalPrice = useMemo(() => {
    const bagTypeObj = BAG_TYPES.find((t) => t.id === config.bagType) || BAG_TYPES[0];
    const sizeObj = SIZES.find((s) => s.id === config.size) || SIZES[0];
    const matObj = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
    const hwObj = HARDWARE_OPTIONS.find((h) => h.id === config.hardware) || HARDWARE_OPTIONS[0];
    const strapObj = STRAPS.find((s) => s.id === config.strapId) || STRAPS[0];

    let sum = bagTypeObj.basePrice + sizeObj.priceDelta + matObj.priceDelta + hwObj.priceDelta + strapObj.priceDelta;

    if (config.monogram.enabled && config.monogram.text.trim()) {
      sum += 150; // Custom monogramming fee
    }

    config.selectedAddonIds.forEach((addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      if (addon) sum += addon.price;
    });

    return sum;
  }, [config]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Add to cart with confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9b287b', '#c69b59', '#ffffff'],
        });
      } catch (e) {
        // ignore
      }

      const bagTypeObj = BAG_TYPES.find((t) => t.id === config.bagType);
      const colorObj = COLORS.find((c) => c.id === config.primaryColorId);

      const cartItem: CartItem = {
        id: `custom_${Date.now()}`,
        configuration: config,
        calculatedPrice: totalPrice,
        quantity: 1,
        customSummaryText: `${bagTypeObj?.nameAr || 'شنطة مخصصة'} - ${colorObj?.nameAr || ''} ${
          config.monogram.enabled && config.monogram.text ? `(حفر: ${config.monogram.text})` : ''
        }`,
      };

      onAddToCart(cartItem);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepInfo = STEPS[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl flex flex-col h-full sm:h-[94vh] max-h-[900px] overflow-hidden" dir="rtl">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fdf2f8] text-[#9b287b] flex items-center justify-center font-bold text-sm">
              {currentStep}/{STEPS.length}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                {currentStepInfo.titleAr}
              </h2>
              <p className="text-xs text-stone-500">تفصيل يدوي حسب ذوقك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5 flex">
          {STEPS.map((step) => (
            <div
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`h-full flex-1 cursor-pointer transition-all duration-300 ${
                step.id <= currentStep ? 'bg-[#9b287b]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {/* Live Preview Display (Always visible at top of wizard like Lola) */}
          <div className="sticky top-0 z-10 pt-1">
            <BagCanvasPreview config={config} />
          </div>

          {/* Step 1: Bag Type / Silhouette */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار شكل وقصة الشنطة الأساسية:</h3>
              <div className="grid grid-cols-2 gap-3">
                {BAG_TYPES.map((type) => {
                  const isSelected = config.bagType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setConfig({ ...config, bagType: type.id })}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] shadow-sm ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#9b287b] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{type.nameAr}</h4>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{type.descriptionAr}</p>
                        <p className="text-xs font-semibold text-[#9b287b] mt-2">
                          يبدأ من {formatPrice(type.basePrice, 'EGP', 'ar')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Size */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار الحجم والأبعاد المناسبة لاحتياجك:</h3>
              <div className="space-y-2.5">
                {SIZES.map((size) => {
                  const isSelected = config.size === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setConfig({ ...config, size: size.id })}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{size.nameAr}</h4>
                          <p className="text-xs text-stone-500">{size.dimensions}</p>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-stone-700">
                        {size.priceDelta > 0 ? `+${formatPrice(size.priceDelta, 'EGP', 'ar')}` : 'ضمن السعر الأساسي'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Material */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار خامة الجلد والملمس الخارجي:</h3>
              <div className="space-y-2.5">
                {MATERIALS.map((mat) => {
                  const isSelected = config.materialId === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setConfig({ ...config, materialId: mat.id })}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{mat.nameAr}</h4>
                          <p className="text-xs text-stone-500">{mat.descriptionAr}</p>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-stone-700">
                        {mat.priceDelta > 0 ? `+${formatPrice(mat.priceDelta, 'EGP', 'ar')}` : 'مشمول'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Color */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار لون الجلد الخارجي:</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {COLORS.map((col) => {
                  const isSelected = config.primaryColorId === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setConfig({ ...config, primaryColorId: col.id })}
                      className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{col.nameAr}</h4>
                        <span className="text-[10px] text-stone-500 block truncate">{col.nameEn}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Hardware */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار طلاء الإكسسوارات والسوستة المعدنية:</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {HARDWARE_OPTIONS.map((hw) => {
                  const isSelected = config.hardware === hw.id;
                  return (
                    <button
                      key={hw.id}
                      onClick={() => setConfig({ ...config, hardware: hw.id })}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-6 h-6 rounded-full shadow-md border border-black/10"
                          style={{ backgroundColor: hw.color }}
                        />
                        {isSelected && <Check className="w-4 h-4 text-[#9b287b]" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{hw.nameAr}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {hw.priceDelta > 0 ? `+${formatPrice(hw.priceDelta, 'EGP', 'ar')}` : 'مشمول'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Strap */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">اختار نوع وشكل حزام الشنطة:</h3>
              <div className="space-y-2.5">
                {STRAPS.map((strap) => {
                  const isSelected = config.strapId === strap.id;
                  return (
                    <button
                      key={strap.id}
                      onClick={() => setConfig({ ...config, strapId: strap.id })}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{strap.nameAr}</h4>
                      </div>
                      <div className="text-xs font-semibold text-stone-700">
                        {strap.priceDelta > 0 ? `+${formatPrice(strap.priceDelta, 'EGP', 'ar')}` : 'مشمول'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Monogram */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">تفعيل حفر اسمك أو حروفك الشخصية؟</h4>
                  <p className="text-xs text-stone-500">حفر حراري دائم على واجهة الشنطة (+150 ج.م)</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.monogram.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      monogram: { ...config.monogram, enabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#9b287b] rounded cursor-pointer"
                />
              </div>

              {config.monogram.enabled && (
                <div className="space-y-3 p-4 bg-[#fdf2f8] rounded-2xl border border-[#9b287b]/20">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      اكتب الحروف أو الاسم (حتى 4 حروف أو اسم قصير بالإنجليزية):
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. LOLA or S.A"
                      value={config.monogram.text}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monogram: { ...config.monogram, text: e.target.value.toUpperCase() },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold uppercase tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#9b287b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1.5">أسلوب ولون الحفر:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'gold_foil', name: 'ذهب لامع (Gold)', color: 'text-amber-600' },
                        { id: 'silver_foil', name: 'فضي بلاتيني', color: 'text-stone-500' },
                        { id: 'blind_emboss', name: 'حفر بارز سادة', color: 'text-stone-700' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              monogram: {
                                ...config.monogram,
                                style: style.id as MonogramConfig['style'],
                              },
                            })
                          }
                          className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                            config.monogram.style === style.id
                              ? 'border-[#9b287b] bg-white shadow-sm'
                              : 'border-transparent bg-white/60 text-stone-600'
                          }`}
                        >
                          <span className={style.color}>{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 8: Add-ons & Gifting */}
          {currentStep === 8 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800">إضافات وتغليف هدايا فاخر:</h3>
              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = config.selectedAddonIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => {
                        const newIds = isChecked
                          ? config.selectedAddonIds.filter((id) => id !== addon.id)
                          : [...config.selectedAddonIds, addon.id];
                        setConfig({ ...config, selectedAddonIds: newIds });
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[#9b287b] bg-[#fdf2f8] ring-2 ring-[#9b287b]/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isChecked ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{addon.nameAr}</h4>
                          <span className="text-[10px] text-stone-500">{addon.nameEn}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#9b287b]">
                        +{formatPrice(addon.price, 'EGP', 'ar')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Delivery Promise badge like Lola */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 flex-shrink-0 text-amber-700" />
                <span>
                  شنطتك المخصصة تصنع يدوياً خصيصاً لك وتكون جاهزة للشحن خلال <strong>3 إلى 5 أيام عمل</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions Bar (Like Lola's checkout bar) */}
        <div className="p-4 border-t border-stone-100 bg-white flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <div>
            <span className="text-[11px] text-stone-400 block">السعر الإجمالي للتفصيل</span>
            <span className="text-lg font-black text-stone-950">
              {formatPrice(totalPrice, 'EGP', 'ar')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-3 rounded-2xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-lg shadow-[#9b287b]/25 flex items-center gap-1.5"
            >
              {currentStep === STEPS.length ? (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  أضف للحقيبة الآن
                </>
              ) : (
                <>
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
