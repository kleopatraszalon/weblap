import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchKioskContext, fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { KioskCartPanel } from "./KioskCartPanel";
import { AiBeautyAdvisor } from "./AiBeautyAdvisor";
import { addToCart } from "./cartStore";
import type { KioskCategory, KioskProduct, KioskService } from "./types";

const FALLBACK_IMAGES = [
  "/kiosk/tiles/fodraszat.png",
  "/kiosk/tiles/kez_es_labapolas.png",
  "/kiosk/tiles/kozmetika.png",
  "/kiosk/tiles/masszazs.png",
  "/kiosk/tiles/testkezeles.png",
  "/kiosk/tiles/wellness_fitness_szolarium.png",
];

type VisualMode = "classic" | "pearl" | "silver" | "kids" | "noir" | "rose-gold" | "aqua" | "zen";
const THEMED_MODES: VisualMode[] = ["pearl", "silver", "kids", "noir", "rose-gold", "aqua", "zen"];
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function getVisualMode(): VisualMode {
  const raw = localStorage.getItem("kiosk_visual_mode") as VisualMode | null;
  return raw && (["classic", ...THEMED_MODES] as VisualMode[]).includes(raw) ? raw : "classic";
}

function serviceSlot(name: string, index = 0) {
  const n = normalize(name || "");
  if (n.includes("haj") || n.includes("fodras")) return 0;
  if (n.includes("kez") || n.includes("lab") || n.includes("korom") || n.includes("manik") || n.includes("pedik")) return 1;
  if (n.includes("kozmet") || n.includes("arc") || n.includes("bor") || n.includes("smink") || n.includes("szortelen")) return 2;
  if (n.includes("massz")) return 3;
  if (n.includes("test") || n.includes("alak") || n.includes("cellulit") || n.includes("fitness")) return 4;
  if (n.includes("wellness") || n.includes("spa") || n.includes("szol")) return 5;
  return index % 6;
}

function fallbackImageFor(name: string, index = 0) {
  return FALLBACK_IMAGES[serviceSlot(name, index)];
}

function categoriesFromServices(services: KioskService[]): KioskCategory[] {
  const map = new Map<string, KioskCategory>();
  services.forEach((service, index) => {
    const id = String(service.category_id ?? service.category_name ?? `service-${index}`);
    const name = service.category_name_hu || service.category_name || "Szolgáltatások";
    if (!map.has(id)) map.set(id, {
      id,
      name,
      subtitle: service.category_subtitle || null,
      image_path: service.category_image || service.image_url || fallbackImageFor(name, index),
    });
  });
  return [...map.values()];
}

function categoriesFromProducts(products: KioskProduct[]): KioskCategory[] {
  const map = new Map<string, KioskCategory>();
  products.forEach((product, index) => {
    const id = String(product.category_id ?? product.category_name ?? product.main_category ?? `product-${index}`);
    const name = product.category_name || product.main_category || "Termékek";
    if (!map.has(id)) map.set(id, {
      id,
      name,
      subtitle: product.category_subtitle || null,
      image_path: product.category_image || product.image_url || fallbackImageFor(name, index),
    });
  });
  return [...map.values()];
}

function ThemeServiceArt({ category, index, visualMode }: { category: KioskCategory; index: number; visualMode: VisualMode }) {
  const slot = serviceSlot(category.name, index);
  const x = (slot % 3) * 50;
  const y = Math.floor(slot / 3) * 100;
  return <span
    className={`kiosk-theme-service-art kiosk-theme-service-art-${slot}`}
    role="img"
    aria-label={category.name}
    style={{ backgroundImage: `url(/kiosk/themes/${visualMode}.webp)`, backgroundPosition: `${x}% ${y}%` }}
  />;
}

