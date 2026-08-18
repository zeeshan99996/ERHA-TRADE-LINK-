// Server-side resilient data store with initial store catalog
// Serves as an automatic zero-latency fallback whenever MySQL is connecting or when running in serverless environments

export const DEFAULT_PRODUCTS: any[] = [
  {
    id: "prd-pzx-v91",
    name: "PZX V91 Fast Charging Power Bank (10,000mAh)",
    category: "Ultra Compact",
    price: 4500,
    salePrice: 2999,
    stock: 80,
    minStock: 10,
    status: "Active",
    shortDescription: "High-performance 10,000mAh lithium-polymer power bank with 22.5W super-fast charging, dual outputs, and digital LED battery indicator.",
    image: "/products/pzx_v91_power_bank.png",
    brand: "PZX",
    sku: "PZX-V91-001",
    rating: 4.9,
    reviews: 142,
    badge: "Best Seller",
    features: [
      "10,000mAh High-Density Lithium Polymer Battery",
      "22.5W Super Fast Charging Output",
      "Intelligent LED Digital Battery Display",
      "Dual USB Output + Type-C Input/Output"
    ],
    specifications: {
      "Capacity": "10,000mAh / 37Wh",
      "Input": "5V-3A / 9V-2A (Type-C)",
      "Output": "5V-4.5A / 9V-2A / 12V-1.5A (22.5W Max)",
      "Battery Type": "Grade-A Lithium Polymer"
    },
    costPrice: 1800
  },
  {
    id: "prd-zoro-zt1",
    name: "ZORO ZT1 True Wireless Earbuds (ANC & ENC)",
    category: "Wireless Earbuds",
    price: 5500,
    salePrice: 3899,
    stock: 50,
    minStock: 5,
    status: "Active",
    shortDescription: "Premium dual-tone wireless earbuds with Active Noise Cancellation (ANC), Environmental Noise Cancellation (ENC) for crystal clear calls, and up to 36 hours playtime.",
    image: "/products/zoro_zt1_earbuds.png",
    brand: "ZORO",
    sku: "ZRO-ZT1-002",
    rating: 4.8,
    reviews: 98,
    badge: "Trending",
    features: [
      "Active Noise Cancellation (ANC) with Transparency Mode",
      "Quad-Mic ENC for Ultra-Clear Phone Calls",
      "Up to 36 Hours Total Battery Life with Charging Case",
      "Bluetooth 5.3 Ultra-Low Latency Gaming Mode"
    ],
    specifications: {
      "Driver": "13mm Titanium Diaphragm Drivers",
      "Bluetooth Version": "5.3",
      "Playtime": "7 Hours (Earbuds) + 29 Hours (Case)",
      "Water Resistance": "IPX5 Water Resistant"
    },
    costPrice: 2200
  },
  {
    id: "prd-tltm-tw09",
    name: "TLTM TW09 Deep Bass Bluetooth Earbuds",
    category: "Wireless Earbuds",
    price: 4200,
    salePrice: 2999,
    stock: 65,
    minStock: 10,
    status: "Active",
    shortDescription: "Ultra-compact matte black Bluetooth earbuds with deep punchy bass, smart touch controls, and ergonomic in-ear comfort fit.",
    image: "/products/tltm_tw09_earbuds.png",
    brand: "TLTM",
    sku: "TLT-TW09-003",
    rating: 4.7,
    reviews: 76,
    badge: "Popular",
    features: [
      "13mm Dynamic Deep Bass Drivers",
      "Smart One-Touch Fingerprint Controls",
      "Fast Type-C Quick Charging (10 min = 2 hrs play)",
      "Ergonomic Lightweight Fit (3.8g per earbud)"
    ],
    specifications: {
      "Driver": "13mm Dynamic Driver",
      "Bluetooth Version": "5.3",
      "Battery Life": "6 Hours Earbuds / 24 Hours Total",
      "Charging Port": "Type-C"
    },
    costPrice: 1600
  },
  {
    id: "prd-zoro-zt-carbon",
    name: "ZORO ZT Carbon Edition Wireless Earbuds",
    category: "Wireless Earbuds",
    price: 6000,
    salePrice: 4499,
    stock: 40,
    minStock: 5,
    status: "Active",
    shortDescription: "Exclusive carbon-fiber styled edition with studio-tuned acoustic clarity, dual microphone ENC, and fast wireless charging support.",
    image: "/products/zoro_zt_carbon_earbuds.png",
    brand: "ZORO",
    sku: "ZRO-ZTC-004",
    rating: 4.9,
    reviews: 54,
    badge: "Pro Choice",
    features: [
      "Signature Carbon Fiber Pattern Styling",
      "Hi-Res Spatial Stereo Audio",
      "Dual Mic HD Voice ENC Calling",
      "Wireless Charging & Type-C Compatible Case"
    ],
    specifications: {
      "Frequency Response": "20Hz - 20kHz",
      "Bluetooth": "5.3 with AAC/SBC Codecs",
      "Total Playtime": "32 Hours",
      "Charging": "Type-C + Qi Wireless"
    },
    costPrice: 2600
  }
];

