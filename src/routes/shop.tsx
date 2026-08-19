import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";
import { ShoppingCart, Star, Zap, Search, X, Sparkles, Filter } from "lucide-react";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    search: typeof search.search === "string" ? search.search : typeof search.q === "string" ? search.q : "",
    category: typeof search.category === "string" ? search.category : "All",
  }),
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
   Smart Search & Category Matching Helpers
──────────────────────────────────────────── */
function matchesSearch(product: any, query: string): boolean {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const name = String(product.name || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();
  const desc = String(product.shortDescription || product.description || "").toLowerCase();
  const brand = String(product.brand || "").toLowerCase();
  const sku = String(product.sku || "").toLowerCase();

  // If user searched for power bank variations
  if (
    q.includes("power") ||
    q.includes("bank") ||
    q.includes("battery") ||
    q.includes("pzx") ||
    q.includes("10000") ||
    q.includes("mah")
  ) {
    if (
      name.includes("power") ||
      name.includes("bank") ||
      category.includes("power") ||
      category.includes("compact") ||
      desc.includes("power") ||
      desc.includes("bank")
    ) {
      return true;
    }
    // If exact earbuds search, don't match power bank
    if (q.includes("earbud") || q.includes("audio")) {
      return false;
    }
  }

  // If user searched for earbuds / audio variations
  if (
    q.includes("ear") ||
    q.includes("bud") ||
    q.includes("headphone") ||
    q.includes("airpod") ||
    q.includes("audio") ||
    q.includes("zoro") ||
    q.includes("tltm") ||
    q.includes("anc") ||
    q.includes("enc") ||
    q.includes("bass") ||
    q.includes("tws")
  ) {
    if (
      name.includes("earbud") ||
      name.includes("earbuds") ||
      name.includes("wireless") ||
      name.includes("bluetooth") ||
      category.includes("earbuds") ||
      category.includes("audio") ||
      desc.includes("earbuds")
    ) {
      return true;
    }
    // If query is specifically earbuds, don't match power bank
    if (!q.includes("power") && !q.includes("bank")) {
      if (name.includes("power bank")) return false;
    }
  }

  // Standard token matching across all product metadata
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every(
    (token) =>
      name.includes(token) ||
      category.includes(token) ||
      desc.includes(token) ||
      brand.includes(token) ||
      sku.includes(token)
  );
}

function matchesCategory(product: any, cat: string): boolean {
  if (!cat || cat === "All") return true;
  const c = cat.toLowerCase();
  const pCat = String(product.category || "").toLowerCase();
  const pName = String(product.name || "").toLowerCase();

  if (c.includes("power")) {
    return pCat.includes("power") || pCat.includes("compact") || pName.includes("power") || pName.includes("bank");
  }
  if (c.includes("earbud")) {
    return pCat.includes("earbuds") || pName.includes("earbuds") || pName.includes("earbud");
  }
  return pCat.includes(c);
}

/* ────────────────────────────────────────────
   Animated heading — letters slide in + glow
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

const CATEGORIES = [
  { id: "All", label: "All Products" },
  { id: "Power Banks", label: "Power Banks" },
  { id: "Wireless Earbuds", label: "Wireless Earbuds" },
];

/* ────────────────────────────────────────────
   Page component
──────────────────────────────────────────── */
function ShopComponent() {
  const { search: searchParam, category: categoryParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const loaderData = Route.useLoaderData() as { products: any[] } | undefined;
  const [products, setProducts] = useState<any[]>(loaderData?.products || []);
  const [loading, setLoading] = useState(!loaderData?.products || loaderData.products.length === 0);
  const [localSearch, setLocalSearch] = useState(searchParam || "");

  // Sync local input with URL search param
  useEffect(() => {
    setLocalSearch(searchParam || "");
  }, [searchParam]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({
        ...prev,
        search: localSearch.trim(),
      }),
    });
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: "",
      }),
    });
  };

  const handleCategorySelect = (catId: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: catId,
      }),
    });
  };

  // Filter products based on search term & category
  const filteredProducts = products.filter(
    (p) => matchesCategory(p, categoryParam) && matchesSearch(p, searchParam)
  );

  const hasActiveFilters = Boolean(searchParam && searchParam.trim()) || (categoryParam && categoryParam !== "All");

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6 flex flex-col items-center text-center gap-2">
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

        {/* Search Bar & Category Filter Controls */}
        <div className="mb-8 max-w-3xl mx-auto space-y-4">
          {/* Shop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center rounded-full bg-white border border-slate-200 shadow-sm pl-4 pr-1.5 py-1.5 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <Search className="size-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search power banks, earbuds, accessories..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  // Real-time instant filtering as user types
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      search: e.target.value,
                    }),
                  });
                }}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = (categoryParam || "All") === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-sm scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Search / Filter Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between bg-cyan-50/70 border border-cyan-200/70 rounded-xl px-4 py-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className="size-3.5 text-cyan-600 shrink-0" />
                <span>
                  Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}
                  {searchParam && searchParam.trim() ? (
                    <> for "<strong>{searchParam}</strong>"</>
                  ) : null}
                  {categoryParam && categoryParam !== "All" ? (
                    <> in <strong>{categoryParam}</strong></>
                  ) : null}
                </span>
              </div>
              <button
                onClick={() => {
                  setLocalSearch("");
                  navigate({
                    search: () => ({ search: "", category: "All" }),
                  });
                }}
                className="text-cyan-700 hover:text-cyan-900 font-semibold underline ml-2 shrink-0 cursor-pointer"
              >
                Reset all
              </button>
            </div>
          )}
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
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-3xl border border-slate-200/70 p-8 text-center max-w-md mx-auto shadow-sm">
            <div className="size-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Search className="size-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No products found</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                We couldn't find any products matching "<strong>{searchParam || categoryParam}</strong>".
              </p>
            </div>
            <button
              onClick={() => {
                setLocalSearch("");
                navigate({
                  search: () => ({ search: "", category: "All" }),
                });
              }}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} p={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
