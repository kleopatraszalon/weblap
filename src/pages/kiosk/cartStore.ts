import type { CartItem } from "./types";

const KEY = "kiosk_cart_v1";

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cart = readCart();
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx >= 0) cart[idx] = { ...cart[idx], qty: cart[idx].qty + qty };
  else cart.push({ ...item, qty });
  writeCart(cart);
  return cart;
}

export function removeFromCart(id: string) {
  const cart = readCart().filter((c) => c.id !== id);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
}
