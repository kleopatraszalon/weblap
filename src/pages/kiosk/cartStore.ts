import type { CartItem } from "./types";

const KEY = "kiosk_cart_v1";

export function readCart(): CartItem[] {
  try { const raw = localStorage.getItem(KEY); if (!raw) return []; const v = JSON.parse(raw); return Array.isArray(v) ? v : []; }
  catch { return []; }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("kiosk-cart-change"));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const cart = readCart();
  const inferredKind = item.meta?.kind || (item.meta?.duration != null ? "service" : undefined);
  const normalized = { ...item, meta: { ...(item.meta || {}), ...(inferredKind ? { kind: inferredKind } : {}) } };
  const idx = cart.findIndex((c) => c.id === normalized.id);
  if (idx >= 0) cart[idx] = { ...cart[idx], ...normalized, qty: Math.min(99, cart[idx].qty + qty) };
  else cart.push({ ...normalized, qty: Math.max(1, Math.min(99, qty)) });
  writeCart(cart);
  return cart;
}

export function setCartQty(id: string, qty: number) {
  const nextQty = Math.max(0, Math.min(99, Number(qty) || 0));
  const cart = readCart();
  const next = nextQty <= 0 ? cart.filter((c) => c.id !== id) : cart.map((c) => c.id === id ? { ...c, qty: nextQty } : c);
  writeCart(next);
  return next;
}

export function changeCartQty(id: string, delta: number) {
  const item = readCart().find((c) => c.id === id);
  return setCartQty(id, Number(item?.qty || 0) + delta);
}

export function removeFromCart(id: string) { const cart = readCart().filter((c) => c.id !== id); writeCart(cart); return cart; }
export function clearCart() { writeCart([]); }
export function cartTotal(cart: CartItem[]) { return cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0); }
export function cartCount(cart: CartItem[]) { return cart.reduce((s, i) => s + Number(i.qty || 0), 0); }
