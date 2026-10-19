'use client';

import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav, NavTab } from '@/components/layout/BottomNav';
import { BagConfiguratorModal } from '@/components/configurator/BagConfiguratorModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { UserProfileModal } from '@/components/profile/UserProfileModal';
import { AdminDashboardModal } from '@/components/admin/AdminDashboardModal';
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>(FEATURED_PRODUCTS);

  // Fetch live products from PostgreSQL API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setDbProducts(data.products);
        }
      })
      .catch((e) => console.log('Using local fallback products', e));
  }, []);

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

  // Category selection handler
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
      ? dbProducts
      : dbProducts.filter((p) => p.category === selectedCategory);

  const activeCategoryObj = BAG_TYPES.find((t) => t.id === homePreviewConfig.bagType);

  return (
    <div className="app-container bg-background text-foreground transition-colors" dir="rtl">
      {/* 1. Header TopBar */}
      <TopBar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'catalog') {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          } else if (tab === 'customize') {
            setIsConfiguratorOpen(true);
          } else if (tab === 'orders') {
            setIsProfileOpen(true);
          }
        }}
        onOpenCustomize={() => setIsConfiguratorOpen(true)}
      />

      {/* 2. Main Scrollable Page Area */}
      <main className="flex-1 pb-28 md:pb-16 space-y-10 sm:space-y-14 max-w-[1536px] mx-auto w-full px-3 sm:px-6 lg:px-10 xl:px-14 pt-2 sm:pt-4">
        {/* Hero Section */}
        <section className="pt-1">
          <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#2c1825] to-[#8a1d63] dark:from-[#0d0d12] dark:via-[#1f0f1b] dark:to-[#631448] text-white p-5 sm:p-10 lg:p-14 xl:p-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Right Column (Hero Typography & CTAs) */}
              <div className="md:col-span-7 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-bold text-amber-300 border border-white/15">
                  <Sparkles className="w-4 h-4" />
                  <span>المنصة الأولى لتفصيل الشنط المخصصة أونلاين في مصر</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-black leading-[1.16] tracking-tight">
                  صممي شنطتك الحلم <br className="hidden sm:inline" />
                  <span className="text-[#e2b77a] inline-block mt-1 sm:mt-2">بكل تفاصيلها بلمسة يدك</span>
                </h1>

                <p className="text-xs sm:text-base lg:text-lg text-stone-200/90 leading-relaxed max-w-2xl font-medium">
                  اختاري القصة المناسبة، نوع الجلد، الألوان، ولمعان الإكسسوارات المعدنية، واكتبي اسمك أو حروفك بحفر الذهب الخالص لتصلك لباب بيتك أينما كنتِ في مصر.
                </p>

                <div className="pt-2 sm:pt-4 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                    className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-stone-950 text-sm sm:text-base font-black shadow-xl hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                  >
                    <span>ابدئي التفصيل الآن</span>
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm sm:text-base font-bold border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>استكشفي الموديلات</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                  </button>
                </div>
              </div>

              {/* Left Column (Hero Visual Bag Card) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl p-4 sm:p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                  <div className="text-center mb-2.5">
                    <span className="text-xs sm:text-sm font-bold text-amber-300">موديل اليوم الأكثر طلباً</span>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/95 p-3 shadow-inner">
                    <BagCanvasPreview config={homePreviewConfig} />
                  </div>
                  <div className="mt-3.5 flex items-center justify-between text-xs sm:text-sm text-white/90 px-1 font-bold">
                    <span>{activeCategoryObj?.nameAr}</span>
                    <span className="text-amber-300 font-extrabold text-sm sm:text-base">
                      {formatPrice(activeCategoryObj?.basePrice || 1850, 'EGP', 'ar')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-12 -left-12 w-80 h-80 rounded-full bg-[#9b287b]/40 blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* 3. Horizontal Stories / Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white">الموديلات والقصات</h2>
              <p className="text-xs sm:text-sm text-stone-500">اضغطي على أي موديل لتغيير المعاينة الحية فوراً وفلترة الكتالوج</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleSelectCategory('all')}
                className="text-xs sm:text-sm font-bold text-[#9b287b] dark:text-[#be3999] bg-[#fdf2f8] dark:bg-[#281223] px-3.5 py-1.5 rounded-full hover:underline"
              >
                إلغاء الفلتر (عرض الكل)
              </button>
            )}
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-touch pb-3 pt-1.5 -mx-3 px-3 sm:mx-0 sm:px-0">
            {/* "All" button */}
            <button
              onClick={() => handleSelectCategory('all')}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-2.5 sm:p-3.5 rounded-3xl transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] font-black ring-2 ring-[#9b287b]/40 shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 bg-white dark:bg-[#15151e] border border-stone-200/80 dark:border-stone-800'
              }`}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-sm border transition-transform ${
                  selectedCategory === 'all'
                    ? 'border-[#9b287b] bg-white dark:bg-stone-800 ring-2 ring-[#9b287b]/20 scale-105'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                }`}
              >
                ✨
              </div>
              <span className="text-xs sm:text-sm font-bold">الكل ({dbProducts.length})</span>
            </button>

            {/* Bag Types */}
            {BAG_TYPES.map((bag) => {
              const isSelected = selectedCategory === bag.id || homePreviewConfig.bagType === bag.id;
              const count = dbProducts.filter((p) => p.category === bag.id).length;
              return (
                <button
                  key={bag.id}
                  onClick={() => handleSelectCategory(bag.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-2.5 sm:p-3.5 rounded-3xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] font-black ring-2 ring-[#9b287b]/40 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 bg-white dark:bg-[#15151e] border border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-sm border transition-transform ${
                      isSelected
                        ? 'border-[#9b287b] bg-white dark:bg-stone-800 ring-2 ring-[#9b287b]/30 scale-105'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                    }`}
                  >
                    {bag.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold truncate max-w-[95px]">{bag.nameAr}</span>
                  <span className="text-[10px] sm:text-xs text-stone-400">({count} موديل)</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Live Interactive Sandbox Card */}
        <section className="bg-white dark:bg-[#15151e] rounded-3xl sm:rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 p-5 sm:p-8 lg:p-10 shadow-sm space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-black uppercase text-[#9b287b] dark:text-[#be3999] tracking-wider bg-[#fdf2f8] dark:bg-[#281223] px-3 py-1 rounded-md border border-[#9b287b]/20">
                  تفاعلي مباشر
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-500">
                  الموديل المختار حالياً: <strong className="text-stone-900 dark:text-white">{activeCategoryObj?.nameAr}</strong>
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white mt-1.5">
                جربي تغيير الموديل، الألوان، والحفر الآن:
              </h3>
            </div>

            <button
              onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
              className="text-xs sm:text-sm font-bold text-white bg-[#9b287b] hover:bg-[#831f67] px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>فتح معالج التفصيل الكامل (8 خطوات)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Canvas Preview Column */}
            <div className="md:col-span-6 lg:col-span-7">
              <BagCanvasPreview config={homePreviewConfig} className="max-h-[340px] sm:max-h-[440px]" />
            </div>

            {/* Interactive Controls Column */}
            <div className="md:col-span-6 lg:col-span-5 space-y-5 sm:space-y-6">
              {/* Quick Model Selector Pills */}
              <div className="space-y-2.5">
                <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 block">اختيار قصة الشنطة المعروضة:</span>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {BAG_TYPES.map((type) => {
                    const isCurrent = homePreviewConfig.bagType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleSelectCategory(type.id)}
                        className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'border-[#9b287b] bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] shadow-sm'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{type.icon}</span>
                        <span className="truncate">{type.nameAr.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Live Color Toggles */}
              <div className="space-y-2.5">
                <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 block">اختيار لون الجلد:</span>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {COLORS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setHomePreviewConfig({ ...homePreviewConfig, primaryColorId: col.id })}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border transition-all flex items-center justify-center ${
                        homePreviewConfig.primaryColorId === col.id
                          ? 'ring-2 ring-offset-2 ring-[#9b287b] scale-110 shadow-md'
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.nameAr}
                    >
                      {homePreviewConfig.primaryColorId === col.id && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Monogram Input */}
              <div className="space-y-2.5">
                <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 block">حفر اسمك أو حروفك بالذهب:</span>
                <div className="flex gap-2.5 items-center">
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
                    className="flex-1 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 uppercase tracking-widest text-center focus:ring-2 focus:ring-[#9b287b] focus:outline-none"
                  />
                  <button
                    onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                    className="px-5 sm:px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
                  >
                    تثبيت وطلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Bags Catalog Grid */}
        <section id="catalog-section" className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 dark:text-white">
                {selectedCategory === 'all'
                  ? 'أكثر الشنط طلباً في مصر'
                  : `شنط ${activeCategoryObj?.nameAr || ''}`}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                عرض {filteredProducts.length} تصميم جاهز للشحن أو قابل للتعديل بالكامل
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((prod) => {
              const isLiked = likedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#15151e] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={prod.image}
                      alt={prod.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(prod.id)}
                      className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-stone-600 dark:text-stone-300'
                        }`}
                      />
                    </button>

                    {prod.isBestSeller && (
                      <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#9b287b] text-white text-[9px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        الأكثر مبيعاً ⭐
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 sm:p-5 space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{prod.rating || 5.0}</span>
                        <span className="text-stone-400 font-normal">({prod.reviewCount || 40})</span>
                      </div>
                      <h3 className="text-xs sm:text-base font-bold text-stone-900 dark:text-white line-clamp-1">
                        {prod.nameAr}
                      </h3>
                      <p className="text-sm sm:text-lg font-black text-[#9b287b] dark:text-[#be3999]">
                        {formatPrice(prod.price, 'EGP', 'ar')}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        onClick={() => handleOpenConfiguratorWithBag(prod.category)}
                        className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] text-xs sm:text-sm font-bold hover:bg-[#fae8f3] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>خصصها بذوقك</span>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-pink-950/20 border border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0 text-3xl shadow-sm">
              🎁
            </div>
            <div className="space-y-1.5 text-center sm:text-right flex-1">
              <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-200">خدمة الإهداء الملكي الفاخرة</h3>
              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed max-w-2xl">
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
          <div className="p-4 bg-white dark:bg-[#15151e] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 dark:text-white block">جلد طبيعي 100%</span>
            <span className="text-[11px] text-stone-500 block">خامات إيطالية ممتازة</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#15151e] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-sm">
            <Truck className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 dark:text-white block">شحن لكل محافظات مصر</span>
            <span className="text-[11px] text-stone-500 block">معاينة الشنطة عند الاستلام</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#15151e] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 dark:text-white block">حفر بالذهب الخالص</span>
            <span className="text-[11px] text-stone-500 block">حراري يدوم للأبد</span>
          </div>

          <div className="p-4 bg-white dark:bg-[#15151e] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-1.5 shadow-sm">
            <Eye className="w-6 h-6 text-[#9b287b] mx-auto" />
            <span className="text-xs font-bold text-stone-900 dark:text-white block">معاينة لحظية 100%</span>
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
          } else if (tab === 'orders') {
            setIsProfileOpen(true);
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

      {/* 11. User Profile & Order History Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 12. Admin Control Panel Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
