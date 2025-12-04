import React, { useEffect, useMemo, useState } from "react";

interface Product {
  id: string;
  name: string;
  retail_price_gross?: number | string | null;
  sale_price?: number | string | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    payment: "card",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("kleoCart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem("kleoCart");
      }
    }
  }, []);

  const subtotal = useMemo(
    () =>
      cart.reduce((s, i) => {
        const raw =
          i.product.retail_price_gross ?? i.product.sale_price ?? 0;
        const p =
          typeof raw === "string"
            ? parseFloat(raw.replace(",", "."))
            : (raw as number);
        if (!p || Number.isNaN(p)) return s;
        return s + p * i.quantity;
      }, 0),
    [cart]
  );

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Itt majd a valódi API hívás mehet
    setMsg("Rendelés rögzítve (demo). Köszönjük!");
    localStorage.removeItem("kleoCart");
  };

  return (
    <main className="page section">
      <div className="container">
        <h1>Fizetés / Számlázás</h1>

        <form onSubmit={submitOrder} className="webshop-form">
          <label className="field">
            <span>Név</span>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </label>

          <label className="field">
            <span>Cím</span>
            <input
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />
          </label>

          <label className="field">
            <span>Fizetési mód</span>
            <select
              value={form.payment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, payment: e.target.value }))
              }
            >
              <option value="card">Bankkártya</option>
              <option value="cod">Utánvét</option>
              <option value="package">Csomagküldő pont</option>
            </select>
          </label>

          <h3>Fizetendő: {subtotal.toLocaleString("hu-HU")} Ft</h3>

          <button className="btn btn-primary" type="submit">
            Rendelés leadása
          </button>
        </form>

        {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
      </div>
    </main>
  );
};
