import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, readCart } from "./cartStore";
import { fetchKioskProducts } from "./kioskApi";
import { KioskCartPanel } from "./KioskCartPanel";
import { KioskSemanticArt, retailGroup, type RetailGroup } from "./KioskSemanticArt";
import { KioskRetailInlineArt } from "./KioskRetailInlineArt";
import type { KioskProduct } from "./types";

type Group = "all" | RetailGroup;
const GROUPS: { id: Group; label: string; icon: string }[] = [
  { id: "all", label: "Összes", icon: "✦" },
  { id: "coffee", label: "Kávék", icon: "☕" },
  { id: "drink", label: "Italok", icon: "🥤" },
  { id: "chocolate", label: "Csokik", icon: "🍫" },
  { id: "protein", label: "Protein shake", icon: "🥛" },
  { id: "water", label: "Víz", icon: "💧" },
  { id: "tea", label: "Tea", icon: "🍵" },
  { id: "snack", label: "Snackek", icon: "🥜" },
];

const normalize = (value: string | null | undefined) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function productName(p: KioskProduct) { return p.name_hu || p.name || "Termék"; }
function productPrice(p: KioskProduct) { return Number(p.sale_price ?? p.retail_price_gross ?? 0); }
function productMetaText(p: KioskProduct) {
  return [p.category_name, p.main_category, p.sub_category, p.service_category].filter(Boolean).join(" ");
}
function productSearchText(p: KioskProduct) {
  return [productName(p), productMetaText(p)].filter(Boolean).join(" ");
}

const BLOCKED_NON_RETAIL = /\b(berlet|hajszaritas|hajvagas|fodrasz|frizura|loknis|kezeles|szolgaltatas|csomag|alkalom|honap|hosszu|extra hosszu|manikur|pedikur|kozmetika|masszazs|szortelenites|gyanta|kavitacio|radiofrekvencia|rf kezeles|hajegyenesites|festes|balayage)\b/;

function brandGroup(name: string): RetailGroup | null {
  if (/\b(nespresso|lavazza|tchibo|illy|jacobs|douwe egberts)\b/.test(name)) return "coffee";
  if (/\b(coca cola|coke|pepsi|fanta|sprite|schweppes|kinley|red bull|hell|monster|cappy)\b/.test(name)) return "drink";
  if (/\b(nestea|fuze tea|lipton)\b/.test(name)) return "tea";
  if (/\b(szentkiralyi|natur aqua|theodora|jana|evian|voss)\b/.test(name)) return "water";
  if (/\b(milka|kinder|snickers|twix|mars|bounty|toblerone|lindt|merci|sport szelet)\b/.test(name)) return "chocolate";
  return null;
}

function classifyConsumable(p: KioskProduct): RetailGroup | null {
  const name = normalize(productName(p));
  const meta = normalize(productMetaText(p));
  const all = `${name} ${meta}`.trim();
  if (!name || BLOCKED_NON_RETAIL.test(all)) return null;

  const named = retailGroup(name);
  if (named !== "other") return named;

  const branded = brandGroup(name);
  if (branded) return branded;

  const byMeta = retailGroup(meta);
  if (["coffee", "chocolate", "protein", "water", "tea", "snack"].includes(byMeta)) return byMeta;
  if (byMeta === "drink") {
    const specificDrink = /\b(cola|coca cola|pepsi|fanta|sprite|schweppes|kinley|tonic|limonade|juice|gyumolcsle|narancsle|almale|energiaital|energy drink|red bull|hell|monster|cappy)\b/.test(all);
    return specificDrink ? "drink" : null;
  }
  return null;
}