function CategoryImage({ category, index, alt = "", visualMode, themedService = false }: {
  category: KioskCategory;
  index: number;
  alt?: string;
  visualMode: VisualMode;
  themedService?: boolean;
}) {
  if (themedService && visualMode !== "classic") return <ThemeServiceArt category={category} index={index} visualMode={visualMode} />;
  const fallback = fallbackImageFor(category.name, index);
  return <img
    src={category.image_path || fallback}
    alt={alt}
    onError={(event) => {
      const image = event.currentTarget;
      if (image.dataset.fallback !== "1") {
        image.dataset.fallback = "1";
        image.src = fallback;
      }
    }}
  />;
}

export function KioskLanding() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const previewLocation = params.get("location_id") || params.get("locationId") || "";
  const [serviceCategories, setServiceCategories] = React.useState<KioskCategory[]>([]);
  const [productCategories, setProductCategories] = React.useState<KioskCategory[]>([]);
  const [services, setServices] = React.useState<KioskService[]>([]);
  const [products, setProducts] = React.useState<KioskProduct[]>([]);
  const [locationName, setLocationName] = React.useState("Gyöngyös");
  const [menu, setMenu] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [started, setStarted] = React.useState(() => sessionStorage.getItem("kiosk_started") === "1");
  const [visualMode, setVisualMode] = React.useState<VisualMode>(() => getVisualMode());

  React.useEffect(() => {
    const syncVisual = () => setVisualMode(getVisualMode());
    window.addEventListener("kiosk-visual-mode-change", syncVisual as EventListener);
    window.addEventListener("storage", syncVisual);
    return () => {
      window.removeEventListener("kiosk-visual-mode-change", syncVisual as EventListener);
      window.removeEventListener("storage", syncVisual);
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const ctx = await fetchKioskContext(previewLocation || undefined);
        const bound = ctx.bound_location || ctx.locations?.[0];
        if (!bound) throw new Error("A Gyöngyös kiosk telephelye nem található.");
        setLocationName(bound.name);
        localStorage.setItem("kiosk_location_id", bound.id);
        window.dispatchEvent(new Event("kiosk-location-change"));
        const [svc, prod] = await Promise.all([
          fetchKioskServices(localStorage.getItem("kiosk_lang") || "hu", bound.id),
          fetchKioskProducts(bound.id),
        ]);
        const loadedServices = svc.services || [];
        const loadedProducts = prod.products || [];
        setServices(loadedServices);
        setProducts(loadedProducts);
        setServiceCategories(svc.categories?.length ? svc.categories : categoriesFromServices(loadedServices));
        setProductCategories(prod.categories?.length ? prod.categories : categoriesFromProducts(loadedProducts));
        setMenu(svc.menu || prod.menu || null);
        if ((svc.menu || prod.menu)?.theme?.showStartScreen === false) {
          sessionStorage.setItem("kiosk_started", "1");
          setStarted(true);
        }
      } catch (e: any) {
        setError(e?.message || "A kiosk menü nem tölthető be.");
      } finally {
        setLoading(false);
      }
    })();
  }, [previewLocation]);

  const theme = menu?.theme || {};
  const start = () => { sessionStorage.setItem("kiosk_started", "1"); setStarted(true); };
  const layoutOrder = (Array.isArray(theme.layoutOrder) ? theme.layoutOrder : ["hero", "services", "products"]).filter((x: string) => ["hero", "services", "products"].includes(x));
  const visible = (key: string) => theme.layoutVisibility?.[key] !== false;
  function openCategory(c: KioskCategory, type: "service" | "product") {
    localStorage.setItem("kiosk_category_id", String(c.id));
    localStorage.setItem("kiosk_category_name", c.name);
    localStorage.setItem("kiosk_catalog_type", type);
    nav(`/kiosk/cat/${slugify(c.name) || c.id}`);
  }

  if (theme.showStartScreen !== false && !started) {
    return <section className="kiosk-start-screen"><div className="kiosk-start-media" style={{ backgroundImage: `linear-gradient(180deg,rgba(18,12,8,.08),rgba(18,12,8,.62)),url(${theme.heroImageUrl || "/images/szolgaltatasok.jpg"})` }}>
      <div className="kiosk-pearl-stage" aria-hidden="true"><div className="kiosk-pearl-aura kiosk-pearl-aura-one"/><div className="kiosk-pearl-aura kiosk-pearl-aura-two"/><div className="kiosk-pearl-orbit"><i/><i/><i/></div><div className="kiosk-pearl-portrait"><img src="/images/home.png" alt=""/></div><div className="kiosk-pearl-chip kiosk-pearl-chip-ai"><span>✦</span><b>AI BEAUTY LAB</b><small>Személyes rutin 2 perc alatt</small></div><div className="kiosk-pearl-chip kiosk-pearl-chip-live"><i/><b>ÉLŐ SZALON</b><small>Gyöngyös · ma nyitva</small></div><div className="kiosk-pearl-index">K / 2026</div></div>
      <div className="kiosk-silver-stage" aria-hidden="true"><div className="kiosk-silver-grid"/><div className="kiosk-silver-scan"/><div className="kiosk-silver-portrait"><img src="/images/home.png" alt=""/><i/></div><div className="kiosk-silver-reticle"><i/><i/><i/><i/></div><div className="kiosk-silver-readout"><span>BEAUTY SYSTEM</span><b>ONLINE</b><small>GYÖNGYÖS // 2026</small></div><div className="kiosk-silver-code">KLEO // SILVER // 03</div></div>
      <div className="kiosk-kids-stage" aria-hidden="true"><div className="kiosk-kids-cloud one"/><div className="kiosk-kids-cloud two"/><div className="kiosk-kids-stars">✦　★　✧　★　✦</div><img className="kiosk-kids-bunny" src="/images/kiosk/kids/bunny.gif" alt=""/><img className="kiosk-kids-bear" src="/images/kiosk/kids/bear.gif" alt=""/><img className="kiosk-kids-fox" src="/images/kiosk/kids/fox.gif" alt=""/><div className="kiosk-kids-bubble">SZIA! 👋<small>Válassz velünk!</small></div></div>
      <div className="kiosk-start-brand"><img src={theme.logoUrl || "/images/kleo_logo@2x.png"} alt="Kleopátra"/><span>{locationName}</span></div>
      <div className="kiosk-start-copy"><span className="kiosk-start-kicker">ÖNKISZOLGÁLÓ KIOSK · GYÖNGYÖS</span><h1>{theme.startTitle || "Üdvözlünk a Kleopátra Szépségszalonban!"}</h1><p>{theme.startSubtitle || "Érintsd meg a képernyőt a választás megkezdéséhez."}</p><div className="kiosk-pearl-services"><span>HAJ</span><span>BŐR</span><span>KÖRÖM</span><span>WELLNESS</span></div><div className="kiosk-silver-services"><span>HAIR_01</span><span>SKIN_02</span><span>NAIL_03</span><span>WELLNESS_04</span></div><div className="kiosk-kids-services"><span>✂️ FRIZURA</span><span>✨ CSILLOGÁS</span><span>🌈 MÓKA</span></div></div>
      <div className="kiosk-start-actions"><div className="kiosk-fixed-location"><span>HELYSZÍN</span><b>{locationName}</b></div><button className="kiosk-start-button" onClick={start}>{theme.startButtonText || "Kezdés"}<span>→</span></button></div>
    </div></section>;
  }

  const rail = [
    ...serviceCategories.map((c) => ({ ...c, type: "service" as const })),
    ...(theme.showProducts !== false ? productCategories.map((c) => ({ ...c, type: "product" as const })) : []),
  ];

  return <div className="kiosk-order-layout" style={{ "--kiosk-radius": `${Number(theme.cardRadius || 24)}px` } as React.CSSProperties}>
    <aside className="kiosk-category-rail">
      <div className="kiosk-location-card"><span>TELEPÍTETT KIOSK</span><strong>{locationName}</strong><small>Gyöngyös szalon</small></div>
      <div className="kiosk-rail-title">Menü</div>
      <div className="kiosk-rail-list">{rail.map((c, i) => <button key={`${c.type}-${c.id}`} onClick={() => openCategory(c, c.type)}>
        <CategoryImage category={c} index={i} visualMode={visualMode} themedService={c.type === "service"}/><span>{c.name}</span><small>{c.type === "product" ? "TERMÉK" : "SZOLGÁLTATÁS"}</small>
      </button>)}</div>
    </aside>
    <section className="kiosk-catalog-home">
      {error && <div className="kioskError">{error}</div>}
      {menu && menu.is_active === false && <div className="kioskError">A Gyöngyös kiosk menüje jelenleg ki van kapcsolva.</div>}
      {loading && <div className="kioskInfo">Gyöngyös kiosk menü betöltése…</div>}
      {!loading && <AiBeautyAdvisor products={products} services={services} onProduct={(p) => addToCart({ id: p.id, title: p.name_hu || p.name, price: Number(p.sale_price ?? p.retail_price_gross ?? 0), meta: { kind: "product", category_id: p.category_id, image_url: p.image_url || p.category_image } }, 1)} onService={(s) => addToCart({ id: s.id, title: s.name_hu || s.name, price: Number(s.list_price ?? s.base_price ?? 0), meta: { kind: "service", duration: s.duration_minutes, category_id: s.category_id, image_url: s.image_url || s.category_image } }, 1)}/>} 
      {!loading && layoutOrder.filter(visible).map((block: string) => block === "hero" ? <div key={block} className="kiosk-catalog-hero" style={{ backgroundImage: `linear-gradient(100deg,rgba(20,9,15,.88),rgba(20,9,15,.18)),url(${theme.heroImageUrl || "/images/szolgaltatasok.jpg"})` }}><div className="kiosk-live-pill"><i/> MA NYITVA · AZONNALI VÁLASZTÁS</div><span>{locationName} · BEAUTY STUDIO</span><h1>{theme.heroTitle || "A szépségélmény, ami rád hangolódik."}</h1><p>{theme.heroSubtitle || theme.welcomeText || "Válassz szolgáltatást, fedezz fel professzionális termékeket, vagy kérj személyes AI-ajánlást."}</p><div className="kiosk-hero-stats"><b>4.9 <small>★ vendégértékelés</small></b><b>2 perc <small>AI rutinajánló</small></b></div></div>
        : block === "services" ? <CatalogBlock key={block} kicker="SZOLGÁLTATÁSOK" title="Válassz szolgáltatáscsoportot" categories={serviceCategories} fallbackOffset={0} onOpen={(c) => openCategory(c, "service")} columns={Number(theme.categoryColumns || 2)} visualMode={visualMode} themedService/>
        : theme.showProducts !== false ? <CatalogBlock key={block} kicker="KLEOSHOP" title="Professzionális otthoni ápolás" categories={productCategories} fallbackOffset={3} onOpen={(c) => openCategory(c, "product")} columns={Number(theme.productColumns || theme.categoryColumns || 2)} visualMode={visualMode}/> : null)}
    </section>
    <KioskCartPanel/>
  </div>;
}

function CatalogBlock({ kicker, title, categories, fallbackOffset, onOpen, columns, visualMode, themedService = false }: {
  kicker: string;
  title: string;
  categories: KioskCategory[];
  fallbackOffset: number;
  onOpen: (c: KioskCategory) => void;
  columns: number;
  visualMode: VisualMode;
  themedService?: boolean;
}) {
  return <section className="kiosk-home-menu-block">
    <div className="kiosk-section-heading"><div><span>{kicker}</span><h2>{title}</h2></div><p>{categories.length} csoport</p></div>
    <div className="kiosk-category-grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, columns))},minmax(0,1fr))` }}>
      {categories.map((c, i) => <button key={c.id} className="kiosk-category-card" onClick={() => onOpen(c)}><div className="kiosk-category-card-image"><CategoryImage category={c} index={i + fallbackOffset} alt={c.name} visualMode={visualMode} themedService={themedService}/></div><div className="kiosk-category-card-copy"><h3>{c.name}</h3>{c.subtitle && <p>{c.subtitle}</p>}<span>Megnézem <b>→</b></span></div></button>)}
      {!categories.length && <div className="kioskInfo">Ebben a menüben jelenleg nincs aktív csoport.</div>}
    </div>
  </section>;
}
