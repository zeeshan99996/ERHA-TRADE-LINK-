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
  },
  {
    id: "prd-erha-magsafe",
    name: "ERHA MagSafe 10K Magnetic Wireless Power Bank",
    category: "MagSafe & Wireless",
    price: 6500,
    salePrice: 4999,
    stock: 45,
    minStock: 5,
    status: "Active",
    shortDescription: "Ultra-slim 10,000mAh magnetic wireless power bank with premium leather finish, strong N52 magnets, and built-in kickstand.",
    image: "/products/magsafe_power_bank.png",
    brand: "ERHA",
    sku: "ERH-MAG-005",
    rating: 4.8,
    reviews: 124,
    badge: "Featured",
    features: [
      "15W MagSafe Magnetic Wireless Fast Charging",
      "20W Power Delivery USB-C Bidirectional Fast Port",
      "Foldable Leather Kickstand for Hands-Free Viewing",
      "Smart LED Battery Status Display"
    ],
    specifications: {
      "Capacity": "10,000mAh / 37Wh",
      "Wireless Output": "5W / 7.5W / 10W / 15W",
      "USB-C Output": "20W Max (5V/3A, 9V/2.22A, 12V/1.67A)",
      "Dimensions": "104 x 68 x 16 mm"
    },
    costPrice: 3000
  },
  {
    id: "prd-erha-powerstation-20k",
    name: "ERHA PowerStation 20K SuperPD 65W Laptop Power Bank",
    category: "Laptop Power Banks",
    price: 9999,
    salePrice: 7499,
    stock: 30,
    minStock: 5,
    status: "Active",
    shortDescription: "Heavy-duty 20,000mAh laptop-class power bank with massive 65W Power Delivery output for MacBooks, Dell, HP, tablets, and phones.",
    image: "/products/laptop_power_bank.png",
    brand: "ERHA",
    sku: "ERH-PD65-006",
    rating: 4.9,
    reviews: 89,
    badge: "Heavy Duty",
    features: [
      "Massive 65W USB-C Output to Charge Laptops at Full Speed",
      "20,000mAh Capacity (Charges iPhone 4x, MacBook 1.2x)",
      "3-Port Simultaneous Fast Charging (2x USB-C, 1x USB-A)",
      "Aircraft-Approved Aluminum Alloy Chassis"
    ],
    specifications: {
      "Capacity": "20,000mAh / 74Wh",
      "USB-C Output": "65W Max (20V/3.25A)",
      "USB-A Output": "22.5W Max",
      "Weight": "395g"
    },
    costPrice: 4800
  },
  {
    id: "prd-erha-hyper-40k",
    name: "ERHA Hyper PowerStation Mega 40K High Capacity",
    category: "High Capacity",
    price: 14500,
    salePrice: 11999,
    stock: 20,
    minStock: 3,
    status: "Active",
    shortDescription: "Colossal 40,000mAh high-capacity charging station with 100W dual-way PD, multi-port hub, and built-in emergency outdoor flashlight.",
    image: "/products/hyper_power_station.png",
    brand: "ERHA",
    sku: "ERH-HYP-007",
    rating: 5.0,
    reviews: 41,
    badge: "Ultimate Power",
    features: [
      "Colossal 40,000mAh Power Capacity",
      "100W Dual-Way Ultra-Fast Power Delivery",
      "Charges up to 4 Devices Simultaneously",
      "Multi-Mode Ultra-Bright Emergency LED Lamp"
    ],
    specifications: {
      "Capacity": "40,000mAh / 148Wh",
      "Max Combined Output": "100W",
      "Ports": "2x USB-C PD, 2x USB-A QC 3.0",
      "Weight": "680g"
    },
    costPrice: 7500
  }
];

export const DEFAULT_CATEGORIES: any[] = [
  { id: 'cat1', name: 'Ultra Compact', slug: 'ultra-compact', parentId: null, imageUrl: '/products/pzx_v91_power_bank.png' },
  { id: 'cat2', name: 'Wireless Earbuds', slug: 'wireless-earbuds', parentId: null, imageUrl: '/products/zoro_zt1_earbuds.png' },
  { id: 'cat3', name: 'MagSafe & Wireless', slug: 'magsafe-wireless', parentId: null, imageUrl: '/products/magsafe_power_bank.png' },
  { id: 'cat4', name: 'Laptop Power Banks', slug: 'laptop-power-banks', parentId: null, imageUrl: '/products/laptop_power_bank.png' },
  { id: 'cat5', name: 'High Capacity', slug: 'high-capacity', parentId: null, imageUrl: '/products/hyper_power_station.png' },
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
