import { createClient } from '@supabase/supabase-js';
import pzxImgUrl from "@/assets/pzx_v91_power_bank.jpg";
import {
  fetchProductsServerFn,
  saveProductServerFn,
  deleteProductServerFn,
  fetchCategoriesServerFn,
  saveCategoryServerFn,
  deleteCategoryServerFn,
  fetchOrdersServerFn,
  createOrderServerFn,
  deleteOrderServerFn,
  clearAllOrdersServerFn,
  fetchCustomersServerFn,
  saveCustomerServerFn,
  deleteCustomerServerFn,
  fetchCouponsServerFn,
  saveCouponServerFn,
  deleteCouponServerFn,
  fetchExpensesServerFn,
  saveExpenseServerFn,
  deleteExpenseServerFn,
  fetchPaymentsServerFn,
  savePaymentServerFn,
  deletePaymentServerFn,
  fetchNotificationsServerFn,
  addNotificationServerFn,
  markNotificationReadServerFn,
  fetchAdminsServerFn,
  verifyAdminServerFn,
  saveAdminServerFn,
  deleteAdminServerFn,
} from './db-server-fns';

// Read Supabase environment variables from import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── PASSWORD HASHING HELPER ──────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── LOCAL STORAGE DATABASE FALLBACK (SINGLE SOURCE OF TRUTH) ──────────────────
const KEYS = {
  PRODUCTS: 'erha_products_v5',
  CATEGORIES: 'erha_categories_v2',
  ORDERS: 'erha_orders_v2',
  CUSTOMERS: 'erha_customers_v2',
  COUPONS: 'erha_coupons_v2',
  EXPENSES: 'erha_expenses_v2',
  PAYMENTS: 'erha_payments_v2',
  NOTIFICATIONS: 'erha_notifications_v2',
  USER_ROLE: 'erha_user_role',
  ADMINS: 'erha_admins_local_v2',
};

