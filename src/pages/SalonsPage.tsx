import React from "react";
import { Link, NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";

type PublicSalon = { id: string; slug: string; city_label: string; address?: string };

const STATIC_SALONS: PublicSalon[] = [
  { id: "budapest-ix", slug: "budapest-ix", city_label: "Budapest IX.", address: "Mester u. 1." },
  { id: "budapest-viii", slug: "budapest-viii", city_label: "Budapest VIII.", address: "Rákóczi u. 63." },
  { id: "budapest-xii", slug: "budapest-xii", city_label: "Budapest XII.", address: "Krisztina krt. 23." },
  { id: "budapest-xiii", slug: "budapest-xiii", city_label: "Budapest XIII.", address: "Visegrádi u. 3." },
  { id: "eger", slug: "eger", city_label: "Eger", address: "Dr. Nagy János u. 8." },
  { id: "gyongyos", slug: "gyongyos", city_label: "Gyöngyös", address: "Koháry u. 29." },
  { id: "salgotarjan", slug: "salgotarjan", city_label: "Salgótarján", address: "Füleki u. 44." },
];

export const SalonsPage: React.FC = () => {
  const salonCount = STATIC_SALONS.length;
  return (
    <main>
      <PublicPageHero
        eyebrow="Szalonjaink"
        title={<>Jelenleg <span className="highlight">{salonCount} helyszínen</span> várunk</>}
        lead={<p>Budapesten és vidéki városokban is megtalálsz bennünket. Foglalhatsz online, de szalonjaink működésének fontos része a rugalmas, akár bejelentkezés nélküli vendégfogadás is.</p>}
        image="/images/szalonok.jpg"
        imageAlt="Kleopátra Szépségszalonok"
        actions={<><NavLink to="/booking" className="btn btn-primary">Online időpontfoglalás</NavLink><NavLink to="/services" className="btn btn-outline">Szolgáltatások</NavLink></>}
      />

      <section className="public-section">
        <div className="container">
          <header className="public-section__header">
            <p className="section-eyebrow">Helyszínek</p>
            <h2>Válaszd ki a hozzád legközelebbi szalont</h2>
            <p>A szalon adatlapján megtalálod az elérhető szolgáltatásokat, szakembereket és a foglaláshoz szükséges információkat.</p>
          </header>
          <div className="salons-grid">
            {STATIC_SALONS.map((s) => (
              <Link key={s.id} to={`/salons/${s.slug}`} className="salon-pill">
                <span className="feature-card__kicker">Kleopátra Szépségszalon</span>
                <span className="salon-pill__city">{s.city_label}</span>
                {s.address && <span className="salon-pill__address">{s.address}</span>}
                <span className="link-btn">Szalon megnyitása →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--soft">
        <div className="container split-feature">
          <div className="split-feature__copy">
            <p className="section-eyebrow">Kleopátra előny</p>
            <h2>Sokféle szolgáltatás, rugalmasan</h2>
            <p>A hálózat koncepciója arra épül, hogy a vendég több szépségápolási szolgáltatást is egy helyen érjen el. Az online foglalás mellett a szalonok a kapacitás függvényében időpont nélkül érkező vendégeket is fogadnak.</p>
            <ul className="public-list">
              <li>fodrászat, kozmetika, kéz- és lábápolás, masszázs és további szolgáltatások;</li>
              <li>hosszú nyitvatartás és recepciós szervezés;</li>
              <li>bankkártyás és elérhetőség szerint SZÉP-kártyás fizetési lehetőségek;</li>
              <li>bérletek, ajándékutalványok és webshopos termékek.</li>
            </ul>
          </div>
          <div className="split-feature__media"><img src="/images/home.png" alt="Kleopátra szalon belső" /></div>
        </div>
      </section>

      <section className="public-section">
        <div className="container public-cta">
          <div><h2>Megvan a szalon?</h2><p>Indítsd el az online foglalást, válassz szolgáltatást, szakembert és megfelelő időpontot.</p></div>
          <NavLink to="/booking" className="btn btn-primary">Foglalok</NavLink>
        </div>
      </section>
    </main>
  );
};
