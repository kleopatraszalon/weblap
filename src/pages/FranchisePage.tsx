import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

const SUPPORT = [
  { title: "Márka és prémium arculat", text: "Egységes Kleopátra megjelenés, arculati szabályok és kialakult márkaélmény." },
  { title: "Felépített működési rendszer", text: "Kialakított üzleti, ügyfélkezelési, értékesítési és üzemeltetési folyamatok." },
  { title: "Indulási támogatás", text: "A kialakítástól és eszközöktől a nyitási kommunikációig és a csapat felépítéséig." },
  { title: "Marketing és ügyfélmenedzsment", text: "Központi kampányok, digitális jelenlét és a hálózat közös ügyfélkezelési eszközei." },
  { title: "HR és képzés", text: "Toborzási támogatás, szakmai integráció, képzések és vezetői fejlődési lehetőségek." },
  { title: "Beszerzés és rendszerháttér", text: "Központilag támogatott beszerzési lehetőségek, digitális folyamatok és menedzsmenttámogatás." },
];

export const FranchisePage: React.FC = () => (
  <main>
    <PublicPageHero
      eyebrow="Franchise"
      title={<>Építs szépségszalont <span className="highlight">biztosabb rendszerrel</span></>}
      lead={<p>A Kleopátra franchise befektetőknek, karrierváltóknak, szépségipari szakembereknek és már működő szalont vezetőknek kínál felépített márka- és működési hátteret.</p>}
      image="/images/franchise.jpg"
      imageAlt="Kleopátra Szépségszalon franchise"
      actions={<><a className="btn btn-primary" href="https://kleopatraszepsegszalonok.hu/franchise/" target="_blank" rel="noreferrer">Franchise részletek</a><NavLink to="/contact" className="btn btn-outline">Kapcsolat</NavLink></>}
    />

    <section className="public-section">
      <div className="container">
        <header className="public-section__header"><p className="section-eyebrow">Kinek szól?</p><h2>Négy tipikus belépési helyzet</h2><p>A program akkor is releváns lehet, ha nem szépségipari szakemberként érkezel, de üzleti szemlélettel és vezetői ambícióval építenél szalont.</p></header>
        <div className="feature-grid feature-grid--four">
          <article className="feature-card"><h3>Befektető</h3><p>Erős márkát és előre felépített működési modellt keresel.</p></article>
          <article className="feature-card"><h3>Karrierváltó</h3><p>Vezetői vagy üzleti tapasztalatodra építve indítanál új vállalkozást.</p></article>
          <article className="feature-card"><h3>Szépségipari szakember</h3><p>Saját szalont szeretnél, de nem mindent a nulláról építenél fel.</p></article>
          <article className="feature-card"><h3>Működő szalon tulajdonosa</h3><p>Rendszert, erősebb arculatot, marketinget és központi támogatást keresel.</p></article>
        </div>
      </div>
    </section>

    <section className="public-section public-section--soft">
      <div className="container">
        <header className="public-section__header"><p className="section-eyebrow">Támogatás</p><h2>Mit ad a hálózat?</h2></header>
        <div className="feature-grid">{SUPPORT.map(item => <article className="feature-card" key={item.title}><span className="feature-card__kicker">Franchise háttér</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </div>
    </section>

    <section className="public-section">
      <div className="container split-feature">
        <div className="split-feature__copy"><p className="section-eyebrow">30+ év tapasztalat</p><h2>Nemcsak név, hanem működési rendszer</h2><p>A franchise célja, hogy az arculaton túl olyan gyakorlati működési hátteret adjon, amely az indulástól a napi üzemeltetésig támogatja a partner szalonját.</p><ul className="public-list"><li>központi marketing és ügyfélmenedzsment;</li><li>HR- és képzési támogatás;</li><li>kedvezményes eszköz- és anyagbeszerzés;</li><li>vezetőképzés és üzleti gondolkodás fejlesztése.</li></ul></div>
        <div className="split-feature__media"><img src="/images/franchise.png" alt="Kleopátra franchise program" /></div>
      </div>
    </section>

    <section className="public-section"><div className="container public-cta"><div><h2>Komolyan érdekel a franchise?</h2><p>A részletes feltételek, lokációk és jelentkezési folyamat a külön franchise oldalon érhető el.</p></div><a className="btn btn-primary" href="https://kleopatraszepsegszalonok.hu/franchise/" target="_blank" rel="noreferrer">Megnézem a programot</a></div></section>
  </main>
);
