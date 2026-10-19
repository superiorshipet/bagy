'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav, NavTab } from '@/components/layout/BottomNav';
import { BagConfiguratorModal } from '@/components/configurator/BagConfiguratorModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BagCanvasPreview } from '@/components/configurator/BagCanvasPreview';
import { BAG_TYPES, FEATURED_PRODUCTS, COLORS, MATERIALS } from '@/data/bagOptions';
import { BagCategory, CartItem, CustomBagConfiguration, ProductItem } from '@/types/bag';
import { formatPrice } from '@/lib/utils';
import {
  Sparkles,
  ArrowLeft,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  Gift,
  Heart,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedBagTypeForConfig, setSelectedBagTypeForConfig] = useState<BagCategory>('tote');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);

  // Interactive Mini Preview on Home Page
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

  // Filter products
  const filteredProducts =
    selectedCategory === 'all'
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="app-container" dir="rtl">
      {/* 1. Header TopBar */}
      <TopBar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Main Scrollable Page Area */}
      <main className="flex-1 pb-24 space-y-6">
        {/* Hero Section (Like Lola Banner) */}
        <section className="px-4 pt-3">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#2c1825] to-[#8a1d63] text-white p-6 shadow-xl">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أول منصة تفصيل شنط مخصصة في مصر</span>
              </div>

              <h1 className="text-2xl font-black leading-tight">
                صممي شنطتك الحلم <br />
                <span className="text-[#e2b77a]">بكل تفاصيلها بلمسة يدك</span>
              </h1>

              <p className="text-xs text-stone-300 leading-relaxed max-w-[260px]">
                اختاري نوع الجلد، الألوان، الإكسسوارات المعدنية، واكتبي اسمك أو حروفك بحفر الذهب الخالص.
              </p>

              <div className="pt-1">
                <button
                  onClick={() => handleOpenConfiguratorWithBag('tote')}
                  className="px-6 py-3 rounded-2xl bg-white text-stone-950 text-xs font-black shadow-lg hover:bg-stone-100 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>ابدئي التفصيل الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#9b287b]/40 blur-3xl" />
          </div>
        </section>

        {/* 3. Horizontal Stories / Categories (Exact Lola Style) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-bold text-stone-900">الموديلات والقصات</h2>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-bold text-[#9b287b] hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#fdf2f8] text-[#9b287b] font-bold'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-sm border ${
                  selectedCategory === 'all'
                    ? 'border-[#9b287b] bg-white ring-2 ring-[#9b287b]/20'
                    : 'border-stone-200 bg-white'
                }`}
              >
                ✨
              </div>
              <span className="text-[11px]">الكل</span>
            </button>

            {BAG_TYPES.map((bag) => {
              const isSelected = selectedCategory === bag.id;
              return (
                <button
                  key={bag.id}
                  onClick={() => setSelectedCategory(bag.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                    isSelected ? 'bg-[#fdf2f8] text-[#9b287b] font-bold' : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-sm border transition-transform ${
                      isSelected
                        ? 'border-[#9b287b] bg-white ring-2 ring-[#9b287b]/20 scale-105'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    {bag.icon}
                  </div>
                  <span className="text-[11px] truncate max-w-[65px]">{bag.nameAr.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Live Interactive Sandbox Card (Signature Wow-factor) */}
        <section className="px-4">
          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#9b287b] tracking-wider">
                  تجربة حية فورية
                </span>
                <h3 className="text-sm font-bold text-stone-900">جربي تخصيص الألوان والحفر بنفسك:</h3>
              </div>
              <button
                onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                className="text-xs font-bold text-[#9b287b] bg-[#fdf2f8] px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <span>فتح المحرر الكامل</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            {/* Realtime Canvas Box */}
            <BagCanvasPreview config={homePreviewConfig} />

            {/* Quick Live Color Toggles */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-stone-500 font-medium">الألوان السريعة:</span>
              <div className="flex gap-2">
                {COLORS.slice(0, 5).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setHomePreviewConfig({ ...homePreviewConfig, primaryColorId: col.id })}
                    className={`w-8 h-8 rounded-full border transition-all ${
                      homePreviewConfig.primaryColorId === col.id
                        ? 'ring-2 ring-offset-2 ring-[#9b287b] scale-110 shadow-md'
                        : 'border-black/10'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.nameAr}
                  />
                ))}
              </div>
            </div>

            {/* Quick Monogram Input */}
            <div className="flex gap-2 items-center pt-1">
              <input
                type="text"
                maxLength={4}
                value={homePreviewConfig.monogram.text}
                onChange={(e) =>
                  setHomePreviewConfig({
                    ...homePreviewConfig,
                    monogram: { ...homePreviewConfig.monogram, text: e.target.value.toUpperCase() },
                  })
                }
                placeholder="حروفك (مثلاً: LA)"
                className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-stone-200 uppercase tracking-widest text-center"
              />
              <button
                onClick={() => handleOpenConfiguratorWithBag(homePreviewConfig.bagType)}
                className="px-4 py-2 bg-[#9b287b] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#831f67]"
              >
                تثبيت وتفصيل
              </button>
            </div>
          </div>
        </section>

        {/* 5. Featured Bags Catalog Grid */}
        <section className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">أكثر الشنط طلباً في مصر</h2>
              <p className="text-xs text-stone-500">جاهزة للشراء فوراً أو قابلة للتعديل بالكامل</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map((prod) => {
              const isLiked = likedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
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
                      className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-600 shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-stone-600'
                        }`}
                      />
                    </button>

                    {prod.isBestSeller && (
                      <span className="absolute top-2.5 right-2.5 bg-[#9b287b] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        الأكثر مبيعاً ⭐
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{prod.rating}</span>
                        <span className="text-stone-400 font-normal">({prod.reviewCount})</span>
                      </div>
                      <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{prod.nameAr}</h3>
                      <p className="text-xs font-extrabold text-[#9b287b]">
                        {formatPrice(prod.price, 'EGP', 'ar')}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col gap-1.5">
                      <button
                        onClick={() => handleOpenConfiguratorWithBag(prod.category)}
                        className="w-full py-2 rounded-xl bg-[#fdf2f8] text-[#9b287b] text-xs font-bold hover:bg-[#fae8f3] transition-colors flex items-center justify-center gap-1"
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
        <section className="px-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 flex items-center justify-center flex-shrink-0 text-2xl">
              🎁
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-amber-950">خدمة الإهداء الملكي</h3>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                نوصل الشنطة في بوكس فاخر مع كارت يحمل كلماتك الخاصة مباشرة لصاحب الهدية مع إخفاء الفاتورة.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Trust & Guarantee Badges */}
        <section className="px-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
            <ShieldCheck className="w-5 h-5 text-[#9b287b] mx-auto" />
            <span className="text-[10px] font-bold text-stone-900 block">جلد طبيعي 100%</span>
            <span className="text-[9px] text-stone-500 block">ضمان استبدال</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
            <Truck className="w-5 h-5 text-[#9b287b] mx-auto" />
            <span className="text-[10px] font-bold text-stone-900 block">شحن لكل مصر</span>
            <span className="text-[9px] text-stone-500 block">ومعاينة عند الاستلام</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
            <Sparkles className="w-5 h-5 text-[#9b287b] mx-auto" />
            <span className="text-[10px] font-bold text-stone-900 block">حفر بالذهب</span>
            <span className="text-[9px] text-stone-500 block">مقاوم للتلاشي</span>
          </div>
        </section>
      </main>

      {/* 8. Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'customize') {
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
