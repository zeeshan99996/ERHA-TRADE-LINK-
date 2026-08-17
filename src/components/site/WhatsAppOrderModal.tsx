import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, ShieldCheck, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/mail";
import { clearCart } from "@/lib/cart";
import { toast } from "sonner";

export interface WhatsAppOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
  quantity: number;
}

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WhatsAppOrderItem[];
  isCart?: boolean;
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  items,
  isCart = false,
}: WhatsAppOrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Multan",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= 2999;
  const shippingRate = isFreeShipping ? 0 : 250;
  const grandTotal = subtotal + shippingRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("No items selected for order!");
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
        customerName: formData.name.trim(),
        email: `${formData.name.toLowerCase().replace(/\s+/g, "")}@whatsapp.erha.com`,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        paymentMethod: "WhatsApp (COD)",
        discountAmount: 0,
        shippingRate: shippingRate,
        subtotal: subtotal,
        total: grandTotal,
        notes: formData.notes.trim() || "Placed via WhatsApp Quick Order",
      };

      // 1. Create order in Supabase & LocalStorage (updates orders table, notifications table, products stock & customers)
      const newOrder = await db.createOrder(orderParams);

      // 2. Trigger Admin & Customer Email notification
      if (newOrder) {
        try {
          await sendOrderConfirmationEmail({
            data: {
              id: newOrder.id,
              customer: newOrder.customer,
              email: newOrder.email,
              phone: newOrder.phone,
              address: newOrder.address,
              items: newOrder.items,
              total: newOrder.total,
              paymentMethod: newOrder.paymentMethod,
              discountAmount: 0,
              shippingRate: shippingRate,
            },
          });
        } catch (emailErr) {
          console.warn("WhatsApp order email notification warning:", emailErr);
        }
      }

      // 3. Clear cart if ordered from cart drawer
      if (isCart) {
        clearCart();
      }

      // 4. Construct rich formatted WhatsApp message
      const itemsListText = items
        .map((x) => `• ${x.product.name} (Qty: ${x.quantity}) - Rs. ${(x.product.price * x.quantity).toLocaleString()}`)
        .join("\n");

      const waText = `🛍️ *NEW WHATSAPP ORDER - ERHA TRADE LINK*
----------------------------------------
🆔 *Order ID:* ${newOrder.id}
👤 *Customer Name:* ${formData.name.trim()}
📞 *Phone:* ${formData.phone.trim()}
📍 *Delivery Address:* ${formData.address.trim()}, ${formData.city.trim()}

📦 *Order Items:*
${itemsListText}

💵 *Subtotal:* Rs. ${subtotal.toLocaleString()}
🚚 *Shipping:* ${isFreeShipping ? "FREE" : `Rs. ${shippingRate.toLocaleString()}`}
💰 *Total Amount:* Rs. ${grandTotal.toLocaleString()}
💳 *Payment Method:* Cash on Delivery (WhatsApp)
${formData.notes ? `📝 *Notes:* ${formData.notes.trim()}` : ""}

Please confirm my order and send tracking updates. Thank you!`;

      const waUrl = `https://wa.me/923023333499?text=${encodeURIComponent(waText)}`;

      toast.success(`Order ${newOrder.id} saved to Admin Panel! Redirecting to WhatsApp...`);

      // 5. Open WhatsApp in new tab
      window.open(waUrl, "_blank");

      onClose();
    } catch (err) {
      console.error("WhatsApp order submission failed:", err);
      toast.error("Failed to process WhatsApp order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg rounded-2xl bg-card border border-border/80 p-6 shadow-2xl backdrop-blur-xl my-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-ink transition cursor-pointer"
              >
                <X className="size-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border/60 pb-4 pr-8">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    Quick WhatsApp Order
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      COD Available
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Order will be recorded in our system & sent to WhatsApp for instant confirmation.
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 bg-muted/40 rounded-xl p-3.5 border border-border/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Ordered Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  <span className="text-brand font-bold">Subtotal: Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-card p-2 rounded-lg border border-border/30">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.product.image && (
                          <img
                            src={item.product.image.split("|||")[0]}
                            alt={item.product.name}
                            className="size-9 rounded-md object-cover border border-border/50 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-xs truncate">{item.product.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-ink text-xs shrink-0 pl-2">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-1 border-t border-border/40 text-ink">
                  <span className="flex items-center gap-1">
                    <Truck className="size-3.5 text-brand" />
                    Delivery Shipping
                  </span>
                  <span>{isFreeShipping ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs. ${shippingRate}`}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-extrabold text-brand pt-1">
                  <span>Grand Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Zeeshan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      WhatsApp / Phone No <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multan, Lahore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Complete Shipping Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Shop No, Street Name, Area / Colony..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Special instructions, preferred delivery time, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-soft transition flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving Order to Admin & Opening WhatsApp...
                      </span>
                    ) : (
                      <>
                        <MessageCircle className="size-5 fill-current" />
                        Complete Order & Open WhatsApp
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
                    <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Instant Admin Panel Sync • 100% Verified COD Order</span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
