import React, { useEffect, useState } from "react";

const heroImages = [
  "/images/images_1.webp",
  "/images/images_2.webp",
  "/images/images_3.webp",
  "/images/images_4.webp",
];

export const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main>
      <section className="hero hero--home">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-kicker">Minden ami szépség, csak Neked.</p>
            <h1>
              Kleopátra Szépségszalonok
              <br />
              <span className="accent">look good, feel good!</span>
            </h1>
            <p className="hero-lead">
              Szalonjainkban a mindennapi szépségápolásodhoz mindent egy helyen
              megtalálsz: fodrászat, kozmetika, kéz- és lábápolás, masszázs és
              szolárium vár több városban, hosszú nyitvatartással.
            </p>
            <div className="hero-pills">
              <span>Fodrászat</span>
              <span>Kozmetika</span>
              <span>Kéz- és lábápolás</span>
              <span>Szolárium</span>
              <span>Masszázs</span>
            </div>
            <div className="btn-row">
              <a className="btn btn-primary" href="/salons">
                Szalon választása
              </a>
              <a className="btn btn-ghost" href="/prices">
                Árlista megnyitása
              </a>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-media-frame">
              <div className="hero-image-stack">
                {heroImages.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt="Kleopátra Szépségszalon"
                    className={idx === activeIndex ? "is-active" : ""}
                  />
                ))}
              </div>
              <div className="hero-chip hero-chip--light">
                Töltsd le mobilalkalmazásunkat
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cards">
        <div className="container grid-three">
          <article className="card">
            <h2 className="card-title">Franchise program</h2>
            <p className="card-text">
              Szeretnél Kleopátra Szépségszalont nyitni? A márka komplett
              arculati, működési és marketing háttérrel támogat, hogy
              professzionális szalont üzemeltethess.
            </p>
            <a className="link-btn" href="/franchise">
              Franchise lehetőségek
            </a>
          </article>
          <article className="card">
            <h2 className="card-title">Kleos termékek</h2>
            <p className="card-text">
              Válaszd Kleos kiegészítőinket és termékeinket, hogy a
              mindennapokban is magaddal vidd a Kleopátra életérzést.
            </p>
            <a className="link-btn" href="/webshop">
              Tovább a webshopra
            </a>
          </article>
          <article className="card">
            <h2 className="card-title">Hűségprogram</h2>
            <p className="card-text">
              Regisztrált vendégeinket pontokkal, kedvezményekkel és exkluzív
              ajánlatokkal jutalmazzuk. Iratkozz fel, hogy ne maradj le az
              újdonságokról.
            </p>
            <a className="link-btn" href="/loyalty">
              Hűségprogram részletei
            </a>
          </article>
        </div>
      </section>
    </main>
  );
};
