import React from "react";
import { NavLink } from "react-router-dom";

const SERVICE_CARDS = [
  {
    slug: "hair",
    title: "Fodrászat",
    description:
      "Női, férfi és gyermek hajvágás, festés, balayage, frissítő vágás és alkalmi frizurák – személyre szabott tanácsadással.",
    cta: "Fodrász árlista megnyitása",
  },
  {
    slug: "beauty",
    title: "Kozmetika",
    description:
      "Klasszikus arckezelések, modern gépi megoldások, smink, szempilla- és szemöldökformázás – a ragyogó bőrért.",
    cta: "Kozmetikai árlista",
  },
  {
    slug: "hands-feet",
    title: "Kéz- és lábápolás",
    description:
      "Manikűr, gél lakk, műköröm, pedikűr – az ápolt, esztétikus kéz és láb érdekében.",
    cta: "Kéz- és lábápolás árlista",
  },
  {
    slug: "solarium",
    title: "Szolárium",
    description:
      "Modern gépekkel, szakértő tanácsadással segítünk elérni az egyenletes, napbarnított bőrt.",
    cta: "Szolárium árlista",
  },
  {
    slug: "massage",
    title: "Masszázs",
    description:
      "Relaxáló, frissítő és gyógy masszázsok, amelyek segítenek feltöltődni és kikapcsolni.",
    cta: "Masszázs árlista",
  },
];

export const ServicesPage: React.FC = () => (
  <main>
    {/* FEJLÉC + NAGY KÉP – ugyanaz a logika, mint a Szalonjaink oldalon */}
    <section className="section section--services-hero">
      <div className="container services-intro">
        <p className="section-eyebrow">Szolgáltatások</p>
        <h1>Szolgáltatásaink – mindent egy helyen</h1>
        <p className="hero-lead hero-lead--narrow">
          Fodrászat, kozmetika, kéz- és lábápolás, szolárium és masszázs – egy
          helyen, Kleopátra-minőségben. Válaszd ki, mire van szükséged, és
          találd meg a hozzád legközelebb eső szalonunkat!
        </p>
      </div>

      <div className="services-hero-image">
        <img
          src="/images/szolgaltatasok.png"
          alt="Kleopátra Szépségszalon – fodrászat, kozmetika, kéz- és lábápolás egy helyen"
          className="services-hero-image__img"
        />
      </div>
    </section>

    {/* SZOLGÁLTATÁS KÁRTYÁK – dizájnban a Szalonjainkhoz igazítva */}
    <section className="section section--services-overview section--services-page-cards">
      <div className="container">
        <div className="grid-three">
          {SERVICE_CARDS.map((service) => (
            <NavLink
              key={service.slug}
              to={
                service.slug === "hair"
                  ? "/prices#category-1"
                  : service.slug === "beauty"
                  ? "/prices#category-2"
                  : service.slug === "hands-feet"
                  ? "/prices#category-3"
                  : service.slug === "solarium"
                  ? "/prices#category-5"
                  : service.slug === "massage"
                  ? "/prices#category-6"
                  : "/prices"
              }
              className="card card--service"
            >
              <h2 className="card-title">{service.title}</h2>
              <p className="card-text">{service.description}</p>
              <span className="link-btn">{service.cta}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  </main>
);
