import React from "react";
import { NavLink } from "react-router-dom";
import { useWebsiteCms } from "../websiteCms";

type ServiceCard = {
  title: string;
  text: string;
  to: string;
  icon: string;
};

type SalonCard = {
  title: string;
  address: string;
  image: string;
  to: string;
};

const SERVICES: ServiceCard[] = [
  { title: "Fodrászat", text: "Hajvágás, festés, balayage és professzionális hajápolás.", to: "/services#hair", icon: "✦" },
  { title: "Körömápolás", text: "Géllakk, műköröm, manikűr és pedikűr a részletekig.", to: "/services#handsfeet", icon: "◇" },
  { title: "Arckezelések", text: "Személyre szabott kozmetikai kezelések a ragyogó bőrért.", to: "/services#beauty", icon: "○" },
  { title: "Szempilla stylist", text: "Szempillahosszabbítás, lifting és laminálás a kifejező tekintetért.", to: "/services#beauty", icon: "⌁" },
  { title: "Testkezelések", text: "Masszázsok, alakformáló és kényeztető kezelések.", to: "/services#massage", icon: "♢" },
  { title: "Smink és beauty", text: "Alkalmi megjelenés, professzionális termékek és beauty szolgáltatások.", to: "/services#beauty", icon: "✧" },
];

const SALONS: SalonCard[] = [
  { title: "Budapest IX.", address: "Mester u. 1.", image: "/images/mester.jpg", to: "/salons/budapest-ix" },
  { title: "Budapest VIII.", address: "Rákóczi u. 63.", image: "/images/rakoczi.jpg", to: "/salons/budapest-viii" },
  { title: "Budapest XII.", address: "Krisztina krt. 23.", image: "/images/krisztina.jpg", to: "/salons/budapest-xii" },
  { title: "Budapest XIII.", address: "Visegrádi u. 3.", image: "/images/visegradi.jpg", to: "/salons/budapest-xiii" },
];

const TRUST_ITEMS = [
  ["7", "szalon", "Budapesten és vidéken"],
  ["Online", "időpontfoglalás", "Gyorsan, néhány lépésben"],
  ["Képzett", "szakemberek", "Folyamatos szakmai fejlődés"],
  ["KLEO", "élmény", "Minden ami szépség, csak Neked!"],
];

