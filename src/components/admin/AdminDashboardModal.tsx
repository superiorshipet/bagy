import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { useAppSettings } from '@/context/ThemeContext';
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
  Users,
  Trash2,
  Edit,
  Save,
  ShieldCheck,
  User,
  AlertTriangle,
  Bell,
  Send,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated?: () => void;
  onCategoriesUpdated?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onProductsUpdated,
  onCategoriesUpdated,
}) => {
  const { currency } = useAppSettings();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'users' | 'promos' | 'notifications'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Notification form state
  const [newNotif, setNewNotif] = useState({
    title: '',
    message: '',
    type: 'alert',
    userId: 'all',
  });
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifSuccessMsg, setNotifSuccessMsg] = useState('');
  const [deletingNotifId, setDeletingNotifId] = useState<string | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    nameAr: '',
    nameEn: '',
    category: 'tote',
    price: 1950,
    image: '',
    isBestSeller: false,
  });
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Categories management state
  const [newCategory, setNewCategory] = useState({
    slug: '',
    nameAr: '',
    nameEn: '',
    icon: '👜',
    basePrice: 1850,
    image: '',
    description: '',
  });
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [categorySuccessMsg, setCategorySuccessMsg] = useState('');
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isSavingCatEdit, setIsSavingCatEdit] = useState(false);

  // Deletion feedback states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Promo codes state
  const [promos, setPromos] = useState<any[]>([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercent: 15,
    maxUsage: 500,
  });
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/stats').then((res) => res.json()),
      fetch('/api/orders').then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/admin/users').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/promos').then((res) => res.json()),
      fetch('/api/notifications').then((res) => res.json()),
    ])
      .then(([statsRes, ordersRes, productsRes, usersRes, catRes, promosRes, notifsRes]) => {
        if (statsRes.success) setStats(statsRes.stats);
        if (ordersRes.success) setOrders(ordersRes.orders);
        if (productsRes.success) setProducts(productsRes.products);
        if (usersRes.success) setUsers(usersRes.users);
        if (catRes.success) setCategories(catRes.categories);
        if (promosRes.success) setPromos(promosRes.promos);
        if (notifsRes?.success) setNotifications(notifsRes.notifications);
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
        if (onProductsUpdated) onProductsUpdated();
        setProducts([data.product, ...products]);
        setProductSuccessMsg('✓ تم إضافة الموديل الجديد بنجاح إلى قاعدة البيانات!');
        setNewProduct({
          nameAr: '',
          nameEn: '',
          category: 'tote',
          price: 1950,
          image: '',
          isBestSeller: false,
        });
        setTimeout(() => setProductSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الموديل "${productName}" نهائياً من المتجر وقاعدة البيانات؟`)) {
      return;
    }
    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        if (onProductsUpdated) onProductsUpdated();
        setNotificationMsg(`✓ تم حذف الموديل "${productName}" بنجاح.`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء حذف الموديل');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لحذف الموديل');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Save Edit Product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === data.product.id ? data.product : p))
        );
        if (onProductsUpdated) onProductsUpdated();
        setEditingProduct(null);
        setNotificationMsg(`✓ تم تحديث بيانات الموديل "${data.product.nameAr}" بنجاح!`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء تحديث الموديل');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لحفظ التعديلات');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`هل أنت متأكد من مسح حساب المستخدم "${userName}" نهائياً من قاعدة البيانات؟`)) {
      return;
    }
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setNotificationMsg(`✓ تم مسح المستخدم "${userName}" بنجاح.`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء مسح المستخدم');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لمسح المستخدم');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.nameAr || !newCategory.slug) {
      alert('يرجى إدخال اسم الفئة والكود التعريفي (Slug)');
      return;
    }
    setIsSubmittingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) => [data.category, ...prev]);
        setCategorySuccessMsg(`✓ تم إضافة الفئة "${data.category.nameAr}" بنجاح!`);
        setNewCategory({
          slug: '',
          nameAr: '',
          nameEn: '',
          icon: '👜',
          basePrice: 1850,
          image: '',
          description: '',
        });
        if (onCategoriesUpdated) onCategoriesUpdated();
        setTimeout(() => setCategorySuccessMsg(''), 4000);
      } else {
        alert(data.error || 'فشل إضافة الفئة الجديدة');
      }
    } catch (e) {
      console.error(e);
      alert('خطأ في الاتصال بالسيرفر أثناء إضافة الفئة');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفئة "${catName}" نهائياً من قاعدة البيانات؟`)) {
      return;
    }
    setDeletingId(catId);
    try {
      const res = await fetch(`/api/categories?id=${catId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
        if (onCategoriesUpdated) onCategoriesUpdated();
        setNotificationMsg(`✓ تم حذف الفئة "${catName}" بنجاح.`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء حذف الفئة');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لحذف الفئة');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Save Edit Category
  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsSavingCatEdit(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.category.id ? data.category : c))
        );
        if (onCategoriesUpdated) onCategoriesUpdated();
        setEditingCategory(null);
        setNotificationMsg(`✓ تم تحديث الفئة "${data.category.nameAr}" بنجاح!`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء تعديل الفئة');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لحفظ تعديلات الفئة');
    } finally {
      setIsSavingCatEdit(false);
    }
  };

  // Handle Create Promo Code
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.discountPercent) {
      alert('يرجى إدخال كود الخصم ونسبة الخصم');
      return;
    }
    setIsSubmittingPromo(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo),
      });
      const data = await res.json();
      if (data.success && data.promo) {
        setPromos((prev) => [data.promo, ...prev]);
        setPromoSuccessMsg(`✓ تم إضافة كود الخصم "${data.promo.code}" بنسبة ${data.promo.discountPercent}% بنجاح!`);
        setNewPromo({
          code: '',
          discountPercent: 15,
          maxUsage: 500,
        });
        setTimeout(() => setPromoSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'فشل إضافة كود الخصم');
      }
    } catch (e) {
      console.error(e);
      alert('خطأ في الاتصال بالسيرفر أثناء إضافة كود الخصم');
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  // Handle Delete Promo Code
  const handleDeletePromo = async (promoId: string, promoCodeStr: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف كود الخصم "${promoCodeStr}" نهائياً من قاعدة البيانات؟`)) {
      return;
    }
    setDeletingId(promoId);
    try {
      const res = await fetch(`/api/promos?id=${promoId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPromos((prev) => prev.filter((p) => p.id !== promoId));
        setNotificationMsg(`✓ تم حذف كود الخصم "${promoCodeStr}" بنجاح.`);
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        alert(data.error || 'حدث خطأ أثناء حذف كود الخصم');
      }
    } catch (e) {
      console.error(e);
      alert('فشل الاتصال بالخادم لحذف كود الخصم');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) {
      alert('يرجى ملء عنوان الإشعار ونص الرسالة');
      return;
    }
    setIsSendingNotif(true);
    setNotifSuccessMsg('');
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif),
      });
      const data = await res.json();
      if (data.success && data.notification) {
        setNotifications((prev) => [data.notification, ...prev]);
        setNewNotif({ title: '', message: '', type: 'alert', userId: 'all' });
        setNotifSuccessMsg('تم إرسال الإشعار بنجاح لجميع العملاء المستهدفين! 🚀');
        setTimeout(() => setNotifSuccessMsg(''), 4500);
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال الإشعار');
      }
    } catch (err) {
      console.error(err);
      alert('فشل الاتصال بالخادم لإرسال الإشعار');
    } finally {
      setIsSendingNotif(false);
    }
  };

  const handleDeleteNotification = async (notifId: string) => {
    if (!confirm('هل تريد حذف هذا الإشعار نهائياً من سجل المتجر؟')) return;
    setDeletingNotifId(notifId);
    try {
      const res = await fetch(`/api/notifications?id=${notifId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      } else {
        alert('حدث خطأ أثناء حذف الإشعار');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingNotifId(null);
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
            الموديلات والشنط ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Tag className="w-4 h-4" />
            الفئات والقصات ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Users className="w-4 h-4" />
            المستخدمين والعملاء ({users.length})
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
            أكواد الخصم والعروض ({promos.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-[#9b287b] text-[#9b287b] dark:text-[#be3999]'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Bell className="w-4 h-4" />
            مركز الإشعارات والتنبيهات ({notifications.length})
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
                    {formatPrice(stats?.totalRevenue || 0, currency, 'ar')}
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
                            {formatPrice(order.total, currency, 'ar')}
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
                            <span>{formatPrice(item.unitPrice * item.quantity, currency, 'ar')}</span>
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
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.icon || '👜'} {cat.nameAr} ({cat.nameEn})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="tote">👜 توت باج (Tote)</option>
                          <option value="crossbody">👝 كروس بودي (Crossbody)</option>
                          <option value="shoulder">👛 شولدر باج (Shoulder)</option>
                          <option value="mini">🎒 ميني باج (Mini)</option>
                          <option value="backpack">🎒 باك باك (Backpack)</option>
                          <option value="clutch">👝 كلاتش (Clutch)</option>
                        </>
                      )}
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

              {/* Products Grid in DB with Edit & Delete actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  الموديلات والشنط المعروضة بالمتجر ({products.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.image}
                          alt={p.nameAr}
                          className="w-16 h-16 rounded-xl object-cover bg-stone-100 dark:bg-stone-800 flex-shrink-0 border border-stone-200 dark:border-stone-700"
                        />
                        <div className="flex-1 overflow-hidden min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(() => {
                              const catObj = categories.find((c) => c.slug === p.category);
                              return (
                                <span className="text-[10px] font-bold text-[#9b287b] dark:text-[#be3999] bg-[#fdf2f8] dark:bg-[#281223] px-2 py-0.5 rounded-md">
                                  {catObj ? `${catObj.icon || ''} ${catObj.nameAr}` : p.category}
                                </span>
                              );
                            })()}
                            {p.isBestSeller && (
                              <span className="text-[10px] font-black bg-amber-500 text-stone-950 px-2 py-0.5 rounded-md">
                                الأكثر مبيعاً ⭐
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate mt-1">
                            {p.nameAr}
                          </h4>
                          <span className="text-[10px] text-stone-400 block truncate">{p.nameEn}</span>
                          <span className="text-xs font-black text-[#9b287b] dark:text-[#be3999] block mt-0.5">
                            {formatPrice(p.price, currency, 'ar')}
                          </span>
                        </div>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.nameAr)}
                          disabled={deletingId === p.id}
                          className="py-1.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          title="حذف هذا الموديل نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES MANAGEMENT (إدارة الفئات والموديلات) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add New Category Form */}
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/30 space-y-4">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#9b287b]" />
                  إضافة فئة / قصة شنطة جديدة إلى قاعدة البيانات
                </h3>

                {categorySuccessMsg && (
                  <div className="p-3 bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 rounded-xl text-xs font-bold">
                    {categorySuccessMsg}
                  </div>
                )}

                <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      اسم الفئة (عربي):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: شنطة حزام"
                      value={newCategory.nameAr}
                      onChange={(e) => {
                        const nameAr = e.target.value;
                        setNewCategory((prev) => ({
                          ...prev,
                          nameAr,
                          // auto-generate slug if slug is empty or matches previous translation
                          slug: prev.slug || nameAr.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '')
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الاسم بالإنجليزية:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Belt Bag"
                      value={newCategory.nameEn}
                      onChange={(e) => {
                        const nameEn = e.target.value;
                        const autoSlug = nameEn.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
                        setNewCategory((prev) => ({
                          ...prev,
                          nameEn,
                          slug: autoSlug || prev.slug
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      المعرف الإنجليزي (Slug / Code):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. belt, satchel"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الأيقونة / الإيموجي:
                    </label>
                    <input
                      type="text"
                      placeholder="👜 أو 👝 أو 🎒"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-center text-base"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      السعر الأساسي المبدئي (ج.م):
                    </label>
                    <input
                      type="number"
                      required
                      value={newCategory.basePrice}
                      onChange={(e) => setNewCategory({ ...newCategory, basePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      رابط صورة نموذجية للفئة (اختياري):
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingCat}
                      className="w-full py-2.5 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmittingCat ? 'جاري الحفظ...' : '+ حفظ الفئة'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories Grid List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    الفئات المسجلة في المتجر ({categories.length})
                  </h3>
                  <span className="text-xs text-stone-400">
                    تظهر الفئات الجديدة فوراً في شريط القصات، وفلاتر المتجر، ومعالج التفصيل
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((c) => {
                    const productCount = products.filter((p) => p.category === c.slug).length;
                    return (
                      <div
                        key={c.id || c.slug}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-[#fdf2f8] dark:bg-[#281223] border border-[#9b287b]/20 flex items-center justify-center text-3xl flex-shrink-0">
                            {c.icon || '👜'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                                {c.nameAr}
                              </h4>
                              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                {c.slug}
                              </span>
                            </div>
                            <span className="text-xs text-stone-400 block truncate">{c.nameEn}</span>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-xs font-black text-[#9b287b] dark:text-[#be3999]">
                                تبدأ من {formatPrice(c.basePrice, currency, 'ar')}
                              </span>
                              <span className="text-[10px] font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                                {productCount} موديل
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons: Edit & Delete */}
                        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                          <button
                            onClick={() => setEditingCategory(c)}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(c.id, c.nameAr)}
                            disabled={deletingId === c.id}
                            className="py-1.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                            title="حذف هذه الفئة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USERS MANAGEMENT (إدارة المستخدمين والعملاء) */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#9b287b]" />
                    سجل المستخدمين والعملاء المسجلين ({users.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    يمكنك استعراض بيانات العملاء وحذف أي حساب عند الحاجة
                  </p>
                </div>
              </div>

              {notificationMsg && (
                <div className="p-3 bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300 rounded-xl text-xs font-bold">
                  {notificationMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {users.map((u) => {
                  const isMainAdmin = u.email === 'admin@bagy.eg';
                  return (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#9b287b] to-[#c69b59] text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm">
                          {u.name?.charAt(0) || 'ع'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white truncate">
                              {u.name}
                            </h4>
                            {u.role === 'ADMIN' ? (
                              <span className="text-[10px] font-black bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full flex-shrink-0">
                                مدير (Admin)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full flex-shrink-0">
                                عميل
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {u.phone ? `هاتف: ${u.phone}` : u.email}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                            <span>📦 عدد الطلبات: {u._count?.orders || 0}</span>
                            <span>📍 العناوين: {u._count?.addresses || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delete User Button */}
                      <div>
                        {isMainAdmin ? (
                          <span className="text-[10px] font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 block text-center">
                            حساب محمي 🛡️
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={deletingId === u.id}
                            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                            title="مسح هذا المستخدم نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">مسح</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PROMO CODES MANAGEMENT */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              {/* Notification Message */}
              {promoSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <span>{promoSuccessMsg}</span>
                  <button onClick={() => setPromoSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add New Promo Code Form */}
              <div className="p-5 sm:p-6 rounded-3xl bg-stone-50/80 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf2f8] dark:bg-[#2e1327] text-[#9b287b] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">إضافة كود خصم جديد (Create Promo Code)</h3>
                    <p className="text-xs text-stone-500">حدد رمز الكود ونسبة الخصم التي تريد تطبيقها للعملاء في السلة</p>
                  </div>
                </div>

                <form onSubmit={handleCreatePromo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        رمز كود الخصم (Promo Code):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثلاً: SUMMER30 أو VIP50"
                        value={newPromo.code}
                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase().trim() })}
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        نسبة الخصم (%):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min={1}
                          max={100}
                          placeholder="مثلاً: 20"
                          value={newPromo.discountPercent}
                          onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b] pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        الحد الأقصى لمرات الاستخدام:
                      </label>
                      <input
                        type="number"
                        min={1}
                        placeholder="500"
                        value={newPromo.maxUsage}
                        onChange={(e) => setNewPromo({ ...newPromo, maxUsage: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                      />
                    </div>
                  </div>

                  {/* Quick percentage pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-stone-400 font-bold">نسب سريعة:</span>
                    {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setNewPromo({ ...newPromo, discountPercent: pct })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          newPromo.discountPercent === pct
                            ? 'bg-[#9b287b] text-white border-[#9b287b]'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingPromo}
                      className="px-6 py-2.5 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmittingPromo ? 'جاري الإضافة...' : 'إضافة وتفعيل كود الخصم'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Existing Promo Codes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>أكواد الخصم الحالية في قاعدة البيانات</span>
                    <span className="text-xs bg-[#fdf2f8] dark:bg-[#281223] text-[#9b287b] font-bold px-2 py-0.5 rounded-full">
                      {promos.length} كود
                    </span>
                  </h3>
                </div>

                {promos.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                    لا توجد أكواد خصم حالياً. أضف كود خصم جديد من النموذج أعلاه.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {promos.map((promo) => (
                      <div
                        key={promo.id}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm flex flex-col justify-between gap-3 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-base text-stone-900 dark:text-white tracking-wider bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-xl">
                                {promo.code}
                              </span>
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                                {promo.isActive ? 'مفعل 🟢' : 'معطل 🔴'}
                              </span>
                            </div>
                            <div className="text-sm font-extrabold text-[#9b287b] dark:text-[#be3999]">
                              خصم {promo.discountPercent}% على كامل السلة
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePromo(promo.id, promo.code)}
                            disabled={deletingId === promo.id}
                            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="مسح كود الخصم نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                          <span>الاستخدام: {promo.usedCount || 0} / {promo.maxUsage || '∞'}</span>
                          <span>{new Date(promo.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: NOTIFICATIONS & ALERTS CENTER */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Send Notification Card */}
              <div className="p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#fdf2f8] dark:bg-[#2e1327] text-[#9b287b] dark:text-[#f472b6] flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900 dark:text-white">
                        إرسال إشعار أو تنبيه جديد للعملاء
                      </h3>
                      <p className="text-xs text-stone-400">
                        إرسال رسائل فورية وتنبيهات مخصصة تظهر في شريط التنبيهات لدى العميل
                      </p>
                    </div>
                  </div>
                </div>

                {notifSuccessMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {notifSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Target Audience */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        الجمهور المستهدف (المستلم):
                      </label>
                      <select
                        value={newNotif.userId}
                        onChange={(e) => setNewNotif({ ...newNotif, userId: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                      >
                        <option value="all">📢 إشعار عام لجميع العملاء (Broadcast to All)</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            👤 {u.name} ({u.phone || u.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Notification Type */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                        نوع وتصنيف التنبيه:
                      </label>
                      <select
                        value={newNotif.type}
                        onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                      >
                        <option value="alert">📢 تنبيه عام / رسالة من صاحب المتجر</option>
                        <option value="promo">🏷️ عرض ترويجي / كود خصم جديد</option>
                        <option value="order">🧵 إشعار خاص بالطلبات والتصنيع</option>
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      عنوان الإشعار:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: خصم 20% لفترة محدودة على حقائب الكلاتش!"
                      value={newNotif.title}
                      onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      نص الرسالة والتفاصيل:
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="اكتب رسالتك وتفاصيل التنبيه التي ستصل لحساب العميل..."
                      value={newNotif.message}
                      onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#9b287b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingNotif}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#9b287b] to-[#7f1b62] hover:opacity-95 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingNotif ? 'جاري إرسال الإشعار...' : 'إرسال الإشعار فوراً للعملاء'}</span>
                  </button>
                </form>
              </div>

              {/* Notification Logs List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#9b287b]" />
                    سجل الإشعارات والتنبيهات المباشرة ({notifications.length})
                  </h3>
                  <button
                    onClick={loadData}
                    className="text-xs font-bold text-[#9b287b] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    تحديث القائمة
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                    لا توجد إشعارات مسجلة حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm space-y-2.5 hover:border-[#9b287b]/40 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">
                                {notif.type === 'order'
                                  ? '🧵'
                                  : notif.type === 'promo'
                                  ? '🏷️'
                                  : '📢'}
                              </span>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                                {notif.title}
                              </h4>
                            </div>
                            <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold px-2 py-0.5 rounded-full inline-block">
                              {notif.userId
                                ? `موجّه للعميل: ${notif.user?.name || notif.userId}`
                                : '📢 إشعار عام (لكل العملاء)'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            disabled={deletingNotifId === notif.id}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="حذف الإشعار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50/60 dark:bg-stone-950/40 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800/80">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                          <span>
                            {new Date(notif.createdAt).toLocaleDateString('ar-EG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </span>
                          <span>{notif.isRead ? 'تمت القراءة ✓' : 'لم يُقرأ بعد ⏳'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Product Modal Overlay */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#15151e] rounded-3xl p-6 w-full max-w-lg border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4" dir="rtl">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#9b287b]" />
                  تعديل بيانات الموديل: {editingProduct.nameAr}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      اسم الموديل (عربي):
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameAr}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الاسم بالإنجليزية:
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.nameEn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الفئة / القصة:
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    >
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.icon || '👜'} {cat.nameAr} ({cat.nameEn})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="tote">👜 توت باج (Tote)</option>
                          <option value="crossbody">👝 كروس بودي (Crossbody)</option>
                          <option value="shoulder">👛 شولدر باج (Shoulder)</option>
                          <option value="mini">🎒 ميني باج (Mini)</option>
                          <option value="backpack">🎒 باك باك (Backpack)</option>
                          <option value="clutch">👝 كلاتش (Clutch)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      السعر الأساسي (ج.م):
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    رابط صورة الشنطة:
                  </label>
                  <input
                    type="url"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                  {editingProduct.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl">
                      <img src={editingProduct.image} alt="معاينة" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-[11px] text-stone-500">معاينة الصورة المختارة</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editBestSeller"
                    checked={Boolean(editingProduct.isBestSeller)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-[#9b287b] rounded"
                  />
                  <label htmlFor="editBestSeller" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                    تمييز كـ "الأكثر مبيعاً ⭐"
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="flex-1 py-2.5 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT CATEGORY MODAL */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a1a24] rounded-3xl p-6 w-full max-w-lg border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#9b287b]" />
                  تعديل بيانات الفئة / القصة: {editingCategory.nameAr}
                </h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditCategory} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      اسم الفئة (عربي):
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCategory.nameAr}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الاسم بالإنجليزية:
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCategory.nameEn}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      الأيقونة / الإيموجي:
                    </label>
                    <input
                      type="text"
                      value={editingCategory.icon || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-center text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      السعر الأساسي (ج.م):
                    </label>
                    <input
                      type="number"
                      required
                      value={editingCategory.basePrice}
                      onChange={(e) => setEditingCategory({ ...editingCategory, basePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    المعرف (Slug / Code):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().trim() })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    رابط صورة توضيحية (اختياري):
                  </label>
                  <input
                    type="url"
                    value={editingCategory.image || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCatEdit}
                    className="flex-1 py-2.5 rounded-xl bg-[#9b287b] hover:bg-[#831f67] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCatEdit ? 'جاري الحفظ...' : 'حفظ تعديلات الفئة'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
