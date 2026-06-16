import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── LOCAL STORAGE DATABASE FALLBACK (SINGLE SOURCE OF TRUTH) ──────────────────
// This ensures that even without active Supabase credentials, the store and dashboard
// operate with complete state sync, allowing real-time inventory deductions, order tracking, and CRUD.

const KEYS = {
  PRODUCTS: 'erha_products_v4',
  CATEGORIES: 'erha_categories_v2',
  ORDERS: 'erha_orders_v2',
  CUSTOMERS: 'erha_customers_v2',
  COUPONS: 'erha_coupons_v2',
  EXPENSES: 'erha_expenses_v2',
  PAYMENTS: 'erha_payments_v2',
  NOTIFICATIONS: 'erha_notifications_v2',
  USER_ROLE: 'erha_user_role',
};

const initialProducts: any[] = [];

const initialCategories = [
  { id: 'cat1', name: 'Ultra Compact', slug: 'ultra-compact', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400' },
  { id: 'cat2', name: 'High Capacity', slug: 'high-capacity', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400' },
  { id: 'cat3', name: 'MagSafe & Wireless', slug: 'magsafe-wireless', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=400' },
  { id: 'cat4', name: 'Laptop Power Banks', slug: 'laptop-power-banks', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' },
  { id: 'cat5', name: 'Rugged & Solar', slug: 'rugged-solar', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400' },
];

const initialCoupons: any[] = [];
const initialCustomers: any[] = [];

export type LocalOrder = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  date: string;
  address: string;
  paymentMethod: string;
  discountAmount: number;
  shippingRate: number;
  trackingNumber?: string;
};

const initialOrders: LocalOrder[] = [];
const initialExpenses: any[] = [];
const initialPayments: any[] = [];
const initialNotifications: any[] = [];

// Helper to load/save from localStorage
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(val));
    // Emit dynamic storage event to sync windows
    window.dispatchEvent(new Event('storage'));
  }
}

export const db = {
  // PRODUCTS
  getProducts: () => getStorage(KEYS.PRODUCTS, initialProducts),
  saveProduct: (p: any) => {
    const products = db.getProducts();
    const idx = products.findIndex((x) => x.id === p.id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...p };
    } else {
      products.push(p);
    }
    setStorage(KEYS.PRODUCTS, products);
  },
  deleteProduct: (id: string) => {
    const products = db.getProducts();
    const updated = products.filter((x) => x.id !== id);
    setStorage(KEYS.PRODUCTS, updated);
  },

  // CATEGORIES
  getCategories: () => getStorage(KEYS.CATEGORIES, initialCategories),
  saveCategory: (c: any) => {
    const cats = db.getCategories();
    const idx = cats.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      cats[idx] = c;
    } else {
      cats.push(c);
    }
    setStorage(KEYS.CATEGORIES, cats);
  },
  deleteCategory: (id: string) => {
    const cats = db.getCategories();
    const updated = cats.filter((x) => x.id !== id);
    setStorage(KEYS.CATEGORIES, updated);
  },

  // ORDERS
  getOrders: () => getStorage(KEYS.ORDERS, initialOrders),
  createOrder: (orderData: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
    paymentMethod: string;
    discountAmount: number;
    shippingRate: number;
    subtotal: number;
    total: number;
    notes?: string;
  }) => {
    const orders = db.getOrders();
    const orderNum = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    
    // 1. Save order
    const newOrder = {
      id: orderNum,
      customer: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      items: orderData.items.map((x) => `${x.name} x${x.quantity}`),
      total: orderData.total,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Pending',
      date: new Date().toISOString(),
      address: `${orderData.address}, ${orderData.city}`,
      paymentMethod: orderData.paymentMethod,
      discountAmount: orderData.discountAmount,
      shippingRate: orderData.shippingRate,
    };
    orders.unshift(newOrder);
    setStorage(KEYS.ORDERS, orders);

    // 2. Decrement stock in inventory for each item
    const products = db.getProducts();
    orderData.items.forEach((item) => {
      const p = products.find((x) => x.id === item.id || x.name === item.name);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        if (p.stock === 0) {
          p.status = 'Out of Stock';
          // Create out of stock notification
          db.createNotification({
            type: 'stock',
            title: 'Out of Stock Alert',
            description: `${p.name} is now completely out of stock!`
          });
        } else if (p.stock < p.minStock) {
          // Create low stock notification
          db.createNotification({
            type: 'stock',
            title: 'Low Stock Alert',
            description: `${p.name} has only ${p.stock} units remaining.`
          });
        }
        db.saveProduct(p);
      }
    });

    // 3. Register Customer spendings
    const customers = db.getCustomers();
    const custIdx = customers.findIndex((x) => x.email.toLowerCase() === orderData.email.toLowerCase());
    if (custIdx >= 0) {
      customers[custIdx].totalOrders += 1;
      customers[custIdx].totalSpend += orderData.total;
      customers[custIdx].phone = orderData.phone;
      customers[custIdx].address = orderData.address;
      customers[custIdx].city = orderData.city;
    } else {
      customers.push({
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        totalOrders: 1,
        totalSpend: orderData.total,
        notes: orderData.notes || 'Added from web checkout',
        status: 'Active',
        created_at: new Date().toISOString()
      });
    }
    setStorage(KEYS.CUSTOMERS, customers);

    // 4. Create Payment if already Paid
    if (newOrder.paymentStatus === 'Paid') {
      db.createPayment({
        orderId: orderNum,
        method: orderData.paymentMethod,
        amount: orderData.total,
        status: 'Paid',
        reference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
      });
    }

    // 5. Trigger new order notification
    db.createNotification({
      type: 'order',
      title: 'New Order Received',
      description: `${orderNum} from ${orderData.customerName} — Rs. ${orderData.total.toLocaleString()}`
    });

    return newOrder;
  },
  updateOrderStatus: (id: string, status: string) => {
    const orders = db.getOrders();
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      orders[idx].orderStatus = status;
      setStorage(KEYS.ORDERS, orders);
    }
  },
  updateOrderPaymentStatus: (id: string, payStatus: string) => {
    const orders = db.getOrders();
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      const order = orders[idx];
      order.paymentStatus = payStatus;
      setStorage(KEYS.ORDERS, orders);

      // Sync with payments list
      const payments = db.getPayments();
      const pIdx = payments.findIndex((p) => p.orderId === id);
      if (pIdx >= 0) {
        payments[pIdx].status = payStatus;
        setStorage(KEYS.PAYMENTS, payments);
      } else if (payStatus === 'Paid') {
        db.createPayment({
          orderId: id,
          method: order.paymentMethod || 'COD',
          amount: order.total || 0,
          status: 'Paid',
          reference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
        });
      }
    }
  },

  // CUSTOMERS
  getCustomers: () => getStorage(KEYS.CUSTOMERS, initialCustomers),
  saveCustomer: (c: any) => {
    const custs = db.getCustomers();
    const idx = custs.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      custs[idx] = c;
    } else {
      custs.push(c);
    }
    setStorage(KEYS.CUSTOMERS, custs);
  },

  // COUPONS
  getCoupons: () => getStorage(KEYS.COUPONS, initialCoupons),
  saveCoupon: (c: any) => {
    const coupons = db.getCoupons();
    const idx = coupons.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      coupons[idx] = c;
    } else {
      coupons.push(c);
    }
    setStorage(KEYS.COUPONS, coupons);
  },
  deleteCoupon: (id: string) => {
    const coupons = db.getCoupons();
    const updated = coupons.filter((x) => x.id !== id);
    setStorage(KEYS.COUPONS, updated);
  },
  validateCoupon: (code: string, orderAmount: number) => {
    const coupons = db.getCoupons();
    const c = coupons.find((x) => x.code.toUpperCase() === code.toUpperCase() && x.status === 'Active');
    if (!c) return { valid: false, message: 'Invalid or inactive discount coupon code.' };
    
    // Check expiry
    if (new Date(c.expiry) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }
    
    // Check min order
    if (orderAmount < c.minOrder) {
      return { valid: false, message: `Minimum order amount of Rs. ${c.minOrder.toLocaleString()} required.` };
    }

    // Check usage limits
    if (c.maxUsage && c.usageCount >= c.maxUsage) {
      return { valid: false, message: 'This coupon usage limit has been reached.' };
    }

    return { valid: true, coupon: c };
  },

  // EXPENSES
  getExpenses: () => getStorage(KEYS.EXPENSES, initialExpenses),
  createExpense: (exp: { category: string; amount: number; description: string; date: string }) => {
    const expenses = db.getExpenses();
    const newExp = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      ...exp
    };
    expenses.unshift(newExp);
    setStorage(KEYS.EXPENSES, expenses);
    return newExp;
  },

  // PAYMENTS
  getPayments: () => getStorage(KEYS.PAYMENTS, initialPayments),
  createPayment: (pmt: { orderId: string; method: string; amount: number; status: string; reference: string }) => {
    const payments = db.getPayments();
    const newPmt = {
      id: `PMT-${String(payments.length + 1).padStart(3, '0')}`,
      ...pmt,
      date: new Date().toISOString().split('T')[0]
    };
    payments.unshift(newPmt);
    setStorage(KEYS.PAYMENTS, payments);
    return newPmt;
  },

  // NOTIFICATIONS
  getNotifications: () => getStorage(KEYS.NOTIFICATIONS, initialNotifications),
  createNotification: (notif: { type: string; title: string; description: string }) => {
    const list = db.getNotifications();
    const newNotif = {
      id: `N${Date.now()}`,
      read: false,
      time: new Date().toISOString(),
      ...notif
    };
    list.unshift(newNotif);
    setStorage(KEYS.NOTIFICATIONS, list.slice(0, 30)); // Cap at 30
    return newNotif;
  },
  markAllNotificationsRead: () => {
    const list = db.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    setStorage(KEYS.NOTIFICATIONS, updated);
  },
  dismissNotification: (id: string) => {
    const list = db.getNotifications();
    const updated = list.filter((n) => n.id !== id);
    setStorage(KEYS.NOTIFICATIONS, updated);
  },

  // ROLES
  getUserRole: () => getStorage(KEYS.USER_ROLE, 'Super Admin'),
  setUserRole: (role: 'Super Admin' | 'Manager' | 'Staff') => {
    setStorage(KEYS.USER_ROLE, role);
  }
};