export const HomePage: React.FC = () => {
  const cms = useWebsiteCms();
  const h = cms.home;
  const configuredHero = (h.heroImageUrl || "").trim();
  const heroImage = !configuredHero || /logo|kleo_logo/i.test(configuredHero)
    ? "/images/szalonok.jpg"
    : configuredHero;

  return (
    <main className="kleo-home-modern">
      <section className="kleo-modern-hero">
        <div className="kleo-modern-hero__shape kleo-modern-hero__shape--gold" />
        <div className="kleo-modern-hero__shape kleo-modern-hero__shape--pink" />
        <div className="kleo-modern-container kleo-modern-hero__grid">
          <div className="kleo-modern-hero__copy">
            <p className="kleo-modern-eyebrow">{h.heroKicker}</p>
            <h1 className="kleo-modern-hero__title">{h.heroTitlePrefix}<span>{h.heroTitleHighlight}</span>{h.heroTitleSuffix}</h1>
            <p className="kleo-modern-hero__lead">{h.heroLead}</p>

            <div className="kleo-modern-hero__actions">
              <NavLink to="/booking" className="kleo-modern-btn kleo-modern-btn--primary">{cms.header.bookingLabel}</NavLink>
              <NavLink to="/services" className="kleo-modern-btn kleo-modern-btn--outline">Szolgáltatásaink</NavLink>
            </div>

            <div className="kleo-modern-benefits" aria-label="Kleopátra előnyök">
              <div><b>♕</b><span><strong>Prémium minőség</strong><small>Minőségi alapanyagok</small></span></div>
              <div><b>♡</b><span><strong>Szakértő kezek</strong><small>Tapasztalt csapat</small></span></div>
              <div><b>◇</b><span><strong>Higiénia & biztonság</strong><small>A te nyugalmadért</small></span></div>
            </div>
          </div>

          <div className="kleo-modern-hero__visual">
            <div className="kleo-modern-hero__image-wrap">
              <img src={heroImage} alt="Kleopátra Szépségszalonok" />
            </div>
            <NavLink to="/loyalty" className="kleo-modern-loyalty-card">
              <span className="kleo-modern-loyalty-card__icon">♧</span>
              <span><strong>Hűségprogram</strong><small>Gyűjts pontokat és élvezd az előnyöket!</small></span>
            </NavLink>
          </div>
        </div>
      </section>

      {h.showServices && (
        <section className="kleo-modern-section kleo-modern-services">
          <div className="kleo-modern-container">
            <div className="kleo-modern-section-head">
              <div><p className="kleo-modern-eyebrow">Szolgáltatásaink</p><h2>Szépségápolás felsőfokon</h2></div>
              <NavLink to="/services" className="kleo-modern-text-link">Összes szolgáltatás <span>→</span></NavLink>
            </div>
            <div className="kleo-modern-service-grid">
              {SERVICES.map((service) => (
                <NavLink key={service.title} to={service.to} className="kleo-modern-service-card">
                  <span className="kleo-modern-service-card__icon" aria-hidden="true">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <span className="kleo-modern-card-arrow">→</span>
                </NavLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="kleo-modern-section kleo-modern-section--soft">
        <div className="kleo-modern-container">
          <div className="kleo-modern-section-head">
            <div><p className="kleo-modern-eyebrow">Szalonjaink</p><h2>Találj ránk a közeledben!</h2></div>
            <NavLink to="/salons" className="kleo-modern-text-link">Összes szalon megtekintése <span>→</span></NavLink>
          </div>
          <div className="kleo-modern-salon-grid">
            {SALONS.map((salon) => (
              <NavLink key={salon.to} to={salon.to} className="kleo-modern-salon-card">
                <img src={salon.image} alt={`Kleopátra Szépségszalon – ${salon.title}`} />
                <div className="kleo-modern-salon-card__body"><small>Kleopátra Szépségszalon</small><h3>{salon.title}</h3><p>{salon.address}</p><span>Részletek →</span></div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {h.showVouchers && (
        <section className="kleo-modern-promo-wrap"><div className="kleo-modern-container"><div className="kleo-modern-promo"><div className="kleo-modern-promo__copy"><p className="kleo-modern-eyebrow">Ajándékötlet</p><h2>{h.voucherTitle || "Ajándékozz Kleopátra élményt"}</h2><p>{h.voucherLead}</p><NavLink to="/webshop" className="kleo-modern-btn kleo-modern-btn--primary">Megnézem az utalványokat</NavLink></div><div className="kleo-modern-promo__image"><img src="/images/vouchers.png" alt="Kleopátra ajándékutalványok" /></div></div></div></section>
      )}

      <section className="kleo-modern-trust"><div className="kleo-modern-container kleo-modern-trust__grid">{TRUST_ITEMS.map(([value, label, note]) => <div className="kleo-modern-trust__item" key={`${value}-${label}`}><span className="kleo-modern-trust__icon">✦</span><div><strong>{value}</strong><b>{label}</b><small>{note}</small></div></div>)}</div></section>

      {h.showProducts && (
        <section className="kleo-modern-section kleo-modern-shop"><div className="kleo-modern-container kleo-modern-shop__grid"><div className="kleo-modern-shop__copy"><p className="kleo-modern-eyebrow">Kleopátra webshop</p><h2>{h.productsTitle || "Prémium termékek a szépségedért"}</h2><p>{h.productsLead}</p><NavLink to="/webshop" className="kleo-modern-btn kleo-modern-btn--primary">Webshop megtekintése</NavLink></div><div className="kleo-modern-shop__visual"><img src="/images/products.png" alt="KLEOS termékek" /><div className="kleo-modern-shop__chips"><span>Hajápolás</span><span>Bőrápolás</span><span>Kéz- és körömápolás</span><span>Beauty</span></div></div></div></section>
      )}

      <section className="kleo-modern-booking-strip"><div className="kleo-modern-container kleo-modern-booking-strip__inner"><div className="kleo-modern-booking-strip__copy"><span className="kleo-modern-booking-strip__icon">▣</span><div><strong>Foglalj időpontot online!</strong><small>Gyorsan és egyszerűen, néhány kattintással.</small></div></div><NavLink to="/booking" className="kleo-modern-btn kleo-modern-btn--light">Időpontfoglalás</NavLink></div></section>
    </main>
  );
};

export default HomePage;
