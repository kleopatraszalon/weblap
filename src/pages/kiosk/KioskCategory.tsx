import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { addToCart } from "./cartStore";
import { UpsellModal } from "./UpsellModal";
import type { KioskProduct, KioskService } from "./types";

const UPSELL_BY_SLUG: Record<string, { title: string; items: { id: string; title: string; price: number; image?: string }[] }> = {
  fodraszat: {
    title: "Ajánlat: Hajápolás vagy ital?",
    items: [
      { id: "buffet_coffee", title: "Kávé", price: 690, image: "/kiosk/buffet/coffee.jpg" },
      { id: "buffet_shake", title: "Protein shake", price: 1290, image: "/kiosk/buffet/shake.jpg" },
    ],
  },
  masszazs: {
    title: "Ajánlat: Relax ital / vitamin",
    items: [
      { id: "buffet_water", title: "Ásványvíz", price: 490, image: "/kiosk/buffet/water.jpg" },
      { id: "buffet_vit", title: "Vitamin ital", price: 990, image: "/kiosk/buffet/vitamin.jpg" },
    ],
  },
};

const TITLE_BY_SLUG: Record<string, { hu: string; en: string; ru: string }> = {
  "beauty-plus": { hu: "BEAUTY+", en: "BEAUTY+", ru: "BEAUTY+" },
  vendegszamla: { hu: "Vendégszámla", en: "Guest account", ru: "Гостевой счёт" },
  ajandekutalvany: { hu: "Ajándékutalványok", en: "Gift vouchers", ru: "Подарочные сертификаты" },
  fodraszat: { hu: "Fodrászat", en: "Hair", ru: "Парикмахерские услуги" },
  kezlab: { hu: "Kéz- és lábápolás", en: "Hand & foot care", ru: "Уход за руками и ногами" },
  kozmetika: { hu: "Kozmetika", en: "Cosmetics", ru: "Косметология" },
  ferfiaknak: { hu: "Férfiaknak", en: "For men", ru: "Для мужчин" },
  masszazs: { hu: "Masszázs", en: "Massage", ru: "Массаж" },
  testkezeles: { hu: "Testkezelés", en: "Body treatment", ru: "Уход за телом" },
  tinik: { hu: "Tinik és Gyerekek", en: "Teens & kids", ru: "Подростки и дети" },
  kids: { hu: "Gyerekeknek – Kids Project", en: "Kids Project", ru: "Kids Project" },
  "wellness-fitness": { hu: "Wellness / Fitness / Szolárium", en: "Wellness / Fitness / Solarium", ru: "Велнес / Фитнес / Солярий" },
};

const MATCHERS: Record<string, string[]> = {
  "beauty-plus": ["beauty", "beauty+", "plusz", "melle"],
  vendegszamla: ["vendegszamla", "guest account"],
  ajandekutalvany: ["ajandekutalvany", "utalvany", "voucher", "gift"],
  fodraszat: ["fodrasz", "haj", "hajvagas", "szaritas", "melir", "dauer", "fonas"],
  kezlab: ["kez", "lab", "manikur", "pedikur", "gellakk", "shellac", "mukorom", "korom"],
  kozmetika: ["kozmetika", "arckezel", "szempilla", "szemoldok", "bajusz", "gyanta", "cukorpaszta", "ultrahang", "mikrodermabrazio", "hidroabrazio", "radiofrekvencia", "ipl"],
  ferfiaknak: ["ferfi", "men"],
  masszazs: ["masszazs", "talpmasszazs", "arcmasszazs"],
  testkezeles: ["testkezeles", "zsirbont", "alakform", "kavitacio", "nyirok", "body"],
  tinik: ["tini", "teen"],
  kids: ["kids", "gyerek", "gyermek"],
  "wellness-fitness": ["wellness", "fitness", "fitnesz", "szolarium", "infra", "szauna"],
};

function lang(): "hu" | "en" | "ru" {
  const raw = localStorage.getItem("kiosk_lang");
  return raw === "en" || raw === "ru" ? raw : "hu";
}

