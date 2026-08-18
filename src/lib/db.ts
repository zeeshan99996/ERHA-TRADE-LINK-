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

// ─── PASSWORD HASHING HELPER ──────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── LOCAL STORAGE KEYS ───────────────────────────────────────────────────────
const KEYS = {
  PRODUCTS: 'erha_products_v7',
  CATEGORIES: 'erha_categories_v3',
  ORDERS: 'erha_orders_v3',
  CUSTOMERS: 'erha_customers_v3',
  COUPONS: 'erha_coupons_v3',
  EXPENSES: 'erha_expenses_v3',
  PAYMENTS: 'erha_payments_v3',
  NOTIFICATIONS: 'erha_notifications_v3',
  USER_ROLE: 'erha_user_role',
  ADMINS: 'erha_admins_local_v3',
};

import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from "./server-store";

const initialProducts: any[] = [...DEFAULT_PRODUCTS];
const initialCategories: any[] = [...DEFAULT_CATEGORIES];

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

export const db = {
  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  getProducts: async (): Promise<any[]> => {
    try {
      const mysqlRes = await fetchProductsServerFn();
      if (mysqlRes.success && Array.isArray(mysqlRes.data)) {
        setStorage(KEYS.PRODUCTS, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL products sync:", e);
    }
    const cached = getStorage(KEYS.PRODUCTS, initialProducts);
    return cached;
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

    try {
      await saveProductServerFn({ data: p });
    } catch (e) {
      console.warn("Hostinger MySQL saveProduct exception:", e);
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    const targetId = String(id).trim().toLowerCase();
    const products = getStorage(KEYS.PRODUCTS, initialProducts);
    const updated = products.filter((x: any) => x && String(x.id).trim().toLowerCase() !== targetId);
    setStorage(KEYS.PRODUCTS, updated);

    try {
      await deleteProductServerFn({ data: { id } });
    } catch (e) {
      console.warn("Hostinger MySQL deleteProduct exception:", e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('erha_products_update'));
    }
  },

  // ─── CATEGORIES ────────────────────────────────────────────────────────────
  getCategories: async (): Promise<any[]> => {
    try {
      const mysqlRes = await fetchCategoriesServerFn();
      if (mysqlRes.success && Array.isArray(mysqlRes.data)) {
        setStorage(KEYS.CATEGORIES, mysqlRes.data);
        return mysqlRes.data;
      }
    } catch (e) {
      console.warn("Hostinger MySQL getCategories error:", e);
    }
    const cached = getStorage(KEYS.CATEGORIES, initialCategories);
    return cached;
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

    try {
      await createOrderServerFn({ data: newOrder });
      
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
  },

  dismissNotification: async (id: string): Promise<void> => {
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.filter((n) => n.id !== id);
    setStorage(KEYS.NOTIFICATIONS, updated);
  },

  clearAllNotifications: async (): Promise<void> => {
    setStorage(KEYS.NOTIFICATIONS, []);
  },

  // ─── ADMIN AUTH & MANAGEMENT ───────────────────────────────────────────────
  loginAdmin: async (email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    const checkEmail = email.trim().toLowerCase();
    const inputHash = await hashPassword(password);
    
    try {
      const mysqlRes = await verifyAdminServerFn({ data: { email: checkEmail, passwordHash: inputHash } });
      if (mysqlRes.success && mysqlRes.admin) {
        return { success: true, user: mysqlRes.admin };
      }
    } catch (e) {
      console.warn("Hostinger MySQL verifyAdmin exception:", e);
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
    // Admin session state cleanup if needed
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

    try {
      await saveAdminServerFn({ data: newAdmin });
    } catch (e) {
      console.warn("Hostinger MySQL saveAdmin exception:", e);
    }

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
  },

  // ─── ROLES ─────────────────────────────────────────────────────────────────
  getUserRole: () => getStorage(KEYS.USER_ROLE, 'Super Admin'),
  setUserRole: (role: 'Super Admin' | 'Manager' | 'Staff') => {
    setStorage(KEYS.USER_ROLE, role);
  }
};

export const dbData = db;
