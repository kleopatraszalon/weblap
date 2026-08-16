import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import FranchiseLeadForm from "../components/FranchiseLeadForm";
import { useWebsiteCms } from "../websiteCms";
import "../styles/franchiseLanding.css";

const AUDIENCES = [
  { title: "Befektetőknek", text: "Ha olyan üzleti lehetőséget keresel, ahol egy felépített márka, működési rendszer és központi támogatás áll a vállalkozás mögött." },
  { title: "Karrierváltóknak", text: "Ha vezetői vagy menedzsment tapasztalatra építve indítanál szépségipari vállalkozást, de nem mindent a nulláról szeretnél kialakítani." },
  { title: "Szépségipari szakembereknek", text: "Ha fodrászként, kozmetikusként, körmösként, masszőrként vagy más szakemberként saját szalont nyitnál bejáratott keretek között." },
  { title: "Működő szalon tulajdonosainak", text: "Ha a meglévő szalonodat erősebb márkával, szervezettebb háttérrel, marketinggel és egységes folyamatokkal fejlesztenéd tovább." },
];

const SUPPORT = [
  { title: "Erős márka és prémium arculat", text: "Egységes Kleopátra megjelenés és márkaélmény, amely segíti a bizalomépítést már az első találkozási ponttól." },
  { title: "Felépített működési rendszer", text: "Dokumentált üzemeltetési, értékesítési, ügyfélkezelési és minőségbiztosítási folyamatok a napi működéshez." },
  { title: "Komplex indulási támogatás", text: "Támogatás a kialakítás, eszközök, induló készlet, nyitási kommunikáció, toborzás, integráció és betanítás területén." },
  { title: "Központi marketing", text: "Közös kampányok, digitális jelenlét, ügyfélkommunikáció és lokális marketinget támogató rendszer." },
  { title: "HR, képzés és szakmai háttér", text: "Toborzási támogatás, szakmai integráció, képzések, vezetőfejlesztés és üzleti szemlélet fejlesztése." },
  { title: "Beszerzés és digitális rendszer", text: "Központilag támogatott beszerzési lehetőségek, ügyfélkezelési és vállalatirányítási folyamatok, automatizálható adminisztráció." },
];

const EXISTING_SALON_CHALLENGES = [
  "ingadozó vagy csökkenő vendégforgalom",
  "szakemberhiány, toborzási és megtartási nehézségek",
  "sok adminisztráció és kevés vezetői idő",
  "magas költségek és nehezen tervezhető eredmény",
  "széttartó működési folyamatok és változó minőség",
  "elavuló arculat vagy gyenge online jelenlét",
];

const PARTNER_CITIES = [
  "Budapest",
  "Győr",
  "Pécs",
  "Székesfehérvár",
  "Tatabánya",
  "Nyíregyháza",
  "Debrecen",
  "Miskolc",
  "Szeged",
  "Veszprém",
  "Kecskemét",
];

function setMeta(name: string, content: string) {
  let meta = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
  return meta;
}

