import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

interface Product { id: string; name: string; retail_price_gross?: number | string | null; sale_price?: number | string | null; }
interface CartItem { product: Product; quantity: number; }

function priceOf(product: Product) {
  const raw = product.sale_price ?? product.retail_price_gross ?? 0;
  const value = typeof raw === "string" ? parseFloat(raw.replace(",", ".")) : Number(raw || 0);
  return Number.isFinite(value) ? value : 0;
}

export const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kleoCart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch { localStorage.removeItem("kleoCart"); }
    }
  }, []);

  const save = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("kleoCart", JSON.stringify(items));
    window.dispatchEvent(new Event("kleo-cart-updated"));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return save(cart.filter((i) => i.product.id !== id));
    save(cart.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const subtotal = cart.reduce((sum, item) => sum + priceOf(item.product) * item.quantity, 0);

  return (
    <main>
      <PublicPageHero eyebrow="Kleoshop" title={<>A Te <span className="highlight">kosarad</span></>} lead={<p>Ellenőrizd a kiválasztott termékeket, bérleteket vagy utalványokat, módosítsd a mennyiséget, majd folytasd a rendelést.</p>} image="/images/kleoshop.png" imageAlt="Kleoshop kosár" compact />
      <section className="public-section">
        <div className="container">
          {cart.length === 0 ? (
            <div className="public-cta"><div><h2>A kosarad még üres</h2><p>Nézd meg a Kleoshop aktuális kínálatát, és válassz ajándékutalványt, bérletet vagy terméket.</p></div><Link className="btn btn-primary" to="/webshop">Irány a webshop</Link></div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cart.map((item) => {
                  const unit = priceOf(item.product);
                  return (
                    <article className="cart-item-card" key={item.product.id}>
                      <div className="cart-item-card__main"><span className="feature-card__kicker">Kleoshop</span><h2>{item.product.name}</h2><p>{unit.toLocaleString("hu-HU")} Ft / db</p></div>
                      <div className="cart-qty" aria-label="Mennyiség módosítása">
                        <button type="button" onClick={() => updateQty(item.product.id, item.quantity - 1)}>−</button>
                        <input type="number" value={item.quantity} min={1} onChange={(e) => updateQty(item.product.id, Math.max(1, Number(e.target.value || "1")))} />
                        <button type="button" onClick={() => updateQty(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                      <strong className="cart-item-card__total">{(unit * item.quantity).toLocaleString("hu-HU")} Ft</strong>
                    </article>
                  );
                })}
              </div>
              <aside className="cart-summary-card">
                <span className="feature-card__kicker">Összesítés</span>
                <h2>Részösszeg</h2>
                <strong>{subtotal.toLocaleString("hu-HU")} Ft</strong>
                <p>A végleges fizetendő összeg a rendelés ellenőrzésekor, az alkalmazott kuponok és fizetési feltételek alapján jelenik meg.</p>
                <Link className="btn btn-primary" to="/checkout">Tovább a fizetéshez</Link>
                <Link className="btn btn-outline" to="/webshop">Vásárlás folytatása</Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
