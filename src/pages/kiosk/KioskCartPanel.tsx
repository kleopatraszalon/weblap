import React from "react";
import { useNavigate } from "react-router-dom";
import { cartCount, cartTotal, changeCartQty, readCart } from "./cartStore";

export function KioskCartPanel() {
  const nav = useNavigate();
  const [cart, setCart] = React.useState(() => readCart());

  React.useEffect(() => {
    const refresh = () => setCart(readCart());
    window.addEventListener("kiosk-cart-change", refresh as EventListener);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("kiosk-cart-change", refresh as EventListener); window.removeEventListener("storage", refresh); };
  }, []);

  const total = cartTotal(cart);
  const count = cartCount(cart);
  const change = (id: string, delta: number) => { changeCartQty(id, delta); setCart(readCart()); };

  return <aside className="kiosk-order-panel">
    <div className="kiosk-order-head">
      <div><span className="kiosk-order-kicker">RENDELÉSED</span><h2>Kosár</h2></div>
      <span className="kiosk-order-count">{count}</span>
    </div>
    <div className="kiosk-order-lines">
      {!cart.length && <div className="kiosk-empty-cart"><span>🛍️</span><b>Még üres a kosár</b><small>Válassz egy szolgáltatást a kezdéshez.</small></div>}
      {cart.map((item) => <article className="kiosk-order-line" key={item.id}>
        <div className="kiosk-order-line-main"><b>{item.title}</b><span>{Number(item.price || 0).toLocaleString("hu-HU")} Ft</span></div>
        <div className="kiosk-qty-control">
          <button type="button" onClick={() => change(item.id, -1)} aria-label="Mennyiség csökkentése">−</button>
          <strong>{item.qty}</strong>
          <button type="button" onClick={() => change(item.id, 1)} aria-label="Mennyiség növelése">+</button>
        </div>
      </article>)}
    </div>
    <div className="kiosk-order-footer">
      <div className="kiosk-order-total"><span>Összesen</span><strong>{total.toLocaleString("hu-HU")} Ft</strong></div>
      <button className="kiosk-checkout-btn" disabled={!cart.length} onClick={() => nav("/kiosk/pay")}>
        Tovább a fizetéshez <span>→</span>
      </button>
      <small>A véglegesítés után a rendelés munkalapként bekerül a VIR rendszerbe.</small>
    </div>
  </aside>;
}