const initialProducts: any[] = [
  {
    id: "prd-pzx-v91",
    name: "PZX V91 Power Bank (10,000mAh)",
    category: "Ultra Compact",
    price: 4500,
    salePrice: 3000,
    stock: 100,
    minStock: 10,
    status: "Active",
    shortDescription: "Stay powered all day with the PZX V91 - a high-capacity 10,000mAh lithium battery power bank. Ultra-compact, fast-charging, and built for reliability.",
    image: pzxImgUrl,
    brand: "PZX",
    sku: "PZX-V91-001",
    rating: 4.8,
    reviews: 95,
    badge: "Featured",
    features: [
      "10,000mAh lithium polymer battery",
      "Dual USB outputs with smart charging",
      "Micro-USB and USB-C inputs",
      "LED indicators for battery status"
    ],
    specifications: {
      "Capacity": "10,000mAh",
      "Input": "5V-2A (Type-C / Micro-USB)",
      "Output": "5V-2A Max (Dual USB-A)",
      "Battery Type": "Lithium Polymer"
    },
    costPrice: 1800
  },
  {
    id: "PRD-1784188637864",
    name: "ERHA MagSafe 10K Wireless Power Bank",
    category: "MagSafe & Wireless",
    price: 6500,
    salePrice: 4999,
    stock: 45,
    minStock: 5,
    status: "Active",
    shortDescription: "Ultra-slim 10,000mAh magnetic wireless power bank with premium leather finish and built-in kickstand.",
    image: "https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=600",
    brand: "ERHA",
    sku: "ERH-PRD-SEED-001",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    features: [
      "15W MagSafe compatible wireless charging",
      "20W Power Delivery USB-C port for fast input/output",
      "Foldable leather kickstand for hands-free viewing",
      "Smart LED battery percentage display"
    ],
    specifications: {
      "Capacity": "10,000mAh / 37Wh",
      "Wireless Output": "5W / 7.5W / 10W / 15W",
      "USB-C Input/Output": "5V-3A / 9V-2.22A / 12V-1.67A (20W Max)",
      "Dimensions": "104 x 68 x 16 mm",
      "Weight": "185g"
    },
    costPrice: 3000
  },
  {
    id: "PRD-1784188637865",
    name: "ERHA AeroCompact 10K Mini Charger",
    category: "Ultra Compact",
    price: 3500,
    salePrice: 2499,
    stock: 85,
    minStock: 10,
    status: "Active",
    shortDescription: "Pocket-sized credit-card format 10,000mAh power bank featuring dual port fast charging and premium aluminum casing.",
    image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=600",
    brand: "ERHA",
    sku: "ERH-PRD-SEED-002",
    rating: 4.6,
    reviews: 89,
    badge: "Trending",
    features: [
      "Ultra-compact credit card footprint",
      "Dual USB-A and USB-C output ports",
      "22.5W Super Fast Charging support",
      "Ergonomic anodized aluminum body"
    ],
    specifications: {
      "Capacity": "10,000mAh / 37Wh",
      "USB-C Output (PD 3.0)": "20W Max",
      "USB-A Output (QC 4.0)": "22.5W Max",
      "Dimensions": "79 x 56 x 22 mm",
      "Weight": "165g"
    },
    costPrice: 1500
  },
  {
    id: "PRD-1784188637866",
    name: "ERHA PowerStation 20K SuperPD 65W",
    category: "Laptop Power Banks",
    price: 9999,
    salePrice: 7499,
    stock: 30,
    minStock: 5,
    status: "Active",
    shortDescription: "Heavy-duty 20,000mAh laptop-class power bank with huge 65W Power Delivery output, perfect for MacBooks and iPads.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600",
    brand: "ERHA",
    sku: "ERH-PRD-SEED-003",
    rating: 4.9,
    reviews: 67,
    badge: "Pro Choice",
    features: [
      "Massive 65W USB-C output to charge laptops at full speed",
      "Huge 20,000mAh capacity to double your laptop battery life",
      "Low current mode for AirPods and smartwatches",
      "Flame-retardant PC/ABS shell with carbon texture"
    ],
    specifications: {
      "Capacity": "20,000mAh / 74Wh",
      "USB-C Output (PD 65W)": "5V-3A / 9V-3A / 12V-3A / 15V-3A / 20V-3.25A",
      "Total Ports": "2x USB-C, 1x USB-A",
      "Dimensions": "145 x 68 x 28 mm",
      "Weight": "380g"
    },
    costPrice: 4800
  }
];

