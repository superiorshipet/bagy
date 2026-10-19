'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav, NavTab } from '@/components/layout/BottomNav';
import { BagConfiguratorModal } from '@/components/configurator/BagConfiguratorModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BagCanvasPreview } from '@/components/configurator/BagCanvasPreview';
import { BAG_TYPES, FEATURED_PRODUCTS, COLORS } from '@/data/bagOptions';
import { BagCategory, CartItem, CustomBagConfiguration } from '@/types/bag';
import { formatPrice } from '@/lib/utils';
import {
  Sparkles,
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  ChevronRight,
  Eye,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedBagTypeForConfig, setSelectedBagTypeForConfig] = useState<BagCategory>('tote');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);

  // Interactive Live Preview on Home Page
  const [homePreviewConfig, setHomePreviewConfig] = useState<CustomBagConfiguration>({
    bagType: 'tote',
    size: 'medium',
    materialId: 'smooth_calfskin',
    primaryColorId: 'onyx_black',
    accentColorId: 'sand_beige',
    hardware: 'gold',
    strapId: 'matching_leather',
    monogram: {
      enabled: true,
      text: 'BAGY',
      style: 'gold_foil',
      font: 'serif',
      placement: 'front_center',
    },
    selectedAddonIds: ['bag_charm'],
  });

  // Category selection handler: updates category filter AND the live preview simultaneously!
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      const bagType = categoryId as BagCategory;
      setHomePreviewConfig((prev) => ({
        ...prev,
        bagType: bagType,
      }));
      setSelectedBagTypeForConfig(bagType);
    }
  };

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOpenConfiguratorWithBag = (bagType: BagCategory) => {
    setSelectedBagTypeForConfig(bagType);
    setIsConfiguratorOpen(true);
  };

  const toggleLike = (id: string) => {
    setLikedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === 'all'
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === selectedCategory);

  const activeCategoryObj = BAG_TYPES.find((t) => t.id === homePreviewConfig.bagType);

  return (
    <div className="app-container" dir="rtl">
      {/* 1. Header TopBar (Full-width responsive with desktop nav) */}
      <TopBar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog') {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'customize') {
            setIsConfiguratorOpen(true);
          }
        }}
        onOpenCustomize={() => setIsConfiguratorOpen(true)}
      />

      {/* 2. Main Scrollable Page Area (Contained in responsive max-w-7xl) */}
      <main className="flex-1 pb-24 md:pb-12 space-y-8 sm:space-y-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
        {/* Hero Section (Responsive 2-column on desktop) */}
        <section className="pt-2">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#2c1825] to-[#8a1d63] text-white p-6 sm:p-10 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              {/* Right Column (Text in RTL) */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/15">
                  <Sparkles className="w-4 h-4" />
                  <span>المنصة الأولى لتفصيل الشنط المخصصة أونلاين في مصر</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                  صممي شنطتك الحلم <br />
                  <span className="text-[#e2b77a]">بكل تفاصيلها بلمسة يدك</span>
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                  اختاري القصة المناسبة، نوع الجلد، الألوان، ولمعان الإكسسوارات المعدنية، واكتبي اسمك أو حروفك بحفر الذهب الخالص لتصلك لباب بيتك أينما كنتِ في مصر.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                    className="px-6 py-3.5 rounded-2xl bg-white text-stone-950 text-xs sm:text-sm font-black shadow-lg hover:bg-stone-100 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>ابدئي التفصيل الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
                  >
                    <span>استكشفي الموديلات</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>

              {/* Left Column (Desktop Hero Visual) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="text-center mb-2">
                    <span className="text-[11px] font-bold text-amber-300">موديل اليوم الأكثر طلباً</span>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/90 p-2 shadow-inner">
                    <BagCanvasPreview config={homePreviewConfig} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/90 px-1">
                    <span className="font-bold">{activeCategoryObj?.nameAr}</span>
                    <span className="text-amber-300 font-extrabold">
                      {formatPrice(activeCategoryObj?.basePrice || 1850, 'EGP', 'ar')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#9b287b]/40 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* 3. Horizontal Stories / Categories (Exact Lola Style - Fully Interactive!) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">الموديلات والقصات</h2>
              <p className="text-xs text-stone-500">اضغطي على أي موديل لتغيير المعاينة الحية فوراً وفلترة الكتالوج</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleSelectCategory('all')}
                className="text-xs font-bold text-[#9b287b] bg-[#fdf2f8] px-3 py-1.5 rounded-full hover:underline"
              >
                إلغاء الفلتر (عرض الكل)
              </button>
            )}
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1">
            {/* "All" button */}
            <button
              onClick={() => handleSelectCategory('all')}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#fdf2f8] text-[#9b287b] font-bold ring-2 ring-[#9b287b]/30'
                  : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
              }`}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-sm border transition-transform ${
                  selectedCategory === 'all'
                    ? 'border-[#9b287b] bg-white ring-2 ring-[#9b287b]/20 scale-105'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                ✨
              </div>
              <span className="text-xs font-bold">الكل ({FEATURED_PRODUCTS.length})</span>
            </button>

            {/* Bag Types */}
            {BAG_TYPES.map((bag) => {
              const isSelected = selectedCategory === bag.id || homePreviewConfig.bagType === bag.id;
              const count = FEATURED_PRODUCTS.filter((p) => p.category === bag.id).length;
              return (
                <button
                  key={bag.id}
                  onClick={() => handleSelectCategory(bag.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#fdf2f8] text-[#9b287b] font-bold ring-2 ring-[#9b287b]/40 shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
                  }`}
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-sm border transition-transform ${
                      isSelected
                        ? 'border-[#9b287b] bg-white ring-2 ring-[#9b287b]/30 scale-105'
                        : 'border-stone-200 bg-stone-50'
                    }`}
                  >
                    {bag.icon}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[85px]">{bag.nameAr}</span>
                  <span className="text-[10px] text-stone-400">({count} موديل)</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Live Interactive Sandbox Card (Responsive 2-column on desktop) */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-[#9b287b] tracking-wider bg-[#fdf2f8] px-2.5 py-0.5 rounded-md border border-[#9b287b]/20">
                  تفاعلي مباشر
                </span>
                <span className="text-xs font-bold text-stone-500">
                  الموديل المختار حالياً: <strong className="text-stone-900">{activeCategoryObj?.nameAr}</strong>
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-stone-900 mt-1">
                جربي تغيير الموديل، الألوان، والحفر الآن:
              </h3>
            </div>

            <button
              onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
              className="text-xs font-bold text-white bg-[#9b287b] hover:bg-[#831f67] px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>فتح معالج التفصيل الكامل (8 خطوات)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Canvas Preview Column */}
            <div className="md:col-span-6 lg:col-span-7">
              <BagCanvasPreview config={homePreviewConfig} className="max-h-[380px]" />
            </div>

            {/* Interactive Controls Column */}
            <div className="md:col-span-6 lg:col-span-5 space-y-5">
              {/* Quick Model Selector Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 block">اختيار قصة الشنطة المعروضة:</span>
                <div className="grid grid-cols-3 gap-2">
                  {BAG_TYPES.map((type) => {
                    const isCurrent = homePreviewConfig.bagType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleSelectCategory(type.id)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'border-[#9b287b] bg-[#fdf2f8] text-[#9b287b] shadow-sm'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span className="truncate">{type.nameAr.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Live Color Toggles */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 block">اختيار لون الجلد:</span>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setHomePreviewConfig({ ...homePreviewConfig, primaryColorId: col.id })}
                      className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center ${
                        homePreviewConfig.primaryColorId === col.id
                          ? 'ring-2 ring-offset-2 ring-[#9b287b] scale-110 shadow-md'
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.nameAr}
                    >
                      {homePreviewConfig.primaryColorId === col.id && (
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Monogram Input */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 block">حفر اسمك أو حروفك بالذهب:</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={homePreviewConfig.monogram.text}
                    onChange={(e) =>
                      setHomePreviewConfig({
                        ...homePreviewConfig,
                        monogram: { ...homePreviewConfig.monogram, text: e.target.value.toUpperCase() },
                      })
                    }
                    placeholder="مثلاً: LOLA"
                    className="flex-1 px-4 py-2.5 text-xs font-bold rounded-xl border border-stone-200 uppercase tracking-widest text-center focus:ring-2 focus:ring-[#9b287b] focus:outline-none"
                  />
                  <button
                    onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    تثبيت وطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Bags Catalog Grid */}
        <section id="catalog-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                {selectedCategory === 'all'
                  ? 'أكثر الشنط طلباً في مصر'
                  : `شنط ${activeCategoryObj?.nameAr || ''}`}
              </h2>
              <p className="text-xs text-stone-500">
                عرض {filteredProducts.length} تصميم جاهز للشحن أو قابل للتعديل بالكامل
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => {
              const isLiked = likedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={prod.image}
                      alt={prod.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(prod.id)}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-600 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-stone-600'
                        }`}
                      />
                    </button>

                    {prod.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-[#9b287b] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        الأكثر مبيعاً ⭐
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{prod.rating}</span>
                        <span className="text-stone-400 font-normal">({prod.reviewCount})</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">{prod.nameAr}</h3>
                      <p className="text-xs sm:text-sm font-extrabold text-[#9b287b]">
                        {formatPrice(prod.price, 'EGP', 'ar')}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        onClick={() => handleOpenConfiguratorWithBag(prod.category)}
                        className="w-full py-2.5 rounded-xl bg-[#fdf2f8] text-[#9b287b] text-xs font-bold hover:bg-[#fae8f3] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        خصصها بذوقك
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Gifting & Luxury Experience Banner */}
        <section>
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 border border-amber-200/60 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-800 flex items-center justify-center flex-shrink-0 text-3xl shadow-sm">
              🎁
            </div>
            <div className="space-y-1.5 text-center sm:text-right flex-1">
              <h3 className="text-base sm:text-lg font-black text-amber-950">خدمة الإهداء الملكي الفاخرة</h3>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed max-w-2xl">
                نوصل الشنطة في بوكس فاخر مغناطيسي مع شريطة ستان وكارت يحمل كلماتك الخاصة مباشرة لصاحب الهدية أينما كان في مصر مع إخفاء الفاتورة تماماً.
              </p>
            </div>
            <button
              onClick={() => handleOpenConfiguratorWithBag('crossbody')}
              className="px-6 py-3 rounded-2xl bg-[#9b287b] text-white text-xs font-bold hover:bg-[#831f67] shadow-md transition-all flex-shrink-0"
            >
              تفصيل شنطة كهدية
            </button>
          </div>
        </section>

        {/* 7. Trust & Guarantee Badges */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-4 bg-white rounded-3xl border border-stone-200 space-y-1.5 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 block">جلد طبيعي 100%</span>
            <span className="text-[11px] text-stone-500 block">خامات إيطالية ممتازة</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-stone-200 space-y-1.5 shadow-sm">
            <Truck className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 block">شحن لكل محافظات مصر</span>
            <span className="text-[11px] text-stone-500 block">معاينة الشنطة عند الاستلام</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-stone-200 space-y-1.5 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 block">حفر بالذهب الخالص</span>
            <span className="text-[11px] text-stone-500 block">حراري يدوم للأبد</span>
          </div>

          <div className="p-4 bg-white rounded-3xl border border-stone-200 space-y-1.5 shadow-sm">
            <Eye className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 block">معاينة لحظية 100%</span>
            <span className="text-[11px] text-stone-500 block">مطابقة للواقع تماماً</span>
          </div>
        </section>
      </main>

      {/* 8. Bottom Navigation (Mobile Only) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog') {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'customize') {
            setIsConfiguratorOpen(true);
          }
        }}
        onOpenCustomize={() => setIsConfiguratorOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
      />

      {/* 9. Interactive Configurator Wizard Modal */}
      <BagConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        initialBagType={selectedBagTypeForConfig}
        onAddToCart={handleAddToCart}
      />

      {/* 10. Sliding Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
