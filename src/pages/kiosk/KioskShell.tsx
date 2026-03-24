import React from "react";
import { cartTotal, readCart } from "./cartStore";

export function KioskShell({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = React.useState(() => cartTotal(readCart()));

  React.useEffect(() => {
    const onStorage = () => setTotal(cartTotal(readCart()));
    window.addEventListener("storage", onStorage);
    const t = window.setInterval(onStorage, 400);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(t);
    };
  }, []);

  return (
    <div className="kioskScreen">
      <div className="kioskTop">
        <div className="kioskBrand">
          <img src="/images/kleo_logo@2x.png" className="kioskBrandLogo" alt="Kleopatra" />
        </div>
        <div className="kioskTopCard">
          <div className="kioskTopCardTitle">Napi akciók</div>
          <div className="kioskTopCardSub">Nincs aktív villám akció.</div>
        </div>
        <div className="kioskSteps">
          <div className="kioskStep">1. Menü</div>
          <div className="kioskStep">2. Fizetés</div>
          <div className="kioskStep">3. Sorszám</div>
        </div>
        <div className="kioskTopSpacer" />
        <div className="kioskMiniTotal">Összesen: {total.toLocaleString("hu-HU")} Ft</div>
      </div>

      <div className="kioskBody">{children}</div>
    </div>
  );
}
