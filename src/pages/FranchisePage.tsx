import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import FranchiseLeadForm from "../components/FranchiseLeadForm";
import { getPublicSalons, getPublicServices, type PublicSalon, type PublicService } from "../apiClient";
import { useWebsiteCms } from "../websiteCms";

const AUDIENCES = [
  { title: "Befektetőknek", text: "Olyan üzleti lehetőséghez, ahol egy felépített márka, dokumentált működési rendszer és központi támogatás dolgozik a befektetés mögött." },
  { title: "Karrierváltóknak", text: "Vezetői vagy menedzsment tapasztalatra építve indítható szépségipari vállalkozás, anélkül hogy minden folyamatot a nulláról kellene kialakítani." },
  { title: "Szépségipari szakembereknek", text: "Fodrászoknak, kozmetikusoknak, körmösöknek, masszőröknek és más szakembereknek, akik saját szalont építenének bejáratott keretek között." },
  { title: "Működő szalon tulajdonosainak", text: "Meglévő egység továbbfejlesztéséhez erősebb márkával, marketinggel, HR-háttérrel, egységes folyamatokkal és digitális támogatással." },
];

const SUPPORT = [
  { title: "Erős márka és prémium arculat", text: "Egységes Kleopátra márkaélmény, amely a vendég első találkozásától támogatja a bizalomépítést és a lokális jelenlétet." },
  { title: "Dokumentált működési rendszer", text: "Arculati és működési standardok, üzemeltetési, értékesítési, ügyfélkezelési és minőségbiztosítási folyamatok." },
  { title: "Komplex indulási támogatás", text: "Támogatás a szalon kialakításában, eszközök és induló készlet tervezésében, nyitási kampányban, toborzásban, integrációban és betanításban." },
  { title: "Központi marketing és CRM", text: "Kampányok, ügyfélkommunikáció, hűségprogram, online foglalás és adatvezérelt vendégkezelés egységes rendszerben." },
  { title: "HR, képzés és vezetőfejlesztés", text: "Toborzási támogatás, szakmai képzések, vezetői tudás és üzleti szemlélet fejlesztése a stabil csapatépítéshez." },
  { title: "Beszerzés és VIR háttér", text: "Központilag támogatott beszerzés, vállalatirányítási folyamatok, riportok és automatizálható adminisztráció a napi működéshez." },
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
  "Budapest", "Győr", "Pécs", "Székesfehérvár", "Tatabánya", "Nyíregyháza",
  "Debrecen", "Miskolc", "Szeged", "Veszprém", "Kecskemét",
];

const CSS = `
.franchise-live-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:28px}
.franchise-live-card{padding:24px;border:1px solid rgba(18,12,8,.09);border-radius:22px;background:#fff;min-height:145px}
.franchise-live-card strong{display:block;font-size:clamp(30px,4vw,48px);line-height:1;letter-spacing:-.04em}.franchise-live-card span{display:block;margin-top:10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.franchise-live-card small{display:block;margin-top:7px;color:#746b64;line-height:1.45}
.franchise-network-list{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.franchise-network-pill{border:1px solid rgba(182,152,97,.35);border-radius:999px;padding:9px 13px;background:#fff;font-size:12px;font-weight:750}
.franchise-investment{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:20px;align-items:stretch}.franchise-investment__metric{display:flex;flex-direction:column;justify-content:center;padding:34px;border-radius:26px;background:#120c08;color:#fff}.franchise-investment__metric strong{font-size:clamp(46px,7vw,78px);line-height:1}.franchise-investment__metric span{margin-top:8px;font-size:14px;font-weight:800}.franchise-investment__metric small{margin-top:12px;color:rgba(255,255,255,.68);line-height:1.5}
.franchise-city-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.franchise-city{padding:18px;border:1px solid rgba(18,12,8,.09);border-radius:18px;background:#fff}.franchise-city strong{display:block}.franchise-city small{display:block;margin-top:5px;color:#746b64}
@media(max-width:980px){.franchise-live-grid,.franchise-city-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.franchise-investment{grid-template-columns:1fr}}
@media(max-width:620px){.franchise-live-grid,.franchise-city-grid{grid-template-columns:1fr}}
`;

function normalizedCity(label: string) {
  const value = String(label || "").trim();
  if (/^budapest/i.test(value)) return "Budapest";
  return value.replace(/\s+(IX\.|VIII\.|XII\.|XIII\.)$/i, "").trim();
}

