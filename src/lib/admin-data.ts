// ─── TYPE DEFINITIONS ───────────────────────────────────────────────────────

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  minStock: number;
  status: 'Active' | 'Draft' | 'Out of Stock';
  image: string;
  rating: number;
  sales: number;
  description: string;
  tags: string[];
};

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  address: string;
  paymentMethod: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  joinDate: string;
  status: 'Active' | 'Inactive';
  notes: string;
};

export type AdminCoupon = {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed' | 'Free Shipping';
  value: number;
  minOrder: number;
  usageCount: number;
  maxUsage: number;
  expiry: string;
  status: 'Active' | 'Expired' | 'Disabled';
};

export type AdminReview = {
  id: string;
  product: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reply?: string;
};

// ─── PRODUCTS DATA ───────────────────────────────────────────────────────────

export const adminProducts: AdminProduct[] = [
  {
    id: 'PRD-001',
    name: 'ERHA Pro X5 Wireless Earbuds',
    sku: 'ERH-EAR-X5-BLK',
    category: 'Earbuds',
    brand: 'ERHA',
    price: 4999,
    salePrice: 3999,
    stock: 145,
    minStock: 20,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400',
    rating: 4.7,
    sales: 324,
    description: 'Premium wireless earbuds with Active Noise Cancellation, 30hr battery life, and IPX5 water resistance.',
    tags: ['wireless', 'anc', 'earbuds', 'bluetooth'],
  },
  {
    id: 'PRD-002',
    name: 'ERHA SmartWatch Pro 2',
    sku: 'ERH-SWT-PRO2-BLK',
    category: 'Smart Watches',
    brand: 'ERHA',
    price: 12999,
    salePrice: 10999,
    stock: 58,
    minStock: 10,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.5,
    sales: 187,
    description: 'Feature-rich smartwatch with health monitoring, GPS, 7-day battery, and 1.8" AMOLED display.',
    tags: ['smartwatch', 'fitness', 'gps', 'amoled'],
  },
  {
    id: 'PRD-003',
    name: 'ERHA PowerCore 20000',
    sku: 'ERH-PWR-20K-WHT',
    category: 'Power Banks',
    brand: 'ERHA',
    price: 3499,
    stock: 212,
    minStock: 30,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    rating: 4.6,
    sales: 512,
    description: '20000mAh power bank with 65W fast charging, dual USB-C, and LED display. Charges laptops too.',
    tags: ['power bank', 'fast charge', '20000mah', 'usb-c'],
  },
  {
    id: 'PRD-004',
    name: 'ERHA BoomBox Mini Speaker',
    sku: 'ERH-SPK-MINI-BLU',
    category: 'Speakers',
    brand: 'ERHA',
    price: 5999,
    salePrice: 4999,
    stock: 76,
    minStock: 15,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    rating: 4.4,
    sales: 243,
    description: 'Portable Bluetooth speaker with 360° surround sound, 12hr playtime, and waterproof body.',
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
  },
  {
    id: 'PRD-005',
    name: 'ERHA GaN 65W Charger',
    sku: 'ERH-CHG-GAN65-WHT',
    category: 'Chargers',
    brand: 'ERHA',
    price: 2499,
    stock: 334,
    minStock: 50,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    rating: 4.8,
    sales: 678,
    description: '65W GaN fast charger with 3 ports (USB-C x2, USB-A x1), compact design, supports PD 3.0.',
    tags: ['charger', 'gan', '65w', 'fast charge', 'usb-c'],
  },
  {
    id: 'PRD-006',
    name: 'ERHA Arena Gaming Headset',
    sku: 'ERH-GHED-ARENA-BLK',
    category: 'Gaming Headsets',
    brand: 'ERHA',
    price: 7999,
    salePrice: 6499,
    stock: 42,
    minStock: 10,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    rating: 4.6,
    sales: 156,
    description: '7.1 surround sound gaming headset with noise-cancelling mic, RGB lighting, and memory foam earcups.',
    tags: ['gaming', 'headset', '7.1 surround', 'rgb', 'pc'],
  },
  {
    id: 'PRD-007',
    name: 'ERHA Armor Case iPhone 15 Pro',
    sku: 'ERH-CASE-IP15P-BLK',
    category: 'Phone Cases',
    brand: 'ERHA',
    price: 1499,
    stock: 0,
    minStock: 25,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400',
    rating: 4.3,
    sales: 289,
    description: 'Military-grade drop protection case with MagSafe compatibility, raised camera edges, and non-slip grip.',
    tags: ['iphone 15 pro', 'case', 'magsafe', 'shockproof'],
  },
  {
    id: 'PRD-008',
    name: 'ERHA Pro Braided USB-C Cable 2m',
    sku: 'ERH-CBL-USBC-2M-GRY',
    category: 'Cables',
    brand: 'ERHA',
    price: 799,
    stock: 567,
    minStock: 100,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.5,
    sales: 1023,
    description: 'Premium braided USB-C to USB-C cable, 100W fast charging support, 10Gbps data transfer, 2m length.',
    tags: ['usb-c', 'cable', '100w', 'braided', '2m'],
  },
  {
    id: 'PRD-009',
    name: 'ERHA Fit Lite Smartwatch',
    sku: 'ERH-SWT-FIT-PNK',
    category: 'Smart Watches',
    brand: 'ERHA',
    price: 6999,
    salePrice: 5499,
    stock: 93,
    minStock: 15,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400',
    rating: 4.2,
    sales: 134,
    description: 'Lightweight fitness smartwatch with heart rate, SpO2, sleep tracking and 14-day battery life.',
    tags: ['smartwatch', 'fitness', 'health', 'lightweight'],
  },
  {
    id: 'PRD-010',
    name: 'ERHA TwinsX TWS Earbuds',
    sku: 'ERH-EAR-TWNX-WHT',
    category: 'Earbuds',
    brand: 'ERHA',
    price: 2999,
    stock: 178,
    minStock: 25,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    rating: 4.3,
    sales: 445,
    description: 'True wireless earbuds with 6mm dynamic drivers, ENC mic, 24hr total battery, and touch controls.',
    tags: ['tws', 'earbuds', 'wireless', 'enc'],
  },
  {
    id: 'PRD-011',
    name: 'ERHA SlimPower 10000 Power Bank',
    sku: 'ERH-PWR-10K-BLK',
    category: 'Power Banks',
    brand: 'ERHA',
    price: 1999,
    stock: 8,
    minStock: 20,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=400',
    rating: 4.4,
    sales: 398,
    description: 'Ultra-slim 10000mAh power bank, 22.5W fast charge, USB-C + USB-A dual output, 13mm thin.',
    tags: ['power bank', 'slim', '10000mah', 'fast charge'],
  },
  {
    id: 'PRD-012',
    name: 'ERHA SoundBar 30W Desktop Speaker',
    sku: 'ERH-SPK-BAR30-BLK',
    category: 'Speakers',
    brand: 'ERHA',
    price: 8999,
    salePrice: 7499,
    stock: 31,
    minStock: 8,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
    rating: 4.7,
    sales: 67,
    description: '30W desktop soundbar with subwoofer, RGB ambient lighting, Bluetooth 5.3, and AUX input.',
    tags: ['soundbar', 'speaker', 'desktop', 'rgb', '30w'],
  },
];

