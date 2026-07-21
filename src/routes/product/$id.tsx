import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
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
        { title: `Premium Product | ERHA Trade Link` },
        { name: "description", content: "Buy high performance tech and charging accessories with warranty and fast delivery nationwide from ERHA Trade Link Multan." }
      ],
    };
  },
  component: ProductDetailComponent,
});

function ProductDetailComponent() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageTilt, setImageTilt] = useState({ x: 0, y: 0 });
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setImageTilt({ x, y });
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setImageTilt({ x: 0, y: 0 });
    setIsImageHovered(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        // Fetch single product directly (extremely fast)
        const found = await db.getProduct(id);
        
        if (found) {
          setProduct(found);
          // Set loading to false early so details show up instantly!
          setIsLoading(false);
          
          // Fetch related products asynchronously in the background
          db.getProducts().then((products) => {
            if (products && Array.isArray(products)) {
              const related = products
                .filter((p) => p && p.id && p.category && found.category && p.category === found.category && String(p.id).trim().toLowerCase() !== String(found.id).trim().toLowerCase() && p.status === "Active")
                .slice(0, 4);
              setRelatedProducts(related);
            }
          }).catch(err => console.error("Error loading related products:", err));
        } else {
          setProduct(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
        setIsLoading(false);
      }
    };

    loadProduct();
    
    // Register window storage listener to update UI when background SWR finishes
    window.addEventListener("storage", loadProduct);
    
    // Reset quantity and active image on product change
    setQuantity(1);
    setSelectedImageIndex(0);
    
    // Scroll to top
    window.scrollTo(0, 0);

    return () => window.removeEventListener("storage", loadProduct);
  }, [id, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-pulse flex-1">
          {/* Back Link skeleton */}
          <div className="mb-6 h-4 w-24 bg-slate-200 rounded-full" />
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-soft">
            {/* Left Column: Image skeleton */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="aspect-square w-full bg-slate-100 rounded-2xl" />
              <div className="flex gap-3 justify-center">
                <div className="size-16 bg-slate-100 rounded-xl" />
                <div className="size-16 bg-slate-100 rounded-xl" />
                <div className="size-16 bg-slate-100 rounded-xl" />
              </div>
            </div>
            
            {/* Right Column: Info skeleton */}
            <div className="lg:col-span-6 flex flex-col space-y-6 justify-center">
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
              <div className="h-10 w-3/4 bg-slate-100 rounded-lg" />
              <div className="h-4 w-32 bg-slate-100 rounded-full" />
              <div className="h-8 w-40 bg-slate-100 rounded-full" />
              <div className="h-6 w-36 bg-slate-100 rounded-full" />
              
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-full" />
                <div className="h-4 w-5/6 bg-slate-100 rounded-full" />
              </div>
              
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6">The product you are looking for does not exist or has been removed.</p>
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

  const images = product.image ? product.image.split('|||').filter(Boolean) : [];
  const activeImage = images[selectedImageIndex] || "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400";

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.price > product.salePrice;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.minStock || 15);

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      image: images[0] || "",
      price: price,
      stock: product.stock,
    }, quantity);

    toast.success(`${product.name} added to cart! Proceeding to checkout...`);
    navigate({ to: "/checkout" });
  };

  const handleQtyChange = (val: number) => {
    const max = product.stock || 99;
    setQuantity(Math.max(1, Math.min(val, max)));
  };

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand transition"
          >
            <ArrowLeft className="size-4" /> Back to Shop
          </Link>
        </div>

        {/* Premium Product Details Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-soft mb-12">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div 
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              className="relative rounded-2xl overflow-hidden border border-slate-100 bg-[#f8f9fa] aspect-square w-full transition-all duration-300 shadow-sm flex items-center justify-center p-6"
              style={{
                transform: isImageHovered
                  ? `perspective(1000px) rotateY(${imageTilt.x * 8}deg) rotateX(${imageTilt.y * -8}deg) scale(1.01)`
                  : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
                transformStyle: "preserve-3d",
                transition: isImageHovered
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500"
                style={{
                  transform: isImageHovered ? "translateZ(20px)" : "translateZ(0px)",
                  transition: "transform 0.3s ease-out",
                }}
              />
              {product.badge && (
                <span 
                  className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm"
                  style={{
                    transform: isImageHovered ? "translateZ(30px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  {product.badge}
                </span>
              )}
              {hasDiscount && (
                <span 
                  className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm"
                  style={{
                    transform: isImageHovered ? "translateZ(30px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  {discountPercent}% OFF
                </span>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-white text-base font-bold uppercase tracking-wider px-4 py-2 border-2 border-white rounded-lg bg-slate-950/80">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`size-16 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? "border-brand scale-105 shadow-soft" : "border-slate-100 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="size-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product details */}
          <div className="lg:col-span-6 flex flex-col space-y-6 justify-center">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-brand/5 border border-brand/10 px-3 py-0.5 text-xs font-semibold text-brand">
                {product.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <p className="text-xs text-slate-400 font-mono">SKU: {product.sku || `ERH-${product.id}`}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`size-4.5 fill-current ${idx < Math.floor(product.rating || 5) ? "text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {product.rating || "4.8"}
              </span>
              <span className="text-xs text-slate-400 border-l border-slate-200 pl-2">
                {product.reviews || "120"} Verified Customer Reviews
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-center gap-3 border-t border-b border-slate-100 py-4 my-2">
              <span className="text-3xl sm:text-4xl font-black text-brand tracking-tight">
                Rs. {price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  ● Out of Stock (Coming soon)
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  ● Low Stock Alert (Only {product.stock} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ● In Stock (Ready to ship from Multan)
                </span>
              )}
            </div>

            {/* Short description overview */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Details</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                {product.shortDescription || "Premium high-speed portable battery charger designed for all mobile devices."}
              </p>
            </div>

            {/* Quantity and Actions */}
            {!isOutOfStock && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 overflow-hidden w-full sm:w-32 h-12 shadow-inner">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    className="p-3.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    className="p-3.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl gradient-brand text-sm font-bold text-white shadow-soft transition hover:opacity-95 active:scale-[0.99] cursor-pointer hover:shadow-glow"
                >
                  <Zap className="size-4 fill-current" /> Buy Now
                </button>
              </div>
            )}

            {/* WhatsApp Direct Buy */}
            <a
              href={`https://wa.me/923023333499?text=Hi%20ERHA%20Trade%20Link,%20I%20am%20interested%20in%20buying%20the%20${encodeURIComponent(product.name)}%20(Price:%20Rs.%20${price.toLocaleString()})`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-sm font-bold text-white shadow-soft transition duration-150 cursor-pointer hover:shadow-lg"
            >
              <MessageCircle className="size-5 fill-current" /> Order on WhatsApp (COD Available)
            </a>

            {/* Trust highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 my-2 text-xs font-semibold text-slate-600">
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
              <div className="space-y-2 border-t border-slate-50 pt-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
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

        {/* Technical Specifications Tab */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-soft">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-50 pb-3">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(product.specifications).map(([key, val]: [string, any]) => (
                <div key={key} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0 text-sm">
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="font-bold text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {relatedProducts.map((p) => {
                const price = p.salePrice || p.price;
                return (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition hover:border-brand/40 hover:shadow-soft"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-50 relative flex items-center justify-center p-4">
                      <img
                        src={p.image ? p.image.split("|||")[0] : ""}
                        alt={p.name}
                        className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-103 transition duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{p.category}</span>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand transition line-clamp-1 mt-0.5">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-extrabold text-brand">Rs. {price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-brand hover:underline">View details</span>
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
