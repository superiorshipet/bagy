'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Plus,
  RefreshCw,
  CheckCircle,
  Truck,
  Clock,
  Printer,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Tag,
  Search,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'promos'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    nameAr: '',
    nameEn: '',
    category: 'tote',
    price: 1950,
    image: '',
  });
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/stats').then((res) => res.json()),
      fetch('/api/orders').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([statsRes, ordersRes, productsRes]) => {
        if (statsRes.success) setStats(statsRes.stats);
        if (ordersRes.success) setOrders(ordersRes.orders);
        if (productsRes.success) setProducts(productsRes.products);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Order Status Update directly in PostgreSQL
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        // Refresh stats
        fetch('/api/admin/stats')
          .then((r) => r.json())
          .then((d) => d.success && setStats(d.stats));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Add Product to PostgreSQL
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts([data.product, ...products]);
        setProductSuccessMsg('✓ تم إضافة الموديل الجديد بنجاح إلى قاعدة البيانات!');
        setNewProduct({
          nameAr: '',
          nameEn: '',
          category: 'tote',
          price: 1950,
          image: '',
        });
        setTimeout(() => setProductSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-6" dir="rtl">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#15151e] rounded-3xl shadow-2xl flex flex-col h-[94vh] max-h-[920px] overflow-hidden border border-stone-200 dark:border-stone-800 transition-colors">
        {/* Top Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#15151e] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-md">
              🛠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                  لوحة تحكم إدارة المتجر (Admin Control Panel)
                </h2>
                <span className="text-[10px] bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">
                  Live PostgreSQL 🟢
                </span>
              </div>
              <p className="text-xs text-stone-400">إدارة الطلبات، خط الإنتاج، المنتجات، وأكواد الخصم</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 px-6 bg-stone-50/70 dark:bg-stone-900/40 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            المؤشرات والإحصائيات
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            إدارة الطلبات والتصنيع ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Package className="w-4 h-4" />
            الموديلات والمخزون ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'promos'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Tag className="w-4 h-4" />
            أكواد الخصم والعروض
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 no-scrollbar">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fdf2f8] to-pink-100/50 dark:from-[#2a1122] dark:to-[#1e101a] border border-pink-200 dark:border-pink-900/40 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#9b287b]">
                    <span>إجمالي الإيرادات</span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    {formatPrice(stats?.totalRevenue || 0, 'EGP', 'ar')}
                  </div>
                  <span className="text-[10px] text-stone-500">من جميع الطلبات المؤكدة</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>قيد التصنيع اليدوي</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    {stats?.inProductionOrders || 0} طلب
                  </div>
                  <span className="text-[10px] text-stone-500">في ورشة تفصيل الجلد</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                    <span>إجمالي الطلبات</span>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    {stats?.totalOrders || 0}
                  </div>
                  <span className="text-[10px] text-stone-500">في قاعدة البيانات</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/40 dark:to-emerald-950/20 border border-green-200 dark:border-green-900/40 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-green-700">
                    <span>تم التسليم بنجاح</span>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                    {stats?.deliveredOrders || 0}
                  </div>
                  <span className="text-[10px] text-stone-500">مكتمل مع العملاء</span>
                </div>
              </div>

              {/* Recent Orders in Workshop */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">أحدث الطلبات في الورشة</h3>
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900/40">
                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900 dark:text-white">{order.orderNumber}</span>
                            <span className="text-xs text-stone-500">- {order.customerName} ({order.customerPhone})</span>
                          </div>
                          <p className="text-xs text-stone-400">
                            {order.items?.map((i: any) => i.summaryText).join(' | ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs text-[#9b287b]">
                            {formatPrice(order.total, 'EGP', 'ar')}
                          </span>
                          <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full font-bold">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Controls: Filter & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-300">الحالة:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="all">كل الطلبات</option>
                    <option value="PENDING">قيد المراجعة (PENDING)</option>
                    <option value="IN_PRODUCTION">في خط الإنتاج (IN_PRODUCTION)</option>
                    <option value="SHIPPED">تم الشحن (SHIPPED)</option>
                    <option value="DELIVERED">تم التسليم (DELIVERED)</option>
                    <option value="CANCELLED">ملغي (CANCELLED)</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث برقم الطلب أو الاسم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Orders Table/Cards */}
              <div className="space-y-3.5">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-stone-900 dark:text-white">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-stone-400">
                            ({new Date(order.createdAt).toLocaleString('ar-EG')})
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                          العميل: <strong>{order.customerName}</strong> | هاتف: {order.customerPhone} | منطقة: {order.deliveryArea}
                        </p>
                      </div>

                      {/* Status Update Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">تغيير الحالة:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#9b287b] bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] dark:text-[#be3999] cursor-pointer"
                        >
                          <option value="PENDING">قيد المراجعة ⏳</option>
                          <option value="IN_PRODUCTION">في خط التصنيع 🧵</option>
                          <option value="SHIPPED">تم الشحن 🚚</option>
                          <option value="DELIVERED">تم التسليم ✓</option>
                          <option value="CANCELLED">إلغاء الطلب ✗</option>
                        </select>
                      </div>
                    </div>

                    {/* Customized Specifications (تذكرة تفصيل الورشة) */}
                    <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl space-y-2 text-xs">
                      <span className="text-[11px] font-bold text-stone-500 block">
                        📋 مواصفات التفصيل اليدوي للمصنع:
                      </span>
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="space-y-1">
                          <div className="flex justify-between font-bold text-stone-900 dark:text-white">
                            <span>• {item.summaryText}</span>
                            <span>{formatPrice(item.unitPrice * item.quantity, 'EGP', 'ar')}</span>
                          </div>
                          {item.customization && (
                            <div className="text-[11px] text-stone-500 grid grid-cols-2 sm:grid-cols-4 gap-1 pr-3">
                              <span>الموديل: {item.customization.bagType}</span>
                              <span>المقاس: {item.customization.size}</span>
                              <span>الإكسسوارات: {item.customization.hardware}</span>
                              {item.customization.monogramText && (
                                <span className="text-amber-600 font-bold">
                                  الحفر: "{item.customization.monogramText}"
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {order.isGift && (
                        <div className="p-2 bg-pink-100/60 dark:bg-pink-950/40 rounded-lg text-[11px] text-pink-900 dark:text-pink-300">
                          🎁 <strong>طلب هدية:</strong> يرسل باسم "{order.recipientName}" مع الكارت: "{order.giftMessage}" (إخفاء السعر).
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Add New Product Form */}
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/30 space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#9b287b]" />
                  إضافة موديل شنطة جديد للمتجر وقاعدة البيانات
                </h3>

                {productSuccessMsg && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-xl text-xs font-bold">
                    {productSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      اسم الموديل (عربي):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: شنطة كتف لوتس"
                      value={newProduct.nameAr}
                      onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الاسم بالإنجليزية:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lotus Shoulder Bag"
                      value={newProduct.nameEn}
                      onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الفئة / القصة:
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    >
                      <option value="tote">توت باج (Tote)</option>
                      <option value="crossbody">كروس بودي (Crossbody)</option>
                      <option value="shoulder">شولدر باج (Shoulder)</option>
                      <option value="mini">ميني باج (Mini)</option>
                      <option value="backpack">باك باك (Backpack)</option>
                      <option value="clutch">كلاتش (Clutch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      السعر الأساسي (ج.م):
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      رابط صورة الشنطة (Image URL):
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingProduct}
                      className="w-full py-2.5 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-md"
                    >
                      {isSubmittingProduct ? 'جاري الحفظ...' : '+ حفظ الموديل'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Products Grid in DB */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">الموديلات المتاحة حالياً ({products.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex items-center gap-3"
                    >
                      <img src={p.image} alt={p.nameAr} className="w-14 h-14 rounded-xl object-cover bg-stone-100" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">{p.nameAr}</h4>
                        <span className="text-[10px] text-stone-400 block">{p.nameEn}</span>
                        <span className="text-xs font-black text-[#9b287b]">{formatPrice(p.price, 'EGP', 'ar')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROMO CODES */}
          {activeTab === 'promos' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">أكواد الخصم المفعلة في النظام</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-[#9b287b]">LOLA</span>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">مفعل</span>
                  </div>
                  <p className="text-xs text-stone-500">خصم ترحيبي 10% لكافة العملاء</p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-[#9b287b]">BAGY10</span>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">مفعل</span>
                  </div>
                  <p className="text-xs text-stone-500">خصم 10% لمتابعي المتجر الجدد</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
