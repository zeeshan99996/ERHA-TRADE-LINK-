import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getCart, removeFromCart, updateCartQty, getCartTotal, CartItem } from "@/lib/cart";

export function openCartDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("erha_cart_open"));
  }
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Sync cart items initially
    setItems(getCart());

    // Listen to open request
    const handleOpen = () => setIsOpen(true);
    // Listen to cart updates
    const handleUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener("erha_cart_open", handleOpen);
    window.addEventListener("erha_cart_update", handleUpdate);
    // Also listen to normal storage sync for other windows
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("erha_cart_open", handleOpen);
      window.removeEventListener("erha_cart_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const total = getCartTotal();
  const freeShippingLimit = 2999;
  const isFreeShipping = total >= freeShippingLimit;
  const progressToFree = Math.min(100, (total / freeShippingLimit) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-0 right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-card/95 shadow-glow backdrop-blur-xl border-l border-border/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="size-5 text-brand" />
                <h2 className="text-lg font-bold text-ink">Your Shopping Cart</h2>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted/80 hover:text-ink transition duration-150"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Free Shipping Tracker */}
            {items.length > 0 && (
              <div className="bg-brand/5 border-b border-brand/10 px-6 py-3.5">
                <div className="flex justify-between text-xs font-semibold text-ink mb-1.5">
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">🎉 Congrats! You get FREE shipping.</span>
                    ) : (
                      <span>
                        Add <span className="text-brand">Rs. {(freeShippingLimit - total).toLocaleString()}</span> more for free delivery
                      </span>
                    )}
                  </span>
                  <span>Rs. {freeShippingLimit.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all duration-300 rounded-full"
                    style={{ width: `${progressToFree}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="rounded-full bg-muted/60 p-6 mb-4">
                    <ShoppingBag className="size-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-1.5">Your Cart is Empty</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] mb-6">
                    Looks like you haven't added any premium power banks to your cart yet.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Route to shop or search if needed
                    }}
                    className="inline-flex items-center justify-center rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 py-4 first:pt-0">
                      {/* Product Image */}
                      <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="size-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-sm font-bold text-ink truncate pr-2 hover:text-brand transition">
                              <Link to="/" onClick={() => setIsOpen(false)}>
                                {item.product.name}
                              </Link>
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-muted-foreground hover:text-rose-500 transition duration-150 p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.product.category}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-border rounded-full bg-card overflow-hidden">
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-muted-foreground hover:text-ink hover:bg-muted/80 transition"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-muted-foreground hover:text-ink hover:bg-muted/80 transition"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-sm font-bold text-brand">
                              Rs. {(item.product.price * item.quantity).toLocaleString()}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-muted-foreground">
                                Rs. {item.product.price.toLocaleString()} each
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border/60 bg-muted/30 px-6 py-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink">Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{isFreeShipping ? "FREE" : "Rs. 250"}</span>
                  </div>
                  <div className="border-t border-border/60 my-2 pt-2 flex justify-between text-base font-bold text-ink">
                    <span>Total Amount</span>
                    <span className="text-brand">
                      Rs. {(total + (isFreeShipping ? 0 : 250)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full gradient-brand py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-95 active:scale-[0.99]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="size-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>Safe & Secure checkout • Warranty included</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
