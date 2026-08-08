import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

const VALUES = ["vendégközpontú gondolkodás","szakmai fejlődés és minőség","rugalmas, gyors kiszolgálás","egységes Kleopátra márkaélmény","csapatmunka és felelősség","folyamatos megújulás"];

export const AboutPage: React.FC = () => {
  const { pages } = useWebsiteCms(); const p=pages.about;
  return <main>
    <PublicPageHero eyebrow={p.eyebrow} title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>} lead={<p>{p.lead}</p>} image={p.imageUrl} imageAlt="Kleopátra Szépségszalonok – rólunk" actions={<><NavLink to="/salons" className="btn btn-primary">Szalonjaink</NavLink><NavLink to="/booking" className="btn btn-outline">Időpontfoglalás</NavLink></>} />
    <section className="public-section"><div className="container split-feature"><div className="split-feature__copy"><p className="section-eyebrow">Víziónk</p><h2>{p.sectionTitle}</h2><p>{p.sectionLead}</p><p>Az online foglalás, a szalonhálózat, a webshop, a hűségprogram és a személyes kiszolgálás ugyanannak a vendégélménynek a részei.</p></div><div className="split-feature__media"><img src="/images/vision.png" alt="Kleopátra vízió"/></div></div></section>
    <section className="public-section public-section--soft"><div className="container split-feature split-feature--reverse"><div className="split-feature__media"><img src="/images/mission.png" alt="Kleopátra küldetés"/></div><div className="split-feature__copy"><p className="section-eyebrow">Küldetésünk</p><h2>Minőség, rugalmasság és fejlődés</h2><p>A célunk nem pusztán szolgáltatások biztosítása, hanem olyan rendszer működtetése, amelyben a vendég, a szakember és a szalon is hosszú távon fejlődni tud.</p><ul className="public-list"><li>széles és folyamatosan fejlődő szolgáltatáskínálat;</li><li>szakmai tudás és belső képzés;</li><li>digitális foglalási és ügyfélkezelési lehetőségek;</li><li>egységes minőségi és arculati elvek.</li></ul></div></div></section>
    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Értékeink</p><h2>Amihez minden szalonban tartjuk magunkat</h2></header><div className="value-grid">{VALUES.map(value=><div className="value-item" key={value}>{value}</div>)}</div></div></section>
    <section className="public-section public-section--soft"><div className="container split-feature"><div className="split-feature__copy"><p className="section-eyebrow">Visszajelzés</p><h2>A vendégvélemény a fejlődés része</h2><p>A visszajelzések segítenek észrevenni, mi működik jól és hol kell javítanunk. Szolgáltatással, szalonnal vagy vendégélménnyel kapcsolatos észrevételt a kapcsolat oldalon tudsz eljuttatni hozzánk.</p><NavLink to="/contact" className="btn btn-outline">Visszajelzést küldök</NavLink></div><div className="split-feature__media"><img src="/images/feedback.png" alt="Vendégvisszajelzés"/></div></div></section>
  </main>;
};