// ─── ORDERS DATA ─────────────────────────────────────────────────────────────

export const adminOrders: AdminOrder[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Ahmed Raza',
    email: 'ahmed.raza@gmail.com',
    phone: '0301-1234567',
    items: ['ERHA Pro X5 Wireless Earbuds x1', 'ERHA GaN 65W Charger x1'],
    total: 7998,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2024-06-01',
    address: 'House 45, Block B, Gulshan-e-Iqbal, Karachi',
    paymentMethod: 'JazzCash',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Fatima Malik',
    email: 'fatima.malik@hotmail.com',
    phone: '0321-9876543',
    items: ['ERHA SmartWatch Pro 2 x1'],
    total: 10999,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '2024-06-02',
    address: 'Flat 3A, DHA Phase 5, Lahore',
    paymentMethod: 'Card',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Muhammad Usman',
    email: 'usman.ch@yahoo.com',
    phone: '0333-5556677',
    items: ['ERHA PowerCore 20000 x2'],
    total: 6998,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    date: '2024-06-03',
    address: 'Street 12, G-10/2, Islamabad',
    paymentMethod: 'COD',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Sana Khan',
    email: 'sana.khan93@gmail.com',
    phone: '0345-1122334',
    items: ['ERHA Arena Gaming Headset x1', 'ERHA Pro Braided USB-C Cable 2m x2'],
    total: 8097,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2024-06-04',
    address: 'House 7, Cavalry Ground, Lahore Cantt',
    paymentMethod: 'EasyPaisa',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Bilal Hussain',
    email: 'bilal.h@gmail.com',
    phone: '0311-8899001',
    items: ['ERHA BoomBox Mini Speaker x1'],
    total: 4999,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    date: '2024-06-05',
    address: 'Plot 22, Bahria Town Phase 4, Rawalpindi',
    paymentMethod: 'JazzCash',
  },
  {
    id: 'ORD-2024-006',
    customer: 'Zainab Akhtar',
    email: 'zainab.akhtar@gmail.com',
    phone: '0312-4455667',
    items: ['ERHA Fit Lite Smartwatch x1', 'ERHA TwinsX TWS Earbuds x1'],
    total: 8498,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2024-06-06',
    address: 'House 33, Model Town, Faisalabad',
    paymentMethod: 'Card',
  },
  {
    id: 'ORD-2024-007',
    customer: 'Hassan Tariq',
    email: 'hassan.t@live.com',
    phone: '0323-7788990',
    items: ['ERHA GaN 65W Charger x2', 'ERHA Pro Braided USB-C Cable 2m x3'],
    total: 7395,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    date: '2024-06-07',
    address: 'Flat 12, Clifton Block 5, Karachi',
    paymentMethod: 'Card',
  },
  {
    id: 'ORD-2024-008',
    customer: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    phone: '0300-2233445',
    items: ['ERHA Pro X5 Wireless Earbuds x1'],
    total: 3999,
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    date: '2024-06-08',
    address: 'House 5, Sector E-11, Islamabad',
    paymentMethod: 'EasyPaisa',
  },
  {
    id: 'ORD-2024-009',
    customer: 'Kamran Sheikh',
    email: 'kamran.sheikh@gmail.com',
    phone: '0336-6677889',
    items: ['ERHA SmartWatch Pro 2 x1', 'ERHA GaN 65W Charger x1'],
    total: 13498,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2024-06-09',
    address: 'Bungalow 101, Bath Island, Karachi',
    paymentMethod: 'Card',
  },
  {
    id: 'ORD-2024-010',
    customer: 'Nadia Qaiser',
    email: 'nadia.q@hotmail.com',
    phone: '0349-5544332',
    items: ['ERHA SlimPower 10000 x1', 'ERHA TwinsX TWS Earbuds x1'],
    total: 4998,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    date: '2024-06-10',
    address: 'House 18, Johar Town, Lahore',
    paymentMethod: 'COD',
  },
  {
    id: 'ORD-2024-011',
    customer: 'Tariq Mehmood',
    email: 'tariq.m@gmail.com',
    phone: '0301-3344556',
    items: ['ERHA PowerCore 20000 x1', 'ERHA Pro Braided USB-C Cable 2m x1'],
    total: 4298,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '2024-06-10',
    address: 'House 77, Satellite Town, Rawalpindi',
    paymentMethod: 'JazzCash',
  },
  {
    id: 'ORD-2024-012',
    customer: 'Rabia Noor',
    email: 'rabia.noor@gmail.com',
    phone: '0321-1234321',
    items: ['ERHA Fit Lite Smartwatch x1'],
    total: 5499,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2024-06-09',
    address: 'Flat 8B, Askari 11, Lahore',
    paymentMethod: 'EasyPaisa',
  },
  {
    id: 'ORD-2024-013',
    customer: 'Imran Butt',
    email: 'imran.butt@gmail.com',
    phone: '0311-9988776',
    items: ['ERHA Arena Gaming Headset x1'],
    total: 6499,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    date: '2024-06-10',
    address: 'House 9, Gulberg III, Lahore',
    paymentMethod: 'Card',
  },
  {
    id: 'ORD-2024-014',
    customer: 'Sara Zafar',
    email: 'sara.zafar@yahoo.com',
    phone: '0300-7766554',
    items: ['ERHA BoomBox Mini Speaker x1', 'ERHA GaN 65W Charger x1'],
    total: 7498,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    date: '2024-06-10',
    address: 'Plot 55, North Nazimabad, Karachi',
    paymentMethod: 'COD',
  },
  {
    id: 'ORD-2024-015',
    customer: 'Umar Farooq',
    email: 'umar.f@gmail.com',
    phone: '0333-4455667',
    items: ['ERHA Pro X5 Wireless Earbuds x1', 'ERHA SlimPower 10000 x1'],
    total: 5998,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '2024-06-08',
    address: 'House 3, F-7/3, Islamabad',
    paymentMethod: 'JazzCash',
  },
];

