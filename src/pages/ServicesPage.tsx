import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

const PRIMARY_SERVICE_CARDS = [
  { slug: "fodraszat", title: "Fodrászat", description: "Női, férfi és gyermek hajvágás, hajfestés, balayage, melegollós hajvágás, hajformázás és professzionális hajkezelések – a megjelenésedhez és hajad állapotához igazítva." },
  { slug: "kez-es-labapolas", title: "Kéz- és lábápolás", description: "Manikűr, japán manikűr, géllakk, műköröm, pedikűr és kapcsolódó kéz- és lábápolási szolgáltatások modern technikákkal." },
  { slug: "kozmetika", title: "Kozmetika", description: "Arctisztítás, anti-age és regeneráló kezelések, gépi kozmetika, szőrtelenítés, szemöldök- és szempillaszolgáltatások személyre szabva." },
  { slug: "masszazs", title: "Masszázs", description: "Relaxáló, frissítő és regeneráló kezelések a feltöltődésért és a mindennapi stressz oldásáért, az adott szalon aktuális kínálata szerint." },
];

const ADDITIONAL_SERVICE_CARDS = [
  { slug: "szolarium", title: "Szolárium", text: "Szalononként elérhető barnulási lehetőségek és kapcsolódó bérletek." },
  { slug: "rendezveny", title: "Rendezvény", text: "Összehangolt szépségszolgáltatások rendezvényekre és különleges alkalmakra." },
  { slug: "eskuvo", title: "Esküvő", text: "Frizura, smink, köröm és további szépségápolási szolgáltatások a nagy napra." },
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
      <header className="public-section__header"><p className="section-eyebrow">4 fő részleg</p><h2>Szépségápolás felsőfokon – minden egy helyen</h2><p>A négy fő részlegből indulva gyorsan eljutsz a konkrét szolgáltatáshoz, annak részletes leírásához és az önállóan böngészhető árlistához.</p></header>
      <div className="feature-grid feature-grid--four">{PRIMARY_SERVICE_CARDS.map(service => <NavLink key={service.slug} to={`/szolgaltatasok/${service.slug}`} className="feature-card card--service"><span className="feature-card__kicker">Kleopátra</span><h2>{service.title}</h2><p>{service.description}</p><span className="link-btn">Részletek →</span></NavLink>)}</div>
    </div></section>
    <section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">További lehetőségek</p><h2>A jelenlegi Kleopátra kínálat további elemei</h2><p>A négy fő részleg mellett a szalon és helyszín kínálatától függően további szolgáltatások és alkalmi összeállítások is elérhetők.</p></header><div className="feature-grid">{ADDITIONAL_SERVICE_CARDS.map(item=><NavLink key={item.slug} to={`/szolgaltatasok/${item.slug}`} className="feature-card card--service"><span className="feature-card__kicker">További szolgáltatás</span><h3>{item.title}</h3><p>{item.text}</p><span className="link-btn">Részletek →</span></NavLink>)}</div><div className="public-cta" style={{marginTop:24}}><div><h2>Csomagajánlatok</h2><p>Az aktuális kombinált ajánlatokat és árakat a böngészhető árlistában tudod ellenőrizni, szalon szerint is szűrve.</p></div><NavLink to="/prices" className="btn btn-primary">Árlista megnyitása</NavLink></div></div></section>
    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Kiemelt kezelések</p><h2>Népszerű szolgáltatások közelebbről</h2></header><div className="feature-grid">{HIGHLIGHTS.map(item => <NavLink to={`/szolgaltatasok/${item.slug}`} className="media-card" key={item.title}><img loading="lazy" src={item.image} alt={item.title} style={{height:220}}/><div style={{padding:22}}><h3>{item.title}</h3><p style={{color:"var(--cms-muted)",lineHeight:1.6}}>{item.text}</p><span className="link-btn">Részletek →</span></div></NavLink>)}</div></div></section>
    <section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Részletes szolgáltatásoldalak</p><h2>Keresésből is közvetlenül a megfelelő kezeléshez</h2><p>A fontos szolgáltatások saját URL-en érhetők el, így a vendég a Google-ből vagy az árlistából közvetlenül a releváns információhoz juthat.</p></header><div className="feature-grid">{SEO_SERVICES.map(item=><NavLink key={item.slug} to={`/szolgaltatasok/${item.slug}`} className="feature-card card--service"><span className="feature-card__kicker">{item.category}</span><h3>{item.title}</h3><p>{item.text}</p><span className="link-btn">Megnézem →</span></NavLink>)}</div></div></section>
    <section className="public-section"><div className="container public-cta"><div><h2>Először csak az ár érdekel?</h2><p>A böngészhető árlistában részleg, kategória és szalon szerint szűrhetsz, és egy helyen láthatod a Normál, TOP és Master árakat.</p></div><div className="public-page-hero__actions"><NavLink to="/prices" className="btn btn-primary">Árlista megnyitása</NavLink><NavLink to="/booking" className="btn btn-outline">Foglalok</NavLink></div></div></section>
  </main>;
};