export const FranchisePage: React.FC = () => {
  const { pages } = useWebsiteCms();
  const p = pages.franchise;

  useEffect(() => {
    const oldTitle = document.title;
    const description = setMeta("description", "Kleopátra Szépségszalonok franchise: bejáratott márka, működési rendszer, marketing-, HR- és szakmai támogatás új vagy meglévő szépségszalon fejlesztéséhez.");
    const previousDescription = description.getAttribute("content") || "";

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdCanonical = !canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const previousCanonical = canonical.getAttribute("href") || "";

    document.title = "Kleopátra franchise | Szépségszalon franchise rendszer";
    canonical.href = "https://www.kleoszalon.hu/franchise";

    return () => {
      document.title = oldTitle;
      if (previousDescription) description.content = previousDescription;
      else description.remove();
      if (createdCanonical) canonical?.remove();
      else if (canonical) canonical.href = previousCanonical;
    };
  }, []);

  return <main>
    <PublicPageHero
      eyebrow={p.eyebrow}
      title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>}
      lead={<p>{p.lead}</p>}
      image={p.imageUrl}
      imageAlt="Kleopátra Szépségszalon franchise"
      actions={<><a className="btn btn-primary" href="#franchise-jelentkezes">Kérem a részleteket</a><a className="btn btn-outline" href="#franchise-rendszer">Megnézem a rendszert</a></>}
    />

    <section className="public-section" id="franchise-rendszer"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Stabil háttér</p>
        <h2>Ne csak egy szalont nyiss – építs működő vállalkozást</h2>
        <p>A Kleopátra több évtizedes szépségipari tapasztalatra épülő franchise rendszere azoknak készült, akik önálló vállalkozást szeretnének, de már kialakított márkával, folyamatokkal és központi támogatással indulnának vagy fejlődnének tovább.</p>
      </header>
      <div className="feature-grid">
        <article className="feature-card"><span className="feature-card__kicker">Vendégélmény</span><h3>Komplex szolgáltatási modell</h3><p>A cél, hogy a vendég egy helyen több szépségápolási szolgáltatáshoz férjen hozzá, ami támogatja a visszatérő vendégkör építését.</p></article>
        <article className="feature-card"><span className="feature-card__kicker">Operáció</span><h3>Nem mindent neked kell kitalálnod</h3><p>A napi működéshez egységes folyamatok, szakmai háttér, üzleti és vezetői támogatás kapcsolódik.</p></article>
        <article className="feature-card"><span className="feature-card__kicker">Fejlődés</span><h3>Új szalonhoz és meglévő üzlethez is</h3><p>A rendszer új egység indítására és működő szépségszalon Kleopátra rendszerbe történő integrálására is alkalmas.</p></article>
      </div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Kinek szól?</p><h2>{p.sectionTitle}</h2><p>{p.sectionLead}</p></header>
      <div className="feature-grid feature-grid--four">
        {AUDIENCES.map(item => <article className="feature-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </div></section>

    <section className="public-section"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Franchise háttér</p><h2>Mit kapsz a Kleopátra rendszerben?</h2><p>A franchise nem csak név- és logóhasználat: az értéke a napi működéshez kapcsolódó egységes háttérben van.</p></header>
      <div className="feature-grid">{SUPPORT.map(item => <article className="feature-card" key={item.title}><span className="feature-card__kicker">Kleopátra</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container split-feature">
      <div className="split-feature__copy">
        <p className="section-eyebrow">Ha már van szalonod</p>
        <h2>A növekedési problémákra rendszerszintű válasz kell</h2>
        <p>Egy szépségszalon működtetése ma a szakmai munka mellett marketinget, HR-t, adminisztrációt, beszerzést, kapacitástervezést és folyamatos online jelenlétet is igényel.</p>
        <ul className="public-list">{EXISTING_SALON_CHALLENGES.map(item => <li key={item}>{item}</li>)}</ul>
        <p>A franchise célja, hogy ezekből minél többet közös rendszer, standardok és központi támogatás segítsen kezelni.</p>
      </div>
      <div className="split-feature__media"><img src="/images/franchise.png" alt="Kleopátra franchise program" /></div>
    </div></section>

    <section className="public-section"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Miért Kleopátra?</p>
        <h2>Több mint három évtized szépségipari működési tapasztalata</h2>
        <p>A hálózat egy kis szépségipari vállalkozásból több városban működő komplex szalonrendszerré fejlődött. A franchise ezt a felhalmozott működési tudást teszi átadhatóvá a partnereknek.</p>
      </header>
      <div className="feature-grid">
        <article className="feature-card"><h3>Bevezetett márka</h3><p>Egységes arculat és kialakult piaci jelenlét.</p></article>
        <article className="feature-card"><h3>Folyamatos fejlesztés</h3><p>A rendszer, a marketing, a digitális működés és a szakmai háttér a hálózattal együtt fejlődik.</p></article>
        <article className="feature-card"><h3>Partneri működés</h3><p>A cél hosszú távon fenntartható, helyi adottságokra épülő szalonok kialakítása közös standardok mellett.</p></article>
      </div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Terjeszkedés</p><h2>Hol keresünk partnereket?</h2><p>Kiemelten az alábbi városok érdekelnek bennünket, de más lokációval is lehet jelentkezni. A végleges döntésnél a helyi keresletet, a versenyt, a lokációt és az üzleti tervet együtt vizsgáljuk.</p></header>
      <div className="feature-grid feature-grid--four">
        {PARTNER_CITIES.map(city => <article className="feature-card" key={city}><h3>{city}</h3><p>Franchise partneri érdeklődés fogadása.</p></article>)}
      </div>
    </div></section>

    <section className="public-section"><div className="container public-cta">
      <div>
        <p className="section-eyebrow">Befektetés</p>
        <h2>Komoly, de előre tervezhető üzleti döntés</h2>
        <p>A szükséges befektetés és a megtérülés lokációtól, mérettől, szolgáltatási portfóliótól, meglévő infrastruktúrától és finanszírozástól függ. A részletes franchise folyamatban ezekhez konkrét költség- és üzleti számítás készíthető.</p>
      </div>
      <a className="btn btn-primary" href="#franchise-jelentkezes">Kérem a részletes információt</a>
    </div></section>

    <section className="public-section public-section--soft" id="franchise-jelentkezes"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Következő lépés</p>
        <h2>Kérj részletes franchise információt</h2>
        <p>Add meg a neved, e-mail címed és telefonszámod. A jelentkezés nem jelent elköteleződést; arra szolgál, hogy a franchise csapat további információt küldhessen és felvehesse veled a kapcsolatot.</p>
      </header>
      <FranchiseLeadForm variant="franchise" />
      <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <NavLink to="/contact" className="btn btn-outline">Kapcsolat</NavLink>
      </div>
    </div></section>
  </main>;
};
