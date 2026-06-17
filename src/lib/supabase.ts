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
  getProducts: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getProducts error:', error);
    }
    return getStorage(KEYS.PRODUCTS, initialProducts);
  },
  saveProduct: async (p: any): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').upsert(p);
      if (!error) return;
      console.error('Supabase saveProduct error:', error);
    }
    const products = getStorage(KEYS.PRODUCTS, initialProducts);
    const idx = products.findIndex((x) => x.id === p.id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...p };
    } else {
      products.push(p);
    }
    setStorage(KEYS.PRODUCTS, products);
  },
  deleteProduct: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return;
      console.error('Supabase deleteProduct error:', error);
    }
    const products = getStorage(KEYS.PRODUCTS, initialProducts);
    const updated = products.filter((x) => x.id !== id);
    setStorage(KEYS.PRODUCTS, updated);
  },

  // CATEGORIES
  getCategories: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (!error && data) return data;
      console.error('Supabase getCategories error:', error);
    }
    return getStorage(KEYS.CATEGORIES, initialCategories);
  },
  saveCategory: async (c: any): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').upsert(c);
      if (!error) return;
      console.error('Supabase saveCategory error:', error);
    }
    const cats = getStorage(KEYS.CATEGORIES, initialCategories);
    const idx = cats.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      cats[idx] = c;
    } else {
      cats.push(c);
    }
    setStorage(KEYS.CATEGORIES, cats);
  },
  deleteCategory: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return;
      console.error('Supabase deleteCategory error:', error);
    }
    const cats = getStorage(KEYS.CATEGORIES, initialCategories);
    const updated = cats.filter((x) => x.id !== id);
    setStorage(KEYS.CATEGORIES, updated);
  },

  // ORDERS
  getOrders: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getOrders error:', error);
    }
    return getStorage(KEYS.ORDERS, initialOrders);
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
    if (isSupabaseConfigured && supabase) {
      try {
        const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const orderNum = `ORD-2026-${String((count || 0) + 1).padStart(3, '0')}`;

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

        const { error: orderErr } = await supabase.from('orders').insert(newOrder);
        if (orderErr) throw orderErr;

        // Decrement stock in Supabase for each item
        for (const item of orderData.items) {
          const { data: p } = await supabase.from('products').select('*').or(`id.eq.${item.id},name.eq.${item.name}`).maybeSingle();
          if (p) {
            const newStock = Math.max(0, p.stock - item.quantity);
            let newStatus = p.status;
            if (newStock === 0) {
              newStatus = 'Out of Stock';
              await db.createNotification({
                type: 'stock',
                title: 'Out of Stock Alert',
                description: `${p.name} is now completely out of stock!`
              });
            } else if (newStock < p.minStock) {
              await db.createNotification({
                type: 'stock',
                title: 'Low Stock Alert',
                description: `${p.name} has only ${newStock} units remaining.`
              });
            }
            await supabase.from('products').update({ stock: newStock, status: newStatus }).eq('id', p.id);
          }
        }

        // Register Customer spendings
        const { data: cust } = await supabase.from('customers').select('*').eq('email', orderData.email).maybeSingle();
        if (cust) {
          await supabase.from('customers').update({
            totalOrders: cust.totalOrders + 1,
            totalSpend: cust.totalSpend + orderData.total,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city
          }).eq('id', cust.id);
        } else {
          const { count: custCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
          const custId = `CUST-${String((custCount || 0) + 1).padStart(3, '0')}`;
          await supabase.from('customers').insert({
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
          });
        }

        // Create Payment if already Paid
        if (newOrder.paymentStatus === 'Paid') {
          await db.createPayment({
            orderId: orderNum,
            method: orderData.paymentMethod,
            amount: orderData.total,
            status: 'Paid',
            reference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
          });
        }

        // Trigger new order notification
        await db.createNotification({
          type: 'order',
          title: 'New Order Received',
          description: `${orderNum} from ${orderData.customerName} — Rs. ${orderData.total.toLocaleString()}`
        });

        return newOrder;
      } catch (err) {
        console.error('Supabase createOrder error, falling back:', err);
      }
    }

    // Fallback to Local Storage
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

    const products = getStorage(KEYS.PRODUCTS, initialProducts);
    orderData.items.forEach((item) => {
      const p = products.find((x) => x.id === item.id || x.name === item.name);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        if (p.stock === 0) {
          p.status = 'Out of Stock';
          db.createNotification({
            type: 'stock',
            title: 'Out of Stock Alert',
            description: `${p.name} is now completely out of stock!`
          });
        } else if (p.stock < p.minStock) {
          db.createNotification({
            type: 'stock',
            title: 'Low Stock Alert',
            description: `${p.name} has only ${p.stock} units remaining.`
          });
        }
        db.saveProduct(p);
      }
    });

    const customers = getStorage(KEYS.CUSTOMERS, initialCustomers);
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

    if (newOrder.paymentStatus === 'Paid') {
      db.createPayment({
        orderId: orderNum,
        method: orderData.paymentMethod,
        amount: orderData.total,
        status: 'Paid',
        reference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
      });
    }

    db.createNotification({
      type: 'order',
      title: 'New Order Received',
      description: `${orderNum} from ${orderData.customerName} — Rs. ${orderData.total.toLocaleString()}`
    });

    return newOrder;
  },
  updateOrderStatus: async (id: string, status: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('orders').update({ orderStatus: status }).eq('id', id);
      if (!error) return;
      console.error('Supabase updateOrderStatus error:', error);
    }
    const orders = getStorage(KEYS.ORDERS, initialOrders);
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      orders[idx].orderStatus = status;
      setStorage(KEYS.ORDERS, orders);
    }
  },
  updateOrderPaymentStatus: async (id: string, payStatus: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').update({ paymentStatus: payStatus }).eq('id', id);
        if (error) throw error;

        const { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
        if (order) {
          const { data: pmt } = await supabase.from('payments').select('*').eq('orderId', id).maybeSingle();
          if (pmt) {
            await supabase.from('payments').update({ status: payStatus }).eq('orderId', id);
          } else if (payStatus === 'Paid') {
            await db.createPayment({
              orderId: id,
              method: order.paymentMethod || 'COD',
              amount: order.total || 0,
              status: 'Paid',
              reference: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
            });
          }
        }
        return;
      } catch (err) {
        console.error('Supabase updateOrderPaymentStatus error, falling back:', err);
      }
    }
    const orders = getStorage(KEYS.ORDERS, initialOrders);
    const idx = orders.findIndex((x) => x.id === id);
    if (idx >= 0) {
      const order = orders[idx];
      order.paymentStatus = payStatus;
      setStorage(KEYS.ORDERS, orders);

      const payments = getStorage(KEYS.PAYMENTS, initialPayments);
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
  getCustomers: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getCustomers error:', error);
    }
    return getStorage(KEYS.CUSTOMERS, initialCustomers);
  },
  saveCustomer: async (c: any): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('customers').upsert(c);
      if (!error) return;
      console.error('Supabase saveCustomer error:', error);
    }
    const custs = getStorage(KEYS.CUSTOMERS, initialCustomers);
    const idx = custs.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      custs[idx] = c;
    } else {
      custs.push(c);
    }
    setStorage(KEYS.CUSTOMERS, custs);
  },

  // COUPONS
  getCoupons: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getCoupons error:', error);
    }
    return getStorage(KEYS.COUPONS, initialCoupons);
  },
  saveCoupon: async (c: any): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('coupons').upsert(c);
      if (!error) return;
      console.error('Supabase saveCoupon error:', error);
    }
    const coupons = getStorage(KEYS.COUPONS, initialCoupons);
    const idx = coupons.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      coupons[idx] = c;
    } else {
      coupons.push(c);
    }
    setStorage(KEYS.COUPONS, coupons);
  },
  deleteCoupon: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (!error) return;
      console.error('Supabase deleteCoupon error:', error);
    }
    const coupons = getStorage(KEYS.COUPONS, initialCoupons);
    const updated = coupons.filter((x) => x.id !== id);
    setStorage(KEYS.COUPONS, updated);
  },
  validateCoupon: async (code: string, orderAmount: number): Promise<{ valid: boolean; coupon?: any; message?: string }> => {
    const codeUpper = code.toUpperCase().trim();
    if (isSupabaseConfigured && supabase) {
      const { data: c, error } = await supabase.from('coupons').select('*').eq('code', codeUpper).eq('status', 'Active').maybeSingle();
      if (!error && c) {
        if (new Date(c.expiry) < new Date()) {
          return { valid: false, message: 'This coupon has expired.' };
        }
        if (orderAmount < c.minOrder) {
          return { valid: false, message: `Minimum order amount of Rs. ${c.minOrder.toLocaleString()} required.` };
        }
        if (c.maxUsage && c.usageCount >= c.maxUsage) {
          return { valid: false, message: 'This coupon usage limit has been reached.' };
        }
        return { valid: true, coupon: c };
      }
      return { valid: false, message: 'Invalid or inactive discount coupon code.' };
    }
    const coupons = getStorage(KEYS.COUPONS, initialCoupons);
    const c = coupons.find((x) => x.code.toUpperCase() === codeUpper && x.status === 'Active');
    if (!c) return { valid: false, message: 'Invalid or inactive discount coupon code.' };
    if (new Date(c.expiry) < new Date()) {
      return { valid: false, message: 'This coupon has expired.' };
    }
    if (orderAmount < c.minOrder) {
      return { valid: false, message: `Minimum order amount of Rs. ${c.minOrder.toLocaleString()} required.` };
    }
    if (c.maxUsage && c.usageCount >= c.maxUsage) {
      return { valid: false, message: 'This coupon usage limit has been reached.' };
    }
    return { valid: true, coupon: c };
  },

  // EXPENSES
  getExpenses: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getExpenses error:', error);
    }
    return getStorage(KEYS.EXPENSES, initialExpenses);
  },
  createExpense: async (exp: { category: string; amount: number; description: string; date: string }): Promise<any> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { count } = await supabase.from('expenses').select('*', { count: 'exact', head: true });
        const id = `EXP-${String((count || 0) + 1).padStart(3, '0')}`;
        const newExp = { id, ...exp };
        const { error } = await supabase.from('expenses').insert(newExp);
        if (!error) return newExp;
        console.error('Supabase createExpense error:', error);
      } catch (err) {
        console.error('Supabase createExpense catch error:', err);
      }
    }
    const expenses = getStorage(KEYS.EXPENSES, initialExpenses);
    const newExp = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      ...exp
    };
    expenses.unshift(newExp);
    setStorage(KEYS.EXPENSES, expenses);
    return newExp;
  },

  // PAYMENTS
  getPayments: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase getPayments error:', error);
    }
    return getStorage(KEYS.PAYMENTS, initialPayments);
  },
  createPayment: async (pmt: { orderId: string; method: string; amount: number; status: string; reference: string }): Promise<any> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { count } = await supabase.from('payments').select('*', { count: 'exact', head: true });
        const id = `PMT-${String((count || 0) + 1).padStart(3, '0')}`;
        const newPmt = {
          id,
          ...pmt,
          date: new Date().toISOString().split('T')[0]
        };
        const { error } = await supabase.from('payments').insert(newPmt);
        if (!error) return newPmt;
        console.error('Supabase createPayment error:', error);
      } catch (err) {
        console.error('Supabase createPayment catch error:', err);
      }
    }
    const payments = getStorage(KEYS.PAYMENTS, initialPayments);
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
  getNotifications: async (): Promise<any[]> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(30);
      if (!error && data) return data;
      console.error('Supabase getNotifications error:', error);
    }
    return getStorage(KEYS.NOTIFICATIONS, initialNotifications);
  },
  createNotification: async (notif: { type: string; title: string; description: string }): Promise<any> => {
    if (isSupabaseConfigured && supabase) {
      const newNotif = {
        id: `N${Date.now()}`,
        read: false,
        time: new Date().toISOString(),
        ...notif
      };
      const { error } = await supabase.from('notifications').insert(newNotif);
      if (!error) return newNotif;
      console.error('Supabase createNotification error:', error);
    }
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
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
  markAllNotificationsRead: async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
      if (!error) return;
      console.error('Supabase markAllNotificationsRead error:', error);
    }
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.map((n) => ({ ...n, read: true }));
    setStorage(KEYS.NOTIFICATIONS, updated);
  },
  dismissNotification: async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (!error) return;
      console.error('Supabase dismissNotification error:', error);
    }
    const list = getStorage(KEYS.NOTIFICATIONS, initialNotifications);
    const updated = list.filter((n) => n.id !== id);
    setStorage(KEYS.NOTIFICATIONS, updated);
  },

  // ADMIN AUTH
  loginAdmin: async (email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase admin login error:', error);
        return { success: false, message: 'Database connection error.' };
      }
      if (data) {
        return { success: true, user: data };
      }
      return { success: false, message: 'Invalid email or password.' };
    }
    
    // Fallback to local storage / static credentials
    const validEmail = 'admin@erha.pk';
    const validEmail2 = 'erhatradelinkinternational@gmail.com';
    const validPassword = 'admin';
    const validPassword2 = 'admin123';
    const checkEmail = email.trim().toLowerCase();
    
    if (
      (checkEmail === validEmail || checkEmail === validEmail2) && 
      (password === validPassword || password === validPassword2)
    ) {
      return { success: true, user: { email: checkEmail, role: 'Super Admin', name: 'Admin User' } };
    }
    return { success: false, message: 'Invalid email or password. Please try again.' };
  },

  // ROLES
  getUserRole: () => getStorage(KEYS.USER_ROLE, 'Super Admin'),
  setUserRole: (role: 'Super Admin' | 'Manager' | 'Staff') => {
    setStorage(KEYS.USER_ROLE, role);
  }
};
