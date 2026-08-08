import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

const POSITIONS = [
  { title: "Fodrász", text: "Női és/vagy férfi hajvágásban, festésben, szőkítésben és hajformázásban magabiztos szakembereknek." },
  { title: "Kozmetikus", text: "Arckezelésekben, diagnosztikában, szőrtelenítésben és szemöldök-szempilla szolgáltatásokban jártas kollégáknak." },
  { title: "Kézápoló és műkörömépítő", text: "Manikűr, gél lakk, épített köröm és díszítés területén precízen dolgozó szakembereknek." },
  { title: "Pedikűrös / gyógypedikűrös", text: "Esztétikai, gépi vagy kombinált pedikűrben jártas, higiénikus és vendégközpontú szakembereknek." },
  { title: "Masszőr / gyógymasszőr", text: "Svédmasszázsban biztos, figyelmes és empatikus szakembereknek; terápiás tapasztalat előny." },
  { title: "Recepciós / supervisor", text: "Erős kommunikációval, adminisztrációs készséggel és értékesítési szemlélettel rendelkező kollégáknak." },
];

export const CareerPage: React.FC = () => (
  <main>
    <PublicPageHero
      eyebrow="Kleo Team Karrier"
      title={<>A te sikered a <span className="highlight">mi sikerünk is</span></>}
      lead={<p>Olyan szakembereket és ügyfélközpontú kollégákat keresünk, akik hosszú távon szeretnének stabil, fejlődő és professzionális szépségipari környezetben dolgozni.</p>}
      image="/images/rolunk.jpg"
      imageAlt="Kleopátra csapat"
      actions={<><a className="btn btn-primary" href="#poziciok">Pozíciók</a><NavLink to="/contact" className="btn btn-outline">Jelentkezési kapcsolat</NavLink></>}
    />

    <section id="poziciok" className="public-section">
      <div className="container">
        <header className="public-section__header"><p className="section-eyebrow">Pozícióink</p><h2>Folyamatosan bővülő csapat</h2><p>A konkrét nyitott helyek szalononként változhatnak. Az alábbi munkakörök rendszeresen megjelennek a hálózatban.</p></header>
        <div className="job-grid">{POSITIONS.map(item => <article className="feature-card job-card" key={item.title}><span className="feature-card__kicker">Kleo Team</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </div>
    </section>

    <section className="public-section public-section--soft">
      <div className="container feature-grid">
        <article className="feature-card"><h2>Amit kínálunk</h2><ul className="public-list"><li>stabil, professzionális munkakörnyezet;</li><li>folyamatos szakmai képzések;</li><li>rugalmas munkaidőbeosztás;</li><li>növekvő vendégkör és központi marketing;</li><li>teljesítményhez kapcsolódó kereseti lehetőségek.</li></ul></article>
        <article className="feature-card"><h2>Amit keresünk</h2><ul className="public-list"><li>szakmai tudás és elhivatottság;</li><li>vendégközpontú hozzáállás;</li><li>precíz és pontos munkavégzés;</li><li>fejlődésvágy és csapatmunka;</li><li>megbízhatóság és rugalmasság.</li></ul></article>
        <article className="feature-card"><h2>Munkavégzési forma</h2><p>A hálózatban alkalmazotti és egyes területeken vállalkozói konstrukciók is előfordulhatnak. A pontos feltételeket mindig az adott álláshirdetés tartalmazza.</p><div className="feature-card__meta"><span>Budapest</span><span>Eger</span><span>Gyöngyös</span><span>Salgótarján</span></div></article>
      </div>
    </section>

    <section className="public-section">
      <div className="container public-cta"><div><h2>Csatlakoznál a Kleo Teamhez?</h2><p>A VIR-specifikáció szerinti teljes álláskereső és pályázati modulhoz a felületet külön HR-integrációval kötjük össze. Addig a kapcsolat oldalon tudsz érdeklődést küldeni.</p></div><NavLink to="/contact" className="btn btn-primary">Kapcsolat / Karrier</NavLink></div>
    </section>
  </main>
);