export const DEFAULT_CATEGORIES: any[] = [
  { id: 'cat1', name: 'Ultra Compact', slug: 'ultra-compact', parentId: null, imageUrl: '/products/pzx_v91_power_bank.png' },
  { id: 'cat2', name: 'Wireless Earbuds', slug: 'wireless-earbuds', parentId: null, imageUrl: '/products/zoro_zt1_earbuds.png' },
];

// Global in-memory storage holding live updates
let memoryProducts: any[] = [...DEFAULT_PRODUCTS];
let memoryCategories: any[] = [...DEFAULT_CATEGORIES];
let memoryOrders: any[] = [];
let memoryCustomers: any[] = [];

export function getMemoryProducts(): any[] {
  return memoryProducts;
}

export function upsertMemoryProduct(product: any): void {
  if (!product || !product.id) return;
  const targetId = String(product.id).trim().toLowerCase();
  const idx = memoryProducts.findIndex((p) => p && String(p.id).trim().toLowerCase() === targetId);
  if (idx >= 0) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...product };
  } else {
    memoryProducts.unshift(product);
  }
}

export function deleteMemoryProduct(id: string): void {
  if (!id) return;
  const targetId = String(id).trim().toLowerCase();
  memoryProducts = memoryProducts.filter((p) => p && String(p.id).trim().toLowerCase() !== targetId);
}

export function setMemoryProducts(products: any[]): void {
  if (Array.isArray(products)) {
    memoryProducts = [...products];
  }
}

export function getMemoryCategories(): any[] {
  return memoryCategories;
}

export function upsertMemoryCategory(category: any): void {
  if (!category || !category.id) return;
  const idx = memoryCategories.findIndex((c) => c.id === category.id);
  if (idx >= 0) {
    memoryCategories[idx] = { ...memoryCategories[idx], ...category };
  } else {
    memoryCategories.push(category);
  }
}

export function deleteMemoryCategory(id: string): void {
  memoryCategories = memoryCategories.filter((c) => c.id !== id);
}

export function getMemoryOrders(): any[] {
  return memoryOrders;
}

export function upsertMemoryOrder(order: any): void {
  if (!order || !order.id) return;
  const idx = memoryOrders.findIndex((o) => o.id === order.id);
  if (idx >= 0) {
    memoryOrders[idx] = { ...memoryOrders[idx], ...order };
  } else {
    memoryOrders.unshift(order);
  }
}

export function deleteMemoryOrder(id: string): void {
  memoryOrders = memoryOrders.filter((o) => o.id !== id);
}

export function getMemoryCustomers(): any[] {
  return memoryCustomers;
}

export function upsertMemoryCustomer(customer: any): void {
  if (!customer || !customer.id) return;
  const idx = memoryCustomers.findIndex((c) => c.id === customer.id);
  if (idx >= 0) {
    memoryCustomers[idx] = { ...memoryCustomers[idx], ...customer };
  } else {
    memoryCustomers.unshift(customer);
  }
}

export function deleteMemoryCustomer(id: string): void {
  memoryCustomers = memoryCustomers.filter((c) => c.id !== id);
}
