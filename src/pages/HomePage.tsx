import React from "react";
import { NavLink } from "react-router-dom";
import { useWebsiteCms } from "../websiteCms";

type ServiceCard = { title: string; text: string; to: string; icon: string };
type SalonCard = { title: string; address: string; image: string; to: string };

const SERVICES: ServiceCard[] = [
  { title: "Fodrászat", text: "Hajvágás, hajfestés, balayage, hajformázás és professzionális hajápolás.", to: "/szolgaltatasok/fodraszat", icon: "✦" },
  { title: "Kéz- és lábápolás", text: "Manikűr, géllakk, műköröm és pedikűr egy helyen.", to: "/szolgaltatasok/kez-es-labapolas", icon: "◇" },
  { title: "Kozmetika", text: "Arckezelések, gépi kezelések, szempilla, szemöldök és gyantázás.", to: "/szolgaltatasok/kozmetika", icon: "○" },
  { title: "Masszázs", text: "Relaxáló, frissítő és regeneráló masszázskezelések.", to: "/szolgaltatasok/masszazs", icon: "♢" },
];

const SALONS: SalonCard[] = [
  { title: "Budapest IX.", address: "Mester u. 1.", image: "/images/mester.jpg", to: "/salons/budapest-ix" },
  { title: "Budapest VIII.", address: "Rákóczi u. 63.", image: "/images/rakoczi.jpg", to: "/salons/budapest-viii" },
  { title: "Budapest XII.", address: "Krisztina krt. 23.", image: "/images/krisztina.jpg", to: "/salons/budapest-xii" },
  { title: "Budapest XIII.", address: "Visegrádi u. 3.", image: "/images/visegradi.jpg", to: "/salons/budapest-xiii" },
];

const QUICK_LINKS = [
  ["Szolgáltatások", "/services"], ["Áraink", "/prices"], ["Szalonjaink", "/salons"],
  ["Webshop", "/webshop"], ["Oktatás", "/education"], ["Karrier", "/career"], ["Időpontfoglalás", "/booking"],
] as const;

const TRUST_ITEMS = [
  ["7", "szalon", "Budapesten és vidéken"],
  ["Online", "időpontfoglalás", "Gyorsan, néhány lépésben"],
  ["Képzett", "szakemberek", "Folyamatos szakmai fejlődés"],
  ["KLEO", "élmény", "Minden ami szépség, csak Neked!"],
];

const HOME_PRIORITY_CSS = `
.kleo-home-priority-nav{background:#fff;border-bottom:1px solid rgba(182,152,97,.22);position:relative;z-index:3}
.kleo-home-priority-nav__inner{display:flex;gap:8px;overflow-x:auto;padding-top:12px;padding-bottom:12px;scrollbar-width:none}
.kleo-home-priority-nav__inner::-webkit-scrollbar{display:none}
.kleo-home-priority-nav a{white-space:nowrap;padding:9px 13px;border:1px solid #e8dfd6;border-radius:999px;color:#241914;text-decoration:none;font-size:12px;font-weight:750;background:#fff}
.kleo-home-priority-nav a:last-child{background:#ec008c;color:#fff;border-color:#ec008c}
.kleo-home-modern .kleo-modern-hero{min-height:520px!important}
.kleo-home-modern .kleo-modern-hero__grid{min-height:520px!important;padding-top:26px!important;padding-bottom:26px!important}
.kleo-home-modern .kleo-modern-hero__visual{min-height:450px!important;isolation:isolate;overflow:visible!important}
.kleo-home-modern .kleo-modern-hero__image-wrap{z-index:1!important;background:transparent!important;box-shadow:none!important}
.kleo-home-modern .kleo-modern-hero__image-wrap::before{display:none!important}
.kleo-home-modern .kleo-modern-hero__image-wrap img{min-height:450px!important;position:relative!important;z-index:2!important;background:transparent!important;mix-blend-mode:multiply}
.kleo-home-modern .kleo-modern-hero__shape--pink-foreground{z-index:3!important;right:-160px!important;bottom:-215px!important;pointer-events:none!important}
.kleo-home-modern .kleo-modern-loyalty-card{z-index:4!important}
.kleo-modern-services{padding-top:42px!important;padding-bottom:40px!important}
.kleo-modern-section--soft{padding-top:42px!important}
@media(max-width:900px){.kleo-home-modern .kleo-modern-hero,.kleo-home-modern .kleo-modern-hero__grid{min-height:auto!important}.kleo-home-modern .kleo-modern-hero__visual,.kleo-home-modern .kleo-modern-hero__image-wrap img{min-height:390px!important}}
@media(max-width:760px){.kleo-home-modern .kleo-modern-hero__shape--pink-foreground{right:-235px!important;bottom:-225px!important;transform:rotate(-8deg) scale(.9)!important}}
@media(max-width:700px){.kleo-modern-services{padding-top:30px!important}.kleo-modern-section--soft{padding-top:32px!important}}
`;

