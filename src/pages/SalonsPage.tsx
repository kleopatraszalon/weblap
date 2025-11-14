import React from "react";
import { Link } from "react-router-dom";

type PublicSalon = {
  id: string;
  slug: string;
  city_label: string;
  address?: string;
};

// FRONTENDEN TÁROLT STATIKUS LISTA – amíg az API nem jó
const STATIC_SALONS: PublicSalon[] = [
  {
    id: "budapest-ix",
    slug: "budapest-ix",
    city_label: "Kleopátra Szépségszalon – Budapest IX.",
    address: "Mester u. 1.",
  },
  {
    id: "budapest-viii",
    slug: "budapest-viii",
    city_label: "Kleopátra Szépségszalon – Budapest VIII.",
    address: "Rákóczi u. 63.",
  },
  {
    id: "budapest-xii",
    slug: "budapest-xii",
    city_label: "Kleopátra Szépségszalon – Budapest XII.",
    address: "Krisztina krt. 23.",
  },
  {
    id: "budapest-xiii",
    slug: "budapest-xiii",
    city_label: "Kleopátra Szépségszalon – Budapest XIII.",
    address: "Visegrádi u. 3.",
  },
  {
    id: "eger",
    slug: "eger",
    city_label: "Kleopátra Szépségszalon – Eger",
    address: "Dr. Nagy János u. 8.",
  },
  {
    id: "gyongyos",
    slug: "gyongyos",
    city_label: "Kleopátra Szépségszalon – Gyöngyös",
    address: "Koháry u. 29.",
  },
  {
    id: "salgotarjan",
    slug: "salgotarjan",
    city_label: "Kleopátra Szépségszalon – Salgótarján",
    address: "Füleki u. 44.",
  },
];

export const SalonsPage: React.FC = () => {
  const salons = STATIC_SALONS;
  const salonCount = salons.length;

  return (
    <main>
      <section className="section section--salons-page">
        <div className="salons-block">
          {/* FEJLÉC SZÖVEG */}
          <header className="salons-block__header">
            <p className="section-eyebrow">Szalonjaink</p>
            <h1>
              Bejelentkezés nélkül is várunk már{" "}
              {salonCount > 0 ? <strong>{salonCount}</strong> : null} helyszínen!
            </h1>
            <p className="hero-lead hero-lead--narrow">
              Válaszd ki a hozzád legközelebb eső Kleopátra Szépségszalont, és
              lépj be a több mint 30 éves szakértelem világába.
            </p>
          </header>

          {/* KÉP KÖZÉPEN – SZALONOK.JPG */}
          <div className="salons-hero-image">
            {/* A fájl:  public/images/szalonok.jpg  */}
            <img
              src="/images/szalonok.jpg"
              alt="Kleopátra Szalonok"
              className="salons-hero-image__img"
            />
          </div>

          {/* SZALON GOMBOK – KÖZÉPEN GRIDBEN */}
          <div className="salons-grid">
            {salons.map((s) => (
              <Link
                key={s.id}
                to={`/salons/${s.slug}`}
                className="salon-pill"
              >
                <span className="salon-pill__city">{s.city_label}</span>
                {s.address && (
                  <span className="salon-pill__address">{s.address}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
