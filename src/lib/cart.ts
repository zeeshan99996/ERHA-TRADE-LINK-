export type CartProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  stock?: number;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

const CART_KEY = "erha_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const val = localStorage.getItem(CART_KEY);
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch custom event for immediate react rendering on same page
    window.dispatchEvent(new CustomEvent("erha_cart_update", { detail: cart }));
    // Dispatch standard storage event
    window.dispatchEvent(new Event("storage"));
  }
}

export function addToCart(product: CartProduct, quantity: number = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);

  const currentQty = existing ? existing.quantity : 0;
  const newQty = currentQty + quantity;

  // If stock is known, cap it at stock limit
  const maxStock = product.stock !== undefined ? product.stock : 99;
  const finalQty = Math.min(newQty, maxStock);

  if (existing) {
    existing.quantity = finalQty;
  } else {
    cart.push({ product, quantity: finalQty });
  }

  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart();
  const updated = cart.filter((item) => item.product.id !== productId);
  saveCart(updated);
}

export function updateCartQty(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((item) => item.product.id === productId);
  if (item) {
    const maxStock = item.product.stock !== undefined ? item.product.stock : 99;
    item.quantity = Math.max(1, Math.min(quantity, maxStock));
    saveCart(cart);
  }
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
