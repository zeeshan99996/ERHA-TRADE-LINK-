import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingCart, Menu, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/erha-logo.png";
import { products } from "@/lib/products";
import { getCartCount } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "/shop" },
  { name: "Categories", to: "/#categories" },
  { name: "Deals", to: "/shop", search: { category: "Ultra Compact" } },
  { name: "Contact", to: "/#footer" }
];

const trendingSearches = ["Wireless Earbuds", "Smart Watches", "Power Banks", "Speakers", "Chargers"];

export function Header() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const dropdownRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCartCount(getCartCount());
    const handleUpdate = () => {
      setCartCount(getCartCount());
    };
    window.addEventListener("erha_cart_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("erha_cart_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    setShowMobileDropdown(false);
    setOpen(false);
    navigate({
      to: "/shop",
      search: { search: searchVal },
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const latestProducts = products.filter((p) => p.badge === "New").slice(0, 3);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="hidden gradient-brand px-4 py-2 text-center text-xs font-medium text-white sm:block">
        🎉 Free delivery across Pakistan on orders over Rs. 2,999 • Use code <span className="font-bold">ERHA10</span> for 10% off
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Left: Logo */}
        <div className="flex lg:w-48 shrink-0 items-center">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="ERHA Trade Link" className="h-9 w-auto sm:h-11 object-contain" />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} ref={dropdownRef} className="hidden flex-1 max-w-xl lg:flex justify-center relative">
          <div className="group relative flex w-full items-center overflow-hidden rounded-full border border-border bg-card pl-5 pr-1.5 shadow-soft transition focus-within:border-brand focus-within:shadow-glow">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search power banks, chargers…"
              className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            <button type="submit" className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 shrink-0 cursor-pointer">
              Search
            </button>
          </div>

          {/* Search Dropdown Overlay */}
          {showDropdown && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-border bg-card/95 p-5 shadow-glow backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-5 gap-6 text-left">
                {/* Left column: Trending Searches */}
                <div className="col-span-2 border-r border-border/60 pr-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Trending Searches</h4>
                  <ul className="space-y-2">
                    {trendingSearches.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchVal(item);
                            navigate({ to: "/shop", search: { search: item } });
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 text-sm text-ink/80 hover:text-brand transition duration-150 w-full text-left cursor-pointer"
                        >
                          <Search className="size-3.5 text-muted-foreground" />
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right column: Latest Products */}
                <div className="col-span-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Latest Products</h4>
                  <div className="space-y-3">
                    {latestProducts.map((p) => (
                      <Link
                        key={p.id}
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted/50 transition duration-150 group"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          <img src={p.image} alt={p.name} className="size-full object-cover group-hover:scale-105 transition" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate group-hover:text-brand transition">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-brand">Rs. {p.price.toLocaleString()}</div>
                          {p.oldPrice && (
                            <div className="text-xs text-muted-foreground line-through">Rs. {p.oldPrice.toLocaleString()}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Right: Actions */}
        <div className="flex lg:w-48 shrink-0 items-center justify-end gap-1 sm:gap-2">

          <IconBtn label="Account" onClick={() => navigate({ to: "/admin" })}><User className="size-5" /></IconBtn>
          <IconBtn label="Wishlist"><Heart className="size-5" /></IconBtn>
          <IconBtn label="Cart" badge={cartCount > 0 ? String(cartCount) : undefined} onClick={openCartDrawer}>
            <ShoppingCart className="size-5" />
          </IconBtn>
          <button
            className="ml-1 inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-border/60 bg-card/40 lg:block">
        <div className="mx-auto max-w-7xl px-6 relative flex items-center justify-center">
          <ul className="flex items-center gap-1">
            {navItems.map((n) => (
              <li key={n.name}>
                <Link
                  to={n.to}
                  search={n.search}
                  className="relative inline-flex items-center px-4 py-3 text-sm font-medium text-ink/80 transition hover:text-brand"
                >
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="absolute right-6 text-sm font-medium text-brand">📞 0302-3333499</div>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="space-y-1 px-4 py-3">
            <form onSubmit={handleSearchSubmit} ref={mobileSearchRef} className="relative mb-3">
              <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 bg-card">
                <Search className="size-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Search products…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onFocus={() => setShowMobileDropdown(true)}
                />
              </div>

              {/* Mobile Search Dropdown */}
              {showMobileDropdown && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl border border-border bg-card p-4 shadow-glow max-h-80 overflow-y-auto">
                  <div className="space-y-4 text-left">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Trending Searches</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingSearches.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSearchVal(item);
                              setShowMobileDropdown(false);
                              navigate({ to: "/shop", search: { search: item } });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs text-ink/80 hover:bg-muted/80 hover:text-brand transition cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Latest Products</h4>
                      <div className="space-y-2">
                        {latestProducts.map((p) => (
                          <Link
                            key={p.id}
                            to="/product/$id"
                            params={{ id: p.id }}
                            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted/50 transition duration-150"
                            onClick={() => {
                              setShowMobileDropdown(false);
                              setOpen(false);
                            }}
                          >
                            <div className="size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                              <img src={p.image} alt={p.name} className="size-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">{p.name}</div>
                              <div className="text-[10px] text-muted-foreground">Rs. {p.price.toLocaleString()}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
            {navItems.map((n) => (
              <Link
                key={n.name}
                to={n.to}
                search={n.search}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.name}
              </Link>
            ))}
            {/* Mobile Admin Link */}
            <div className="pt-2 mt-2 border-t border-border">
              <a href="tel:03023333499" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand mt-1">
                📞 0302-3333499
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function IconBtn({ children, label, badge, onClick }: { children: React.ReactNode; label: string; badge?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-muted cursor-pointer"
    >
      {children}
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full gradient-brand px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}