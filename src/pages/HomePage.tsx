import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { getPublicSalons, type PublicSalon } from "../apiClient";
import { useWebsiteCms } from "../websiteCms";

type ServiceCard = { title: string; text: string; to: string };
type UserPosition = { latitude: number; longitude: number };

const SERVICES: ServiceCard[] = [
  { title: "Fodrászat", text: "Hajvágás, hajfestés, balayage, hajformázás és professzionális hajápolás – mindig a Te stílusodhoz és elképzelésedhez igazítva.", to: "/szolgaltatasok/fodraszat" },
  { title: "Kéz- és lábápolás", text: "Manikűr, géllakk, műköröm és pedikűr modern technikákkal, minőségi alapanyagokkal és tartós, ápolt végeredménnyel.", to: "/szolgaltatasok/kez-es-labapolas" },
  { title: "Kozmetika", text: "Arckezelések, gépi kezelések, szempilla, szemöldök és szőrtelenítés korszerű megoldásokkal, a bőr állapotához igazítva.", to: "/szolgaltatasok/kozmetika" },
  { title: "Masszázs", text: "Relaxáló és frissítő kezelések, hogy a mindennapi stressz helyét nyugalom, feltöltődés és jó közérzet vegye át.", to: "/szolgaltatasok/masszazs" },
];

const SALON_IMAGES: Record<string, string> = {
  "budapest-ix": "/images/mester.jpg",
  "budapest-viii": "/images/rakoczi.jpg",
  "budapest-xii": "/images/krisztina.jpg",
  "budapest-xiii": "/images/visegradi.jpg",
  eger: "/images/Eger.jpg",
  gyongyos: "/images/gyongyos.png",
  salgotarjan: "/images/salgotarjan.jpg",
};

const QUICK_LINKS = [
  ["Szolgáltatások", "/services"],
  ["Áraink", "/prices"],
  ["Szalonjaink", "/salons"],
  ["Webshop", "/webshop"],
  ["Oktatás", "/education"],
  ["Karrier", "/career"],
  ["Időpontfoglalás", "/booking"],
  ["Hűségprogram", "/loyalty"],
  ["Franchise", "/franchise"],
  ["Rólunk", "/about"],
  ["Ajándékutalvány", "/webshop"],
] as const;

const APP_FEATURES = [
  "Foglalásaid gyors áttekintése és egyszerű újrafoglalás",
  "Bérleteid és a még felhasználható alkalmak követése",
  "Vendégszámla-egyenleged megtekintése",
  "Személyre szabott ajánlatok és aktuális akciók",
];

const FRANCHISE_ITEMS = [
  "Marketing támogatás",
  "HR és toborzási támogatás",
  "Kedvezményes eszköz- és anyagvásárlás",
  "Folyamatos szakmai és vezetői képzések",
  "Központi ügyfélmenedzsment",
  "Bevezetett márka- és működési háttér",
];