function semanticName(group: RetailGroup, p: KioskProduct) {
  const label = GROUPS.find((g) => g.id === group)?.label || group;
  return `${group} ${label} ${productSearchText(p)}`;
}

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

  const grouped = React.useMemo(
    () => products
      .map((product) => ({ product, group: classifyConsumable(product) }))
      .filter((item): item is { product: KioskProduct; group: RetailGroup } => Boolean(item.group)),
    [products],
  );
  const counts = React.useMemo(() => {
    const result = new Map<Group, number>();
    result.set("all", grouped.length);
    grouped.forEach((item) => result.set(item.group, (result.get(item.group) || 0) + 1));
    return result;
  }, [grouped]);
  const availableGroups = React.useMemo(() => new Set(grouped.map((x) => x.group)), [grouped]);
  const visible = React.useMemo(
    () => group === "all" ? grouped : grouped.filter((x) => x.group === group),
    [group, grouped],
  );

  React.useEffect(() => {
    if (group !== "all" && !availableGroups.has(group)) setGroup("all");
  }, [availableGroups, group]);

  function add(p: KioskProduct) {
    const strictGroup = classifyConsumable(p);
    if (!strictGroup) return;
    addToCart({
      id: p.id,
      title: productName(p),
      price: productPrice(p),
      meta: { kind: "product", category_id: p.category_id, image_url: p.image_url || null, retail_group: strictGroup },
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
        <div><span>TERMÉKELADÁS · KLEOPÁTRA</span><h1>{service ? "A kezelés mellé kérsz valamit inni?" : "Kávé, frissítő és finomságok"}</h1><p>{service ? "Válassz egy italt vagy nassolnivalót, hogy kellemesebb legyen a várakozás." : "A szalon adatbázisban elérhető fogyasztható termékei közül válogathatsz."}</p></div>
        {service && <div className="kiosk-retail-selected-service"><small>Kiválasztott kezelés</small><b>{service.title}</b>{service.meta?.duration ? <span>{service.meta.duration} perc</span> : null}</div>}
      </header>

      <nav className="kiosk-retail-tabs" aria-label="Termékkategóriák">
        {GROUPS.filter((g) => g.id === "all" || availableGroups.has(g.id as RetailGroup)).map((g) => <button key={g.id} className={group === g.id ? "active" : ""} onClick={() => setGroup(g.id)}><span>{g.icon}</span>{g.label}<small>{counts.get(g.id) || 0}</small></button>)}
      </nav>

      {loading && <div className="kioskInfo">Termékek betöltése a VIR adatbázisból…</div>}
      {error && <div className="kioskError">{error}</div>}
      {!loading && !grouped.length && <div className="kiosk-retail-empty"><span>☕</span><h2>Jelenleg nincs kioskon értékesíthető fogyasztható termék.</h2><p>Csak kávé, ital, csoki, protein shake, víz, tea és snack jelenhet meg ezen az oldalon.</p></div>}
      {!loading && grouped.length > 0 && !visible.length && <div className="kiosk-retail-empty"><span>🛍️</span><h2>Ebben a csoportban nincs termék.</h2><p>A csoport kizárólag a hozzá tartozó termékeket jeleníti meg.</p></div>}
      <div className="kiosk-retail-grid">
        {visible.map(({ product: p, group: productGroup }) => <article key={p.id} className="kiosk-retail-card" data-retail-group={productGroup}>
          <div className="kiosk-retail-photo">
            {p.image_url
              ? <KioskSemanticArt kind="product" name={semanticName(productGroup, p)} source={p.image_url} />
              : <KioskRetailInlineArt name={semanticName(productGroup, p)} />}
            <span>{GROUPS.find((g) => g.id === productGroup)?.label}</span>
          </div>
          <div className="kiosk-retail-copy"><h3>{productName(p)}</h3>{p.web_description && <p>{p.web_description}</p>}<div><strong>{productPrice(p).toLocaleString("hu-HU")} Ft</strong><button className={added === p.id ? "added" : ""} onClick={() => add(p)}>{added === p.id ? "✓ Hozzáadva" : "Kosárba"}</button></div></div>
        </article>)}
      </div>
    </section>
    <KioskCartPanel />
  </div>;
}

export default KioskRetail;
