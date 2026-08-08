import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

const BENEFITS = [
  { title: "Kleo Card", text: "Regisztrált vendégeink számára elérhető hűség- és kedvezményrendszer, amelyhez időszakos ajánlatok kapcsolódhatnak." },
  { title: "Hírlevél kedvezmények", text: "Akciók, kuponok és fontos újdonságok közvetlenül a feliratkozóknak." },
  { title: "Vendégszámla", text: "A vendéghez kapcsolódó egyenlegek és jóváírások kezelése a Kleopátra rendszerben." },
  { title: "Bérletek", text: "Rendszeresen igénybe vett szolgáltatásokhoz kedvezőbb, előre tervezhető konstrukciók." },
  { title: "Céges kedvezmények", text: "Kijelölt partneri és vállalati konstrukciók a mindenkori feltételek szerint." },
  { title: "Webshop", text: "Ajándékutalványok, bérletek, szépségcsomagok és Kleo termékek online eléréssel." },
];

export const LoyaltyPage: React.FC = () => {
  const { pages } = useWebsiteCms(); const p = pages.loyalty;
  return <main>
    <PublicPageHero eyebrow={p.eyebrow} title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>} lead={<p>{p.lead}</p>} image={p.imageUrl} imageAlt="Kleopátra hűségprogram" actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/webshop" className="btn btn-outline">Webshop</NavLink></>} />
    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Előnyök</p><h2>{p.sectionTitle}</h2><p>{p.sectionLead}</p></header><div className="feature-grid">{BENEFITS.map(item=><article className="feature-card" key={item.title}><span className="feature-card__kicker">Kleo előny</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></div></section>
    <section className="public-section public-section--soft"><div className="container split-feature split-feature--reverse"><div className="split-feature__media"><img src="/images/app.png" alt="Kleopátra mobilalkalmazás"/></div><div className="split-feature__copy"><p className="section-eyebrow">Mobilalkalmazás</p><h2>A foglalásaid és ajánlataid mindig kéznél lehetnek</h2><p>A mobilalkalmazás segít a foglalások követésében, a gyors időpontválasztásban, valamint a vendéghez kapcsolódó bérletek és ajánlatok áttekintésében.</p><ul className="public-list"><li>gyors időpontfoglalás;</li><li>foglalások követése;</li><li>bérletek és vendégszámla áttekintése;</li><li>személyre szabott ajánlatok.</li></ul></div></div></section>
    <section className="public-section"><div className="container"><div className="notice-card"><strong>Fontos:</strong> akciók, kuponok és egyéb kedvezmények nem minden esetben vonhatók össze. A pontos felhasználási feltételeket az adott ajánlatnál jelenítjük meg.</div></div></section>
  </main>;
};
