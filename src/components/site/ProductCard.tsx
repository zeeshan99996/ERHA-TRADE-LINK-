import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/lib/products";

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-110" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            {p.badge}
          </span>
        )}
        <button aria-label="Wishlist" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white hover:text-brand">
          <Heart className="size-4" />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full gradient-brand py-2.5 text-xs font-semibold text-white shadow-soft">
            <ShoppingCart className="size-4" /> Add to Cart
          </button>
          <button aria-label="Quick view" className="grid size-10 place-items-center rounded-full bg-white text-ink shadow-soft hover:text-brand">
            <Eye className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.category}</div>
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-semibold text-ink">{p.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} className={`size-3.5 ${k < Math.round(p.rating) ? "fill-current" : "opacity-30"}`} />
            ))}
          </div>
          <span className="text-muted-foreground">({p.reviews})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-brand">Rs. {p.price.toLocaleString()}</span>
          {p.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">Rs. {p.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}