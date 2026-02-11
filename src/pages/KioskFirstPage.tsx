import React, { useEffect, useMemo, useState } from "react";
import "./kioskFirst.css";

type KioskCategory = {
  id: string;
  name: string;
  image_path?: string | null;
  sort_order?: number | null;
};

type Professional = {
  id: string;
  name: string;
  title?: string | null;
  photo_url?: string | null;
  is_available?: boolean | null;
};

type WebshopProduct = {
  id: string;
  name: string;
  price_huf?: number | null;
  image_url?: string | null;
  short_desc?: string | null;
};

function safeJson<T>(r: Response): Promise<T> {
  return r.json().catch(() => ({} as T));
}

export function KioskFirstPage() {
  const [categories, setCategories] = useState<KioskCategory[]>([]);
  const [pros, setPros] = useState<Professional[]>([]);
  const [weeklyDeals, setWeeklyDeals] = useState<any[]>([]);
  const [buffetProducts, setBuffetProducts] = useState<WebshopProduct[]>([]);
  const [webshopProducts, setWebshopProducts] = useState<WebshopProduct[]>([]);

  // Képcsere a középső "szalon" sliderhez
  const heroImages = useMemo(
    () => [
      "/images/kiosk/salon_1.jpg",
      "/images/kiosk/salon_2.jpg",
      "/images/kiosk/salon_3.jpg",
    ],
    []
  );
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setHeroIdx((i) => (i + 1) % heroImages.length);
    }, 8000);
    return () => window.clearInterval(t);
  }, [heroImages.length]);

  // Képcsere a jobb alsó "webshop" sliderhez
  const [webshopIdx, setWebshopIdx] = useState(0);
  useEffect(() => {
    if (webshopProducts.length <= 1) return;
    const t = window.setInterval(() => {
      setWebshopIdx((i) => (i + 1) % webshopProducts.length);
    }, 6000);
    return () => window.clearInterval(t);
  }, [webshopProducts.length]);

  // Büfé termék slider (középső blokk)
  const [buffetIdx, setBuffetIdx] = useState(0);
  useEffect(() => {
    if (buffetProducts.length <= 1) return;
    const t = window.setInterval(() => {
      setBuffetIdx((i) => (i + 1) % buffetProducts.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, [buffetProducts.length]);

  useEffect(() => {
    // FŐ kategóriák (nagy arany kártyák)
    fetch("/api/kiosk/categories")
      .then((r) => (r.ok ? safeJson<KioskCategory[]>(r) : Promise.resolve([])))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCategories(
          [...list].sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          )
        );
      })
      .catch(() => setCategories([]));

    // Munkatársak (Signage oldalról)
    fetch("/api/signage/professionals/public")
      .then((r) => (r.ok ? safeJson<Professional[]>(r) : Promise.resolve([])))
      .then((data) => setPros(Array.isArray(data) ? data : []))
      .catch(() => setPros([]));

    // Heti akciók (ha van külön endpoint, itt cseréld)
    fetch("/api/signage/deals/weekly")
      .then((r) => (r.ok ? safeJson<any[]>(r) : Promise.resolve([])))
      .then((data) => setWeeklyDeals(Array.isArray(data) ? data : []))
      .catch(() => setWeeklyDeals([]));

    // Büfé termékek – ideális esetben külön endpoint (pl. /api/buffet/products)
    fetch("/api/webshop/products?tag=buffet&limit=12")
      .then((r) => (r.ok ? safeJson<WebshopProduct[]>(r) : Promise.resolve([])))
      .then((data) => setBuffetProducts(Array.isArray(data) ? data : []))
      .catch(() => setBuffetProducts([]));

    // Webshop termékek – váltakozó blokk
    fetch("/api/webshop/products?limit=12")
      .then((r) => (r.ok ? safeJson<WebshopProduct[]>(r) : Promise.resolve([])))
      .then((data) => setWebshopProducts(Array.isArray(data) ? data : []))
      .catch(() => setWebshopProducts([]));
  }, []);

  const heroSrc = heroImages[heroIdx] ?? "";
  const currentWebshop = webshopProducts[webshopIdx];
  const currentBuffet = buffetProducts[buffetIdx];

  return (
    <div className="kioskFirstRoot">
      <div className="kioskTopBar">
        <div className="kioskBrand">
          <img
            className="kioskBrandLogo"
            src="/images/kleo_logo@2x.png"
            alt="Kleopátra"
          />
          <div className="kioskBrandText">
            <div className="kioskBrandTitle">KLEOPÁTRA</div>
            <div className="kioskBrandSubtitle">SZÉPSÉGSZALONOK</div>
          </div>
        </div>

        <div className="kioskDailyDeals">
          <div className="kioskDailyDealsTitle">Napi akciók</div>
          <div className="kioskDailyDealsDesc">Nincs aktív villám akció.</div>
        </div>

        <div className="kioskSteps">
          <div className="kioskStep active">1. Menü</div>
          <div className="kioskStep">2. Fizetés</div>
          <div className="kioskStep">3. Sorszám</div>
        </div>
      </div>

      <div className="kioskGrid">
        {/* Bal oszlop: FŐ kategóriák */}
        <aside className="kioskColLeft">
          <div className="kioskPanelTitle">Kategóriák</div>
          <div className="kioskCats">
            {(categories.length ? categories : demoCats).map((c) => (
              <button key={c.id} className="kioskCatCard" type="button">
                <div className="kioskCatImgWrap">
                  {c.image_path ? (
                    <img
                      className="kioskCatImg"
                      src={c.image_path}
                      alt={c.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="kioskCatImgPlaceholder" />
                  )}
                </div>
                <div className="kioskCatName">{c.name}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Középső oszlop: slider + web + büfé + heti */}
        <main className="kioskColCenter">
          <div className="kioskHero">
            <img
              className="kioskHeroImg"
              src={heroSrc}
              alt="Szalon"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/880x360?text=KLEO+SALON";
              }}
            />
          </div>

          <section className="kioskSection">
            <div className="kioskSectionHeader">
              <div className="kioskSectionTitle">Weboldal</div>
              <div className="kioskSectionHint">Belinkelve a főoldal</div>
            </div>
            <div className="kioskIFrameWrap">
              <iframe
                className="kioskIframe"
                src="/"
                title="Kleoszalon web"
              />
            </div>
          </section>

          <section className="kioskSection">
            <div className="kioskSectionHeader">
              <div className="kioskSectionTitle">Büfé termékek</div>
              <div className="kioskSectionHint">Slide + rövid leírás</div>
            </div>

            <div className="kioskProductSlide">
              <div className="kioskProductImgWrap">
                <img
                  className="kioskProductImg"
                  src={currentBuffet?.image_url ?? ""}
                  alt={currentBuffet?.name ?? "Büfé"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/360x220?text=BUFFET";
                  }}
                />
              </div>
              <div className="kioskProductText">
                <div className="kioskProductName">
                  {currentBuffet?.name ?? "Büfé termék"}
                </div>
                <div className="kioskProductDesc">
                  {currentBuffet?.short_desc ??
                    "Kóstold meg a büfében elérhető termékeinket."}
                </div>
                {typeof currentBuffet?.price_huf === "number" && (
                  <div className="kioskProductPrice">
                    {Math.round(currentBuffet.price_huf).toLocaleString("hu-HU")} Ft
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="kioskSection">
            <div className="kioskSectionHeader">
              <div className="kioskSectionTitle">Heti akciók</div>
              <div className="kioskSectionHint">Aktuális ajánlatok</div>
            </div>
            <div className="kioskWeeklyDeals">
              {(weeklyDeals.length ? weeklyDeals : demoWeeklyDeals).map(
                (d, idx) => (
                  <div className="kioskDealRow" key={idx}>
                    <div className="kioskDealTitle">{d.title}</div>
                    <div className="kioskDealMeta">{d.subtitle}</div>
                  </div>
                )
              )}
            </div>
          </section>
        </main>

        {/* Jobb oszlop: munkatársak + webshop slider */}
        <aside className="kioskColRight">
          <div className="kioskPanelTitle">Elérhető szakembereink</div>
          <div className="kioskPros">
            {(pros.length ? pros : demoPros).slice(0, 6).map((p) => (
              <div className="kioskProRow" key={p.id}>
                <div className="kioskProAvatarWrap">
                  <img
                    className="kioskProAvatar"
                    src={p.photo_url ?? ""}
                    alt={p.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://placehold.co/96x96?text=%F0%9F%91%A4";
                    }}
                  />
                  <span
                    className={
                      "kioskProDot " +
                      (p.is_available ? "ok" : "no")
                    }
                  />
                </div>
                <div className="kioskProText">
                  <div className="kioskProName">{p.name}</div>
                  <div className="kioskProTitle">{p.title ?? ""}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="kioskWebshopCard">
            <div className="kioskWebshopTitle">Webshop ajánlat</div>
            <div className="kioskWebshopBody">
              <img
                className="kioskWebshopImg"
                src={currentWebshop?.image_url ?? ""}
                alt={currentWebshop?.name ?? "Webshop"}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/420x260?text=WEBSHOP";
                }}
              />
              <div className="kioskWebshopName">
                {currentWebshop?.name ?? "Szépségcsomag"}
              </div>
              <div className="kioskWebshopDesc">
                {currentWebshop?.short_desc ??
                  "Válassz a webshop kínálatából – ajándéknak is tökéletes."}
              </div>
              {typeof currentWebshop?.price_huf === "number" && (
                <div className="kioskWebshopPrice">
                  {Math.round(currentWebshop.price_huf).toLocaleString("hu-HU")} Ft
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const demoCats: KioskCategory[] = [
  { id: "hair", name: "FODRÁSZAT" },
  { id: "cosm", name: "KOZMETIKA" },
  { id: "nails", name: "KÉZ- ÉS LÁBÁPOLÁS" },
  { id: "massage", name: "MASSZÁZS" },
  { id: "fitness", name: "FITNESS" },
];

const demoPros: Professional[] = [
  {
    id: "p1",
    name: "Lendiel Dzhenna",
    title: "Fodrász",
    photo_url: "https://placehold.co/96x96?text=JD",
    is_available: true,
  },
  {
    id: "p2",
    name: "Viktor Renátó",
    title: "Gyógymasszőr",
    photo_url: "https://placehold.co/96x96?text=VR",
    is_available: false,
  },
  {
    id: "p3",
    name: "Besenyei Szilvia",
    title: "TOP Gyógymasszőr",
    photo_url: "https://placehold.co/96x96?text=BS",
    is_available: false,
  },
  {
    id: "p4",
    name: "Szöke Noémi",
    title: "Fodrász",
    photo_url: "https://placehold.co/96x96?text=SN",
    is_available: true,
  },
  {
    id: "p5",
    name: "Sülyi Alexandra",
    title: "Fodrász",
    photo_url: "https://placehold.co/96x96?text=SA",
    is_available: true,
  },
];

const demoWeeklyDeals = [
  { title: "-10% minden hajápolásra", subtitle: "Hétfő–Szerda" },
  { title: "Arcápolás csomag", subtitle: "+ ajándék szérum" },
  { title: "Masszázs 30 perc", subtitle: "kedvezményes áron" },
];
