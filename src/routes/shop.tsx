import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";
import { ShoppingCart, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/shop")({
  loader: async () => {
    try {
      const prods = await db.getProducts();
      return { products: (prods || []).filter((p: any) => p && (p.status === "Active" || !p.status)) };
    } catch {
      return { products: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Shop Premium Tech & Accessories | ERHA Trade Link" },
      {
        name: "description",
        content:
          "Browse our collection of premium tech and charging accessories in Pakistan. Wireless earbuds, smartwatches, power banks, chargers and audio gear.",
      },
    ],
  }),
  component: ShopComponent,
});

/* ────────────────────────────────────────────
   Animated heading — letters slide in + glow
   on hover the whole heading shimmers
──────────────────────────────────────────── */
function AnimatedHeading() {
  const text = "Our Products";
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <h1
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-block cursor-default select-none"
      style={{
        fontSize: "30px",
        fontWeight: 900,
        letterSpacing: "-0.03em",
        lineHeight: 1.15,
      }}
    >
      {/* Shimmer underline on hover */}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: "-4px",
          height: "3px",
          borderRadius: "99px",
          background: "linear-gradient(90deg,#06b6d4,#6366f1,#a855f7)",
          width: hovered ? "100%" : "0%",
          transition: "width 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      />
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: hovered ? (i % 2 === 0 ? "#06b6d4" : "#6366f1") : "#0f172a",
            transform: inView
              ? "translateY(0) scale(1)"
              : "translateY(24px) scale(0.85)",
            opacity: inView ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(.34,1.56,.64,1) ${i * 35}ms,
                         opacity 0.35s ease ${i * 35}ms,
                         color 0.25s ease`,
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

/* ────────────────────────────────────────────
   Single product card
──────────────────────────────────────────── */
function ProductCard({ p, onAddToCart }: { p: any; onAddToCart: (p: any, e: React.MouseEvent) => void }) {
  const price = p.salePrice || p.price;
  const hasDiscount = p.salePrice && p.price > p.salePrice;
  const discountPct = hasDiscount
    ? Math.round(((p.price - p.salePrice) / p.price) * 100)
    : 0;
  const img = p.image ? p.image.split("|||")[0] : "";

  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_8px_32px_rgba(6,182,212,0.15)] relative"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {p.badge && (
          <span className="rounded-full bg-indigo-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            {p.badge}
          </span>
        )}
        {hasDiscount && (
          <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            -{discountPct}% OFF
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-slate-50 border-b border-slate-100 relative flex items-center justify-center p-4">
        {img ? (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="size-full object-contain transition duration-500 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }}
          />
        ) : (
          <div className="size-full flex items-center justify-center text-slate-300 text-xs">
            No image
          </div>
        )}
        {p.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 border-2 border-white rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {p.category}
        </span>
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition line-clamp-2 mt-1 leading-snug">
          {p.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3 fill-current ${
                i < Math.floor(p.rating || 5) ? "text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-[10px] font-semibold text-slate-500 ml-0.5">
            {p.rating || "4.8"} ({p.reviews || "100"})
          </span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <span className="text-base font-extrabold text-slate-900">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="block text-xs text-slate-400 line-through">
                Rs. {p.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => onAddToCart(p, e)}
            disabled={p.stock === 0}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition duration-150 active:scale-95 ${
              p.stock === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow hover:opacity-90"
            }`}
          >
            <ShoppingCart className="size-3" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────
   Page component
──────────────────────────────────────────── */
function ShopComponent() {
  const loaderData = Route.useLoaderData() as { products: any[] } | undefined;
  const [products, setProducts] = useState<any[]>(loaderData?.products || []);
  const [loading, setLoading] = useState(!loaderData?.products || loaderData.products.length === 0);

  useEffect(() => {
    const load = async () => {
      const prods = await db.getProducts();
      const active = (prods || []).filter((p: any) => p && (p.status === "Active" || !p.status));
      setProducts(active);
      setLoading(false);
    };
    if (!loaderData?.products || loaderData.products.length === 0) {
      load();
    }
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [loaderData]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image ? product.image.split("|||")[0] : "",
        price: product.salePrice || product.price,
        stock: product.stock,
      },
      1
    );
    toast.success(`${product.name} added to cart!`);
    openCartDrawer();
  };

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center text-center gap-2">
          <AnimatedHeading />
          <p className="text-sm text-slate-500 max-w-md mt-1">
            Discover our full range of premium tech &amp; charging accessories
          </p>
          {/* Decorative accent line */}
          <div
            style={{
              height: "3px",
              width: "64px",
              borderRadius: "99px",
              background: "linear-gradient(90deg,#06b6d4,#6366f1)",
              marginTop: "6px",
            }}
          />
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-200/70 animate-pulse overflow-hidden"
              >
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 w-16 bg-slate-100 rounded-full" />
                  <div className="h-3.5 w-full bg-slate-100 rounded-full" />
                  <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Zap className="size-12 text-slate-200" />
            <p className="text-slate-500 text-sm font-medium">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