// ─── CUSTOMERS DATA ───────────────────────────────────────────────────────────

export const adminCustomers: AdminCustomer[] = [
  {
    id: 'CUST-001',
    name: 'Ahmed Raza',
    email: 'ahmed.raza@gmail.com',
    phone: '0301-1234567',
    city: 'Karachi',
    totalOrders: 8,
    totalSpending: 52430,
    joinDate: '2023-03-15',
    status: 'Active',
    notes: 'Prefers JazzCash payments. Regular buyer of earbuds category.',
  },
  {
    id: 'CUST-002',
    name: 'Fatima Malik',
    email: 'fatima.malik@hotmail.com',
    phone: '0321-9876543',
    city: 'Lahore',
    totalOrders: 5,
    totalSpending: 41995,
    joinDate: '2023-05-22',
    status: 'Active',
    notes: 'Interested in smart watches and wearables.',
  },
  {
    id: 'CUST-003',
    name: 'Muhammad Usman',
    email: 'usman.ch@yahoo.com',
    phone: '0333-5556677',
    city: 'Islamabad',
    totalOrders: 3,
    totalSpending: 15990,
    joinDate: '2023-08-10',
    status: 'Active',
    notes: 'Prefers COD. Sometimes delays on delivery.',
  },
  {
    id: 'CUST-004',
    name: 'Sana Khan',
    email: 'sana.khan93@gmail.com',
    phone: '0345-1122334',
    city: 'Lahore',
    totalOrders: 11,
    totalSpending: 78540,
    joinDate: '2022-12-01',
    status: 'Active',
    notes: 'Top customer. Frequent buyer. Eligible for VIP discount.',
  },
  {
    id: 'CUST-005',
    name: 'Bilal Hussain',
    email: 'bilal.h@gmail.com',
    phone: '0311-8899001',
    city: 'Rawalpindi',
    totalOrders: 4,
    totalSpending: 22500,
    joinDate: '2023-11-05',
    status: 'Active',
    notes: 'Interested in audio products.',
  },
  {
    id: 'CUST-006',
    name: 'Zainab Akhtar',
    email: 'zainab.akhtar@gmail.com',
    phone: '0312-4455667',
    city: 'Faisalabad',
    totalOrders: 6,
    totalSpending: 34760,
    joinDate: '2023-07-19',
    status: 'Active',
    notes: 'Prefers card payments. Bought multiple watches as gifts.',
  },
  {
    id: 'CUST-007',
    name: 'Hassan Tariq',
    email: 'hassan.t@live.com',
    phone: '0323-7788990',
    city: 'Karachi',
    totalOrders: 2,
    totalSpending: 7998,
    joinDate: '2024-01-14',
    status: 'Inactive',
    notes: 'Had a failed payment. Follow up needed.',
  },
  {
    id: 'CUST-008',
    name: 'Kamran Sheikh',
    email: 'kamran.sheikh@gmail.com',
    phone: '0336-6677889',
    city: 'Karachi',
    totalOrders: 9,
    totalSpending: 63450,
    joinDate: '2022-09-30',
    status: 'Active',
    notes: 'Tech enthusiast. Buys new launches immediately.',
  },
  {
    id: 'CUST-009',
    name: 'Nadia Qaiser',
    email: 'nadia.q@hotmail.com',
    phone: '0349-5544332',
    city: 'Lahore',
    totalOrders: 7,
    totalSpending: 29870,
    joinDate: '2023-04-08',
    status: 'Active',
    notes: 'Regularly uses discount coupons. Price-sensitive buyer.',
  },
  {
    id: 'CUST-010',
    name: 'Tariq Mehmood',
    email: 'tariq.m@gmail.com',
    phone: '0301-3344556',
    city: 'Rawalpindi',
    totalOrders: 3,
    totalSpending: 12890,
    joinDate: '2024-02-20',
    status: 'Active',
    notes: 'New customer. Bought power banks and cables.',
  },
];

