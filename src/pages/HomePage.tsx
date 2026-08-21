import React from "react";
import { NavLink } from "react-router-dom";
import { useWebsiteCms } from "../websiteCms";

type ServiceCard = { title: string; text: string; to: string };
type SalonCard = { title: string; address: string; image: string; to: string };

const SERVICES: ServiceCard[] = [
  { title: "Fodrászat", text: "Hajvágás, hajfestés, balayage, hajformázás és professzionális hajápolás – a hozzád illő megjelenésért.", to: "/szolgaltatasok/fodraszat" },
  { title: "Kozmetika", text: "Arckezelések, gépi kezelések, szempilla, szemöldök és szőrtelenítés korszerű megoldásokkal.", to: "/szolgaltatasok/kozmetika" },
  { title: "Kéz- és lábápolás", text: "Manikűr, géllakk, műköröm és pedikűr – tartós, ápolt és stílusos végeredménnyel.", to: "/szolgaltatasok/kez-es-labapolas" },
  { title: "Szolárium", text: "Szalononként elérhető szolárium szolgáltatások, rugalmasan, a Kleopátra szépségélmény részeként.", to: "/szolgaltatasok/szolarium" },
  { title: "Masszázs", text: "Relaxáló és frissítő kezelések, hogy a szépségápolás valódi feltöltődés is legyen.", to: "/szolgaltatasok/masszazs" },
  { title: "Fitness & Wellness Gyöngyös", text: "Mozgás, feltöltődés és szépség egy helyen – a gyöngyösi helyszín kiemelt szolgáltatásai.", to: "/salons" },
];

const SALONS: SalonCard[] = [
  { title: "Budapest IX.", address: "Mester u. 1.", image: "/images/mester.jpg", to: "/salons/budapest-ix" },
  { title: "Budapest VIII.", address: "Rákóczi u. 63.", image: "/images/rakoczi.jpg", to: "/salons/budapest-viii" },
  { title: "Budapest XII.", address: "Krisztina krt. 23.", image: "/images/krisztina.jpg", to: "/salons/budapest-xii" },
  { title: "Budapest XIII.", address: "Visegrádi u. 3.", image: "/images/visegradi.jpg", to: "/salons/budapest-xiii" },
];

const QUICK_LINKS = [
  ["Szolgáltatások", "/services"],
  ["Áraink", "/prices"],
  ["Szalonjaink", "/salons"],
  ["Hűségprogram", "/loyalty"],
  ["Ajándékutalvány", "/webshop"],
  ["Webshop", "/webshop"],
  ["Rólunk", "/about"],
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

export const HomePage: React.FC = () => {
  const cms = useWebsiteCms();
  const h = cms.home;
  const configuredHero = (h.heroImageUrl || "").trim();
  const heroImage = !configuredHero || /logo|kleo_logo/i.test(configuredHero) ? "/images/home.png" : configuredHero;

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
              <span><i aria-hidden="true" /> Bejelentkezés nélkül is</span>
              <span><i aria-hidden="true" /> Online foglalás</span>
              <span><i aria-hidden="true" /> Több szépségápolási részleg</span>
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
        <section className="kleo-v3-section">
          <div className="kleo-modern-container">
            <header className="kleo-v3-head">
              <div className="kleo-v3-head__copy">
                <p className="kleo-v3-eyebrow">Minden, ami szépség – egy helyen</p>
                <h2>Válaszd azt, amitől igazán jól érzed magad.</h2>
                <p>A Kleopátra világában a haj, a bőr, a kéz- és lábápolás, a relaxáció és a kiegészítő szépségszolgáltatások egyetlen, könnyen elérhető rendszerben találkoznak.</p>
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

      <section className="kleo-v3-section kleo-v3-section--paper">
        <div className="kleo-modern-container">
          <header className="kleo-v3-head">
            <div className="kleo-v3-head__copy">
              <p className="kleo-v3-eyebrow">Szalonjaink</p>
              <h2>A Kleopátra élmény hozzád közel.</h2>
              <p>Válassz helyszínt, nézd meg az elérhető szolgáltatásokat és szakembereket, majd foglalj néhány lépésben.</p>
            </div>
            <NavLink to="/salons" className="kleo-v3-text-link">Összes szalon <span>→</span></NavLink>
          </header>

          <div className="kleo-v3-salon-grid">
            {SALONS.map((salon) => (
              <NavLink key={salon.to} to={salon.to} className="kleo-v3-salon">
                <img loading="lazy" decoding="async" src={salon.image} alt={`Kleopátra Szépségszalon – ${salon.title}`} />
                <div className="kleo-v3-salon__body">
                  <small>Kleopátra Szépségszalon</small>
                  <h3>{salon.title}</h3>
                  <p>{salon.address}</p>
                  <span>Részletek és foglalás →</span>
                </div>
              </NavLink>
            ))}
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
