import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getPublicSalons, PublicSalon } from "../apiClient";

export const SalonDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [salons, setSalons] = useState<PublicSalon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSalons()
      .then(setSalons)
      .catch((err) => {
        console.error(err);
        setError("Nem sikerült betölteni a szalonokat.");
      });
  }, []);

  if (error) {
    return (
      <main className="section">
        <div className="container">
          <p className="form-msg form-msg--error">{error}</p>
        </div>
      </main>
    );
  }

  if (!salons) {
    return (
      <main className="section">
        <div className="container">
          <p>Betöltés...</p>
        </div>
      </main>
    );
  }

  const salon = salons.find((s) => s.slug === slug);

  if (!salon) {
    return <Navigate to="/salons" replace />;
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Szalonjaink</p>
          <h1>
            {salon.city_label} – {salon.address}
          </h1>
          <p className="hero-lead hero-lead--narrow">
            Ebben a Kleopátra Szépségszalonban is komplett szépségápolási
            szolgáltatásokat kínálunk: fodrászat, kozmetika, kéz- és lábápolás,
            masszázs és további kezelések várnak modern, egységes környezetben.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">Alapadatok</h2>
            <ul className="info-list">
              <li>
                <strong>Cím:</strong> {salon.city_label}, {salon.address}
              </li>
              <li>
                <strong>Szolgáltatások:</strong> fodrászat, kozmetika, kéz- és
                lábápolás, masszázs, szolárium (helyszínenként eltérhet)
              </li>
              <li>
                <strong>Fizetési módok:</strong> készpénz, bankkártya,
                SZÉP-kártya
              </li>
            </ul>
          </article>
          <article className="card">
            <h2 className="card-title">Időpontfoglalás</h2>
            <p className="card-text">
              Időpontot foglalhatsz mobilalkalmazásunkon, telefonon vagy az
              online rendszerünkön keresztül. Akár bejelentkezés nélkül is
              betérhetsz, kollégáink a lehető legrövidebb időn belül fogadnak.
            </p>
            <Link className="btn btn-primary" to="/salons">
              Vissza a szalonlistához
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
};
