import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getCart, clearCart, getCartTotal } from "@/lib/cart";
import { db } from "@/lib/supabase";
import { toast } from "sonner";
import { ShieldCheck, Ticket, CheckCircle2, ArrowRight, CornerDownRight, Landmark, CreditCard, MessageCircle, Truck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | ERHA Trade Link" },
      { name: "description", content: "Complete your order for premium power banks with Cash on Delivery or Mobile Payments." }
    ],
  }),
  component: CheckoutComponent,
});

function CheckoutComponent() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Multan",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const subtotal = getCartTotal();
  const isFreeShipping = subtotal >= 2999;
  const shippingRate = isFreeShipping ? 0 : 250;

  // Calculate discount when coupon is applied
  const applyCoupon = () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    const res = db.validateCoupon(couponCode, subtotal);
    if (!res.valid) {
      toast.error(res.message);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    const coupon = res.coupon;
    if (!coupon) return;
    setAppliedCoupon(coupon);

    let discount = 0;
    if (coupon.type === "Percentage") {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === "Fixed") {
      discount = coupon.value;
    }
    
    setDiscountAmount(discount);
    toast.success(`Coupon "${coupon.code}" applied successfully! Discount: Rs. ${discount.toLocaleString()}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  const grandTotal = Math.max(0, subtotal + shippingRate - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderParams = {
        customerName: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@erhacustomer.com`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        paymentMethod: paymentMethod,
        discountAmount: discountAmount,
        shippingRate: shippingRate,
        subtotal: subtotal,
        total: grandTotal,
        notes: formData.notes,
      };

      const newOrder = db.createOrder(orderParams);

      if (appliedCoupon) {
        try {
          const coupons = db.getCoupons();
          const targetCoupon = coupons.find((c) => c.id === appliedCoupon.id);
          if (targetCoupon) {
            targetCoupon.usageCount = (targetCoupon.usageCount || 0) + 1;
            db.saveCoupon(targetCoupon);
          }
        } catch (couponErr) {
          console.error("Failed to update coupon usage count:", couponErr);
        }
      }

      clearCart();
      setOrderSuccess(newOrder);
      toast.success("Order placed successfully!");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    const waText = `Hi ERHA Trade Link, I have placed an order with ID: ${orderSuccess.id}. Total Amount: Rs. ${orderSuccess.total.toLocaleString()}. Please confirm my order. Details: Name: ${orderSuccess.customer}, Phone: ${orderSuccess.phone}, Address: ${orderSuccess.address}`;
    const waUrl = `https://wa.me/923023333499?text=${encodeURIComponent(waText)}`;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="inline-flex rounded-full bg-emerald-100 p-4 text-emerald-600">
            <CheckCircle2 className="size-16 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-ink">Thank You for Your Order!</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your order has been received and is currently being processed. An expert from ERHA Trade Link will contact you shortly to confirm the delivery.
            </p>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6 text-left shadow-soft space-y-4">
            <div className="flex justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold text-ink">{orderSuccess.id}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-muted-foreground">Customer Name</span>
              <span className="font-bold text-ink">{orderSuccess.customer}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-muted-foreground">Shipping Address</span>
              <span className="font-bold text-ink text-right max-w-xs truncate">{orderSuccess.address}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-3">
              <span className="font-semibold text-muted-foreground">Payment Method</span>
              <span className="font-bold text-ink">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-brand pt-2">
              <span>Total Amount Paid/Due</span>
              <span>Rs. {orderSuccess.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] px-6 py-3 text-sm font-bold text-white shadow-soft transition"
            >
              <MessageCircle className="size-4.5 fill-current" /> Confirm Order via WhatsApp
            </a>
            
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-ink hover:bg-muted/80 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-8">Secure Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border/40 rounded-2xl shadow-soft">
            <h2 className="text-lg font-bold text-ink mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">You need to add products to your cart before proceeding to checkout.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Checkout Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* Shipping Information */}
              <div className="bg-card rounded-2xl border border-border/40 p-6 sm:p-8 shadow-soft space-y-5">
                <h2 className="text-lg font-bold text-ink border-b border-border/40 pb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">1</span>
                  Shipping & Customer Info
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmed Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0302-3333499"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Plot#, Street, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink uppercase tracking-wider">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multan"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider">Order Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any special instructions for delivery riders..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-card rounded-2xl border border-border/40 p-6 sm:p-8 shadow-soft space-y-5">
                <h2 className="text-lg font-bold text-ink border-b border-border/40 pb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">2</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex flex-col items-center justify-center border-2 rounded-2xl p-4 cursor-pointer transition select-none ${
                      paymentMethod === "COD" ? "border-brand bg-brand/5" : "border-border hover:border-border/80"
                    }`}
                  >
                    <Truck className="size-6 text-brand mb-2" />
                    <span className="text-sm font-bold text-ink">COD</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Cash on Delivery</span>
                  </label>

                  {/* JazzCash */}
                  <label
                    onClick={() => setPaymentMethod("JazzCash")}
                    className={`flex flex-col items-center justify-center border-2 rounded-2xl p-4 cursor-pointer transition select-none ${
                      paymentMethod === "JazzCash" ? "border-brand bg-brand/5" : "border-border hover:border-border/80"
                    }`}
                  >
                    <Landmark className="size-6 text-brand mb-2" />
                    <span className="text-sm font-bold text-ink">JazzCash</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Mobile Transfer</span>
                  </label>

                  {/* EasyPaisa */}
                  <label
                    onClick={() => setPaymentMethod("Easypaisa")}
                    className={`flex flex-col items-center justify-center border-2 rounded-2xl p-4 cursor-pointer transition select-none ${
                      paymentMethod === "Easypaisa" ? "border-brand bg-brand/5" : "border-border hover:border-border/80"
                    }`}
                  >
                    <CreditCard className="size-6 text-brand mb-2" />
                    <span className="text-sm font-bold text-ink">EasyPaisa</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Mobile Transfer</span>
                  </label>
                </div>

                {paymentMethod !== "COD" && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800 leading-relaxed">
                    💡 <strong>Instructions:</strong> Please transfer the total order amount to our bank account or mobile wallet after checking out. Send the payment screenshot to our official WhatsApp support number <strong>0302-3333499</strong> alongside your Order ID for immediate activation and dispatch.
                  </div>
                )}
              </div>
            </form>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-soft space-y-5">
                <h2 className="text-lg font-bold text-ink border-b border-border/40 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                </h2>

                {/* Items List */}
                <div className="max-h-48 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3 text-sm">
                      <div className="size-12 rounded-lg border border-border/60 overflow-hidden bg-muted shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="size-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-ink truncate">{item.product.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {item.quantity} x Rs. {item.product.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="font-bold text-ink shrink-0">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Discount Code Input */}
                <div className="border-t border-border/40 pt-4">
                  <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-1.5">Discount Coupon</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm text-emerald-800">
                      <span className="font-bold">Code applied: {appliedCoupon.code}</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-bold underline hover:text-emerald-950 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2 text-sm outline-none transition focus:border-brand"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="rounded-xl bg-slate-900 px-4 text-xs font-bold text-white transition hover:bg-slate-800"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="border-t border-border/40 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Fee</span>
                    <span>{isFreeShipping ? "FREE" : "Rs. 250"}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount Coupon</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-border/40 pt-3 flex justify-between text-base font-bold text-ink">
                    <span>Total Amount</span>
                    <span className="text-brand">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Submission Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-3 h-12 flex items-center justify-center gap-2 rounded-xl gradient-brand text-sm font-bold text-white shadow-soft transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
                  <ArrowRight className="size-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
