// src/utils/cart.ts

export interface WebshopProduct {
  id: string;
  name: string;
  retail_price_gross?: number | string | null;
  sale_price?: number | string | null;
  // ... ha vannak még mezők, itt nyugodtan bővítheted
}

export interface CartItem {
  product: WebshopProduct;
  quantity: number;
}

const STORAGE_KEY = "kleoCart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // jelezzük a lebegő kosár gombnak, hogy frissítse a darabszámot
  window.dispatchEvent(new Event("kleo-cart-updated"));
}

/**
 * Termék hozzáadása a kosárhoz.
 * Ha már van ilyen termék, a mennyiséget növeli.
 */
export function addToCart(product: WebshopProduct, qty: number = 1) {
  const cart = readCart();
  const idx = cart.findIndex((i) => i.product.id === product.id);

  if (idx === -1) {
    cart.push({ product, quantity: qty });
  } else {
    cart[idx] = {
      ...cart[idx],
      quantity: cart[idx].quantity + qty,
    };
  }

  writeCart(cart);
}

/** Kosár kiolvasása – CartPage-nek, badge-nek stb. */
export function getCart(): CartItem[] {
  return readCart();
}

/** Kosár ürítése pl. sikeres rendelés után */
export function clearCart() {
  writeCart([]);
}