// ─── COUPONS DATA ─────────────────────────────────────────────────────────────

export const adminCoupons: AdminCoupon[] = [
  {
    id: 'CPN-001',
    code: 'ERHA20',
    type: 'Percentage',
    value: 20,
    minOrder: 3000,
    usageCount: 145,
    maxUsage: 500,
    expiry: '2024-12-31',
    status: 'Active',
  },
  {
    id: 'CPN-002',
    code: 'SAVE500',
    type: 'Fixed',
    value: 500,
    minOrder: 5000,
    usageCount: 89,
    maxUsage: 200,
    expiry: '2024-09-30',
    status: 'Active',
  },
  {
    id: 'CPN-003',
    code: 'FREESHIP',
    type: 'Free Shipping',
    value: 0,
    minOrder: 2000,
    usageCount: 312,
    maxUsage: 1000,
    expiry: '2024-07-31',
    status: 'Active',
  },
  {
    id: 'CPN-004',
    code: 'EID2024',
    type: 'Percentage',
    value: 30,
    minOrder: 4000,
    usageCount: 500,
    maxUsage: 500,
    expiry: '2024-04-15',
    status: 'Expired',
  },
  {
    id: 'CPN-005',
    code: 'JAZZ15',
    type: 'Percentage',
    value: 15,
    minOrder: 2500,
    usageCount: 67,
    maxUsage: 300,
    expiry: '2024-08-31',
    status: 'Active',
  },
  {
    id: 'CPN-006',
    code: 'NEWUSER',
    type: 'Fixed',
    value: 250,
    minOrder: 1500,
    usageCount: 234,
    maxUsage: 10000,
    expiry: '2025-12-31',
    status: 'Active',
  },
  {
    id: 'CPN-007',
    code: 'SUMMER10',
    type: 'Percentage',
    value: 10,
    minOrder: 1000,
    usageCount: 178,
    maxUsage: 200,
    expiry: '2024-06-30',
    status: 'Disabled',
  },
  {
    id: 'CPN-008',
    code: 'VIP1000',
    type: 'Fixed',
    value: 1000,
    minOrder: 10000,
    usageCount: 23,
    maxUsage: 100,
    expiry: '2024-12-31',
    status: 'Active',
  },
];

