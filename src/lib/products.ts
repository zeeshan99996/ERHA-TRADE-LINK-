export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: "New" | "Hot" | "-20%" | "-30%" | "Best Seller";
};

const img = (q: string, sig: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80&sig=${sig}`;

export const products: Product[] = [
  { id: "p1", name: "Aero Pro Wireless Earbuds", category: "Earbuds", image: img("photo-1606220945770-b5b6c2c55bf1", 1), price: 6499, oldPrice: 8999, rating: 4.8, reviews: 1284, badge: "Hot" },
  { id: "p2", name: "Pulse X Smart Watch Series 7", category: "Smart Watch", image: img("photo-1546868871-7041f2a55e12", 2), price: 12999, oldPrice: 15999, rating: 4.7, reviews: 942, badge: "-20%" },
  { id: "p3", name: "Volt 20K Fast Power Bank", category: "Power Bank", image: img("photo-1609091839311-d5365f9ff1c5", 3), price: 3499, oldPrice: 4499, rating: 4.6, reviews: 612, badge: "Best Seller" },
  { id: "p4", name: "Sonic Boom Bluetooth Speaker", category: "Speaker", image: img("photo-1608043152269-423dbba4e7e1", 4), price: 5499, oldPrice: 6999, rating: 4.5, reviews: 488 },
  { id: "p5", name: "GameForge Pro Headset", category: "Gaming", image: img("photo-1612198188060-c7c2a3b66eae", 5), price: 8999, oldPrice: 11999, rating: 4.9, reviews: 1820, badge: "New" },
  { id: "p6", name: "FluxCharge 65W GaN Adapter", category: "Charger", image: img("photo-1583394838336-acd977736f90", 6), price: 2999, rating: 4.7, reviews: 356 },
  { id: "p7", name: "Lumen Lite USB-C Cable 1.8m", category: "Cable", image: img("photo-1606293459409-72e0e15c4ef9", 7), price: 799, oldPrice: 1299, rating: 4.4, reviews: 219, badge: "-30%" },
  { id: "p8", name: "Halo Magnetic Phone Stand", category: "Accessory", image: img("photo-1592890288564-76628a30a657", 8), price: 1799, rating: 4.6, reviews: 174 },
  { id: "p9", name: "Zen Buds Active Noise Cancel", category: "Earbuds", image: img("photo-1590658268037-6bf12165a8df", 9), price: 9499, oldPrice: 11499, rating: 4.8, reviews: 752, badge: "New" },
  { id: "p10", name: "Orbit Round Smart Watch", category: "Smart Watch", image: img("photo-1579586337278-3befd40fd17a", 10), price: 7999, rating: 4.5, reviews: 410 },
  { id: "p11", name: "TitanCharge 30K Power Bank", category: "Power Bank", image: img("photo-1585338447937-7082f8fc763d", 11), price: 5499, oldPrice: 6499, rating: 4.7, reviews: 309 },
  { id: "p12", name: "BassCube Mini Speaker", category: "Speaker", image: img("photo-1545454675-3531b543be5d", 12), price: 2799, rating: 4.4, reviews: 287, badge: "New" },
];

export const categories = [
  { name: "Wireless Earbuds", icon: "headphones", image: img("photo-1590658268037-6bf12165a8df", 21) },
  { name: "Smart Watches", icon: "watch", image: img("photo-1546868871-7041f2a55e12", 22) },
  { name: "Power Banks", icon: "battery-charging", image: img("photo-1609091839311-d5365f9ff1c5", 23) },
  { name: "Bluetooth Speakers", icon: "speaker", image: img("photo-1608043152269-423dbba4e7e1", 24) },
  { name: "Chargers", icon: "zap", image: img("photo-1583394838336-acd977736f90", 25) },
  { name: "Gaming Accessories", icon: "gamepad-2", image: img("photo-1612198188060-c7c2a3b66eae", 26) },
  { name: "Phone Cases", icon: "smartphone", image: img("photo-1592890288564-76628a30a657", 27) },
  { name: "Data Cables", icon: "cable", image: img("photo-1606293459409-72e0e15c4ef9", 28) },
];