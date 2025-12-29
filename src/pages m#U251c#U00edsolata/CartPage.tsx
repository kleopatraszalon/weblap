import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

export const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      const updated = cart.filter((i) => i.product.id !== id);
      setCart(updated);
      localStorage.setItem("kleoCart", JSON.stringify(updated));
      return;
    }
    const updated = cart.map((i) =>
      i.product.id === id ? { ...i, quantity: qty } : i
    );
    setCart(updated);
    localStorage.setItem("kleoCart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((s, i) => {
    const raw = i.product.retail_price_gross ?? i.product.sale_price ?? 0;
    const p =
      typeof raw === "string"
        ? parseFloat(raw.replace(",", "."))
        : (raw as number);
    if (!p || Number.isNaN(p)) return s;
    return s + p * i.quantity;
  }, 0);

  return (
    <main className="page section">
      <div className="container">
        <h1>Kosár</h1>
        {cart.length === 0 ? (
          <p>A kosár üres.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Termék</th>
                  <th>Egységár</th>
                  <th>Mennyiség</th>
                  <th>Összeg</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const raw =
                    item.product.retail_price_gross ??
                    item.product.sale_price ??
                    0;
                  const p =
                    typeof raw === "string"
                      ? parseFloat(raw.replace(",", "."))
                      : (raw as number);
                  const unit =
                    !p || Number.isNaN(p)
                      ? "-"
                      : `${p.toLocaleString("hu-HU")} Ft`;
                  const total =
                    !p || Number.isNaN(p)
                      ? "-"
                      : `${(p * item.quantity).toLocaleString("hu-HU")} Ft`;
                  return (
                    <tr key={item.product.id}>
                      <td>{item.product.name}</td>
                      <td>{unit}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.product.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            updateQty(
                              item.product.id,
                              Number(e.target.value || "1")
                            )
                          }
                          style={{ width: "3rem", textAlign: "center" }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.product.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td>{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h3>Részösszeg: {subtotal.toLocaleString("hu-HU")} Ft</h3>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Link className="btn btn-secondary" to="/webshop">
                Folytatom a vásárlást
              </Link>
              <Link className="btn btn-primary" to="/checkout">
                Számlázás / fizetés
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