// ─── REVIEWS DATA ─────────────────────────────────────────────────────────────

export const adminReviews: AdminReview[] = [
  {
    id: 'REV-001',
    product: 'ERHA Pro X5 Wireless Earbuds',
    customer: 'Ahmed Raza',
    rating: 5,
    comment: 'Absolutely love these earbuds! The ANC is phenomenal and the bass is deep. Highly recommended for the price.',
    date: '2024-06-02',
    status: 'Approved',
    reply: 'Thank you Ahmed! We are delighted you love the X5. Your feedback motivates us!',
  },
  {
    id: 'REV-002',
    product: 'ERHA SmartWatch Pro 2',
    customer: 'Fatima Malik',
    rating: 4,
    comment: 'Very good watch. The display is gorgeous and health tracking is accurate. Battery lasts about 5-6 days.',
    date: '2024-06-04',
    status: 'Approved',
  },
  {
    id: 'REV-003',
    product: 'ERHA GaN 65W Charger',
    customer: 'Sana Khan',
    rating: 5,
    comment: 'This charger is a game changer. Charges my laptop and phone simultaneously. Very compact and travel-friendly.',
    date: '2024-06-05',
    status: 'Approved',
    reply: 'We are so happy you love the GaN charger, Sana! Perfect for power users like you.',
  },
  {
    id: 'REV-004',
    product: 'ERHA Arena Gaming Headset',
    customer: 'Hassan Tariq',
    rating: 2,
    comment: 'Sound quality is ok but the mic quality is really disappointing. My teammates can hardly hear me. Expected better for the price.',
    date: '2024-06-07',
    status: 'Pending',
  },
  {
    id: 'REV-005',
    product: 'ERHA PowerCore 20000',
    customer: 'Muhammad Usman',
    rating: 5,
    comment: 'Excellent power bank! Charged my phone 5 times and still had juice left. The 65W PD is super fast.',
    date: '2024-06-06',
    status: 'Approved',
  },
  {
    id: 'REV-006',
    product: 'ERHA BoomBox Mini Speaker',
    customer: 'Bilal Hussain',
    rating: 4,
    comment: 'Great speaker for the size. Sound is loud and clear. Battery life is impressive. Would have given 5 stars if the bass was slightly stronger.',
    date: '2024-06-08',
    status: 'Approved',
  },
  {
    id: 'REV-007',
    product: 'ERHA TwinsX TWS Earbuds',
    customer: 'Nadia Qaiser',
    rating: 4,
    comment: 'Very good budget earbuds. Sound quality is great for the price. Touch controls are responsive. Good buy!',
    date: '2024-06-09',
    status: 'Pending',
  },
  {
    id: 'REV-008',
    product: 'ERHA Fit Lite Smartwatch',
    customer: 'Zainab Akhtar',
    rating: 5,
    comment: 'I bought this as a gift for my sister and she absolutely loves it. Beautiful design, accurate sensors, great battery life.',
    date: '2024-06-07',
    status: 'Approved',
    reply: 'Such a sweet gesture, Zainab! We hope your sister enjoys every feature of the Fit Lite.',
  },
  {
    id: 'REV-009',
    product: 'ERHA Pro Braided USB-C Cable 2m',
    customer: 'Tariq Mehmood',
    rating: 3,
    comment: 'Cable quality is fine but the 100W charging speed isn\'t working on my phone. Works normally at standard speed. Maybe a compatibility issue.',
    date: '2024-06-09',
    status: 'Rejected',
  },
  {
    id: 'REV-010',
    product: 'ERHA SmartWatch Pro 2',
    customer: 'Kamran Sheikh',
    rating: 5,
    comment: 'Third ERHA product I\'ve bought and they never disappoint. The watch face customization is excellent. GPS is very accurate. Worth every rupee!',
    date: '2024-06-10',
    status: 'Approved',
    reply: 'You are our MVP customer, Kamran! 🎉 Thank you for your continued trust in ERHA.',
  },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────

export const revenueData = [
  { month: 'Jan', revenue: 285000, orders: 42 },
  { month: 'Feb', revenue: 320000, orders: 48 },
  { month: 'Mar', revenue: 410000, orders: 63 },
  { month: 'Apr', revenue: 375000, orders: 57 },
  { month: 'Feb', revenue: 320000, orders: 51 },
  { month: 'Mar', revenue: 415000, orders: 68 },
  { month: 'Apr', revenue: 370000, orders: 58 },
  { month: 'May', revenue: 510000, orders: 79 },
  { month: 'Jun', revenue: 505000, orders: 68 },
];

// ─── Category Pie Chart Data ──────────────────────────────────────────────────

export type CategoryDataPoint = {
  name: string;
  value: number;
  color: string;
};

export const categoryData: CategoryDataPoint[] = [
  { name: 'Earbuds', value: 32, color: '#6366F1' },
  { name: 'Smart Watch', value: 24, color: '#8B5CF6' },
  { name: 'Power Bank', value: 18, color: '#10B981' },
  { name: 'Speaker', value: 14, color: '#F59E0B' },
  { name: 'Gaming', value: 7, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#6B7280' },
];

// ─── MOCK PRODUCTS ───────────────────────────────────────────────────────────

export const formatPKR = (amount: number): string =>
  `Rs. ${amount.toLocaleString('en-PK')}`;

export const getOrderStatusColor = (status: AdminOrder['orderStatus']): string => {
  const map: Record<AdminOrder['orderStatus'], string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return map[status];
};

export const getPaymentStatusColor = (status: AdminOrder['paymentStatus']): string => {
  const map: Record<AdminOrder['paymentStatus'], string> = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
    Refunded: 'bg-gray-100 text-gray-800',
  };
  return map[status];
};

export const getProductStatusColor = (status: AdminProduct['status']): string => {
  const map: Record<AdminProduct['status'], string> = {
    Active: 'bg-green-100 text-green-800',
    Draft: 'bg-gray-100 text-gray-800',
    'Out of Stock': 'bg-red-100 text-red-800',
  };
  return map[status];
};