function normalize(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchTerms(slug: string) {
  return MATCHERS[slug] || [slug];
}

function matchesSlug(slug: string, ...values: (string | null | undefined)[]) {
  const haystack = normalize(values.filter(Boolean).join(" "));
  const terms = getSearchTerms(slug).map(normalize).filter(Boolean);
  return terms.some((term) => haystack.includes(term));
}

function getServiceName(item: KioskService) {
  const current = lang();
  return (current === "en" ? item.name_en : current === "ru" ? item.name_ru : item.name_hu) || item.name;
}

function getProductName(item: KioskProduct) {
  const current = lang();
  return (current === "en" ? item.name_en : current === "ru" ? item.name_ru : item.name_hu) || item.name;
}

function getDisplayPrice(item: KioskProduct | KioskService) {
  if ("base_price" in item) return item.list_price ?? item.base_price ?? null;
  return item.sale_price ?? item.retail_price_gross ?? null;
}

function getProductDescription(product: KioskProduct) {
  return product.web_description || product.sub_category || product.main_category || "Webshop termék";
}

function uiText() {
  const current = lang();
  if (current === "en") {
    return {
      back: "← Back",
      pay: "Payment",
      loading: "Loading…",
      noData: "No database data arrived for this tile.",
      services: "Services",
      products: "Products / vouchers",
      add: "Add to cart",
      minutes: "min",
    };
  }
  if (current === "ru") {
    return {
      back: "← Назад",
      pay: "Оплата",
      loading: "Загрузка…",
      noData: "Для этой плитки не пришли данные из базы.",
      services: "Услуги",
      products: "Товары / сертификаты",
      add: "В корзину",
      minutes: "мин",
    };
  }
  return {
    back: "← Vissza",
    pay: "Fizetés",
    loading: "Betöltés…",
    noData: "Ehhez a csempéhez nem érkezett adat az adatbázisból.",
    services: "Szolgáltatások",
    products: "Termékek / utalványok",
    add: "Kosárba",
    minutes: "perc",
  };
}

export function KioskCategory() {
  const nav = useNavigate();
  const { slug } = useParams();
  const currentSlug = (slug || "").toLowerCase();
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [services, setServices] = React.useState<KioskService[]>([]);
  const [products, setProducts] = React.useState<KioskProduct[]>([]);
  const [langTick, setLangTick] = React.useState(0);

  const [upsellOpen, setUpsellOpen] = React.useState(false);
  const upsellCfg = UPSELL_BY_SLUG[currentSlug];
  const text = uiText();

  React.useEffect(() => {
    const onLangChange = () => setLangTick((x) => x + 1);
    window.addEventListener("kiosk-lang-change", onLangChange);
    return () => window.removeEventListener("kiosk-lang-change", onLangChange);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const locationId = localStorage.getItem("kiosk_location_id");
        const [serviceData, productData] = await Promise.all([
          fetchKioskServices(lang(), locationId),
          fetchKioskProducts(),
        ]);

        const filteredServices = serviceData.services.filter((s) =>
          matchesSlug(
            currentSlug,
            s.category_name,
            s.category_name_hu,
            s.category_name_en,
            s.category_name_ru,
            s.name,
            s.name_hu,
            s.name_en,
            s.name_ru
          )
        );

        const filteredProducts = productData.filter((p) =>
          matchesSlug(
            currentSlug,
            p.name,
            p.name_hu,
            p.name_en,
            p.name_ru,
            p.main_category,
            p.sub_category,
            p.service_category,
            p.web_description
          )
        );

        setServices(filteredServices);
        setProducts(filteredProducts);
      } catch (e: any) {
        setErr(String(e?.message || e || "API hiba"));
      } finally {
        setLoading(false);
      }
    })();
  }, [currentSlug, langTick]);

  function onPickService(s: KioskService) {
    addToCart(
      {
        id: s.id,
        title: getServiceName(s),
        price: Number(getDisplayPrice(s) || 0),
        meta: { duration: s.duration_minutes },
      },
      1
    );
    if (upsellCfg) setUpsellOpen(true);
  }

  function onPickProduct(p: KioskProduct) {
    addToCart({ id: p.id, title: getProductName(p), price: Number(getDisplayPrice(p) || 0) }, 1);
  }

  function addUpsell(id: string) {
    const item = upsellCfg?.items.find((x) => x.id === id);
    if (item) addToCart({ id: item.id, title: item.title, price: item.price }, 1);
    setUpsellOpen(false);
  }

  const currentLang = lang();
  const title = TITLE_BY_SLUG[currentSlug]?.[currentLang] || currentSlug.replace(/-/g, " ");
  const hasResults = services.length > 0 || products.length > 0;

  return (
    <>
      <div className="kioskCategoryPage">
        <div className="kioskBackRow">
          <button className="kioskBtn" onClick={() => nav("/kiosk")}>
            {text.back}
          </button>
          <button className="kioskBtn kioskPrimaryBtn" onClick={() => nav("/kiosk/pay")}>
            {text.pay}
          </button>
        </div>

        <div className="kioskPanelTitle">{title}</div>

        {loading ? <div className="kioskInfo">{text.loading}</div> : null}
        {err ? <div className="kioskError">Hiba: {err}</div> : null}
        {!loading && !err && !hasResults ? <div className="kioskInfo">{text.noData}</div> : null}

        <div className="kioskCategoryScroll">
          {services.length > 0 ? (
            <>
              <div className="kioskSectionMiniTitle">{text.services}</div>
              <div className="kioskServicesGrid">
                {services.map((s) => (
                  <button key={s.id} className="kioskServiceCard" onClick={() => onPickService(s)}>
                    <div className="kioskServiceName">{getServiceName(s)}</div>
                    <div className="kioskServiceMeta">
                      <span>{Number(getDisplayPrice(s) || 0).toLocaleString("hu-HU")} Ft</span>
                      {s.duration_minutes != null ? (
                        <span>
                          {" "}
                          • {s.duration_minutes} {text.minutes}
                        </span>
                      ) : null}
                    </div>
                    <div className="kioskServiceCta">{text.add}</div>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {products.length > 0 ? (
            <>
              <div className="kioskSectionMiniTitle">{text.products}</div>
              <div className="kioskServicesGrid">
                {products.map((p) => (
                  <button key={p.id} className="kioskServiceCard" onClick={() => onPickProduct(p)}>
                    <div className="kioskServiceName">{getProductName(p)}</div>
                    <div className="kioskServiceMeta">
                      <span>{Number(getDisplayPrice(p) || 0).toLocaleString("hu-HU")} Ft</span>
                    </div>
                    <div className="kioskServiceDesc">{getProductDescription(p)}</div>
                    <div className="kioskServiceCta">{text.add}</div>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <UpsellModal
        open={upsellOpen}
        title={upsellCfg?.title || "Ajánlat"}
        items={upsellCfg?.items || []}
        onAdd={addUpsell}
        onClose={() => setUpsellOpen(false)}
      />
    </>
  );
}
