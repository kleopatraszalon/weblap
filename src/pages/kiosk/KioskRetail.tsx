import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, readCart } from "./cartStore";
import { fetchKioskProducts } from "./kioskApi";
import { KioskCartPanel } from "./KioskCartPanel";
import { KioskSemanticArt, retailGroup } from "./KioskSemanticArt";
import type { KioskProduct } from "./types";

type Group = "all" | "coffee" | "drink" | "chocolate" | "protein" | "water" | "tea" | "snack" | "other";
const GROUPS: { id: Group; label: string; icon: string }[] = [
  { id: "all", label: "Összes", icon: "✦" },
  { id: "coffee", label: "Kávék", icon: "☕" },
  { id: "drink", label: "Italok", icon: "🥤" },
  { id: "chocolate", label: "Csokik", icon: "🍫" },
  { id: "protein", label: "Protein shake", icon: "🥛" },
  { id: "water", label: "Víz", icon: "💧" },
  { id: "tea", label: "Tea", icon: "🍵" },
  { id: "snack", label: "Snackek", icon: "🥜" },
  { id: "other", label: "Egyéb", icon: "🛍" },
];

function productName(p: KioskProduct) { return p.name_hu || p.name || "Termék"; }
function productPrice(p: KioskProduct) { return Number(p.sale_price ?? p.retail_price_gross ?? 0); }
function productSearchText(p: KioskProduct) { return [productName(p), p.category_name, p.main_category, p.sub_category, p.service_category].filter(Boolean).join(" "); }

export function KioskRetail() {
  const nav = useNavigate();
  const [products, setProducts] = React.useState<KioskProduct[]>([]);
  const [group, setGroup] = React.useState<Group>("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [added, setAdded] = React.useState("");
  const service = readCart().find((item) => item.meta?.kind === "service");

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError("");
        const data = await fetchKioskProducts(localStorage.getItem("kiosk_location_id"));
        setProducts(data.products || []);
      } catch (e: any) {
        setError(e?.message || "A termékkínálat nem tölthető be.");
      } finally { setLoading(false); }
    })();
  }, []);

  const grouped = React.useMemo(() => products.map((p) => ({ product: p, group: retailGroup(productSearchText(p)) as Group })), [products]);
  const availableGroups = React.useMemo(() => new Set(grouped.map((x) => x.group)), [grouped]);
  const visible = group === "all" ? grouped : grouped.filter((x) => x.group === group);

  function add(p: KioskProduct) {
    addToCart({
      id: p.id,
      title: productName(p),
      price: productPrice(p),
      meta: { kind: "product", category_id: p.category_id, image_url: p.image_url || p.category_image, retail_group: retailGroup(productSearchText(p)) },
    }, 1);
    setAdded(p.id);
    window.setTimeout(() => setAdded(""), 800);
  }

  return <div className="kiosk-retail-layout">
    <section className="kiosk-retail-main">
      <div className="kiosk-retail-backrow">
        <button onClick={() => nav(-1)}>← Vissza</button>
        <button className="kiosk-retail-services" onClick={() => nav("/kiosk")}>✂ Szolgáltatások</button>
      </div>
      <header className="kiosk-retail-hero">
        <div className="kiosk-retail-hero-icon">☕</div>
        <div><span>TERMÉKELADÁS · KLEOPÁTRA</span><h1>{service ? "A kezelés mellé kérsz valamit inni?" : "Kávé, frissítő és finomságok"}</h1><p>{service ? "Válassz egy italt vagy nassolnivalót, hogy kellemesebb legyen a várakozás." : "A Gyöngyös szalon adatbázisban elérhető termékei közül válogathatsz."}</p></div>
        {service && <div className="kiosk-retail-selected-service"><small>Kiválasztott kezelés</small><b>{service.title}</b>{service.meta?.duration ? <span>{service.meta.duration} perc</span> : null}</div>}
      </header>

      <nav className="kiosk-retail-tabs" aria-label="Termékkategóriák">
        {GROUPS.filter((g) => g.id === "all" || availableGroups.has(g.id)).map((g) => <button key={g.id} className={group === g.id ? "active" : ""} onClick={() => setGroup(g.id)}><span>{g.icon}</span>{g.label}</button>)}
      </nav>

      {loading && <div className="kioskInfo">Termékek betöltése a VIR adatbázisból…</div>}
      {error && <div className="kioskError">{error}</div>}
      {!loading && !products.length && <div className="kiosk-retail-empty"><span>🛍️</span><h2>Jelenleg nincs kioskon értékesíthető termék.</h2><p>A termékek a VIR adatbázisból és a kiosk termékkínálatából érkeznek.</p></div>}
      <div className="kiosk-retail-grid">
        {visible.map(({ product: p, group: productGroup }) => <article key={p.id} className="kiosk-retail-card">
          <div className="kiosk-retail-photo"><KioskSemanticArt kind="product" name={productSearchText(p)} source={p.image_url || p.category_image} /><span>{GROUPS.find((g) => g.id === productGroup)?.label}</span></div>
          <div className="kiosk-retail-copy"><h3>{productName(p)}</h3>{p.web_description && <p>{p.web_description}</p>}<div><strong>{productPrice(p).toLocaleString("hu-HU")} Ft</strong><button className={added === p.id ? "added" : ""} onClick={() => add(p)}>{added === p.id ? "✓ Hozzáadva" : "Kosárba"}</button></div></div>
        </article>)}
      </div>
    </section>
    <KioskCartPanel />
  </div>;
}

export default KioskRetail;
