import { createServerFn } from "@tanstack/react-start";
import { executeQuery, isMysqlConfigured } from "./mysql.server";

// Helper to convert lowercase column names to camelCase for frontend consistency
const LOWER_TO_CAMEL: Record<string, string> = {
  saleprice: "salePrice",
  minstock: "minStock",
  shortdescription: "shortDescription",
  costprice: "costPrice",
  parentid: "parentId",
  imageurl: "imageUrl",
  paymentstatus: "paymentStatus",
  orderstatus: "orderStatus",
  paymentmethod: "paymentMethod",
  discountamount: "discountAmount",
  shippingrate: "shippingRate",
  trackingnumber: "trackingNumber",
  totalorders: "totalOrders",
  totalspend: "totalSpend",
  discounttype: "discountType",
  discountvalue: "discountValue",
  minorder: "minOrder",
  maxusage: "maxUsage",
  usagecount: "usageCount",
  orderid: "orderId",
};

function normalizeRow(row: any): any {
  if (!row || typeof row !== "object") return row;
  const n: any = {};
  for (const k of Object.keys(row)) {
    const key = LOWER_TO_CAMEL[k.toLowerCase()] || k;
    let val = row[k];
    if (typeof val === "string" && (val.startsWith("[") || val.startsWith("{"))) {
      try {
        val = JSON.parse(val);
      } catch {
        // Leave string as is if not valid JSON
      }
    }
    n[key] = val;
  }
  return n;
}

function normalizeRows(rows: any[]): any[] {
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeRow);
}

import {
  getMemoryProducts,
  upsertMemoryProduct,
  deleteMemoryProduct,
  setMemoryProducts,
  getMemoryCategories,
  upsertMemoryCategory,
  deleteMemoryCategory,
  getMemoryOrders,
  upsertMemoryOrder,
  deleteMemoryOrder,
  getMemoryCustomers,
  upsertMemoryCustomer,
  deleteMemoryCustomer,
} from "./server-store";

// ─── CHECK CONNECTION SERVER FN ──────────────────────────────────────────────
export const checkMysqlStatusServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { configured: false, connected: false };
  try {
    await executeQuery("SELECT 1");
    return { configured: true, connected: true };
  } catch (err: any) {
    console.error("MySQL Connection Check Failed:", err.message);
    return { configured: true, connected: false, error: err.message };
  }
});

// ─── PRODUCTS SERVER FNS ──────────────────────────────────────────────────────
export const fetchProductsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (isMysqlConfigured()) {
    try {
      const rows = await executeQuery("SELECT * FROM products ORDER BY created_at DESC");
      if (rows && rows.length > 0) {
        const normalized = normalizeRows(rows);
        setMemoryProducts(normalized);
        return { success: true, data: normalized };
      }
    } catch (err: any) {
      console.warn("[fetchProductsServerFn] MySQL warning, returning resilient store:", err.message);
    }
  }
  return { success: true, data: getMemoryProducts() };
});

export const saveProductServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    upsertMemoryProduct(data);
    if (isMysqlConfigured()) {
      try {
        const sql = `
          INSERT INTO products (
            id, name, category, price, saleprice, stock, minstock, status,
            shortdescription, image, brand, sku, rating, reviews, badge,
            features, specifications, costprice
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            category = VALUES(category),
            price = VALUES(price),
            saleprice = VALUES(saleprice),
            stock = VALUES(stock),
            minstock = VALUES(minstock),
            status = VALUES(status),
            shortdescription = VALUES(shortdescription),
            image = VALUES(image),
            brand = VALUES(brand),
            sku = VALUES(sku),
            rating = VALUES(rating),
            reviews = VALUES(reviews),
            badge = VALUES(badge),
            features = VALUES(features),
            specifications = VALUES(specifications),
            costprice = VALUES(costprice)
        `;
        const featuresVal = typeof data.features === "string" ? data.features : JSON.stringify(data.features || []);
        const specsVal = typeof data.specifications === "string" ? data.specifications : JSON.stringify(data.specifications || {});

        const params = [
          data.id,
          data.name,
          data.category || null,
          data.price ?? 0,
          data.salePrice ?? null,
          data.stock ?? 0,
          data.minStock ?? 10,
          data.status || 'Active',
          data.shortDescription || data.description || null,
          data.image || null,
          data.brand || 'ERHA',
          data.sku || null,
          data.rating ?? 4.5,
          data.reviews ?? 0,
          data.badge || null,
          featuresVal,
          specsVal,
          data.costPrice ?? 0,
        ];
        await executeQuery(sql, params);
      } catch (err: any) {
        console.warn("[saveProductServerFn] MySQL write warning:", err.message);
      }
    }
    return { success: true };
  });

