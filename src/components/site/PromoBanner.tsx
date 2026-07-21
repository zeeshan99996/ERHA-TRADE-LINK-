import { useState } from "react";
import { ArrowRight, Zap, ShoppingCart, MessageCircle, Battery, Package, Truck, X, CheckCircle2, User, Phone, MapPin, Building, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "@/lib/supabase";
import { toast } from "sonner";
import pzxImg from "@/assets/pzx_v91_power_bank.png";

export function PromoBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Multan",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const productPrice = 3000;
  const subtotal = productPrice * quantity;
  const shippingRate = subtotal >= 2999 ? 0 : 250; // free delivery above 2999
  const grandTotal = subtotal + shippingRate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (formData.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderParams = {
        customerName: formData.name,
        email: `${formData.name.toLowerCase().replace(/\s+/g, "")}@erhacustomer.com`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: [
          {
            id: "prd-pzx-v91",
            name: "PZX V91 Power Bank (10,000mAh)",
            quantity: quantity,
            price: productPrice,
          },
        ],
        paymentMethod: paymentMethod,
        discountAmount: 0,
        shippingRate: shippingRate,
        subtotal: subtotal,
        total: grandTotal,
        notes: formData.notes || "Quick Order from Promo Banner",
      };

      const newOrder = await db.createOrder(orderParams);
      setOrderSuccess(newOrder);
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderSuccess(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "Multan",
      notes: "",
    });
    setQuantity(1);
    setPaymentMethod("COD");
  };

  return (
    <section className="bg-background py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-secondary p-6 sm:p-10 lg:p-16 text-white">
          <div className="absolute -right-20 -top-20 size-80 rounded-full gradient-brand opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-80 rounded-full bg-cyan opacity-30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              {/* Badge */}
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan">
                🇨🇳 China Import — Premium Quality
              </span>

              {/* Heading */}
              <h2 className="mt-3 sm:mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                PZX <span className="text-gradient-brand">V91</span>
              </h2>
              <p className="mt-1 text-lg sm:text-xl font-semibold text-white/50 tracking-wider uppercase">
                Power Bank
              </p>

              {/* Description */}
              <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-white/70 leading-relaxed">
                Stay powered all day with the PZX V91 — a high-capacity <strong className="text-white">10,000mAh lithium battery</strong> power bank. Ultra-compact, fast-charging, and built for reliability. Imported directly from China for the best quality at the best price.
              </p>

              {/* Feature pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  <Battery className="size-3 text-cyan" /> 10,000mAh Lithium
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  <Package className="size-3 text-cyan" /> China Import
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  <Truck className="size-3 text-cyan" /> Delivery All Over Pakistan
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-bold shadow-glow transition hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingCart className="size-4" /> Order Now
                </button>
                <a
                  href="https://wa.me/923023333499"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20"
                >
                  <MessageCircle className="size-4 text-[#25D366]" /> WhatsApp Order
                </a>
              </div>

              {/* Contact strip */}
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/60">
                <span>📞 0302-3333499</span>
                <span>📍 Multan, Pakistan</span>
                <span>🚚 Delivery All Over Pakistan</span>
              </div>
            </div>

            {/* PZX V91 Product Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={pzxImg}
                  alt="PZX V91 Power Bank"
                  className="w-full object-contain drop-shadow-2xl select-none"
                />
                {/* Price badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-cyan text-secondary text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                  <Zap className="size-3.5" /> From Rs. 3,000
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* QUICK ORDER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
            >
              {/* Modal Body */}
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-card text-ink rounded-3xl border border-border/80 shadow-glow overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="p-5 border-b border-border/60 flex items-center justify-between bg-muted/40">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="size-5 text-brand" />
                    <h3 className="font-display font-bold text-lg text-ink">Quick Checkout</h3>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {!orderSuccess ? (
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                      {/* Product Preview Card */}
                      <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-2xl border border-border/40">
                        <img
                          src={pzxImg}
                          alt="PZX V91 Preview"
                          className="size-16 object-contain bg-white rounded-xl p-1 border"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-ink">PZX V91 Power Bank (10,000mAh)</h4>
                          <p className="text-xs text-muted-foreground">China Import • High-Quality Lithium Battery</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-brand">Rs. {productPrice.toLocaleString()}</span>
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 border border-border bg-background rounded-lg px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="text-muted-foreground font-bold hover:text-ink text-sm px-1"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-ink w-4 text-center">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="text-muted-foreground font-bold hover:text-ink text-sm px-1"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3.5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-brand"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="e.g., 03023333499"
                              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-brand"
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Shipping Address *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                            <textarea
                              name="address"
                              required
                              rows={2}
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="House #, Street Name, Area/Sector"
                              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none transition focus:border-brand resize-none"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              City *
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-brand"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                              Payment Method
                            </label>
                            <select
                              name="paymentMethod"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand cursor-pointer"
                            >
                              <option value="COD">Cash on Delivery (COD)</option>
                              <option value="BANK">Bank Transfer</option>
                            </select>
                          </div>
                        </div>

                        {/* Optional Notes */}
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Order Notes (Optional)
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                            <textarea
                              name="notes"
                              rows={1}
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Any instructions for delivery..."
                              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none transition focus:border-brand resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment info if Bank Transfer selected */}
                      {paymentMethod === "BANK" && (
                        <div className="bg-amber-500/10 border border-amber-500/20 text-ink text-xs p-3.5 rounded-2xl space-y-1.5">
                          <p className="font-bold text-amber-500">Bank Transfer Details:</p>
                          <p><strong>Bank:</strong> Allied Bank (ABL)</p>
                          <p><strong>Account Title:</strong> ERHA Trade Link</p>
                          <p><strong>Account Number:</strong> 03023333499</p>
                          <p className="text-[10px] text-muted-foreground">Please send a screenshot of the payment receipt to our WhatsApp after placing the order.</p>
                        </div>
                      )}

                      {/* Order Summary & Pricing */}
                      <div className="bg-muted/40 p-4 rounded-2xl border border-border/40 space-y-2.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Subtotal ({quantity} {quantity === 1 ? "item" : "items"})</span>
                          <span>Rs. {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Shipping Rate</span>
                          <span>{shippingRate === 0 ? "FREE" : `Rs. ${shippingRate.toLocaleString()}`}</span>
                        </div>
                        <div className="border-t border-border/60 pt-2.5 flex justify-between text-sm font-bold text-ink">
                          <span>Total Amount</span>
                          <span className="text-brand">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl gradient-brand text-white py-3 text-sm font-bold shadow-soft transition hover:opacity-95 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Placing Order...
                          </>
                        ) : (
                          <>Place Order (Rs. {grandTotal.toLocaleString()})</>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* SUCCESS SCREEN */
                    <div className="text-center py-8 space-y-6">
                      <div className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-950/30 p-4 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-16 animate-bounce" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-extrabold text-ink">Order Confirmed!</h4>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          Thank you for ordering the PZX V91. Your order has been registered successfully.
                        </p>
                      </div>

                      {/* Order info details box */}
                      <div className="bg-muted/60 rounded-2xl p-4 border text-left text-xs space-y-2 max-w-sm mx-auto">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order ID:</span>
                          <span className="font-bold text-ink">{orderSuccess.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Name:</span>
                          <span className="font-bold text-ink">{orderSuccess.customer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping To:</span>
                          <span className="font-bold text-ink truncate max-w-[200px]">{orderSuccess.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-bold text-brand">Rs. {orderSuccess.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* WhatsApp confirmation button */}
                        <a
                          href={`https://wa.me/923023333499?text=${encodeURIComponent(
                            `Hello ERHA, I just placed an order for PZX V91 Power Bank!\nOrder ID: ${orderSuccess.id}\nName: ${orderSuccess.customer}\nPhone: ${orderSuccess.phone}\nAddress: ${orderSuccess.address}\nTotal: Rs. ${orderSuccess.total.toLocaleString()}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 text-sm font-bold shadow-soft transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="size-4" /> Share Order on WhatsApp
                        </a>

                        <button
                          onClick={handleCloseModal}
                          className="w-full rounded-xl border border-border bg-background hover:bg-muted text-ink py-2.5 text-xs font-semibold transition cursor-pointer"
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}