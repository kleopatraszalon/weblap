import React from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

const COURSES = [
  { title: "Füllyukasztás", text: "Gyakorlatorientált képzés a higiénikus és professzionális szolgáltatás elsajátításához." },
  { title: "Fogfehérítés", text: "Esztétikai fogfehérítési szolgáltatáshoz kapcsolódó elméleti és gyakorlati ismeretek." },
  { title: "Cukorpasztás szőrtelenítés", text: "A sugar technika alapjai, anyaghasználat, mozdulatok és kezelési területek." },
  { title: "Intim sugar", text: "Haladó, speciális cukorpasztás szőrtelenítési technika megfelelő előkészítéssel és higiéniával." },
  { title: "1D classic műszempilla", text: "A klasszikus 1D szempillaépítés alapjai, előkészítés, izolálás, styling és utóápolás." },
  { title: "Hajhosszabbítás", text: "Gyakorlati képzés a kiválasztott hajhosszabbítási technológiák biztonságos alkalmazásához." },
];

export const TrainingPage: React.FC = () => (
  <main>
    <PublicPageHero
      eyebrow="KLEO ACADEMY"
      title={<>Tanulj, fejlődj, építs <span className="highlight">szépségipari karriert</span></>}
      lead={<p>A KLEO ACADEMY célja a gyakorlatban is használható tudás átadása. A képzési kínálatban rövid, célzott szakmai tanfolyamok és tanulói gyakorlati lehetőségek is megjelennek.</p>}
      image="/images/oktatas.jpg"
      imageAlt="KLEO ACADEMY oktatás"
      actions={<><a className="btn btn-primary" href="#kepzesek">Képzések</a><NavLink to="/contact" className="btn btn-outline">Érdeklődés</NavLink></>}
    />

    <section id="kepzesek" className="public-section">
      <div className="container">
        <header className="public-section__header">
          <p className="section-eyebrow">2026-os képzési kínálat</p>
          <h2>Gyakorlatorientált szakmai tanfolyamok</h2>
          <p>A pontos indulási időpontok, helyszínek, részvételi díjak és feltételek képzésenként változhatnak. Jelentkezés előtt mindig az aktuális kiírás az irányadó.</p>
        </header>
        <div className="course-grid">
          {COURSES.map(course => (
            <article className="feature-card course-card" key={course.title}>
              <span className="feature-card__kicker">KLEO ACADEMY</span>
              <h3>{course.title}</h3>
              <p>{course.text}</p>
              <NavLink to="/contact" className="btn btn-outline">Érdeklődöm</NavLink>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="public-section public-section--soft">
      <div className="container split-feature split-feature--reverse">
        <div className="split-feature__media"><img src="/images/values.png" alt="Kleopátra szakmai értékek" /></div>
        <div className="split-feature__copy">
          <p className="section-eyebrow">Tanulói gyakorlat</p>
          <h2>Valódi szalonkörnyezetben szerzett tapasztalat</h2>
          <p>A szakmai gyakorlat akkor értékes, ha a technikai tudás mellett a vendégkezelést, a munkaszervezést, a higiéniai folyamatokat és a szalon mindennapi működését is meg lehet ismerni.</p>
          <ul className="public-list">
            <li>gyakorlati szemlélet és szakmai mentorálás;</li>
            <li>szalonkultúra és vendégkommunikáció;</li>
            <li>egységes minőségi és higiéniai elvárások;</li>
            <li>betekintés egy országos hálózat működésébe.</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="public-section">
      <div className="container public-cta">
        <div><h2>Képzésre jelentkeznél?</h2><p>Írd meg, melyik tanfolyam érdekel, és a kapcsolatfelvétel során egyeztetjük az aktuális lehetőségeket.</p></div>
        <NavLink to="/contact" className="btn btn-primary">Kapcsolatfelvétel</NavLink>
      </div>
    </section>
  </main>
);
