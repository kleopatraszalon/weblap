import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, cartTotal, clearCart, readCart, removeFromCart } from "./cartStore";
import { UpsellModal } from "./UpsellModal";

const BUFFET = [
  { id: "buffet_coffee", title: "Kávé", price: 690, image: "/kiosk/buffet/coffee.jpg" },
  { id: "buffet_shake", title: "Protein shake", price: 1290, image: "/kiosk/buffet/shake.jpg" },
  { id: "buffet_water", title: "Ásványvíz", price: 490, image: "/kiosk/buffet/water.jpg" },
];

export function KioskPay() {
  const nav = useNavigate();
  const [cart, setCart] = React.useState(() => readCart());
  const total = cartTotal(cart);
  const [upsellOpen, setUpsellOpen] = React.useState(true);

  function refresh() {
    setCart(readCart());
  }

  function addBuffet(id: string) {
    const it = BUFFET.find((x) => x.id === id);
    if (it) addToCart({ id: it.id, title: it.title, price: it.price }, 1);
    refresh();
  }

  function payNow(method: string) {
    // demo: payment flow placeholder
    const payload = { method, total };
    console.log("PAY", payload);
    clearCart();
    nav("/kiosk/ticket");
  }

  return (
    <div className="kioskPayPage">
      <div className="kioskBackRow">
        <button className="kioskBtn" onClick={() => nav(-1 as any)}>← Vissza</button>
        <button className="kioskBtn" onClick={() => { clearCart(); refresh(); }}>Kosár ürítése</button>
      </div>

      <div className="kioskPanelTitle">Fizetés</div>

      <div className="kioskPayGrid">
        <div className="kioskPayLeft">
          <div className="kioskCartList">
            {cart.length === 0 ? <div className="kioskInfo">A kosár üres.</div> : null}
            {cart.map((c) => (
              <div key={c.id} className="kioskCartRow">
                <div>
                  <div className="kioskCartRowTitle">{c.title}</div>
                  <div className="kioskCartRowSub">{c.qty} × {c.price.toLocaleString("hu-HU")} Ft</div>
                </div>
                <button className="kioskIconBtn" onClick={() => { removeFromCart(c.id); refresh(); }}>🗑</button>
              </div>
            ))}
          </div>
          <div className="kioskTotalRow">
            <div>Összesen</div>
            <div className="kioskTotalValue">{total.toLocaleString("hu-HU")} Ft</div>
          </div>
        </div>

        <div className="kioskPayRight">
          <div className="kioskPayMethods">
            <button className="kioskPayMethod" onClick={() => payNow("card")}>Bankkártya</button>
            <button className="kioskPayMethod" onClick={() => payNow("szep")}>SZÉP kártya</button>
            <button className="kioskPayMethod" onClick={() => payNow("reception")}>Fizetés a recepción</button>
          </div>
        </div>
      </div>

      <UpsellModal
        open={upsellOpen}
        title="Fizetés előtt: fogyasszon valamit a büfénkből"
        items={BUFFET}
        onAdd={addBuffet}
        onClose={() => setUpsellOpen(false)}
      />
    </div>
  );
}
