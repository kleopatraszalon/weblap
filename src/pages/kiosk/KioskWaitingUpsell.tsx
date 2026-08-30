import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, readCart } from "./cartStore";
import { fetchKioskProducts } from "./kioskApi";
import { KioskSemanticArt, retailGroup } from "./KioskSemanticArt";
import type { KioskProduct } from "./types";

function productName(p: KioskProduct) { return p.name_hu || p.name || "Termék"; }
function productPrice(p: KioskProduct) { return Number(p.sale_price ?? p.retail_price_gross ?? 0); }
function productText(p: KioskProduct) { return [productName(p), p.category_name, p.main_category, p.sub_category].filter(Boolean).join(" "); }

export function KioskWaitingUpsell() {
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<KioskProduct[]>([]);
  const [serviceTitle, setServiceTitle] = React.useState("");
  const knownServices = React.useRef(new Set(readCart().filter((item) => item.meta?.kind === "service").map((item) => item.id)));

  const load = React.useCallback(async () => {
    try {
      const data = await fetchKioskProducts(localStorage.getItem("kiosk_location_id"));
      setProducts(data.products || []);
    } catch { setProducts([]); }
  }, []);

  const showForService = React.useCallback((title: string) => {
    setServiceTitle(title || "a kezelésed");
    window.setTimeout(() => setOpen(true), 260);
  }, []);

  React.useEffect(() => {
    load();
    const locationChange = () => load();
    const selected = (event: Event) => {
      const detail = (event as CustomEvent<{ title?: string }>).detail;
      showForService(detail?.title || "a kezelésed");
    };
    const cartChanged = () => {
      const services = readCart().filter((item) => item.meta?.kind === "service");
      const newest = services.find((item) => !knownServices.current.has(item.id));
      knownServices.current = new Set(services.map((item) => item.id));
      if (newest) showForService(newest.title);
    };
    window.addEventListener("kiosk-location-change", locationChange as EventListener);
    window.addEventListener("kiosk-service-selected", selected as EventListener);
    window.addEventListener("kiosk-cart-change", cartChanged as EventListener);
    return () => {
      window.removeEventListener("kiosk-location-change", locationChange as EventListener);
      window.removeEventListener("kiosk-service-selected", selected as EventListener);
      window.removeEventListener("kiosk-cart-change", cartChanged as EventListener);
    };
  }, [load, showForService]);

  const suggestions = React.useMemo(() => {
    const priority = ["coffee", "drink", "chocolate", "protein", "water", "tea", "snack"];
    const picked: KioskProduct[] = [];
    for (const group of priority) {
      const candidate = products.find((p) => retailGroup(productText(p)) === group && !picked.some((x) => x.id === p.id));
      if (candidate) picked.push(candidate);
      if (picked.length >= 4) break;
    }
    return picked;
  }, [products]);

  React.useEffect(() => { if (open && !suggestions.length) setOpen(false); }, [open, suggestions.length]);
  if (!open || !suggestions.length) return null;

  function add(p: KioskProduct) {
    addToCart({ id: p.id, title: productName(p), price: productPrice(p), meta: { kind: "product", category_id: p.category_id, image_url: p.image_url || p.category_image, retail_group: retailGroup(productText(p)) } }, 1);
  }

  return <div className="kiosk-upsell-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
    <section className="kiosk-upsell-dialog" role="dialog" aria-modal="true" aria-labelledby="kiosk-upsell-title">
      <button className="kiosk-upsell-close" onClick={() => setOpen(false)} aria-label="Bezárás">×</button>
      <div className="kiosk-upsell-kicker">KLEOPÁTRA REFRESH</div>
      <h2 id="kiosk-upsell-title">Amíg várakozol, fogyassz valamit!</h2>
      <p>A(z) <strong>{serviceTitle}</strong> mellé kérsz egy kávét, hideg üdítőt vagy valami finomat?</p>
      <div className="kiosk-upsell-products">
        {suggestions.map((p) => <article key={p.id}><KioskSemanticArt kind="product" name={productText(p)} source={p.image_url || p.category_image}/><b>{productName(p)}</b><span>{productPrice(p).toLocaleString("hu-HU")} Ft</span><button onClick={() => add(p)}>+ Kosárba</button></article>)}
      </div>
      <div className="kiosk-upsell-actions"><button className="secondary" onClick={() => setOpen(false)}>Most nem</button><button onClick={() => { setOpen(false); nav("/kiosk/products"); }}>Minden termék →</button></div>
    </section>
  </div>;
}

export default KioskWaitingUpsell;