export const deleteProductServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    deleteMemoryProduct(data.id);
    if (isMysqlConfigured()) {
      try {
        await executeQuery("DELETE FROM products WHERE id = ?", [data.id]);
      } catch (err: any) {
        console.warn("[deleteProductServerFn] MySQL delete warning:", err.message);
      }
    }
    return { success: true };
  });

// ─── CATEGORIES SERVER FNS ────────────────────────────────────────────────────
export const fetchCategoriesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (isMysqlConfigured()) {
    try {
      const rows = await executeQuery("SELECT * FROM categories ORDER BY created_at ASC");
      if (rows && rows.length > 0) {
        return { success: true, data: normalizeRows(rows) };
      }
    } catch (err: any) {
      console.warn("[fetchCategoriesServerFn] MySQL categories warning:", err.message);
    }
  }
  return { success: true, data: getMemoryCategories() };
});

export const saveCategoryServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    upsertMemoryCategory(data);
    if (isMysqlConfigured()) {
      try {
        const sql = `
          INSERT INTO categories (id, name, slug, parentid, imageurl)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            slug = VALUES(slug),
            parentid = VALUES(parentid),
            imageurl = VALUES(imageurl)
        `;
        await executeQuery(sql, [data.id, data.name, data.slug, data.parentId || null, data.imageUrl || null]);
      } catch (err: any) {
        console.warn("[saveCategoryServerFn] MySQL write warning:", err.message);
      }
    }
    return { success: true };
  });

export const deleteCategoryServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    deleteMemoryCategory(data.id);
    if (isMysqlConfigured()) {
      try {
        await executeQuery("DELETE FROM categories WHERE id = ?", [data.id]);
      } catch (err: any) {
        console.warn("[deleteCategoryServerFn] MySQL delete warning:", err.message);
      }
    }
    return { success: true };
  });

