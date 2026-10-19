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
  initialProduct?: any;
  categories?: any[];
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
  initialProduct,
  categories,
}) => {
  const effectiveCategories = (categories && categories.length > 0) ? categories : BAG_TYPES;
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Configuration state
  const [config, setConfig] = useState<CustomBagConfiguration>({
    bagType: (initialProduct?.category as BagCategory) || initialBagType,
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

  // Keep bagType updated if modal opens with different initialProduct or initialBagType
  React.useEffect(() => {
    if (initialProduct) {
      if (initialProduct.category) {
        setConfig((prev) => ({ ...prev, bagType: initialProduct.category }));
      }
    } else if (initialBagType) {
      setConfig((prev) => ({ ...prev, bagType: initialBagType }));
    }
  }, [initialProduct, initialBagType]);

  // Calculate live total price
  const totalPrice = useMemo(() => {
    const bagTypeObj = effectiveCategories.find((t) => (t.slug || t.id) === config.bagType) || effectiveCategories[0] || BAG_TYPES[0];
    const sizeObj = SIZES.find((s) => s.id === config.size) || SIZES[0];
    const matObj = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
    const hwObj = HARDWARE_OPTIONS.find((h) => h.id === config.hardware) || HARDWARE_OPTIONS[0];
    const strapObj = STRAPS.find((s) => s.id === config.strapId) || STRAPS[0];

    const basePrice = initialProduct?.price || bagTypeObj?.basePrice || 1850;
    let sum = basePrice + sizeObj.priceDelta + matObj.priceDelta + hwObj.priceDelta + strapObj.priceDelta;

    if (config.monogram.enabled && config.monogram.text.trim()) {
      sum += 150; // Custom monogramming fee
    }

    config.selectedAddonIds.forEach((addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      if (addon) sum += addon.price;
    });

    return sum;
  }, [config, initialProduct, effectiveCategories]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Add to cart with confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#9b287b', '#c69b59', '#ffffff'],
        });
      } catch (e) {
        // ignore
      }

      const bagTypeObj = effectiveCategories.find((t) => (t.slug || t.id) === config.bagType);
      const colorObj = COLORS.find((c) => c.id === config.primaryColorId);
      const colorLabel = config.customColorHex
        ? `لون مخصص (${config.customColorHex})`
        : (colorObj?.nameAr || '');

      const cartItem: CartItem = {
        id: `custom_${Date.now()}`,
        product: initialProduct,
        previewDataUrl: initialProduct?.image,
        configuration: config,
        calculatedPrice: totalPrice,
        quantity: 1,
        customSummaryText: `${initialProduct?.nameAr || bagTypeObj?.nameAr || 'شنطة مخصصة'} - ${colorLabel} ${
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-6 overflow-hidden">
      <div
        className="relative w-full max-w-lg md:max-w-5xl bg-white dark:bg-[#15151e] text-stone-900 dark:text-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[96vh] sm:h-[94vh] max-h-[920px] overflow-hidden transition-colors"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-[#15151e] sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] flex items-center justify-center font-bold text-xs sm:text-sm">
              {currentStep}/{STEPS.length}
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-stone-900 dark:text-white leading-tight">
                {currentStepInfo.titleAr}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500">تفصيل يدوي حسب ذوقك واختياراتك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 flex">
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

        {/* Responsive Body: 2 Columns on Desktop, Single Column on Mobile */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Column 1: Live Canvas / Real Photo Preview */}
          <div className="md:col-span-6 lg:col-span-5 bg-gradient-to-b from-stone-50 to-stone-100/60 dark:from-[#191924] dark:to-[#12121a] p-2.5 sm:p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-l border-stone-200 dark:border-stone-800">
            <div className="w-full max-w-[240px] sm:max-w-sm">
              <div className="mb-1 sm:mb-2 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#9b287b] dark:text-[#be3999] bg-[#fdf2f8] dark:bg-[#281223] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#9b287b]/20 inline-block">
                  معاينة حية تفاعلية للشنطة
                </span>
              </div>

              <BagCanvasPreview
                config={config}
                imageUrl={initialProduct?.image || effectiveCategories.find((c) => (c.slug || c.id) === config.bagType)?.image}
              />

              <div className="mt-1.5 sm:mt-3 text-center text-[10px] sm:text-xs text-stone-400 hidden sm:block">
                <span>تتحدث الأبعاد والألوان وحفر الاسم تلقائياً مع كل خطوة</span>
              </div>
            </div>
          </div>

          {/* Column 2: Step Wizard Controls */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col h-full overflow-hidden bg-white dark:bg-[#15151e]">
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5 no-scrollbar">
              {/* Step 1: Bag Type / Silhouette */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  {initialProduct && (
                    <div className="p-3 bg-gradient-to-r from-[#fdf2f8] to-purple-50 dark:from-[#281223] dark:to-purple-950/30 rounded-2xl border border-[#9b287b]/30 flex items-center gap-3">
                      <img
                        src={initialProduct.image}
                        alt={initialProduct.nameAr}
                        className="w-12 h-12 rounded-xl object-cover border border-[#9b287b]/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#9b287b] dark:text-[#be3999] bg-white dark:bg-stone-800 px-2 py-0.5 rounded-full">
                            الموديل المختار
                          </span>
                          <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                            {initialProduct.nameAr}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 block mt-0.5">
                          السعر الأساسي للموديل: {formatPrice(initialProduct.price, 'EGP', 'ar')}
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {initialProduct ? 'أو يمكنك تغيير القصة الأساسية:' : 'اختار شكل وقصة الشنطة الأساسية:'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {effectiveCategories.map((type) => {
                      const typeId = type.slug || type.id;
                      const isSelected = config.bagType === typeId;
                      return (
                        <button
                          key={typeId}
                          onClick={() => setConfig({ ...config, bagType: typeId })}
                          className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#9b287b] bg-[#fdf2f8] dark:bg-[#281223] shadow-sm ring-2 ring-[#9b287b]/20'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className="text-2xl">{type.icon || '👜'}</span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#9b287b] text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-white">{type.nameAr}</h4>
                            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{type.descriptionAr || type.nameEn}</p>
                            <p className="text-xs font-semibold text-[#9b287b] dark:text-[#be3999] mt-2">
                              يبدأ من {formatPrice(type.basePrice || 1850, 'EGP', 'ar')}
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
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">اختار الحجم والأبعاد المناسبة لاحتياجك:</h3>
                  <div className="space-y-2.5">
                    {SIZES.map((size) => {
                      const isSelected = config.size === size.id;
                      return (
                        <button
                          key={size.id}
                          onClick={() => setConfig({ ...config, size: size.id })}
                          className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/20 shadow-sm'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300 dark:border-stone-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white">{size.nameAr}</h4>
                              <p className="text-xs text-stone-500 dark:text-stone-400">{size.dimensions}</p>
                            </div>
                          </div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-[#9b287b] dark:text-[#f472b6]' : 'text-stone-700 dark:text-stone-300'}`}>
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
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">اختار خامة الجلد والملمس الخارجي:</h3>
                  <div className="space-y-2.5">
                    {MATERIALS.map((mat) => {
                      const isSelected = config.materialId === mat.id;
                      return (
                        <button
                          key={mat.id}
                          onClick={() => setConfig({ ...config, materialId: mat.id })}
                          className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/20 shadow-sm'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300 dark:border-stone-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white">{mat.nameAr}</h4>
                              <p className="text-xs text-stone-500 dark:text-stone-400">{mat.descriptionAr}</p>
                            </div>
                          </div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-[#9b287b] dark:text-[#f472b6]' : 'text-stone-700 dark:text-stone-300'}`}>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2.5">
                      الألوان الأساسية الفاخرة المعتمدة:
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {COLORS.map((col) => {
                        const isSelected = config.primaryColorId === col.id && !config.customColorHex;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() =>
                              setConfig({
                                ...config,
                                primaryColorId: col.id,
                                customColorHex: undefined,
                                customColorName: undefined,
                              })
                            }
                            className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/30 shadow-sm'
                                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                            }`}
                          >
                            <div
                              className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex-shrink-0"
                              style={{ backgroundColor: col.hex }}
                            />
                            <div className="overflow-hidden min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">{col.nameAr}</h4>
                              <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">{col.nameEn}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOM COLOR PICKER SECTION */}
                  <div
                    className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                      config.customColorHex
                        ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8]/70 dark:bg-[#2e1327]/80 ring-2 ring-[#9b287b]/30 shadow-md'
                        : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/40 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full shadow-md border-2 border-white dark:border-stone-700 flex items-center justify-center text-sm flex-shrink-0"
                          style={{
                            backgroundColor: config.customColorHex || '#e91e63',
                            boxShadow: '0 0 10px rgba(0,0,0,0.15)'
                          }}
                        >
                          🎨
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                              اختيار لون مخصص (Custom Color)
                            </h4>
                            {config.customColorHex && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#9b287b] text-white">
                                مفعل الآن ✨
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            اكتبي أي كود لون (HEX) أو اختاري من عجلة الألوان مباشرة
                          </p>
                        </div>
                      </div>

                      {/* Native Color Picker trigger */}
                      <label className="relative cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all shadow-sm">
                        <span>باليت الألوان</span>
                        <input
                          type="color"
                          value={config.customColorHex || '#e91e63'}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              customColorHex: e.target.value,
                              customColorName: 'لون مخصص',
                              primaryColorId: 'custom',
                            })
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    </div>

                    {/* Hex Code Input & Live Action */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-stone-400">
                          HEX
                        </span>
                        <input
                          type="text"
                          maxLength={7}
                          placeholder="#E91E63"
                          value={config.customColorHex || ''}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                            setConfig({
                              ...config,
                              customColorHex: val,
                              customColorName: 'لون مخصص',
                              primaryColorId: 'custom',
                            });
                          }}
                          className="w-full px-3 py-2 pl-12 text-xs font-mono font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white uppercase focus:ring-2 focus:ring-[#9b287b]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            customColorHex: config.customColorHex || '#e91e63',
                            customColorName: 'لون مخصص',
                            primaryColorId: 'custom',
                          })
                        }
                        className="px-4 py-2 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>تطبيق اللون</span>
                      </button>
                    </div>

                    {/* Quick Trend Colors Palette */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block">
                        ألوان تريند مقترحة:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'زهري باربي', hex: '#ff2d75' },
                          { name: 'أزرق كحلي ملكي', hex: '#1e3a8a' },
                          { name: 'تركواز فيروزي', hex: '#0891b2' },
                          { name: 'خردلي دافئ', hex: '#d97706' },
                          { name: 'بنفسجي لافندر', hex: '#7c3aed' },
                          { name: 'رمادي تيتانيوم', hex: '#475569' },
                          { name: 'أخضر نعناعي', hex: '#10b981' },
                          { name: 'برتقالي تيراكوتا', hex: '#ea580c' },
                        ].map((trend) => {
                          const isTrendActive = config.customColorHex?.toLowerCase() === trend.hex.toLowerCase();
                          return (
                            <button
                              key={trend.hex}
                              type="button"
                              onClick={() =>
                                setConfig({
                                  ...config,
                                  customColorHex: trend.hex,
                                  customColorName: trend.name,
                                  primaryColorId: 'custom',
                                })
                              }
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                                isTrendActive
                                  ? 'border-[#9b287b] bg-white dark:bg-stone-800 text-[#9b287b] dark:text-[#be3999] ring-2 ring-[#9b287b]/30 shadow-sm'
                                  : 'border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:scale-105'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/10 inline-block"
                                style={{ backgroundColor: trend.hex }}
                              />
                              <span>{trend.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Hardware */}
              {currentStep === 5 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">اختار طلاء الإكسسوارات والسوستة المعدنية:</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {HARDWARE_OPTIONS.map((hw) => {
                      const isSelected = config.hardware === hw.id;
                      return (
                        <button
                          key={hw.id}
                          onClick={() => setConfig({ ...config, hardware: hw.id })}
                          className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/20 shadow-sm'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-6 h-6 rounded-full shadow-md border border-black/10"
                              style={{ backgroundColor: hw.color }}
                            />
                            {isSelected && <Check className="w-4 h-4 text-[#9b287b] dark:text-[#be3999]" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900 dark:text-white">{hw.nameAr}</h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
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
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">اختار نوع وشكل حزام الشنطة:</h3>
                  <div className="space-y-2.5">
                    {STRAPS.map((strap) => {
                      const isSelected = config.strapId === strap.id;
                      return (
                        <button
                          key={strap.id}
                          onClick={() => setConfig({ ...config, strapId: strap.id })}
                          className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/20 shadow-sm'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300 dark:border-stone-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <h4 className="text-sm font-bold text-stone-900 dark:text-white">{strap.nameAr}</h4>
                          </div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-[#9b287b] dark:text-[#f472b6]' : 'text-stone-700 dark:text-stone-300'}`}>
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
                  <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">تفعيل حفر اسمك أو حروفك الشخصية؟</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">حفر حراري دائم على واجهة الشنطة (+150 ج.م)</p>
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
                    <div className="space-y-3 p-4 bg-[#fdf2f8] dark:bg-[#2e1327] rounded-2xl border border-[#9b287b]/20 dark:border-[#be3999]/30">
                      <div>
                        <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                          اكتب الحروف أو الاسم (حتى 6 حروف بالإنجليزية):
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
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold uppercase tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#9b287b]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1.5">أسلوب ولون الحفر:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'gold_foil', name: 'ذهب لامع (Gold)', color: 'text-amber-600 dark:text-amber-400' },
                            { id: 'silver_foil', name: 'فضي بلاتيني', color: 'text-stone-600 dark:text-stone-300' },
                            { id: 'blind_emboss', name: 'حفر بارز سادة', color: 'text-stone-800 dark:text-stone-200' },
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
                              className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                                config.monogram.style === style.id
                                  ? 'border-[#9b287b] bg-white dark:bg-stone-800 ring-2 ring-[#9b287b]/25 shadow-sm'
                                  : 'border-transparent bg-white/60 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 hover:bg-white/90'
                              }`}
                            >
                              <span className={style.color}>{style.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1.5">شكل ونوع الخط:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'serif', name: 'سيريف ملكي', sample: 'Aa Serif', fontClass: 'font-serif' },
                            { id: 'sans', name: 'مودرن كلاسيك', sample: 'Aa Sans', fontClass: 'font-sans' },
                            { id: 'script', name: 'توقيع كاليجرافي', sample: 'Aa Script', fontClass: 'italic' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() =>
                                setConfig({
                                  ...config,
                                  monogram: {
                                    ...config.monogram,
                                    font: f.id as MonogramConfig['font'],
                                  },
                                })
                              }
                              className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                                config.monogram.font === f.id
                                  ? 'border-[#9b287b] bg-white dark:bg-stone-800 ring-2 ring-[#9b287b]/25 shadow-sm text-[#9b287b] dark:text-[#be3999]'
                                  : 'border-transparent bg-white/60 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 hover:bg-white/90'
                              }`}
                            >
                              <div className={f.fontClass}>{f.name}</div>
                              <span className="text-[10px] opacity-60 block mt-0.5">{f.sample}</span>
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
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">إضافات وتغليف هدايا فاخر:</h3>
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
                              ? 'border-[#9b287b] dark:border-[#be3999] bg-[#fdf2f8] dark:bg-[#2e1327] ring-2 ring-[#9b287b]/20 shadow-sm'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                isChecked ? 'border-[#9b287b] bg-[#9b287b] text-white' : 'border-stone-300 dark:border-stone-700'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-white">{addon.nameAr}</h4>
                              <span className="text-[10px] text-stone-500 dark:text-stone-400">{addon.nameEn}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#9b287b] dark:text-[#f472b6]">
                            +{formatPrice(addon.price, 'EGP', 'ar')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Delivery Promise badge like Lola */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                    <Clock className="w-4 h-4 flex-shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>
                      شنطتك المخصصة تصنع يدوياً خصيصاً لك وتكون جاهزة للشحن خلال <strong>3 إلى 5 أيام عمل</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="p-3 sm:p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-[#15151e] flex items-center justify-between gap-2 sm:gap-3 sticky bottom-0 z-20 pb-safe">
              <div>
                <span className="text-[10px] sm:text-[11px] text-stone-400 block">السعر الإجمالي للتفصيل</span>
                <span className="text-base sm:text-lg font-black text-stone-950 dark:text-white">
                  {formatPrice(totalPrice, 'EGP', 'ar')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>السابق</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#9b287b]/25 flex items-center gap-1.5"
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
      </div>
    </div>
  );
};
