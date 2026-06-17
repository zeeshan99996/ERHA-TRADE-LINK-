import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { db } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { openCartDrawer } from "@/components/site/CartDrawer";
import { toast } from "sonner";
import { Star, ShieldCheck, Truck, RefreshCw, Zap, Plus, Minus, ArrowLeft, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    // We don't have direct access to localStorage in static meta generator, but we can do a fallback
    return {
      meta: [
        { title: `Premium Power Bank | ERHA Trade Link` },
        { name: "description", content: "Buy high performance power bank with warranty and fast delivery nationwide from ERHA Trade Link Multan." }
      ],
    };
  },
  component: ProductDetailComponent,
});

function ProductDetailComponent() {
  const { id } = useParams({ from: "/product/$id" });
  
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      const products = await db.getProducts();
      const found = products.find((p) => p.id === id);
      
      if (found) {
        setProduct(found);
        
        // Load related products (same category, excluding current)
        const related = products
          .filter((p) => p.category === found.category && p.id !== found.id && p.status === "Active")
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
    };

    loadProduct();
    
    // Reset quantity on product change
    setQuantity(1);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-2xl font-bold text-ink mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The power bank you are looking for does not exist or has been removed.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
          >
            <ArrowLeft className="size-4" /> Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.price > product.salePrice;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.minStock || 15);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      price: price,
      stock: product.stock,
    }, quantity);

    toast.success(`${quantity} x ${product.name} added to cart!`);
    openCartDrawer();
  };

  const handleQtyChange = (val: number) => {
    const max = product.stock || 99;
    setQuantity(Math.max(1, Math.min(val, max)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand transition"
          >
            <ArrowLeft className="size-4" /> Back to Shop
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Product Image */}
          <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted aspect-square lg:aspect-auto lg:h-[500px]">
            <img
              src={product.image}
              alt={product.name}
              className="size-full object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
            {hasDiscount && (
              <span className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                <span className="text-white text-base font-bold uppercase tracking-wider px-4 py-2 border-2 border-white rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-brand/10 border border-brand/20 px-3 py-0.5 text-xs font-semibold text-brand">
                {product.category}
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                {product.name}
              </h1>
              
              <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku || `ERH-${product.id}`}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`size-4.5 fill-current ${idx < Math.floor(product.rating || 5) ? "text-amber-400" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-ink">
                {product.rating || "4.8"}
              </span>
              <span className="text-xs text-muted-foreground border-l border-border/60 pl-2">
                {product.reviews || "120"} Verified Customer Reviews
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-brand">
                Rs. {price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">
                  ● Out of Stock (Coming soon)
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                  ● Low Stock Alert (Only {product.stock} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ● In Stock (Ready to ship from Multan)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Quick Details</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.shortDescription || "Premium high-speed portable battery charger designed for all mobile devices."}
              </p>
            </div>

            {/* Quantity and Actions */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center justify-between border border-border rounded-xl bg-card overflow-hidden w-full sm:w-32 h-12">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    className="p-3.5 text-muted-foreground hover:text-ink hover:bg-muted/80 transition"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    className="p-3.5 text-muted-foreground hover:text-ink hover:bg-muted/80 transition"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl gradient-brand text-sm font-bold text-white shadow-soft transition hover:opacity-95 active:scale-[0.99]"
                >
                  <Zap className="size-4 fill-current" /> Add To Shopping Cart
                </button>
              </div>
            )}

            {/* WhatsApp Direct Buy */}
            <a
              href={`https://wa.me/923023333499?text=Hi%20ERHA%20Trade%20Link,%20I%20am%20interested%20in%20buying%20the%20${encodeURIComponent(product.name)}%20(Price:%20Rs.%20${price.toLocaleString()})`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-sm font-bold text-white shadow-soft transition duration-150"
            >
              <MessageCircle className="size-5 fill-current" /> Order on WhatsApp (COD Available)
            </a>

            {/* Trust highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-border/60 py-4 my-4 text-xs font-semibold text-ink">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-brand shrink-0" />
                <span>1-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="size-5 text-brand shrink-0" />
                <span>Nationwide Shipping</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="size-5 text-brand shrink-0" />
                <span>7-Day Return Policy</span>
              </div>
            </div>

            {/* Specifications & Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Product Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {product.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand shrink-0 mt-0.5">✔</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Tab */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 bg-card rounded-2xl border border-border/40 p-6 sm:p-8 shadow-soft">
            <h2 className="text-lg font-bold text-ink mb-4 border-b border-border/60 pb-3">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(product.specifications).map(([key, val]: [string, any]) => (
                <div key={key} className="flex justify-between py-2.5 border-b border-border/40 last:border-0 text-sm">
                  <span className="font-semibold text-muted-foreground">{key}</span>
                  <span className="font-bold text-ink">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {relatedProducts.map((p) => {
                const price = p.salePrice || p.price;
                return (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-brand/40 hover:shadow-soft"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-muted relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="size-full object-cover group-hover:scale-103 transition duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{p.category}</span>
                      <h4 className="text-sm font-bold text-ink group-hover:text-brand transition line-clamp-1 mt-0.5">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-extrabold text-brand">Rs. {price.toLocaleString()}</span>
                        <span className="text-[10px] font-semibold text-emerald-600">Buy now</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
