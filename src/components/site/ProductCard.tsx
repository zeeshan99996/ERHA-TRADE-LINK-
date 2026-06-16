import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/products";
import { Link } from "@tanstack/react-router";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const discountPct = p.oldPrice
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      category: p.category,
      image: p.image,
      price: p.price,
      // fallback if stock is not defined in static product
    }, 1);
    toast.success(`${p.name} added to cart!`);
    openCartDrawer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04 }}
      className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
    >
      {/* Image area */}
      <Link to="/product/$id" params={{ id: p.id }} className="relative aspect-square overflow-hidden bg-muted block">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        {p.badge && (
          <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 rounded-full gradient-brand px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            {p.badge}
          </span>
        )}

        {/* Discount badge */}
        {discountPct && !p.badge && (
          <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 rounded-full bg-red-500 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-soft">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast.success("Added to wishlist!");
          }}
          aria-label="Wishlist"
          className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 grid size-8 sm:size-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white hover:text-brand cursor-pointer"
        >
          <Heart className="size-3.5 sm:size-4" />
        </button>

        {/* Hover overlay actions */}
        <div className="absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full gradient-brand py-2 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-white shadow-soft cursor-pointer hover:opacity-95"
          >
            <ShoppingCart className="size-3 sm:size-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </button>
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            aria-label="Quick view"
            className="grid size-9 sm:size-10 place-items-center rounded-full bg-white text-ink shadow-soft hover:text-brand cursor-pointer"
          >
            <Eye className="size-3.5 sm:size-4" />
          </Link>
        </div>
      </Link>

      {/* Info area */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.category}</div>
        <h3 className="mt-1 line-clamp-2 font-display text-xs sm:text-sm font-semibold text-ink leading-snug hover:text-brand transition">
          <Link to="/product/$id" params={{ id: p.id }}>
            {p.name}
          </Link>
        </h3>

        {/* Stars */}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-xs">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} className={`size-3 sm:size-3.5 ${k < Math.round(p.rating) ? "fill-current" : "opacity-30"}`} />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">({p.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="font-display text-sm sm:text-lg font-bold text-brand">Rs. {p.price.toLocaleString()}</span>
          {p.oldPrice && (
            <span className="text-[10px] sm:text-xs text-muted-foreground line-through">Rs. {p.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}