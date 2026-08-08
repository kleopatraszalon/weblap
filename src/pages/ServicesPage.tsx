import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

const SERVICE_CARDS = [
  { slug: "hair", title: "Fodrászat", description: "Női, férfi és gyermek hajvágás, festés, balayage, hajápolás és alkalmi frizurák.", cta: "Fodrász árlista" },
  { slug: "beauty", title: "Kozmetika", description: "Arckezelések, gépi kezelések, szőrtelenítés, szemöldök- és szempillaszolgáltatások.", cta: "Kozmetikai árlista" },
  { slug: "hands-feet", title: "Kéz- és lábápolás", description: "Manikűr, gél lakk, műköröm, pedikűr és az ápolt kéz-láb megjelenéséhez kapcsolódó kezelések.", cta: "Kéz- és lábápolás árlista" },
  { slug: "solarium", title: "Szolárium", description: "Szalononként elérhető szolárium szolgáltatások és kapcsolódó lehetőségek.", cta: "Szolárium árlista" },
  { slug: "massage", title: "Masszázs", description: "Relaxáló és frissítő kezelések a feltöltődésért, az adott szalon kínálata szerint.", cta: "Masszázs árlista" },
  { slug: "event", title: "Rendezvény és esküvő", description: "Komplex szépségápolási összeállítások alkalmakra, rendezvényekre és esküvői készülődéshez.", cta: "Kapcsolatfelvétel", to: "/contact" },
];

const HIGHLIGHTS = [
  { title: "Műszempilla építés", image: "/images/szempilla.png", text: "Klasszikus és látványosabb szettek, szakember és szalon elérhetősége szerint." },
  { title: "Arctisztító kezelések", image: "/images/actisztitas.png", text: "Bőrállapothoz igazított kozmetikai kezelések és otthonápolási javaslatok." },
  { title: "Joico hajkezelések", image: "/images/joico.png", text: "Professzionális hajápolási megoldások a haj állapotához és célodhoz igazítva." },
];

export const ServicesPage: React.FC = () => (
  <main>
    <PublicPageHero
      eyebrow="Szolgáltatások"
      title={<>Minden, ami szépség – <span className="highlight">egy helyen</span></>}
      lead={<p>A Kleopátra Szépségszalonok célja, hogy több szépségápolási területet egy helyen érj el, rugalmas időpontfoglalással és szalononként összeállított szolgáltatáskínálattal.</p>}
      image="/images/szolgaltatasok.jpg"
      imageAlt="Kleopátra Szépségszalon szolgáltatások"
      actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/prices" className="btn btn-outline">Árlista</NavLink></>}
    />

    <section className="public-section">
      <div className="container">
        <header className="public-section__header">
          <p className="section-eyebrow">Kategóriák</p>
          <h2>Válaszd ki, mire van szükséged</h2>
          <p>A pontos kínálat és az elérhető szakemberek szalononként eltérhetnek; a foglalási rendszer mindig az aktuális lehetőségeket mutatja.</p>
        </header>
        <div className="feature-grid">
          {SERVICE_CARDS.map((service) => (
            <NavLink key={service.slug} to={service.to || `/prices#${service.slug}`} className="feature-card card--service">
              <span className="feature-card__kicker">Kleopátra</span>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <span className="link-btn">{service.cta} →</span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>

    <section className="public-section public-section--soft">
      <div className="container">
        <header className="public-section__header">
          <p className="section-eyebrow">Kiemelt kezelések</p>
          <h2>Népszerű szolgáltatások közelebbről</h2>
        </header>
        <div className="feature-grid">
          {HIGHLIGHTS.map((item) => (
            <article className="media-card" key={item.title}>
              <img src={item.image} alt={item.title} style={{height: 220}} />
              <div style={{padding: 22}}>
                <h3>{item.title}</h3>
                <p style={{color:"var(--cms-muted)",lineHeight:1.6}}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="public-section">
      <div className="container public-cta">
        <div><h2>Nem tudod, melyik kezelés lenne a jó?</h2><p>Válassz szalont, nézd meg az aktuális kínálatot, vagy kérj segítséget a kapcsolat oldalon.</p></div>
        <div className="public-page-hero__actions"><NavLink to="/salons" className="btn btn-primary">Szalon választása</NavLink><NavLink to="/contact" className="btn btn-outline">Kérdezek</NavLink></div>
      </div>
    </section>
  </main>
);
