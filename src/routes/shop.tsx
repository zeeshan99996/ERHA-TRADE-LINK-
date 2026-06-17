import { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";
import { Search, SlidersHorizontal, Grid, List, Star, ArrowUpDown, ChevronDown, Check, ArrowRight, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const shopSearchSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
});

type ShopSearch = z.infer<typeof shopSearchSchema>;

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    return shopSearchSchema.parse(search);
  },
  head: () => ({
    meta: [
      { title: "Shop Premium Power Banks | ERHA Trade Link" },
      {
        name: "description",
        content: "Browse our collection of premium power banks in Pakistan. High capacity, MagSafe wireless chargers, rugged solar chargers & laptop battery packs.",
      },
    ],
  }),
  component: ShopComponent,
});

function ShopComponent() {
  const searchParams = useSearch({ from: "/shop" });
  
  // Local state initialized with query params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync with search queries when they change from outside (e.g. Header Search/Categories)
  useEffect(() => {
    if (searchParams.search !== undefined) {
      setSearchQuery(searchParams.search);
    }
    if (searchParams.category !== undefined) {
      setSelectedCategory(searchParams.category);
    }
  }, [searchParams.search, searchParams.category]);

  // Load from local storage DB on mount & listen to changes
  useEffect(() => {
    const loadData = async () => {
      const prods = await db.getProducts();
      setProductsList(prods);
      const cats = await db.getCategories();
      // Ensure "All" is not in list but we add it manually or handle it
      setCategoriesList(cats);
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = productsList
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "All" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        // Handle slugs
        (selectedCategory === "MagSafe & Wireless" && p.category === "MagSafe & Wireless") ||
        (selectedCategory === "magsafe-wireless" && p.category === "MagSafe & Wireless");

      return matchSearch && matchCategory && p.status === "Active";
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
      return 0; // featured/default
    });

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      price: product.salePrice || product.price,
      stock: product.stock,
    }, 1);

    toast.success(`${product.name} added to cart!`);
    openCartDrawer();
  };

  const allCategories = ["All", ...categoriesList.map((c) => c.name)];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 px-6 py-12 sm:px-12 sm:py-16 text-center mb-8 border border-border/40 shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.12),transparent_50%)]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-semibold text-brand">
              <Zap className="size-3" /> Professional Charging Gear
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Shop Premium Power Banks
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore high-performance charging solutions. From ultra-slim pocket packs to heavy-duty laptop power banks, we keep your devices running.
            </p>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-2xl border border-border/40 shadow-soft mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search power banks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted/50 transition lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-xl bg-background overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-brand text-white" : "text-muted-foreground hover:text-ink"}`}
                title="Grid View"
              >
                <Grid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-brand text-white" : "text-muted-foreground hover:text-ink"}`}
                title="List View"
              >
                <List className="size-4" />
              </button>
            </div>

            {/* Sorting */}
            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-background pl-3 pr-8 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-brand cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: Highest</option>
                <option value="reviews">Popularity</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border/40 p-6 space-y-6 shadow-soft">
              <div>
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Categories</h3>
                <ul className="space-y-1.5">
                  {allCategories.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "bg-brand/10 text-brand font-bold"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-ink"
                          }`}
                        >
                          <span>{cat}</span>
                          {isActive && <Check className="size-4" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t border-border/60 pt-6">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Quick Support</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Need help choosing the right capacity or device compatibility? Get live guidance on WhatsApp.
                </p>
                <a
                  href="https://wa.me/923023333499"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 text-xs font-bold transition shadow-soft"
                >
                  WhatsApp Expert
                </a>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border/40 rounded-2xl shadow-soft">
                <p className="text-base text-muted-foreground">No products found matching your filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((p) => {
                  const price = p.salePrice || p.price;
                  const hasDiscount = p.salePrice && p.price > p.salePrice;
                  const discountPercent = hasDiscount ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0;

                  return (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-brand/40 hover:shadow-glow relative"
                    >
                      {/* Product Badges */}
                      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                        {p.badge && (
                          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                            {p.badge}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                            -{discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Image container */}
                      <div className="aspect-square w-full overflow-hidden bg-muted relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="size-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {/* Out of Stock Overlay */}
                        {p.stock === 0 && (
                          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-white rounded-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {p.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-brand transition line-clamp-1 mt-1">
                          {p.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`size-3.5 fill-current ${idx < Math.floor(p.rating || 5) ? "text-amber-400" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-ink">
                            {p.rating || "4.8"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({p.reviews || "100"})
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                          {p.shortDescription || "Premium fast-charging portable power solution."}
                        </p>

                        <div className="flex items-end justify-between mt-auto pt-4">
                          {/* Price block */}
                          <div>
                            <span className="text-base sm:text-lg font-extrabold text-brand">
                              Rs. {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="block text-xs text-muted-foreground line-through">
                                Rs. {p.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Cart button */}
                          <button
                            onClick={(e) => handleAddToCart(p, e)}
                            disabled={p.stock === 0}
                            className={`rounded-full p-2.5 transition duration-150 ${
                              p.stock === 0
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "gradient-brand text-white shadow-soft hover:opacity-95 active:scale-95"
                            }`}
                          >
                            <Zap className="size-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* List Layout */
              <div className="space-y-4">
                {filteredProducts.map((p) => {
                  const price = p.salePrice || p.price;
                  const hasDiscount = p.salePrice && p.price > p.salePrice;

                  return (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-brand/40 hover:shadow-glow"
                    >
                      <div className="w-full sm:w-48 aspect-square sm:aspect-auto shrink-0 relative bg-muted">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="size-full object-cover group-hover:scale-103 transition duration-500"
                        />
                        {p.stock === 0 && (
                          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-white rounded-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col p-5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {p.category}
                        </span>
                        <h3 className="text-lg font-bold text-ink group-hover:text-brand transition mt-1">
                          {p.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`size-3.5 fill-current ${idx < Math.floor(p.rating || 5) ? "text-amber-400" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-ink">
                            {p.rating || "4.8"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({p.reviews || "100"} reviews)
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-3 max-w-xl">
                          {p.shortDescription || "Premium fast-charging portable power solution with advanced safety features."}
                        </p>

                        <div className="flex items-center justify-between sm:justify-start gap-6 mt-auto pt-4 border-t border-border/40">
                          <div>
                            <span className="text-lg font-extrabold text-brand">
                              Rs. {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="ml-2 text-xs text-muted-foreground line-through">
                                Rs. {p.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(p, e)}
                            disabled={p.stock === 0}
                            className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition duration-150 ${
                              p.stock === 0
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "gradient-brand text-white shadow-soft hover:opacity-95 active:scale-95 ml-auto sm:ml-0"
                            }`}
                          >
                            <Zap className="size-3.5 fill-current" /> Add To Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xs lg:hidden"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 top-0 z-[101] flex h-full w-full max-w-xs flex-col bg-card shadow-glow border-r border-border/40 lg:hidden p-6"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                <h2 className="text-base font-bold text-ink">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Categories</h3>
                  <ul className="space-y-1">
                    {allCategories.map((cat) => {
                      const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <li key={cat}>
                          <button
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowMobileFilters(false);
                            }}
                            className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
                              isActive
                                ? "bg-brand/10 text-brand font-bold"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-ink"
                            }`}
                          >
                            <span>{cat}</span>
                            {isActive && <Check className="size-4" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 mt-auto">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowMobileFilters(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-muted-foreground hover:text-ink transition"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