const initialCategories = [
  { id: 'cat1', name: 'Ultra Compact', slug: 'ultra-compact', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400' },
  { id: 'cat2', name: 'High Capacity', slug: 'high-capacity', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400' },
  { id: 'cat3', name: 'MagSafe & Wireless', slug: 'magsafe-wireless', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?w=400' },
  { id: 'cat4', name: 'Laptop Power Banks', slug: 'laptop-power-banks', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' },
  { id: 'cat5', name: 'Rugged & Solar', slug: 'rugged-solar', parentId: null, imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400' },
];

const initialCoupons: any[] = [];
const initialCustomers: any[] = [];
const initialAdmins = [
  {
    id: 'admin-3',
    email: 'muhammadzeeshan0477@gmail.com',
    password: 'Erha@1122',
    role: 'Super Admin',
    name: 'Muhammad Zeeshan',
    created_at: new Date().toISOString()
  }
];

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
    window.dispatchEvent(new Event('storage'));
  }
}

const LOWER_TO_CAMEL: Record<string, string> = {
  saleprice: 'salePrice',
  minstock: 'minStock',
  shortdescription: 'shortDescription',
  costprice: 'costPrice',
  parentid: 'parentId',
  imageurl: 'imageUrl',
  paymentstatus: 'paymentStatus',
  orderstatus: 'orderStatus',
  paymentmethod: 'paymentMethod',
  discountamount: 'discountAmount',
  shippingrate: 'shippingRate',
  trackingnumber: 'trackingNumber',
  totalorders: 'totalOrders',
  totalspend: 'totalSpend',
  discounttype: 'discountType',
  discountvalue: 'discountValue',
  minorder: 'minOrder',
  maxusage: 'maxUsage',
  usagecount: 'usageCount',
  orderid: 'orderId',
};

function rowToCamel(row: any): any {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
  const n: any = {};
  for (const k of Object.keys(row)) {
    const camelKey = LOWER_TO_CAMEL[k] || k;
    n[camelKey] = row[k];
  }
  return n;
}

function rowsToCamel(rows: any[]): any[] {
  if (!rows || !Array.isArray(rows)) return rows;
  return rows.map(rowToCamel);
}

function rowToLower(row: any): any {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
  const n: any = {};
  for (const k of Object.keys(row)) {
    const lowerKey = k.toLowerCase();
    n[lowerKey] = row[k];
  }
  return n;
}

export const db = {
  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  getProducts: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.PRODUCTS, initialProducts);
    
    // Priority 1: Hostinger MySQL via Server Function
    try {
      const mysqlRes = await fetchProductsServerFn();
      if (mysqlRes.success && mysqlRes.data && mysqlRes.data.length > 0) {
        setStorage(KEYS.PRODUCTS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL products sync:", e);
    }

    // Priority 2: Supabase Fallback
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setStorage(KEYS.PRODUCTS, rowsToCamel(data));
          }
        })
        .catch((e) => console.warn("Supabase background sync:", e));
    }

    return getStorage(KEYS.PRODUCTS, cached);
  },

  getProduct: async (id: string): Promise<any | null> => {
    const products = await db.getProducts();
    return products.find((p: any) => p && p.id && String(p.id).trim().toLowerCase() === String(id).trim().toLowerCase()) || null;
  },

  saveProduct: async (p: any): Promise<void> => {
    const products = getStorage(KEYS.PRODUCTS, initialProducts);
    const idx = products.findIndex((x) => x.id === p.id);
    if (idx >= 0) products[idx] = { ...products[idx], ...p };
    else products.push(p);
    setStorage(KEYS.PRODUCTS, products);

    // Save to Hostinger MySQL
    try {
      const mysqlRes = await saveProductServerFn({ data: p });
      if (mysqlRes.success) return;
    } catch (e) {
      console.warn("Hostinger MySQL saveProduct exception:", e);
    }

    // Fallback to Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').upsert(rowToLower(p));
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    const products = getStorage(KEYS.PRODUCTS, []);
    const updated = products.filter((x: any) => String(x.id) !== String(id));
    setStorage(KEYS.PRODUCTS, updated);

    // Hostinger MySQL
    try {
      await deleteProductServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteProduct exception:", e);
    }

    // Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('erha_products_update'));
    }
  },

  // ─── CATEGORIES ────────────────────────────────────────────────────────────
  getCategories: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.CATEGORIES, initialCategories);

    try {
      const mysqlRes = await fetchCategoriesServerFn();
      if (mysqlRes.success && mysqlRes.data && mysqlRes.data.length > 0) {
        setStorage(KEYS.CATEGORIES, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getCategories error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          setStorage(KEYS.CATEGORIES, rowsToCamel(data));
        }
      } catch (e) {
        console.warn("Supabase getCategories error:", e);
      }
    }

    return getStorage(KEYS.CATEGORIES, cached);
  },

  saveCategory: async (c: any): Promise<void> => {
    const cats = getStorage(KEYS.CATEGORIES, initialCategories);
    const idx = cats.findIndex((x) => x.id === c.id);
    if (idx >= 0) cats[idx] = c;
    else cats.push(c);
    setStorage(KEYS.CATEGORIES, cats);

    try {
      await saveCategoryServerFn({ data: c });
    } catch (e) {
      console.warn("Hostinger MySQL saveCategory exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').upsert(rowToLower(c));
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    const cats = getStorage(KEYS.CATEGORIES, initialCategories);
    const updated = cats.filter((x) => x.id !== id);
    setStorage(KEYS.CATEGORIES, updated);

    try {
      await deleteCategoryServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteCategory exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
  },

  // ─── ORDERS ────────────────────────────────────────────────────────────────
  getOrders: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.ORDERS, initialOrders);

    try {
      const mysqlRes = await fetchOrdersServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.ORDERS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getOrders error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setStorage(KEYS.ORDERS, rowsToCamel(data));
          }
        })
        .catch((e) => console.warn("Supabase orders background sync:", e));
    }

    return getStorage(KEYS.ORDERS, cached);
  },

  createOrder: async (orderData: {
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
  }): Promise<any> => {
    const orders = getStorage(KEYS.ORDERS, initialOrders);
    const orderNum = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;

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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('erha_orders_update'));
    }

    // Hostinger MySQL Order Placement
    try {
      await createOrderServerFn({ data: newOrder });
      
      // Save/update customer in Hostinger MySQL
      const custId = `CUST-${Date.now()}`;
      await saveCustomerServerFn({
        data: {
          id: custId,
          name: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          totalOrders: 1,
          totalSpend: orderData.total,
          notes: orderData.notes || 'Added from web checkout',
          status: 'Active'
        }
      });
    } catch (e) {
      console.warn("Hostinger MySQL createOrder exception:", e);
    }

    // Supabase Fallback
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert(rowToLower(newOrder)).then(() => {}).catch(() => {});
    }

    return newOrder;
  },

  updateOrderStatus: async (id: string, status: string): Promise<void> => {
    const orders = getStorage(KEYS.ORDERS, initialOrders);
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      orders[idx].orderStatus = status;
      setStorage(KEYS.ORDERS, orders);
      try {
        await createOrderServerFn({ data: orders[idx] });
      } catch (e) {
        console.warn("Hostinger MySQL updateOrderStatus error:", e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update(rowToLower({ orderStatus: status })).eq('id', id);
    }
  },

  updateOrderPaymentStatus: async (id: string, payStatus: string): Promise<void> => {
    const orders = getStorage(KEYS.ORDERS, initialOrders);
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      orders[idx].paymentStatus = payStatus;
      setStorage(KEYS.ORDERS, orders);
      try {
        await createOrderServerFn({ data: orders[idx] });
      } catch (e) {
        console.warn("Hostinger MySQL updateOrderPaymentStatus error:", e);
      }
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update(rowToLower({ paymentStatus: payStatus })).eq('id', id);
    }
  },

  deleteOrder: async (id: string): Promise<void> => {
    const orders = getStorage(KEYS.ORDERS, []);
    const updated = orders.filter((x: any) => String(x.id) !== String(id));
    setStorage(KEYS.ORDERS, updated);

    try {
      await deleteOrderServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteOrder error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').delete().eq('id', id);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('erha_orders_update'));
    }
  },

  // ─── CUSTOMERS ─────────────────────────────────────────────────────────────
  getCustomers: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.CUSTOMERS, initialCustomers);

    try {
      const mysqlRes = await fetchCustomersServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.CUSTOMERS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getCustomers error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (!error && data) return rowsToCamel(data);
    }

    return cached;
  },

  saveCustomer: async (c: any): Promise<void> => {
    const custs = getStorage(KEYS.CUSTOMERS, initialCustomers);
    const idx = custs.findIndex((x) => x.id === c.id);
    if (idx >= 0) custs[idx] = c;
    else custs.push(c);
    setStorage(KEYS.CUSTOMERS, custs);

    try {
      await saveCustomerServerFn({ data: c });
    } catch (e) {
      console.warn("Hostinger MySQL saveCustomer exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('customers').upsert(rowToLower(c));
    }
  },

  deleteCustomer: async (id: string): Promise<void> => {
    const custs = getStorage(KEYS.CUSTOMERS, []);
    const updated = custs.filter((x: any) => String(x.id) !== String(id));
    setStorage(KEYS.CUSTOMERS, updated);

    try {
      await deleteCustomerServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteCustomer exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('customers').delete().eq('id', id);
    }
  },

  // ─── COUPONS ───────────────────────────────────────────────────────────────
  getCoupons: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.COUPONS, initialCoupons);

    try {
      const mysqlRes = await fetchCouponsServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.COUPONS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getCoupons error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (!error && data) return rowsToCamel(data);
    }

    return cached;
  },

  saveCoupon: async (c: any): Promise<void> => {
    const coupons = getStorage(KEYS.COUPONS, initialCoupons);
    const idx = coupons.findIndex((x) => x.id === c.id);
    if (idx >= 0) coupons[idx] = c;
    else coupons.push(c);
    setStorage(KEYS.COUPONS, coupons);

    try {
      await saveCouponServerFn({ data: c });
    } catch (e) {
      console.warn("Hostinger MySQL saveCoupon exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('coupons').upsert(rowToLower(c));
    }
  },

  deleteCoupon: async (id: string): Promise<void> => {
    const coupons = getStorage(KEYS.COUPONS, initialCoupons);
    const updated = coupons.filter((x) => x.id !== id);
    setStorage(KEYS.COUPONS, updated);

    try {
      await deleteCouponServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteCoupon exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('coupons').delete().eq('id', id);
    }
  },

  validateCoupon: async (code: string, orderAmount: number): Promise<{ valid: boolean; coupon?: any; message?: string }> => {
    const coupons = await db.getCoupons();
    const codeUpper = code.toUpperCase().trim();
    const c = coupons.find((x) => String(x.code).toUpperCase() === codeUpper && x.status === 'Active');
    
    if (!c) return { valid: false, message: 'Invalid or inactive discount coupon code.' };
    if (new Date(c.expiry) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }
    if (orderAmount < (c.minOrder || 0)) {
      return { valid: false, message: `Minimum order amount of Rs. ${Number(c.minOrder).toLocaleString()} required.` };
    }
    if (c.maxUsage && (c.usageCount || 0) >= c.maxUsage) {
      return { valid: false, message: 'This coupon usage limit has been reached.' };
    }
    return { valid: true, coupon: c };
  },

  // ─── EXPENSES ──────────────────────────────────────────────────────────────
  getExpenses: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.EXPENSES, initialExpenses);

    try {
      const mysqlRes = await fetchExpensesServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.EXPENSES, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getExpenses error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (!error && data) return rowsToCamel(data);
    }

    return cached;
  },

  createExpense: async (exp: { category: string; amount: number; description: string; date: string }): Promise<any> => {
    const expenses = getStorage(KEYS.EXPENSES, initialExpenses);
    const id = `EXP-${String(expenses.length + 1).padStart(3, '0')}`;
    const newExp = { id, ...exp };
    expenses.unshift(newExp);
    setStorage(KEYS.EXPENSES, expenses);

    try {
      await saveExpenseServerFn({ data: newExp });
    } catch (e) {
      console.warn("Hostinger MySQL saveExpense exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('expenses').insert(rowToLower(newExp));
    }

    return newExp;
  },

  // ─── PAYMENTS ──────────────────────────────────────────────────────────────
  getPayments: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.PAYMENTS, initialPayments);

    try {
      const mysqlRes = await fetchPaymentsServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.PAYMENTS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getPayments error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (!error && data) return rowsToCamel(data);
    }

    return cached;
  },

  createPayment: async (pmt: { orderId: string; method: string; amount: number; status: string; reference: string }): Promise<any> => {
    const payments = getStorage(KEYS.PAYMENTS, initialPayments);
    const id = `PMT-${String(payments.length + 1).padStart(3, '0')}`;
    const newPmt = {
      id,
      ...pmt,
      date: new Date().toISOString().split('T')[0]
    };
    payments.unshift(newPmt);
    setStorage(KEYS.PAYMENTS, payments);

    try {
      await savePaymentServerFn({ data: newPmt });
    } catch (e) {
      console.warn("Hostinger MySQL savePayment exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('payments').insert(rowToLower(newPmt));
    }

    return newPmt;
  },

  // ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
  getNotifications: async (): Promise<any[]> => {
    const cached = getStorage(KEYS.NOTIFICATIONS, initialNotifications);

    try {
      const mysqlRes = await fetchNotificationsServerFn();
      if (mysqlRes.success && mysqlRes.data) {
        setStorage(KEYS.NOTIFICATIONS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getNotifications error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(30);
      if (!error && data) return rowsToCamel(data);
    }

    return cached;
  },

  createNotification: async (notif: { type: string; title: string; description: string }): Promise<any> => {
    const newNotif = {
      id: `N${Date.now()}`,
      read: false,
      time: new Date().toISOString(),
      ...notif
    };
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    list.unshift(newNotif);
    setStorage(KEYS.NOTIFICATIONS, list.slice(0, 30));

    try {
      await addNotificationServerFn({ data: newNotif });
    } catch (e) {
      console.warn("Hostinger MySQL addNotification exception:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').insert(rowToLower(newNotif));
    }

    return newNotif;
  },

  markAllNotificationsRead: async (): Promise<void> => {
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.map((n) => ({ ...n, read: true }));
    setStorage(KEYS.NOTIFICATIONS, updated);

    try {
      await markNotificationReadServerFn({ data: {} });
    } catch (e) {
      console.warn("Hostinger MySQL markNotificationRead error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
    }
  },

  dismissNotification: async (id: string): Promise<void> => {
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.filter((n) => n.id !== id);
    setStorage(KEYS.NOTIFICATIONS, updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').delete().eq('id', id);
    }
  },

  clearAllNotifications: async (): Promise<void> => {
    setStorage(KEYS.NOTIFICATIONS, []);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').delete().neq('id', '_none_');
    }
  },

  // ─── ADMIN AUTH & MANAGEMENT ───────────────────────────────────────────────
  loginAdmin: async (email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    const checkEmail = email.trim().toLowerCase();
    const inputHash = await hashPassword(password);
    
    // Priority 1: Hostinger MySQL Verification
    try {
      const mysqlRes = await verifyAdminServerFn({ data: { email: checkEmail, passwordHash: inputHash } });
      if (mysqlRes.success && mysqlRes.admin) {
        return { success: true, user: mysqlRes.admin };
      }
    } catch (e) {
      console.warn("Hostinger MySQL verifyAdmin exception:", e);
    }

    // Priority 2: Supabase Auth / Profile Fallback
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: checkEmail,
          password: password
        });

        if (!authError && authData.user) {
          return {
            success: true,
            user: {
              email: authData.user.email,
              role: authData.user.user_metadata?.role || 'Super Admin',
              name: authData.user.user_metadata?.name || 'Admin User'
            }
          };
        }
      } catch (authErr) {
        console.error('Supabase Auth sign-in failed:', authErr);
      }

      const { data } = await supabase
        .from('admins')
        .select('*')
        .eq('email', checkEmail)
        .maybeSingle();

      if (data && (data.password === password || data.password === inputHash)) {
        return { success: true, user: rowToCamel(data) };
      }
    }

    // Local Storage Fallback
    const admins = getStorage(KEYS.ADMINS, initialAdmins);
    const matched = admins.find((a) => a.email.toLowerCase() === checkEmail);
    if (matched && (matched.password === password || matched.password === inputHash)) {
      return { success: true, user: { email: matched.email, role: matched.role || 'Super Admin', name: matched.name || 'Admin User' } };
    }

    return { success: false, message: 'Invalid email or password. Please try again.' };
  },

  logoutAdmin: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  signupAdmin: async (adminData: { name: string; email: string; password: string; role: 'Super Admin' | 'Manager' | 'Staff' }): Promise<{ success: boolean; message?: string }> => {
    const checkEmail = adminData.email.trim().toLowerCase();
    const hashedPassword = await hashPassword(adminData.password);
    const newAdmin = {
      id: `admin-${Date.now()}`,
      email: checkEmail,
      password: hashedPassword,
      role: adminData.role,
      name: adminData.name,
      created_at: new Date().toISOString()
    };

    // Save to Hostinger MySQL
    try {
      await saveAdminServerFn({ data: newAdmin });
    } catch (e) {
      console.warn("Hostinger MySQL saveAdmin exception:", e);
    }

    // Save to Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('admins').insert(rowToLower(newAdmin));
    }

    // Save to Local Storage
    const admins = getStorage(KEYS.ADMINS, initialAdmins);
    admins.push(newAdmin);
    setStorage(KEYS.ADMINS, admins);

    return { success: true };
  },

  changeAdminPassword: async (email: string, currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    const checkEmail = email.trim().toLowerCase();
    const newHash = await hashPassword(newPass);

    const loginRes = await db.loginAdmin(checkEmail, currentPass);
    if (!loginRes.success) {
      return { success: false, message: 'Incorrect current password.' };
    }

    // Update in Hostinger MySQL
    try {
      await saveAdminServerFn({
        data: {
          id: loginRes.user?.id || `admin-${Date.now()}`,
          email: checkEmail,
          password: newHash,
          role: loginRes.user?.role || 'Super Admin',
          name: loginRes.user?.name || 'Admin'
        }
      });
    } catch (e) {
      console.warn("Hostinger MySQL update password exception:", e);
    }

    // Update in Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('admins').update({ password: newHash }).eq('email', checkEmail);
    }

    // Update in Local Storage
    const admins = getStorage(KEYS.ADMINS, initialAdmins);
    const idx = admins.findIndex((a) => a.email.toLowerCase() === checkEmail);
    if (idx >= 0) {
      admins[idx].password = newHash;
      setStorage(KEYS.ADMINS, admins);
    }

    return { success: true };
  },

  changeAdminEmail: async (oldEmail: string, newEmail: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const checkOld = oldEmail.trim().toLowerCase();
    const checkNew = newEmail.trim().toLowerCase();

    const loginRes = await db.loginAdmin(checkOld, pass);
    if (!loginRes.success) {
      return { success: false, message: 'Incorrect password verification.' };
    }

    // Update Hostinger MySQL
    try {
      await saveAdminServerFn({
        data: {
          id: loginRes.user?.id || `admin-${Date.now()}`,
          email: checkNew,
          password: loginRes.user?.password || pass,
          role: loginRes.user?.role || 'Super Admin',
          name: loginRes.user?.name || 'Admin'
        }
      });
      await deleteAdminServerFn({ data: { id: loginRes.user?.id } });
    } catch (e) {
      console.warn("Hostinger MySQL email change exception:", e);
    }

    // Update Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('admins').update(rowToLower({ email: checkNew })).eq('email', checkOld);
    }

    // Local Storage
    const admins = getStorage(KEYS.ADMINS, initialAdmins);
    const idx = admins.findIndex((a) => a.email.toLowerCase() === checkOld);
    if (idx >= 0) {
      admins[idx].email = checkNew;
      setStorage(KEYS.ADMINS, admins);
    }

    return { success: true };
  },

  clearAllOrdersAndCustomers: async (): Promise<void> => {
    setStorage(KEYS.ORDERS, []);
    setStorage(KEYS.CUSTOMERS, []);
    setStorage(KEYS.PAYMENTS, []);
    setStorage(KEYS.NOTIFICATIONS, []);

    try {
      await clearAllOrdersServerFn();
    } catch (e) {
      console.warn("Hostinger MySQL clearAllOrders error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('payments').delete().neq('id', '_none_');
      await supabase.from('orders').delete().neq('id', '_none_');
      await supabase.from('customers').delete().neq('id', '_none_');
      await supabase.from('notifications').delete().neq('id', '_none_');
    }
  },

  // ─── ROLES ─────────────────────────────────────────────────────────────────
  getUserRole: () => getStorage(KEYS.USER_ROLE, 'Super Admin'),
  setUserRole: (role: 'Super Admin' | 'Manager' | 'Staff') => {
    setStorage(KEYS.USER_ROLE, role);
  }
};

// Aliased export for backward compatibility
export const dbData = db;