export const HomePage: React.FC = () => {
  const cms = useWebsiteCms();
  const h = cms.home;
  const configuredHero = (h.heroImageUrl || "").trim();
  const heroImage = !configuredHero || /logo|kleo_logo/i.test(configuredHero) ? "/images/szalonok.jpg" : configuredHero;

  return (
    <main className="kleo-home-modern">
      <style>{HOME_PRIORITY_CSS}</style>
      <section className="kleo-modern-hero">
        <div className="kleo-modern-hero__shape kleo-modern-hero__shape--gold" />
        <div className="kleo-modern-container kleo-modern-hero__grid">
          <div className="kleo-modern-hero__copy">
            <p className="kleo-modern-eyebrow">{h.heroKicker}</p>
            <h1 className="kleo-modern-hero__title">{h.heroTitlePrefix}<span>{h.heroTitleHighlight}</span>{h.heroTitleSuffix}</h1>
            <p className="kleo-modern-hero__lead">{h.heroLead}</p>
            <p className="kleo-modern-hero__lead"><strong>Minden, ami szépség – egy helyen.</strong> Találd meg gyorsan a szolgáltatást, az árat, a hozzád legközelebbi szalont és a megfelelő időpontot.</p>
            <div className="kleo-modern-hero__actions">
              <NavLink to="/booking" className="kleo-modern-btn kleo-modern-btn--primary">{cms.header.bookingLabel}</NavLink>
              <NavLink to="/prices" className="kleo-modern-btn kleo-modern-btn--outline">Árak és szolgáltatások</NavLink>
            </div>
            <div className="kleo-modern-benefits" aria-label="Kleopátra előnyök">
              <div><b>♕</b><span><strong>Minden egy helyen</strong><small>4 fő szépségápolási részleg</small></span></div>
              <div><b>♡</b><span><strong>Szakértő kezek</strong><small>Tapasztalt csapat</small></span></div>
              <div><b>◇</b><span><strong>Gyors foglalás</strong><small>Szalon, időpont vagy szakember alapján</small></span></div>
            </div>
          </div>
          <div className="kleo-modern-hero__visual">
            <div className="kleo-modern-hero__image-wrap"><img src={heroImage} alt="Kleopátra Szépségszalonok" /></div>
            <div className="kleo-modern-hero__shape kleo-modern-hero__shape--pink kleo-modern-hero__shape--pink-foreground" aria-hidden="true" />
            <NavLink to="/loyalty" className="kleo-modern-loyalty-card"><span className="kleo-modern-loyalty-card__icon">♧</span><span><strong>Hűségprogram</strong><small>Gyűjts pontokat és élvezd az előnyöket!</small></span></NavLink>
          </div>
        </div>
      </section>

      <nav className="kleo-home-priority-nav" aria-label="Gyors elérés"><div className="kleo-modern-container kleo-home-priority-nav__inner">
        {QUICK_LINKS.map(([label,to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
      </div></nav>

      {h.showServices && <section className="kleo-modern-section kleo-modern-services"><div className="kleo-modern-container">
        <div className="kleo-modern-section-head"><div><p className="kleo-modern-eyebrow">Minden egy helyen</p><h2>Szépségápolás felsőfokon</h2></div><NavLink to="/services" className="kleo-modern-text-link">Összes szolgáltatás <span>→</span></NavLink></div>
        <div className="kleo-modern-service-grid">{SERVICES.map(service => <NavLink key={service.title} to={service.to} className="kleo-modern-service-card"><span className="kleo-modern-service-card__icon" aria-hidden="true">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><span className="kleo-modern-card-arrow">→</span></NavLink>)}</div>
      </div></section>}

      <section className="kleo-modern-section kleo-modern-section--soft"><div className="kleo-modern-container">
        <div className="kleo-modern-section-head"><div><p className="kleo-modern-eyebrow">Szalonjaink</p><h2>Találj ránk a közeledben!</h2></div><NavLink to="/salons" className="kleo-modern-text-link">Összes szalon és térkép <span>→</span></NavLink></div>
        <div className="kleo-modern-salon-grid">{SALONS.map(salon => <NavLink key={salon.to} to={salon.to} className="kleo-modern-salon-card"><img src={salon.image} alt={`Kleopátra Szépségszalon – ${salon.title}`} /><div className="kleo-modern-salon-card__body"><small>Kleopátra Szépségszalon</small><h3>{salon.title}</h3><p>{salon.address}</p><span>Részletek →</span></div></NavLink>)}</div>
      </div></section>

      {h.showVouchers && <section className="kleo-modern-promo-wrap"><div className="kleo-modern-container"><div className="kleo-modern-promo"><div className="kleo-modern-promo__copy"><p className="kleo-modern-eyebrow">Ajándékötlet</p><h2>{h.voucherTitle || "Ajándékozz Kleopátra élményt"}</h2><p>{h.voucherLead}</p><NavLink to="/webshop" className="kleo-modern-btn kleo-modern-btn--primary">Megnézem az utalványokat</NavLink></div><div className="kleo-modern-promo__image"><img src="/images/vouchers.png" alt="Kleopátra ajándékutalványok" /></div></div></div></section>}

      <section className="kleo-modern-trust"><div className="kleo-modern-container kleo-modern-trust__grid">{TRUST_ITEMS.map(([value,label,note]) => <div className="kleo-modern-trust__item" key={`${value}-${label}`}><span className="kleo-modern-trust__icon">✦</span><div><strong>{value}</strong><b>{label}</b><small>{note}</small></div></div>)}</div></section>

      {h.showProducts && <section className="kleo-modern-section kleo-modern-shop"><div className="kleo-modern-container kleo-modern-shop__grid"><div className="kleo-modern-shop__copy"><p className="kleo-modern-eyebrow">Kleopátra webshop</p><h2>{h.productsTitle || "Prémium termékek a szépségedért"}</h2><p>{h.productsLead}</p><NavLink to="/webshop" className="kleo-modern-btn kleo-modern-btn--primary">Webshop megtekintése</NavLink></div><div className="kleo-modern-shop__visual"><img src="/images/products.png" alt="KLEOS termékek" /></div></div></section>}

      <section className="kleo-modern-booking-strip"><div className="kleo-modern-container kleo-modern-booking-strip__inner"><div className="kleo-modern-booking-strip__copy"><span className="kleo-modern-booking-strip__icon">▣</span><div><strong>Foglalj időpontot online!</strong><small>Gyorsan és egyszerűen, néhány kattintással.</small></div></div><NavLink to="/booking" className="kleo-modern-btn kleo-modern-btn--light">Időpontfoglalás</NavLink></div></section>
    </main>
  );
};

export default HomePage;