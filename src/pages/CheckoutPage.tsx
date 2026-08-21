import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";
import "../styles/webshop-modern.css";

interface Product {
  id: string;
  name: string;
  retail_price_gross?: number | string | null;
  sale_price?: number | string | null;
}
interface CartItem { product: Product; quantity: number; }
interface CouponResponse {
  valid?: boolean;
  code?: string;
  discount_gross?: number;
  message?: string;
}

const toNumber = (value: number | string | null | undefined) => {
  if (value == null || value === "") return 0;
  const parsed = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const priceOf = (product: Product) => {
  const retail = toNumber(product.retail_price_gross);
  const sale = toNumber(product.sale_price);
  return sale > 0 && (retail <= 0 || sale < retail) ? sale : retail;
};

const money = (value: number) => `${Math.round(value).toLocaleString("hu-HU")} Ft`;

export const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    payment: "cod" as "card" | "cod",
  });
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kleoCart");
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } catch {
      localStorage.removeItem("kleoCart");
    }
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + priceOf(item.product) * item.quantity, 0),
    [cart]
  );
  const total = Math.max(0, subtotal - discount);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const applyCoupon = async () => {
    setError("");
    setMessage("");
    const code = couponInput.trim().toUpperCase();
    if (!code) return setError("Adj meg egy kuponkódot.");
    if (!cart.length) return setError("A kosár üres, ezért a kupon még nem ellenőrizhető.");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code,
          cart: {
            items: cart.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
              unit_price: priceOf(item.product),
            })),
            total_gross: subtotal,
          },
        }),
      });
      const data = (await response.json().catch(() => ({}))) as CouponResponse;
      if (!response.ok || !data.valid) throw new Error(data.message || "A kupon nem használható erre a rendelésre.");
      setCouponCode(data.code || code);
      setDiscount(Number(data.discount_gross || 0));
      setMessage(data.message || "A kupon sikeresen alkalmazva.");
    } catch (err: any) {
      setCouponCode(null);
      setDiscount(0);
      setError(err?.message || "Nem sikerült ellenőrizni a kupont.");
    } finally {
      setLoading(false);
    }
  };

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!cart.length) return setError("A kosár üres.");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: {
            full_name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            note: form.note.trim(),
          },
          payment_method: form.payment,
          coupon: couponCode ? { code: couponCode, discount_gross: discount } : null,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: priceOf(item.product),
          })),
          totals: {
            subtotal_gross: subtotal,
            discount_gross: discount,
            total_gross: total,
            currency: "HUF",
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || data?.message || "Nem sikerült leadni a rendelést.");
      if (form.payment === "card" && data?.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      localStorage.removeItem("kleoCart");
      window.dispatchEvent(new Event("kleo-cart-updated"));
      setCart([]);
      setOrderCompleted(true);
      const serverTotal = Number(data?.totals?.total_gross ?? total);
      setMessage(`A rendelés rögzítve. Fizetendő: ${money(serverTotal)}. A visszaigazolást a megadott e-mail címre küldjük.`);
    } catch (err: any) {
      setError(err?.message || "Hiba történt a rendelés rögzítésekor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="kleo-shop-page">
      <div className="kleo-shop-shell">
        <nav className="kleo-shop-breadcrumbs" aria-label="Morzsamenü">
          <Link to="/webshop">Kleoshop</Link><span>›</span>
          <Link to="/cart">Kosár</Link><span>›</span>
          <strong>Pénztár</strong>
        </nav>

        <div className="kleo-checkout-progress" aria-label="Pénztár lépései">
          <span>1 · Kosár</span>
          <span className={!orderCompleted ? "is-active" : ""}>2 · Adatok és fizetés</span>
          <span className={orderCompleted ? "is-active" : ""}>3 · Visszaigazolás</span>
        </div>

        <header className="kleo-shop-heading">
          <div>
            <span>KLEOSHOP · BIZTONSÁGOS PÉNZTÁR</span>
            <h1>{orderCompleted ? "Köszönjük a rendelést" : "Rendelés véglegesítése"}</h1>
            <p>
              {orderCompleted
                ? "A rendelésed bekerült a rendszerbe. A részleteket a megadott e-mail címen kapod meg."
                : "Nem kötelező fiókot létrehoznod. Add meg a teljesítéshez szükséges adatokat, alkalmazd a kuponod, majd ellenőrizd a végösszeget."}
            </p>
          </div>
        </header>

        {orderCompleted ? (
          <section className="kleo-shop-card kleo-shop-empty">
            <span aria-hidden="true">✓</span>
            <h2>Sikeres rendelés</h2>
            {message && <div className="kleo-shop-message kleo-shop-message--ok" style={{ maxWidth: 650, marginInline: "auto" }}>{message}</div>}
            <Link className="kleo-shop-primary" style={{ maxWidth: 250, marginInline: "auto" }} to="/webshop">Vissza a Kleoshopba</Link>
          </section>
        ) : cart.length === 0 ? (
          <section className="kleo-shop-card kleo-shop-empty">
            <span aria-hidden="true">🛍</span>
            <h2>A pénztárhoz szükség van termékre</h2>
            <p>A kosarad jelenleg üres. Válassz terméket, majd térj vissza ide a rendelés véglegesítéséhez.</p>
            <Link className="kleo-shop-primary" style={{ maxWidth: 250, marginInline: "auto" }} to="/webshop">Termékek megtekintése</Link>
          </section>
        ) : (
          <div className="kleo-shop-layout">
            <form onSubmit={submitOrder} className="kleo-shop-card kleo-checkout-form">
              <h2>Vásárló és számlázási adatok</h2>
              <p>A csillaggal jelölt mezők szükségesek a rendelés rögzítéséhez.</p>

              <div className="kleo-field-grid">
                <label className="kleo-field">
                  <span>Teljes név *</span>
                  <input
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                    required
                  />
                </label>
                <label className="kleo-field">
                  <span>E-mail cím *</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                    required
                  />
                </label>
              </div>

              <div className="kleo-field-grid">
                <label className="kleo-field">
                  <span>Telefonszám</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(event) => setForm((previous) => ({ ...previous, phone: event.target.value }))}
                  />
                </label>
                <label className="kleo-field">
                  <span>Fizetési mód</span>
                  <select
                    value={form.payment}
                    onChange={(event) => setForm((previous) => ({ ...previous, payment: event.target.value as "card" | "cod" }))}
                  >
                    <option value="cod">Utánvét / fizetés átvételkor</option>
                    <option value="card" disabled>Bankkártya · bekötés alatt</option>
                  </select>
                </label>
              </div>

              <label className="kleo-field">
                <span>Számlázási / szállítási cím *</span>
                <input
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => setForm((previous) => ({ ...previous, address: event.target.value }))}
                  required
                />
              </label>

              <label className="kleo-field">
                <span>Megjegyzés a rendeléshez</span>
                <textarea
                  rows={4}
                  value={form.note}
                  onChange={(event) => setForm((previous) => ({ ...previous, note: event.target.value }))}
                  placeholder="Ajándéküzenet, átvételi kérés vagy egyéb megjegyzés…"
                />
              </label>

              <div className="kleo-checkout-notice">
                A bankkártyás fizetés csak a fizetési szolgáltató élesítése után válik választhatóvá. Addig a rendszer az elérhető fizetési módot kínálja fel.
              </div>

              {error && <div className="kleo-shop-message kleo-shop-message--error" role="alert">{error}</div>}
              {message && <div className="kleo-shop-message kleo-shop-message--ok">{message}</div>}

              <button className="kleo-shop-primary" type="submit" disabled={loading || !cart.length}>
                {loading ? "Feldolgozás…" : `Rendelés leadása · ${money(total)}`}
              </button>
              <Link className="kleo-shop-secondary" to="/cart">← Vissza a kosárhoz</Link>
            </form>

            <aside className="kleo-shop-card kleo-shop-summary">
              <span className="kleo-shop-summary__kicker">RENDELÉS · {itemCount} DB</span>
              <h2>Összesítés</h2>
              <div className="kleo-checkout-items">
                {cart.map((item) => (
                  <div className="kleo-checkout-item" key={item.product.id}>
                    <span>{item.product.name} × {item.quantity}</span>
                    <b>{money(priceOf(item.product) * item.quantity)}</b>
                  </div>
                ))}
              </div>

              <div className="kleo-shop-coupon">
                <label htmlFor="checkout-coupon">Kuponkód</label>
                <div>
                  <input
                    id="checkout-coupon"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                    placeholder="pl. KLEO10"
                  />
                  <button type="button" onClick={applyCoupon} disabled={loading}>Alkalmaz</button>
                </div>
              </div>

              {couponCode && <div className="kleo-shop-message kleo-shop-message--ok">✓ Aktív kupon: {couponCode}</div>}
              <div className="kleo-shop-summary-row"><span>Részösszeg</span><b>{money(subtotal)}</b></div>
              {discount > 0 && <div className="kleo-shop-summary-row is-discount"><span>Kedvezmény</span><b>−{money(discount)}</b></div>}
              <div className="kleo-shop-summary-total"><span>Fizetendő</span><strong>{money(total)}</strong></div>
              <p style={{ margin: "14px 0 0", color: "#6f6870", fontSize: 10, lineHeight: 1.55 }}>
                Biztonsági okból a backend a végleges rendelés előtt újraszámolja a termékárakat és ellenőrzi a kupon érvényességét.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
