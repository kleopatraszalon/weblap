import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

const SERVICE_CARDS = [
  { slug: "fodraszat", title: "Fodrászat", description: "Női, férfi és gyermek hajvágás, festés, balayage, hajápolás és alkalmi frizurák." },
  { slug: "kez-es-labapolas", title: "Kéz- és lábápolás", description: "Manikűr, géllakk, műköröm, pedikűr és az ápolt kéz-láb megjelenéséhez kapcsolódó kezelések." },
  { slug: "kozmetika", title: "Kozmetika", description: "Arckezelések, gépi kezelések, szőrtelenítés, szemöldök- és szempillaszolgáltatások." },
  { slug: "masszazs", title: "Masszázs", description: "Relaxáló és frissítő kezelések a feltöltődésért, az adott szalon kínálata szerint." },
  { slug: "szolarium", title: "Szolárium", description: "Szalononként elérhető szolárium szolgáltatások és kapcsolódó lehetőségek." },
  { slug: "rendezveny", title: "Rendezvény és esküvő", description: "Komplex szépségápolási összeállítások alkalmakra, rendezvényekre és esküvői készülődéshez." },
];

const HIGHLIGHTS = [
  { slug: "muszempilla", title: "Műszempilla építés", image: "/images/szempilla.png", text: "Klasszikus és látványosabb szettek, szakember és szalon elérhetősége szerint." },
  { slug: "arctisztitas", title: "Arctisztító kezelések", image: "/images/actisztitas.png", text: "Bőrállapothoz igazított kozmetikai kezelések és otthonápolási javaslatok." },
  { slug: "joicohajkezeles", title: "Joico hajkezelések", image: "/images/joico.png", text: "Professzionális hajápolási megoldások a haj állapotához és célodhoz igazítva." },
];

const SEO_SERVICES = [
  { slug: "balayage", title: "Balayage", category: "Fodrászat", text: "Színátmenetes hajfestési technika részletes leírással, árakkal és foglalással." },
  { slug: "gellakk", title: "Géllakk", category: "Kéz- és lábápolás", text: "Tartós géllakk szolgáltatás, árkategóriák és kapcsolódó kezelések egy oldalon." },
  { slug: "japan-manikur", title: "Japán manikűr", category: "Kéz- és lábápolás", text: "Természetes körömápoló kezelés, fontos tudnivalókkal és online foglalással." },
  { slug: "szempillalifting", title: "Szempilla lifting", category: "Kozmetika", text: "A kezelés menete, ajánlásai, időtartama és elérhető árak külön oldalon." },
  { slug: "arckezelesek", title: "Arckezelések", category: "Kozmetika", text: "Arckezelések áttekintése, kapcsolódó kezelések és foglalási lehetőség." },
];

export const ServicesPage: React.FC = () => {
  const { pages } = useWebsiteCms();
  const p = pages.services;
  return <main>
    <PublicPageHero
      eyebrow={p.eyebrow}
      title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>}
      lead={<p>{p.lead}</p>}
      image={p.imageUrl}
      imageAlt="Kleopátra Szépségszalon szolgáltatások"
      actions={<><NavLink to="/prices" className="btn btn-primary">Árak és szolgáltatások</NavLink><NavLink to="/booking" className="btn btn-outline">Időpontfoglalás</NavLink></>}
    />
    <section className="public-section"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">4 fő részleg</p><h2>{p.sectionTitle}</h2><p>{p.sectionLead}</p></header>
      <div className="feature-grid">{SERVICE_CARDS.map(service => <NavLink key={service.slug} to={`/szolgaltatasok/${service.slug}`} className="feature-card card--service"><span className="feature-card__kicker">Kleopátra</span><h2>{service.title}</h2><p>{service.description}</p><span className="link-btn">Részletek →</span></NavLink>)}</div>
    </div></section>
    <section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Kiemelt kezelések</p><h2>Népszerű szolgáltatások közelebbről</h2></header><div className="feature-grid">{HIGHLIGHTS.map(item => <NavLink to={`/szolgaltatasok/${item.slug}`} className="media-card" key={item.title}><img loading="lazy" src={item.image} alt={item.title} style={{height:220}}/><div style={{padding:22}}><h3>{item.title}</h3><p style={{color:"var(--cms-muted)",lineHeight:1.6}}>{item.text}</p><span className="link-btn">Részletek →</span></div></NavLink>)}</div></div></section>
    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Részletes szolgáltatásoldalak</p><h2>Keresésből is közvetlenül a megfelelő kezeléshez</h2><p>A fontos szolgáltatások saját URL-en érhetők el, így a vendég a Google-ből vagy az árlistából közvetlenül a releváns információhoz juthat.</p></header><div className="feature-grid">{SEO_SERVICES.map(item=><NavLink key={item.slug} to={`/szolgaltatasok/${item.slug}`} className="feature-card card--service"><span className="feature-card__kicker">{item.category}</span><h3>{item.title}</h3><p>{item.text}</p><span className="link-btn">Megnézem →</span></NavLink>)}</div></div></section>
    <section className="public-section public-section--soft"><div className="container public-cta"><div><h2>Először csak az ár érdekel?</h2><p>A böngészhető árlistában részleg, kategória és szalon szerint szűrhetsz, és egy helyen láthatod a Normál, TOP és Master árakat.</p></div><div className="public-page-hero__actions"><NavLink to="/prices" className="btn btn-primary">Árlista megnyitása</NavLink><NavLink to="/booking" className="btn btn-outline">Foglalok</NavLink></div></div></section>
  </main>;
};