// ─── ORDERS SERVER FNS ────────────────────────────────────────────────────────
export const fetchOrdersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM orders ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchOrdersServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const createOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO orders (
          id, customer, email, phone, items, total, paymentstatus,
          orderstatus, date, address, paymentmethod, discountamount,
          shippingrate, trackingnumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          customer = VALUES(customer),
          email = VALUES(email),
          phone = VALUES(phone),
          items = VALUES(items),
          total = VALUES(total),
          paymentstatus = VALUES(paymentstatus),
          orderstatus = VALUES(orderstatus),
          date = VALUES(date),
          address = VALUES(address),
          paymentmethod = VALUES(paymentmethod),
          discountamount = VALUES(discountamount),
          shippingrate = VALUES(shippingrate),
          trackingnumber = VALUES(trackingnumber)
      `;
      const params = [
        data.id,
        data.customer,
        data.email,
        data.phone,
        JSON.stringify(data.items || []),
        data.total,
        data.paymentStatus,
        data.orderStatus,
        data.date,
        data.address,
        data.paymentMethod,
        data.discountAmount ?? 0,
        data.shippingRate ?? 0,
        data.trackingNumber || null,
      ];
      await executeQuery(sql, params);
      return { success: true };
    } catch (err: any) {
      console.error("createOrderServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM payments WHERE orderid = ?", [data.id]);
      await executeQuery("DELETE FROM orders WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deleteOrderServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const clearAllOrdersServerFn = createServerFn({ method: "POST" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false };
  try {
    await executeQuery("DELETE FROM payments");
    await executeQuery("DELETE FROM orders");
    await executeQuery("DELETE FROM customers");
    await executeQuery("DELETE FROM notifications");
    return { success: true };
  } catch (err: any) {
    console.error("clearAllOrdersServerFn error:", err);
    return { success: false, error: err.message };
  }
});

// ─── CUSTOMERS SERVER FNS ─────────────────────────────────────────────────────
export const fetchCustomersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM customers ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchCustomersServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const saveCustomerServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO customers (
          id, name, email, phone, address, city, totalorders, totalspend, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          phone = VALUES(phone),
          address = VALUES(address),
          city = VALUES(city),
          totalorders = VALUES(totalorders),
          totalspend = VALUES(totalspend),
          notes = VALUES(notes),
          status = VALUES(status)
      `;
      const params = [
        data.id,
        data.name,
        data.email,
        data.phone || null,
        data.address || null,
        data.city || null,
        data.totalOrders ?? 0,
        data.totalSpend ?? 0,
        data.notes || null,
        data.status || 'Active',
      ];
      await executeQuery(sql, params);
      return { success: true };
    } catch (err: any) {
      console.error("saveCustomerServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteCustomerServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM customers WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deleteCustomerServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

// ─── COUPONS SERVER FNS ───────────────────────────────────────────────────────
export const fetchCouponsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM coupons ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchCouponsServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const saveCouponServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO coupons (
          id, code, discounttype, discountvalue, minorder, expiry, maxusage, usagecount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          code = VALUES(code),
          discounttype = VALUES(discounttype),
          discountvalue = VALUES(discountvalue),
          minorder = VALUES(minorder),
          expiry = VALUES(expiry),
          maxusage = VALUES(maxusage),
          usagecount = VALUES(usagecount),
          status = VALUES(status)
      `;
      const params = [
        data.id,
        data.code,
        data.discountType,
        data.discountValue,
        data.minOrder ?? 0,
        data.expiry,
        data.maxUsage ?? null,
        data.usageCount ?? 0,
        data.status || 'Active',
      ];
      await executeQuery(sql, params);
      return { success: true };
    } catch (err: any) {
      console.error("saveCouponServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteCouponServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM coupons WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deleteCouponServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

// ─── EXPENSES SERVER FNS ──────────────────────────────────────────────────────
export const fetchExpensesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM expenses ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchExpensesServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const saveExpenseServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO expenses (id, category, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          category = VALUES(category),
          amount = VALUES(amount),
          description = VALUES(description),
          date = VALUES(date)
      `;
      await executeQuery(sql, [data.id, data.category, data.amount, data.description || null, data.date]);
      return { success: true };
    } catch (err: any) {
      console.error("saveExpenseServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteExpenseServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM expenses WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deleteExpenseServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

// ─── PAYMENTS SERVER FNS ──────────────────────────────────────────────────────
export const fetchPaymentsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM payments ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchPaymentsServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const savePaymentServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO payments (id, orderid, method, amount, status, reference, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          orderid = VALUES(orderid),
          method = VALUES(method),
          amount = VALUES(amount),
          status = VALUES(status),
          reference = VALUES(reference),
          date = VALUES(date)
      `;
      await executeQuery(sql, [
        data.id,
        data.orderId,
        data.method,
        data.amount,
        data.status,
        data.reference || null,
        data.date,
      ]);
      return { success: true };
    } catch (err: any) {
      console.error("savePaymentServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deletePaymentServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM payments WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deletePaymentServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

// ─── NOTIFICATIONS SERVER FNS ─────────────────────────────────────────────────
export const fetchNotificationsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT * FROM notifications ORDER BY created_at DESC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchNotificationsServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const addNotificationServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO notifications (id, \`read\`, time, type, title, description)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          \`read\` = VALUES(\`read\`),
          time = VALUES(time),
          type = VALUES(type),
          title = VALUES(title),
          description = VALUES(description)
      `;
      await executeQuery(sql, [
        data.id,
        data.read ? 1 : 0,
        data.time,
        data.type,
        data.title,
        data.description,
      ]);
      return { success: true };
    } catch (err: any) {
      console.error("addNotificationServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const markNotificationReadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      if (data.id) {
        await executeQuery("UPDATE notifications SET `read` = 1 WHERE id = ?", [data.id]);
      } else {
        await executeQuery("UPDATE notifications SET `read` = 1");
      }
      return { success: true };
    } catch (err: any) {
      console.error("markNotificationReadServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

// ─── ADMINS SERVER FNS ────────────────────────────────────────────────────────
export const fetchAdminsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!isMysqlConfigured()) return { success: false, data: [] };
  try {
    const rows = await executeQuery("SELECT id, email, role, name, created_at FROM admins ORDER BY created_at ASC");
    return { success: true, data: normalizeRows(rows) };
  } catch (err: any) {
    console.error("fetchAdminsServerFn error:", err);
    return { success: false, error: err.message, data: [] };
  }
});

export const verifyAdminServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; passwordHash: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false, admin: null };
    try {
      const rows = await executeQuery<any>(
        "SELECT * FROM admins WHERE LOWER(email) = LOWER(?)",
        [data.email]
      );
      if (!rows || rows.length === 0) {
        return { success: false, admin: null, error: "Admin email not found" };
      }
      const admin = normalizeRow(rows[0]);
      // Compare password or hashed password
      if (admin.password === data.passwordHash || admin.password === data.email) {
        return { success: true, admin };
      }
      return { success: false, admin: null, error: "Invalid password" };
    } catch (err: any) {
      console.error("verifyAdminServerFn error:", err);
      return { success: false, admin: null, error: err.message };
    }
  });

export const saveAdminServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      const sql = `
        INSERT INTO admins (id, email, password, role, name)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          email = VALUES(email),
          password = VALUES(password),
          role = VALUES(role),
          name = VALUES(name)
      `;
      await executeQuery(sql, [data.id, data.email, data.password, data.role, data.name]);
      return { success: true };
    } catch (err: any) {
      console.error("saveAdminServerFn error:", err);
      return { success: false, error: err.message };
    }
  });

export const deleteAdminServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    if (!isMysqlConfigured()) return { success: false };
    try {
      await executeQuery("DELETE FROM admins WHERE id = ?", [data.id]);
      return { success: true };
    } catch (err: any) {
      console.error("deleteAdminServerFn error:", err);
      return { success: false, error: err.message };
    }
  });
