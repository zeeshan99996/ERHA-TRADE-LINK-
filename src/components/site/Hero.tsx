import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";
import type { Product } from "@/lib/products";

interface HeroProps {
  products?: Product[];
}

const PALETTES = [
  { bg: "#eef9ff", accent: "#06b6d4", btn: "linear-gradient(135deg,#06b6d4,#2563eb)" },
  { bg: "#f5f0ff", accent: "#7c3aed", btn: "linear-gradient(135deg,#7c3aed,#a21caf)" },
  { bg: "#fff0f5", accent: "#e11d48", btn: "linear-gradient(135deg,#e11d48,#db2777)" },
  { bg: "#fffbeb", accent: "#d97706", btn: "linear-gradient(135deg,#d97706,#ea580c)" },
  { bg: "#f0fdf4", accent: "#059669", btn: "linear-gradient(135deg,#059669,#0d9488)" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getImg(product: any): string {
  if (!product?.image) return "";
  const raw = product.image as string;
  return raw.includes("|||") ? raw.split("|||")[0] : raw;
}

interface ProductCardProps {
  product: any;
  palette: typeof PALETTES[0];
  side: "left" | "right";
}

function ProductCard({ product, palette, side }: ProductCardProps) {
  const img = getImg(product);
  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.price > product.salePrice;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, category: product.category, image: img, price, stock: product.stock }, 1);
    toast.success(`${product.name} added to cart!`);
    openCartDrawer();
  };

  return (
    <div
      className="flex items-center gap-3 h-full"
      style={{ flexDirection: side === "left" ? "row" : "row-reverse" }}
    >
      {/* Product Image — no background, pure PNG */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: "120px", height: "130px" }}>
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {/* Category badge */}
        <span
          className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{ background: palette.accent }}
        >
          <Zap className="size-2.5" />
          {product.category || "Tech"}
        </span>

        {/* Name */}
        <h2 className="font-black text-sm sm:text-base lg:text-lg text-slate-900 leading-tight line-clamp-2">
          {product.name}
        </h2>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm sm:text-base font-black text-slate-900">
            Rs {Number(price).toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[11px] text-slate-400 line-through">
                Rs {Number(product.price).toLocaleString()}
              </span>
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200">
                {discountPct}% OFF
              </span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: palette.btn }}
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <ShoppingCart className="size-2.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hero({ products = [] }: HeroProps) {
  const [pairs, setPairs] = useState<[any, any][]>([]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (products.length < 1) return;
    const active = products.filter((p) => p.status === "Active" || !p.status);
    if (active.length === 0) return;
    const shuffled = shuffle(active);
    const built: [any, any][] = [];
    for (let i = 0; i + 1 < shuffled.length; i += 2) {
      built.push([shuffled[i], shuffled[i + 1]]);
    }
    if (shuffled.length === 1) built.push([shuffled[0], shuffled[0]]);
    else if (shuffled.length % 2 === 1) built.push([shuffled[shuffled.length - 1], shuffled[0]]);
    setPairs(built);
    setIdx(Math.floor(Math.random() * built.length));
  }, [products]);

  const fadeTo = useCallback((nextIdx: number) => {
    setVisible(false);
    setTimeout(() => {
      setIdx(nextIdx);
      setVisible(true);
    }, 180);
  }, []);

  const goNext = useCallback(() => {
    if (pairs.length < 2) return;
    fadeTo((idx + 1) % pairs.length);
  }, [pairs.length, idx, fadeTo]);

  const goPrev = useCallback(() => {
    if (pairs.length < 2) return;
    fadeTo((idx - 1 + pairs.length) % pairs.length);
  }, [pairs.length, idx, fadeTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx((prev) => {
        const next = (prev + 1) % pairs.length;
        setVisible(false);
        setTimeout(() => { setIdx(next); setVisible(true); }, 180);
        return prev;
      });
    }, 3500);
  }, [pairs.length]);

  useEffect(() => {
    if (pairs.length < 2) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [pairs.length, resetTimer]);

  if (products.length === 0 || pairs.length === 0) {
    return (
      <section
        className="w-full border-b border-slate-200/60"
        style={{ height: "200px", background: "#eef9ff" }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="size-12 rounded-full bg-slate-200" />
            <div className="h-3 w-48 rounded-full bg-slate-200" />
            <div className="h-2 w-32 rounded-full bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  const [left, right] = pairs[idx];
  const palette = PALETTES[idx % PALETTES.length];

  return (
    <section
      className="relative w-full border-b border-slate-200/60 overflow-hidden select-none"
      style={{ height: "200px", background: palette.bg, transition: "background 0.4s ease" }}
    >
      {/* Crossfade content — no white flash, pure opacity */}
      <div
        className="absolute inset-0 flex items-center"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.18s ease",
          willChange: "opacity",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-2 gap-3 sm:gap-6 h-full items-center">
          {/* LEFT product: image + details */}
          <div className="h-full flex items-center border-r border-slate-200/60 pr-3 sm:pr-6">
            <ProductCard product={left} palette={palette} side="left" />
          </div>

          {/* RIGHT product: image + details */}
          <div className="h-full flex items-center pl-0">
            <ProductCard product={right} palette={palette} side="right" />
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {pairs.length > 1 && (
        <>
          <button
            onClick={() => { goPrev(); resetTimer(); }}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex size-6 items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm hover:bg-white transition cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="size-3.5 text-slate-600" />
          </button>
          <button
            onClick={() => { goNext(); resetTimer(); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex size-6 items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm hover:bg-white transition cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="size-3.5 text-slate-600" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {pairs.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
          {pairs.map((_, i) => (
            <button
              key={i}
              onClick={() => { fadeTo(i); resetTimer(); }}
              className="h-1 rounded-full cursor-pointer transition-all duration-200"
              style={{
                width: i === idx ? "16px" : "4px",
                background: i === idx ? palette.accent : "rgba(100,116,139,0.35)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}