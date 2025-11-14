import React from "react";

export const CareerPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Karrier</p>
        <h1>Csatlakozz a Kleopátra csapatához</h1>
        <p className="hero-lead hero-lead--narrow">
          Fodrász, kozmetikus, körmös, masszőr vagy recepciós munkatársakat
          keresünk több városban. Ismerd meg lehetőségeinket és jelentkezz
          online.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-two">
        <article className="card">
          <h2 className="card-title">Nyitott pozíciók</h2>
          <p className="card-text">
            A végleges rendszerben itt jelennek meg a szalononkénti
            álláshirdetések, közvetlen jelentkezési lehetőséggel.
          </p>
        </article>
        <article className="card">
          <h2 className="card-title">Miért jó nálunk dolgozni?</h2>
          <p className="card-text">
            Stabil háttér, egységes arculat, folyamatos szakmai fejlődési
            lehetőség és támogató csapat vár a Kleopátra Szépségszalonok
            hálózatában.
          </p>
        </article>
      </div>
    </section>
  </main>
);
