import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink, Navigate } from "react-router-dom";
import { getPublicSalons, PublicSalon } from "../apiClient";
import PublicPageHero from "../components/PublicPageHero";

const SALON_IMAGES: Record<string, string> = {
  "budapest-ix": "/images/mester.jpg",
  "budapest-viii": "/images/rakoczi.jpg",
  "budapest-xii": "/images/krisztina.jpg",
  "budapest-xiii": "/images/visegradi.jpg",
  eger: "/images/Eger.jpg",
  gyongyos: "/images/gyongyos.png",
  salgotarjan: "/images/salgotarjan.jpg",
};

export const SalonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salons, setSalons] = useState<PublicSalon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSalons().then(setSalons).catch((err) => {
      console.error(err);
      setError("Nem sikerült betölteni a szalonokat.");
    });
  }, []);

  const salon = useMemo(() => salons?.find((s) => s.slug === id || String(s.id) === id), [salons, id]);

  if (error) return <main className="public-section"><div className="container"><div className="notice-card">{error}</div></div></main>;
  if (!salons) return <main className="public-section"><div className="container"><div className="notice-card">Szalon adatainak betöltése…</div></div></main>;
  if (!salon) return <Navigate to="/salons" replace />;

  const image = SALON_IMAGES[salon.slug] || "/images/szalonok.jpg";

  return (
    <main>
      <PublicPageHero
        eyebrow="Kleopátra Szépségszalon"
        title={salon.city_label}
        lead={<p>{salon.address}. Több szépségápolási szolgáltatás egy helyen, online időpontfoglalással és a szalon aktuális kapacitása szerint akár bejelentkezés nélkül is.</p>}
        image={image}
        imageAlt={`${salon.city_label} Kleopátra Szépségszalon`}
        actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/prices" className="btn btn-outline">Árlista</NavLink></>}
      />

      <section className="public-section">
        <div className="container feature-grid">
          <article className="feature-card"><span className="feature-card__kicker">Helyszín</span><h2>Cím</h2><p>{salon.address || "A cím betöltése folyamatban."}</p></article>
          <article className="feature-card"><span className="feature-card__kicker">Szolgáltatások</span><h2>Szépség egy helyen</h2><p>Fodrászat, kozmetika, kéz- és lábápolás, masszázs és további szolgáltatások. A pontos kínálat szalononként eltérhet.</p></article>
          <article className="feature-card"><span className="feature-card__kicker">Foglalás</span><h2>Online vagy személyesen</h2><p>Foglalj online valós idejű szabad időpontra, vagy érdeklődj közvetlenül a szalonnál az aktuális lehetőségekről.</p></article>
        </div>
      </section>

      <section className="public-section public-section--soft">
        <div className="container public-cta">
          <div><h2>Készen állsz?</h2><p>Az online foglalóban válaszd ki ezt a helyszínt, a szolgáltatást és a megfelelő szakembert.</p></div>
          <div className="public-page-hero__actions"><NavLink to="/booking" className="btn btn-primary">Foglalás</NavLink><NavLink to="/salons" className="btn btn-outline">Másik szalon</NavLink></div>
        </div>
      </section>
    </main>
  );
};
