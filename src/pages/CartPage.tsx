import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";
import "../styles/webshop-modern.css";

interface Product {
  id: string;
  name: string;
  retail_price_gross?: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  web_description?: string | null;
  main_category?: string | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const toNumber = (value: number | string | null | undefined) => {
  if (value == null || value === "") return 0;
  const parsed = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const priceOf = (product: Product) => {
  const retail = toNumber(product.retail_price_gross);
  const sale = toNumber(product.sale_price);
  if (sale > 0 && (retail <= 0 || sale < retail)) return sale;
  return retail;
};

const money = (value: number) => `${Math.round(value).toLocaleString("hu-HU")} Ft`;

const buildImageUrl = (value?: string | null) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
};

export const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kleoCart");
      if (raw) setCart(JSON.parse(raw) as CartItem[]);
    } catch {
      localStorage.removeItem("kleoCart");
    }
  }, []);

  const save = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("kleoCart", JSON.stringify(items));
    window.dispatchEvent(new Event("kleo-cart-updated"));
  };

  const updateQty = (id: string, quantity: number) => {
    if (quantity <= 0) {
      save(cart.filter((item) => item.product.id !== id));
      return;
    }
    save(
      cart.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + priceOf(item.product) * item.quantity, 0),
    [cart]
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <main className="kleo-shop-page">
      <div className="kleo-shop-shell">
        <nav className="kleo-shop-breadcrumbs" aria-label="Morzsamenü">
          <Link to="/">Kezdőlap</Link><span>›</span>
          <Link to="/webshop">Kleoshop</Link><span>›</span>
          <strong>Kosár</strong>
        </nav>

        <header className="kleo-shop-heading">
          <div>
            <span>KLEOSHOP · KOSÁR</span>
            <h1>A kiválasztott termékeid</h1>
            <p>
              Ellenőrizd a mennyiségeket és az árakat. A kuponkódot a pénztárban
              is megadhatod, a végösszeget pedig a rendszer rendeléskor ismét ellenőrzi.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              className="kleo-shop-secondary"
              style={{ border: 0, padding: "0 18px" }}
              onClick={() => save([])}
            >
              Kosár ürítése
            </button>
          )}
        </header>

        {cart.length === 0 ? (
          <section className="kleo-shop-card kleo-shop-empty">
            <span aria-hidden="true">🛍</span>
            <h2>A kosarad még üres</h2>
            <p>
              Fedezd fel az ajándékutalványokat, bérleteket és Kleo termékeket,
              majd egyetlen kattintással tedd őket a kosárba.
            </p>
            <Link className="kleo-shop-primary" style={{ maxWidth: 240, marginInline: "auto" }} to="/webshop">
              Irány a webshop
            </Link>
          </section>
        ) : (
          <div className="kleo-shop-layout">
            <section className="kleo-shop-card kleo-shop-list" aria-label="Kosár tartalma">
              {cart.map((item) => {
                const price = priceOf(item.product);
                const image = buildImageUrl(item.product.thumbnail_url || item.product.image_url);
                return (
                  <article key={item.product.id} className="kleo-shop-line-item">
                    <Link
                      className="kleo-shop-line-item__media"
                      to={`/webshop/${item.product.id}`}
                      state={{ product: item.product }}
                    >
                      {image ? <img src={image} alt={item.product.name} /> : <span>KLEO</span>}
                    </Link>
                    <div className="kleo-shop-line-item__copy">
                      <small>{item.product.main_category || "Kleoshop"}</small>
                      <h2>{item.product.name}</h2>
                      <p>{money(price)} / db</p>
                    </div>
                    <div className="kleo-shop-qty" aria-label={`${item.product.name} mennyisége`}>
                      <button type="button" onClick={() => updateQty(item.product.id, item.quantity - 1)} aria-label="Mennyiség csökkentése">−</button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        aria-label="Mennyiség"
                        onChange={(event) => updateQty(item.product.id, Math.max(1, Number(event.target.value || "1")))}
                      />
                      <button type="button" onClick={() => updateQty(item.product.id, item.quantity + 1)} aria-label="Mennyiség növelése">+</button>
                    </div>
                    <strong className="kleo-shop-line-item__total">{money(price * item.quantity)}</strong>
                  </article>
                );
              })}
            </section>

            <aside className="kleo-shop-card kleo-shop-summary">
              <span className="kleo-shop-summary__kicker">RENDELÉS ÖSSZESÍTŐ</span>
              <h2>{itemCount} termék a kosárban</h2>
              <div className="kleo-shop-summary-row">
                <span>Részösszeg</span><b>{money(subtotal)}</b>
              </div>
              <div className="kleo-shop-summary-row">
                <span>Kuponkedvezmény</span><b>a pénztárban</b>
              </div>
              <div className="kleo-shop-summary-total">
                <span>Jelenlegi összeg</span><strong>{money(subtotal)}</strong>
              </div>
              <Link className="kleo-shop-primary" to="/checkout">Tovább a pénztárhoz →</Link>
              <Link className="kleo-shop-secondary" to="/webshop">Vásárlás folytatása</Link>
              <p style={{ margin: "14px 0 0", color: "#6f6870", fontSize: 11, lineHeight: 1.55 }}>
                A végleges fizetendő összeget a szerver a terméktörzs és az érvényes
                kedvezményszabályok alapján számolja újra.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