const radians = (value: number) => value * Math.PI / 180;
function distanceKm(position: UserPosition, salon: PublicSalon) {
  if (salon.latitude == null || salon.longitude == null) return Number.POSITIVE_INFINITY;
  const earth = 6371;
  const dLat = radians(Number(salon.latitude) - position.latitude);
  const dLon = radians(Number(salon.longitude) - position.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(position.latitude)) * Math.cos(radians(Number(salon.latitude))) * Math.sin(dLon / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const HomePage: React.FC = () => {
  const cms = useWebsiteCms();
  const h = cms.home;
  const configuredHero = (h.heroImageUrl || "").trim();
  const heroImage = !configuredHero || /logo|kleo_logo/i.test(configuredHero) ? "/images/home.png" : configuredHero;
  const [salons, setSalons] = useState<PublicSalon[]>([]);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "denied">("idle");

  useEffect(() => {
    let alive = true;
    getPublicSalons().then((items) => { if (alive) setSalons(items); }).catch(() => undefined);
    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      navigator.permissions.query({ name: "geolocation" as PermissionName }).then((permission) => {
        if (!alive || permission.state !== "granted") return;
        navigator.geolocation.getCurrentPosition((result) => {
          if (!alive) return;
          setPosition({ latitude: result.coords.latitude, longitude: result.coords.longitude });
          setLocationState("ready");
        }, () => undefined, { enableHighAccuracy: false, maximumAge: 300000, timeout: 4000 });
      }).catch(() => undefined);
    }
    return () => { alive = false; };
  }, []);

  const nearbySalons = useMemo(() => {
    const copy = [...salons];
    if (position) copy.sort((a, b) => distanceKm(position, a) - distanceKm(position, b));
    return copy.slice(0, 4);
  }, [salons, position]);

  const requestLocation = () => {
    if (!navigator.geolocation) return setLocationState("denied");
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition((result) => {
      setPosition({ latitude: result.coords.latitude, longitude: result.coords.longitude });
      setLocationState("ready");
    }, () => setLocationState("denied"), { enableHighAccuracy: false, maximumAge: 300000, timeout: 7000 });
  };

  return (
    <main className="kleo-v3-home">
      <section className="kleo-v3-hero">
        <div className="kleo-modern-container kleo-v3-hero__grid">
          <div className="kleo-v3-hero__copy">
            <p className="kleo-v3-eyebrow">{h.heroKicker}</p>
            <h1>{h.heroTitlePrefix}<em>{h.heroTitleHighlight}</em>{h.heroTitleSuffix}</h1>
            <p className="kleo-v3-hero__lead">{h.heroLead}</p>
            <div className="kleo-v3-hero__actions">
              <NavLink to="/booking" className="kleo-v3-btn kleo-v3-btn--dark">{cms.header.bookingLabel}</NavLink>
              <NavLink to="/salons" className="kleo-v3-btn kleo-v3-btn--ghost">Szalon választása</NavLink>
            </div>
            <div className="kleo-v3-hero__meta" aria-label="Kleopátra előnyök">
              <span><i aria-hidden="true" /> Minden egy helyen</span>
              <span><i aria-hidden="true" /> Bejelentkezés nélkül is</span>
              <span><i aria-hidden="true" /> Online foglalás</span>
            </div>
          </div>

          <div className="kleo-v3-hero__visual">
            <div className="kleo-v3-hero__image">
              <img src={heroImage} alt="Kleopátra Szépségszalonok" decoding="async" />
            </div>
            <div className="kleo-v3-hero__badge">
              <small>Rugalmas szépségápolás</small>
              <strong>Térj be, amikor csak akarsz.</strong>
              <span>Ha előre tervezel, foglalj online vagy telefonon; ha gyors megoldás kell, szalonjaink bejelentkezés nélkül is várnak.</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="kleo-v3-quick" aria-label="Gyors elérés">
        <div className="kleo-modern-container kleo-v3-quick__inner">
          {QUICK_LINKS.map(([label, to]) => <NavLink key={`${label}-${to}`} to={to}>{label}</NavLink>)}
        </div>
      </nav>

      {h.showServices && (
        <section className="kleo-v3-section kleo-v3-section--priority">
          <div className="kleo-modern-container">
            <header className="kleo-v3-head">
              <div className="kleo-v3-head__copy">
                <p className="kleo-v3-eyebrow">Minden, ami szépség – egy helyen</p>
                <h2>Szépségápolás felsőfokon.</h2>
                <p>Fodrászat, kéz- és lábápolás, kozmetika és masszázs egyetlen könnyen átlátható rendszerben. Válaszd ki a részleget, nézd meg a szolgáltatásokat és az árakat, majd csak akkor foglalj, amikor már tudod, mit szeretnél.</p>
              </div>
              <NavLink to="/services" className="kleo-v3-text-link">Minden szolgáltatás <span>→</span></NavLink>
            </header>

            <div className="kleo-v3-services">
              {SERVICES.map((service, index) => (
                <NavLink key={service.title} to={service.to} className="kleo-v3-service">
                  <span className="kleo-v3-service__index">0{index + 1}</span>
                  <span className="kleo-v3-service__arrow" aria-hidden="true">↗</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </NavLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="kleo-v3-section kleo-v3-section--paper kleo-v3-section--priority">
        <div className="kleo-modern-container">
          <header className="kleo-v3-head">
            <div className="kleo-v3-head__copy">
              <p className="kleo-v3-eyebrow">Szalonjaink</p>
              <h2>Találj ránk a közeledben.</h2>
              <p>{position ? "A helyzeted alapján a hozzád legközelebbi szalonokat mutatjuk elsőként." : "Válassz képek és helyszín alapján, vagy engedélyezd a helyzeted használatát, és a hozzád legközelebbi szalonokat rendezzük előre."}</p>
            </div>
            <div className="kleo-v3-nearby-actions">
              {!position && <button type="button" className="kleo-v3-nearby-btn" onClick={requestLocation} disabled={locationState === "loading"}>{locationState === "loading" ? "Helyzet meghatározása…" : "Helyzetem alapján rendezem"}</button>}
              <NavLink to="/salons" className="kleo-v3-text-link">Összes szalon és térkép <span>→</span></NavLink>
            </div>
          </header>
          {locationState === "denied" && <p className="kleo-v3-location-note">A helyzeted nem érhető el, ezért az alapértelmezett szalonlistát mutatjuk. A teljes térképes kereső a Szalonjaink oldalon továbbra is használható.</p>}

          <div className="kleo-v3-salon-grid">
            {nearbySalons.map((salon) => {
              const km = position ? distanceKm(position, salon) : null;
              return <NavLink key={salon.slug} to={`/salons/${salon.slug}`} className="kleo-v3-salon">
                <img loading="lazy" decoding="async" src={SALON_IMAGES[salon.slug] || "/images/szalonok.jpg"} alt={`Kleopátra Szépségszalon – ${salon.city_label}`} />
                <div className="kleo-v3-salon__body">
                  <small>{km != null && Number.isFinite(km) ? `${km.toFixed(km < 10 ? 1 : 0)} km · ` : ""}Kleopátra Szépségszalon</small>
                  <h3>{salon.city_label}</h3>
                  <p>{salon.address}</p>
                  <span>Részletek, árak és foglalás →</span>
                </div>
              </NavLink>;
            })}
          </div>
        </div>
      </section>

      <section className="kleo-v3-section kleo-v3-section--ink">
        <div className="kleo-modern-container">
          <div className="kleo-v3-booking-choice">
            <div>
              <span>01 / Spontán</span>
              <h2>Csak térj be.</h2>
              <p>Gyors megoldásra van szükséged? Szalonjainkban lehetőséged van arra, hogy bejelentkezés nélkül is igénybe vedd az adott helyszínen szabadon elérhető szolgáltatásokat.</p>
              <NavLink to="/salons">Közeli szalon keresése →</NavLink>
            </div>
            <div>
              <span>02 / Tervezetten</span>
              <h2>Foglalj előre.</h2>
              <p>Ha fontos a konkrét időpont vagy a megszokott szakember, válassz szalont, szolgáltatást és időpontot az online foglalásban.</p>
              <NavLink to="/booking">Online időpontfoglalás →</NavLink>
            </div>
          </div>
        </div>
      </section>

      {h.showApp && (
        <section className="kleo-v3-section">
          <div className="kleo-modern-container kleo-v3-split kleo-v3-split--reverse">
            <div className="kleo-v3-split__media">
              <img loading="lazy" decoding="async" src="/images/app.png" alt="Kleopátra mobilalkalmazás" />
            </div>
            <div className="kleo-v3-split__copy">
              <p className="kleo-v3-eyebrow">Kleopátra a mobilodon</p>
              <h2>{h.appTitle}</h2>
              <p>{h.appLead}</p>
              <div className="kleo-v3-feature-list">
                {APP_FEATURES.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="kleo-v3-store-buttons">
                <a href="https://apps.apple.com/us/app/id1492246806" target="_blank" rel="noreferrer">Letöltés iPhone-ra ↗</a>
                <a href="https://play.google.com/store/apps/details?hl=hu&id=com.yclients.mobile.s206313" target="_blank" rel="noreferrer">Letöltés Androidra ↗</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {(h.showVouchers || h.showNewsletter) && (
        <section className="kleo-v3-section kleo-v3-section--paper">
          <div className="kleo-modern-container kleo-v3-bento">
            {h.showVouchers && (
              <article className="kleo-v3-bento__card">
                <img loading="lazy" decoding="async" src="/images/vouchers.png" alt="Kleopátra ajándékutalványok" />
                <div className="kleo-v3-bento__content">
                  <p className="kleo-v3-eyebrow">Ajándék, ami élménnyé válik</p>
                  <h2>{h.voucherTitle}</h2>
                  <p>{h.voucherLead}</p>
                  <NavLink to="/webshop">Ajándékutalványok megtekintése →</NavLink>
                </div>
              </article>
            )}

            {h.showNewsletter && (
              <article className="kleo-v3-bento__card kleo-v3-bento__card--magenta">
                <div className="kleo-v3-bento__content">
                  <p className="kleo-v3-eyebrow">Kleopátra hírlevél</p>
                  <h2>{h.newsletterTitle}</h2>
                  <p>{h.newsletterLead}</p>
                  <a href="https://www.kleoszalon.hu/hirlevel" target="_blank" rel="noreferrer">Feliratkozom →</a>
                </div>
              </article>
            )}
          </div>
        </section>
      )}

      {h.showProducts && (
        <section className="kleo-v3-section">
          <div className="kleo-modern-container kleo-v3-shop">
            <div className="kleo-v3-shop__copy">
              <p className="kleo-v3-eyebrow">Kleos termékek</p>
              <h2>{h.productsTitle}</h2>
              <p>{h.productsLead}</p>
              <p>Stílusos, letisztult és egyedi megjelenés – a Kleopátra életérzés a szalonon kívül is.</p>
              <NavLink to="/webshop" className="kleo-v3-btn kleo-v3-btn--dark">Webshop megnyitása</NavLink>
            </div>
            <div className="kleo-v3-shop__visual">
              <img loading="lazy" decoding="async" src="/images/products.png" alt="KLEOS saját márkás termékek" />
            </div>
          </div>
        </section>
      )}

      <section className="kleo-v3-section kleo-v3-section--paper">
        <div className="kleo-modern-container kleo-v3-why">
          <div>
            <p className="kleo-v3-eyebrow">Miért Kleopátra?</p>
            <h2>{h.whyTitle}</h2>
          </div>
          <div className="kleo-v3-why__items">
            {h.whyItems.map((item, index) => (
              <div key={item} className="kleo-v3-why__item">
                <span>0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {h.showFranchise && (
        <section className="kleo-v3-section">
          <div className="kleo-modern-container">
            <div className="kleo-v3-franchise">
              <div className="kleo-v3-franchise__media">
                <img loading="lazy" decoding="async" src="/images/franchise.jpg" alt="Kleopátra franchise program" />
              </div>
              <div className="kleo-v3-franchise__copy">
                <p className="kleo-v3-eyebrow">Franchise program</p>
                <h2>Saját Kleopátra Szépségszalont szeretnél?</h2>
                <p>Csatlakozz egy professzionális háttérrel rendelkező szépségmárkához, és építs szalont kialakított üzleti, szakmai és marketing rendszerrel.</p>
                <ul>{FRANCHISE_ITEMS.map((item) => <li key={item}>{item}</li>)}</ul>
                <NavLink to="/franchise" className="kleo-v3-btn kleo-v3-btn--ghost" style={{ marginTop: 28, alignSelf: "flex-start", color: "#fff", borderColor: "rgba(255,255,255,.35)" }}>Franchise részletek</NavLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="kleo-v3-final">
        <div className="kleo-modern-container kleo-v3-final__inner">
          <div className="kleo-v3-final__copy">
            <p className="kleo-v3-eyebrow">Look good, feel good</p>
            <h2>Találd meg a szalonod, és foglalj időpontot.</h2>
            <p>Válassz szolgáltatást, helyszínt és szakembert – vagy térj be hozzánk spontán, amikor szépségre és feltöltődésre van szükséged.</p>
          </div>
          <NavLink to="/booking" className="kleo-v3-btn kleo-v3-btn--dark">Időpontfoglalás</NavLink>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
