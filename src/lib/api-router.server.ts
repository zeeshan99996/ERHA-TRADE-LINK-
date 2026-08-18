import { executeQuery, isMysqlConfigured } from "./mysql.server";

// Helper to convert lowercase column names to camelCase for frontend & admin consistency
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

// CORS Response Helper
function corsResponse(body: any, status = 200) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only handle /api/ paths
  if (!pathname.startsWith("/api/")) {
    return null;
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return corsResponse({}, 204);
  }

  try {
    // ─── PRODUCTS ─────────────────────────────────────────────────────────────
    if (pathname === "/api/admin/products" || pathname === "/api/products") {
      if (request.method === "GET") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, data: [], error: "DB not configured" });
        const rows = await executeQuery("SELECT * FROM products ORDER BY created_at DESC");
        return corsResponse({ success: true, data: normalizeRows(rows) });
      }

      if (request.method === "POST") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, error: "DB not configured" }, 500);
        const data = await request.json();
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
          data.status || "Active",
          data.shortDescription || data.description || null,
          data.image || null,
          data.brand || "ERHA",
          data.sku || null,
          data.rating ?? 4.5,
          data.reviews ?? 0,
          data.badge || null,
          featuresVal,
          specsVal,
          data.costPrice ?? 0,
        ];
        await executeQuery(sql, params);
        return corsResponse({ success: true, message: "Product saved successfully" });
      }

      if (request.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (!id) return corsResponse({ success: false, error: "Product id required" }, 400);
        await executeQuery("DELETE FROM products WHERE id = ?", [id]);
        return corsResponse({ success: true, message: "Product deleted" });
      }
    }

    // ─── CATEGORIES ───────────────────────────────────────────────────────────
    if (pathname === "/api/admin/categories" || pathname === "/api/categories") {
      if (request.method === "GET") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, data: [], error: "DB not configured" });
        const rows = await executeQuery("SELECT * FROM categories ORDER BY created_at ASC");
        return corsResponse({ success: true, data: normalizeRows(rows) });
      }
      if (request.method === "POST") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, error: "DB not configured" }, 500);
        const data = await request.json();
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
        return corsResponse({ success: true });
      }
      if (request.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (id) await executeQuery("DELETE FROM categories WHERE id = ?", [id]);
        return corsResponse({ success: true });
      }
    }

    // ─── ORDERS ───────────────────────────────────────────────────────────────
    if (pathname === "/api/admin/orders" || pathname === "/api/orders") {
      if (request.method === "GET") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, data: [], error: "DB not configured" });
        const rows = await executeQuery("SELECT * FROM orders ORDER BY created_at DESC");
        return corsResponse({ success: true, data: normalizeRows(rows) });
      }
      if (request.method === "POST") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, error: "DB not configured" }, 500);
        const data = await request.json();
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
          typeof data.items === "string" ? data.items : JSON.stringify(data.items || []),
          data.total,
          data.paymentStatus || "Pending",
          data.orderStatus || "Processing",
          data.date || new Date().toISOString(),
          data.address || "",
          data.paymentMethod || "COD",
          data.discountAmount ?? 0,
          data.shippingRate ?? 0,
          data.trackingNumber || null,
        ];
        await executeQuery(sql, params);
        return corsResponse({ success: true });
      }
      if (request.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (id) {
          try { await executeQuery("DELETE FROM payments WHERE orderid = ?", [id]); } catch {}
          await executeQuery("DELETE FROM orders WHERE id = ?", [id]);
        }
        return corsResponse({ success: true });
      }
    }

    // ─── CUSTOMERS ────────────────────────────────────────────────────────────
    if (pathname === "/api/admin/customers") {
      if (request.method === "GET") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, data: [], error: "DB not configured" });
        const rows = await executeQuery("SELECT * FROM customers ORDER BY created_at DESC");
        return corsResponse({ success: true, data: normalizeRows(rows) });
      }
      if (request.method === "POST") {
        if (!isMysqlConfigured()) return corsResponse({ success: false, error: "DB not configured" }, 500);
        const data = await request.json();
        const sql = `
          INSERT INTO customers (id, name, email, phone, address, city, totalorders, totalspend, notes, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        await executeQuery(sql, [
          data.id, data.name, data.email, data.phone || null, data.address || null,
          data.city || null, data.totalOrders ?? 0, data.totalSpend ?? 0, data.notes || null, data.status || 'Active'
        ]);
        return corsResponse({ success: true });
      }
      if (request.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (id) await executeQuery("DELETE FROM customers WHERE id = ?", [id]);
        return corsResponse({ success: true });
      }
    }

    // ─── ADMIN AUTH ───────────────────────────────────────────────────────────
    if (pathname === "/api/admin/login" && request.method === "POST") {
      const { email, password } = await request.json();
      const rows = await executeQuery<any>("SELECT * FROM admins WHERE LOWER(email) = LOWER(?)", [email]);
      if (rows && rows.length > 0) {
        const admin = rows[0];
        if (admin.password === password || admin.password === email) {
          return corsResponse({ success: true, user: admin });
        }
      }
      return corsResponse({ success: false, message: "Invalid credentials" }, 401);
    }

    // Fallback 404 for unknown api routes
    return corsResponse({ error: "Endpoint not found" }, 404);
  } catch (err: any) {
    console.error("API Router Error:", err);
    return corsResponse({ success: false, error: err.message }, 500);
  }
}
