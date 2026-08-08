import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";
import PublicPageHero from "../components/PublicPageHero";

interface Product { id: string; name: string; retail_price_gross?: number | string | null; sale_price?: number | string | null; }
interface CartItem { product: Product; quantity: number; }

const numericPrice = (product: Product) => {
  const raw = product.sale_price ?? product.retail_price_gross ?? 0;
  const value = typeof raw === "string" ? parseFloat(raw.replace(",", ".")) : Number(raw || 0);
  return Number.isFinite(value) ? value : 0;
};

export const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", note: "", payment: "card" as "card" | "cod" });
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kleoCart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch { localStorage.removeItem("kleoCart"); }
    }
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + numericPrice(item.product) * item.quantity, 0), [cart]);
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    setError(""); setMsg("");
    const code = couponInput.trim().toUpperCase();
    if (!code) return setError("Adj meg egy kuponkódot.");
    if (!cart.length) return setError("A kosár üres.");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cart: { items: cart.map(item => ({ product_id: item.product.id, quantity: item.quantity, unit_price: numericPrice(item.product) })), total_gross: subtotal } }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.valid) throw new Error(data.message || "A kupon nem használható.");
      setCouponCode(data.code || code);
      setDiscount(Number(data.discount_gross || 0));
      setMsg(data.message || "A kupon sikeresen alkalmazva.");
    } catch (err: any) {
      setCouponCode(null); setDiscount(0); setError(err?.message || "Nem sikerült ellenőrizni a kupont.");
    } finally { setLoading(false); }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMsg("");
    if (!cart.length) return setError("A kosár üres.");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { full_name: form.name, email: form.email, phone: form.phone, address: form.address, note: form.note },
          payment_method: form.payment,
          coupon: couponCode ? { code: couponCode, discount_gross: discount } : null,
          items: cart.map(item => ({ product_id: item.product.id, quantity: item.quantity, unit_price: numericPrice(item.product) })),
          totals: { subtotal_gross: subtotal, discount_gross: discount, total_gross: total, currency: "HUF" },
        }),
      });
      const data = await response.json().catch(async () => ({ error: await response.text().catch(() => "") }));
      if (!response.ok) throw new Error(data.error || data.message || "Nem sikerült leadni a rendelést.");
      if (form.payment === "card" && data.payment_url) { window.location.href = data.payment_url; return; }
      localStorage.removeItem("kleoCart");
      window.dispatchEvent(new Event("kleo-cart-updated"));
      setCart([]);
      setMsg("Köszönjük! A rendelés rögzítve. A visszaigazolást a megadott e-mail címre küldjük.");
    } catch (err: any) {
      setError(err?.message || "Hiba történt a rendelés rögzítésekor.");
    } finally { setLoading(false); }
  };

  return (
    <main>
      <PublicPageHero eyebrow="Kleoshop" title={<>Rendelés <span className="highlight">véglegesítése</span></>} lead={<p>Add meg a számlázási és kapcsolattartási adatokat, ellenőrizd az összeget, majd add le a rendelést.</p>} image="/images/vendegszamla.png" imageAlt="Kleoshop rendelés" compact />
      <section className="public-section">
        <div className="container checkout-layout">
          <form onSubmit={submitOrder} className="form-card checkout-form">
            <p className="section-eyebrow">Vásárló adatai</p>
            <h2>Számlázás és kapcsolattartás</h2>
            <div className="form-row form-row--two">
              <label className="field"><span>Név*</span><input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required /></label>
              <label className="field"><span>E-mail*</span><input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} required /></label>
            </div>
            <div className="form-row form-row--two">
              <label className="field"><span>Telefonszám</span><input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} /></label>
              <label className="field"><span>Fizetési mód</span><select value={form.payment} onChange={(e) => setForm(prev => ({ ...prev, payment: e.target.value as "card" | "cod" }))}><option value="card">Bankkártya</option><option value="cod">Utánvét</option></select></label>
            </div>
            <label className="field"><span>Számlázási / szállítási cím*</span><input value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} required /></label>
            <label className="field"><span>Megjegyzés</span><textarea rows={4} value={form.note} onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))} /></label>
            <button className="btn btn-primary" type="submit" disabled={loading || !cart.length}>{loading ? "Feldolgozás…" : "Rendelés leadása"}</button>
            {error && <div className="notice-card checkout-message checkout-message--error">{error}</div>}
            {msg && <div className="notice-card checkout-message">{msg}</div>}
          </form>

          <aside className="cart-summary-card checkout-summary">
            <span className="feature-card__kicker">Rendelés</span>
            <h2>{cart.length ? `${cart.length} tétel` : "Üres kosár"}</h2>
            {cart.map(item => <div className="checkout-line" key={item.product.id}><span>{item.product.name} × {item.quantity}</span><b>{(numericPrice(item.product) * item.quantity).toLocaleString("hu-HU")} Ft</b></div>)}
            <div className="checkout-line"><span>Részösszeg</span><b>{subtotal.toLocaleString("hu-HU")} Ft</b></div>
            {discount > 0 && <div className="checkout-line checkout-line--discount"><span>Kedvezmény {couponCode ? `(${couponCode})` : ""}</span><b>−{discount.toLocaleString("hu-HU")} Ft</b></div>}
            <div className="checkout-total"><span>Fizetendő</span><strong>{total.toLocaleString("hu-HU")} Ft</strong></div>
            <div className="coupon-row"><input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Kuponkód" /><button type="button" className="btn btn-outline" onClick={applyCoupon} disabled={loading}>Alkalmaz</button></div>
            <Link to="/cart" className="btn btn-outline">Vissza a kosárhoz</Link>
          </aside>
        </div>
      </section>
    </main>
  );
};
