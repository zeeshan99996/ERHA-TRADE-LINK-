export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
};

const img = (q: string, sig: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80&sig=${sig}`;

export const products: Product[] = [
  { id: "p1", name: "ERHA SlimPower 10000 (MagSafe)", category: "MagSafe & Wireless", image: img("photo-1609592424083-d5d14dfc949a", 1), price: 2499, oldPrice: 3499, rating: 4.8, reviews: 342, badge: "Hot" },
  { id: "p2", name: "ERHA PowerCore 20000 (65W)", category: "Laptop Power Banks", image: img("photo-1609091839311-d5365f9ff1c5", 2), price: 3499, oldPrice: 4499, rating: 4.7, reviews: 612, badge: "Best Seller" },
  { id: "p3", name: "ERHA TitanCharge 30000 (100W)", category: "Laptop Power Banks", image: img("photo-1585338447937-7082f8fc763d", 3), price: 5999, oldPrice: 6999, rating: 4.9, reviews: 209, badge: "New" },
  { id: "p4", name: "ERHA SolarVolt Pocket 12000", category: "Rugged & Solar", image: img("photo-1622445262465-2481c4574875", 4), price: 2999, oldPrice: 3999, rating: 4.5, reviews: 124 },
  { id: "p5", name: "ERHA MagCore Mini 5000", category: "Ultra Compact", image: img("photo-1592890288564-76628a30a657", 5), price: 1999, oldPrice: 2499, rating: 4.6, reviews: 88, badge: "New" },
  { id: "p6", name: "ERHA HyperCharge 40000 (140W)", category: "High Capacity", image: img("photo-1583394838336-acd977736f90", 6), price: 8999, oldPrice: 10999, rating: 4.9, reviews: 67, badge: "-20%" },
  { id: "p7", name: "ERHA PocketPower 10000 (22.5W)", category: "Ultra Compact", image: img("photo-1608248597481-496100c80836", 7), price: 2199, oldPrice: 2999, rating: 4.7, reviews: 145 },
  { id: "p8", name: "ERHA ToughCharge 20000 (IP67)", category: "Rugged & Solar", image: img("photo-1609091839311-d5365f9ff1c5", 8), price: 4499, oldPrice: 5499, rating: 4.6, reviews: 93 },
  { id: "p9", name: "ERHA DuoWireless 15000", category: "MagSafe & Wireless", image: img("photo-1609592424083-d5d14dfc949a", 9), price: 3299, oldPrice: 3999, rating: 4.4, reviews: 56 },
  { id: "p10", name: "ERHA LiteCore 5000 (Built-in Cable)", category: "Ultra Compact", image: img("photo-1592890288564-76628a30a657", 10), price: 1599, oldPrice: 1999, rating: 4.5, reviews: 72 },
  { id: "p11", name: "ERHA Nomad SolarStation 50000", category: "Rugged & Solar", image: img("photo-1585338447937-7082f8fc763d", 11), price: 12999, oldPrice: 14999, rating: 4.8, reviews: 34, badge: "Hot" },
  { id: "p12", name: "ERHA ChargeStation Pro 8-Port", category: "High Capacity", image: img("photo-1583394838336-acd977736f90", 12), price: 14999, oldPrice: 17999, rating: 4.7, reviews: 19 },
  { id: "p13", name: "ERHA PocketCharge Slim 5000", category: "Ultra Compact", image: img("photo-1609592424083-d5d14dfc949a", 13), price: 1499, oldPrice: 1999, rating: 4.4, reviews: 48, badge: "New" },
];

export const categories = [
  { name: "Ultra Compact", icon: "smartphone", image: img("photo-1592890288564-76628a30a657", 21) },
  { name: "High Capacity", icon: "battery-charging", image: img("photo-1583394838336-acd977736f90", 22) },
  { name: "MagSafe & Wireless", icon: "zap", image: img("photo-1609592424083-d5d14dfc949a", 23) },
  { name: "Laptop Power Banks", icon: "zap", image: img("photo-1609091839311-d5365f9ff1c5", 24) },
  { name: "Rugged & Solar", icon: "cable", image: img("photo-1622445262465-2481c4574875", 25) },
];