export const FranchisePage: React.FC = () => {
  const { pages } = useWebsiteCms();
  const p = pages.franchise;
  const [salons, setSalons] = useState<PublicSalon[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([getPublicSalons(), getPublicServices()])
      .then(([nextSalons, nextServices]) => {
        if (!alive) return;
        setSalons(nextSalons);
        setServices(nextServices);
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const liveCities = useMemo(() => Array.from(new Set(salons.map(s => normalizedCity(s.city_label)).filter(Boolean))), [salons]);
  const serviceCount = useMemo(() => new Set(services.map(s => String(s.name || "").trim()).filter(Boolean)).size, [services]);

  useEffect(() => {
    const oldTitle = document.title;
    let description = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const createdDescription = !description;
    const previousDescription = description?.content || "";
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdCanonical = !canonical;
    const previousCanonical = canonical?.href || "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    document.title = "Kleopátra franchise | Szépségszalon franchise rendszer";
    description.content = "Kleopátra Szépségszalonok franchise: több mint 30 év szépségipari tapasztalat, működési rendszer, marketing-, HR-, digitális és szakmai támogatás új vagy meglévő szalon fejlesztéséhez.";
    canonical.href = "https://www.kleoszalon.hu/franchise";

    return () => {
      document.title = oldTitle;
      if (createdDescription) description?.remove();
      else if (description) description.content = previousDescription;
      if (createdCanonical) canonical?.remove();
      else if (canonical) canonical.href = previousCanonical;
    };
  }, []);

  return <main><style>{CSS}</style>
    <PublicPageHero
      eyebrow={p.eyebrow}
      title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>}
      lead={<><p>{p.lead}</p><p>Indíts új szalont vagy fejleszd tovább a meglévő üzletedet egy több mint 30 éves szépségipari tapasztalatra épülő rendszerben.</p></>}
      image={p.imageUrl}
      imageAlt="Kleopátra Szépségszalon franchise"
      actions={<><a className="btn btn-primary" href="#franchise-jelentkezes">Kérem a részleteket</a><a className="btn btn-outline" href="#franchise-rendszer">Megnézem a rendszert</a></>}
    />

    <section className="public-section public-section--soft"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Hálózati háttér</p><h2>Valós működésre épített franchise rendszer</h2><p>A publikus hálózati mutatók a Kleopátra központi rendszerének aktuális adataiból töltődnek, így a franchise oldal nem egy különálló statikus bemutatkozás.</p></header>
      <div className="franchise-live-grid">
        <div className="franchise-live-card"><strong>30+</strong><span>év tapasztalat</span><small>Szépségipari működési és hálózatépítési tapasztalat.</small></div>
        <div className="franchise-live-card"><strong>{salons.length || 7}</strong><span>aktív szalon</span><small>A központi publikus szalontörzs alapján.</small></div>
        <div className="franchise-live-card"><strong>{liveCities.length || 4}</strong><span>jelenlegi város</span><small>A hálózat aktív lokációinak összevont városlistája.</small></div>
        <div className="franchise-live-card"><strong>{serviceCount || "100+"}</strong><span>szolgáltatás</span><small>A publikus szolgáltatási törzs aktuális kínálatából.</small></div>
      </div>
      <div className="franchise-network-list">{(liveCities.length ? liveCities : ["Budapest","Eger","Gyöngyös","Salgótarján"]).map(city=><span className="franchise-network-pill" key={city}>{city}</span>)}</div>
    </div></section>

    <section className="public-section" id="franchise-rendszer"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Stabil háttér</p>
        <h2>Ne csak egy szalont nyiss – építs működő vállalkozást</h2>
        <p>A franchise célja, hogy a partner ne egyedül építse fel a márkát, a napi folyamatokat, a marketinget, a HR-t és a digitális rendszert. A Kleopátra ezekhez közös standardokat és központi hátteret biztosít.</p>
      </header>
      <div className="feature-grid">
        <article className="feature-card"><span className="feature-card__kicker">Vendégélmény</span><h3>Komplex szolgáltatási modell</h3><p>A vendég egy helyen több alapvető szépségápolási szolgáltatáshoz fér hozzá, ami támogatja a kényelmet és a visszatérő vendégkör építését.</p></article>
        <article className="feature-card"><span className="feature-card__kicker">Operáció</span><h3>Nem mindent neked kell kitalálnod</h3><p>A napi működéshez dokumentált folyamatok, szakmai háttér, vezetői támogatás és vállalatirányítási eszközök kapcsolódnak.</p></article>
        <article className="feature-card"><span className="feature-card__kicker">Fejlődés</span><h3>Új és meglévő szalonhoz is</h3><p>A rendszer új egység indítására, valamint működő szépségszalon Kleopátra rendszerbe történő integrálására és fejlesztésére is használható.</p></article>
      </div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Kinek szól?</p><h2>{p.sectionTitle}</h2><p>{p.sectionLead}</p></header>
      <div className="feature-grid feature-grid--four">
        {AUDIENCES.map(item => <article className="feature-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </div></section>

    <section className="public-section"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Franchise háttér</p><h2>Mit kapsz a Kleopátra rendszerben?</h2><p>A franchise értéke nem pusztán a név- és logóhasználat: a napi működéshez kapcsolódó központi rendszer, standardok és támogatás együtt adják a hátteret.</p></header>
      <div className="feature-grid">{SUPPORT.map(item => <article className="feature-card" key={item.title}><span className="feature-card__kicker">Kleopátra</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container split-feature">
      <div className="split-feature__copy">
        <p className="section-eyebrow">Ha már van szalonod</p>
        <h2>A növekedési problémákra rendszerszintű válasz kell</h2>
        <p>Egy szépségszalon működtetése ma a szakmai munka mellett marketinget, HR-t, adminisztrációt, beszerzést, kapacitástervezést és folyamatos online jelenlétet is igényel.</p>
        <ul className="public-list">{EXISTING_SALON_CHALLENGES.map(item => <li key={item}>{item}</li>)}</ul>
        <p>A franchise célja, hogy ezekből minél többet közös rendszer, központi eszközök és egységes standardok segítsenek kezelni.</p>
      </div>
      <div className="split-feature__media"><img src="/images/franchise.png" alt="Kleopátra franchise program" /></div>
    </div></section>

    <section className="public-section"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Központi digitális háttér</p><h2>A franchise a VIR működési rendszeréhez kapcsolódik</h2><p>A központi rendszer az operáció, ügyfélkezelés, foglalás, HR, készlet, marketing és vezetői riportok egységesítését támogatja. A cél, hogy a partner ne különálló eszközökből próbálja összerakni a napi működést.</p></header>
      <div className="feature-grid">
        <article className="feature-card"><h3>Foglalás és vendégkezelés</h3><p>Online időpontfoglalás, szolgáltatási törzs, ügyféladatok, hűség és kommunikáció közös digitális háttérrel.</p></article>
        <article className="feature-card"><h3>HR és operáció</h3><p>Munkatársak, munkakörök, jelenlét, feladatok, képzések és működési standardok központi kontroll mellett.</p></article>
        <article className="feature-card"><h3>Vezetői átláthatóság</h3><p>Telephelyi és hálózati mutatók, pénzügyi és teljesítményriportok, valamint egységesebb döntéstámogatás.</p></article>
      </div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container">
      <header className="public-section__header"><p className="section-eyebrow">Terjeszkedés</p><h2>Hol keresünk most partnereket?</h2><p>Kiemelten az alábbi városokban keresünk franchise partnereket. Más lokációval is lehet jelentkezni; a döntésnél a keresletet, a versenyt, az ingatlant és az üzleti tervet együtt kell vizsgálni.</p></header>
      <div className="franchise-city-grid">{PARTNER_CITIES.map(city => <div className="franchise-city" key={city}><strong>{city}</strong><small>Franchise partneri érdeklődés fogadása</small></div>)}</div>
    </div></section>

    <section className="public-section"><div className="container franchise-investment">
      <div className="public-cta"><div><p className="section-eyebrow">Befektetés</p><h2>Komoly, de előre tervezhető üzleti döntés</h2><p>A szükséges befektetés lokációtól, mérettől, szolgáltatási portfóliótól, meglévő infrastruktúrától és finanszírozástól függ. A részletes folyamatban ezekhez konkrét költség- és üzleti terv készíthető.</p></div><a className="btn btn-primary" href="#franchise-jelentkezes">Kérem a részletes információt</a></div>
      <div className="franchise-investment__metric"><strong>2–3 év</strong><span>jellemző megtérülési idő a franchise tájékoztató szerint</span><small>Tájékoztató jellegű tapasztalati adat, nem hozam- vagy megtérülési garancia. Az egyedi eredmény a lokációtól, költségektől, forgalomtól és működtetéstől függ.</small></div>
    </div></section>

    <section className="public-section public-section--soft" id="franchise-jelentkezes"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Következő lépés</p>
        <h2>Kérd a részletes franchise információt</h2>
        <p>Add meg a neved, e-mail címed és telefonszámod. A jelentkezés nem jelent elköteleződést; a franchise csapat a megadott adatok alapján küld további információt és felveszi veled a kapcsolatot.</p>
      </header>
      <FranchiseLeadForm variant="franchise" />
      <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}><NavLink to="/contact" className="btn btn-outline">Kapcsolat</NavLink></div>
    </div></section>
  </main>;
};
