import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getPublicSalons, PublicSalon } from "../apiClient";
import { useI18n } from "../i18n";

const ALTEGIO_WIDGETS: Record<string, string> = {
  "budapest-ix": "https://w529306.alteg.io/widgetJS", // Mester u. 1.
  "budapest-viii": "https://w197493.alteg.io/widgetJS", // Rákóczi u. 63.
  "budapest-xii": "https://w206438.alteg.io/widgetJS", // Krisztina krt. 23. (Buda)
  "budapest-xiii": "https://w206416.alteg.io/widgetJS", // Visegrádi u. 3. (Visi)
  eger: "https://w206809.alteg.io/widgetJS",
  gyongyos: "https://w207008.alteg.io/widgetJS",
  salgotarjan: "https://w206818.alteg.io/widgetJS",
};

const DEFAULT_WIDGET_SRC = "https://w714308.alteg.io/widgetJS"; // központi – minden szalon egyben

// Szalon hero-képek – a felhasználó által megadott fájlnevek
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
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();

  const [salons, setSalons] = useState<PublicSalon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSalons()
      .then(setSalons)
      .catch((err) => {
        console.error(err);
        setError(t("salon.detail.error"));
      });
  }, [t]);

  const salon = salons?.find((s) => s.slug === slug) ?? null;

  // Altegio widget betöltése a megfelelő szalonhoz
  useEffect(() => {
    if (!salon) return;

    const widgetSrc = ALTEGIO_WIDGETS[salon.slug] ?? DEFAULT_WIDGET_SRC;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${widgetSrc}"]`
    );
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = widgetSrc;
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);
  }, [salon]);

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
          <p>{t("salon.detail.loading")}</p>
        </div>
      </main>
    );
  }

  if (!salon) {
    return <Navigate to="/salons" replace />;
  }

  const mapQuery = `${salon.city_label} ${salon.address ?? ""}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&output=embed`;

  const salonImageSrc = SALON_IMAGES[salon.slug] ?? "/images/szalonok.jpg";

  return (
    <main>
      <section className="page-hero page-hero--salons">
        <div className="page-hero__image-wrap">
          <img
            src={salonImageSrc}
            alt={salon.city_label}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay" />
        </div>
        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow">{t("salon.detail.eyebrow")}</p>
          <h1>
            {salon.city_label}
            {salon.address ? ` – ${salon.address}` : ""}
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("salon.detail.lead")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">{t("salon.detail.basicTitle")}</h2>
            <ul className="info-list">
              <li>
                <strong>{t("salon.detail.basicLabel.name")}</strong>{" "}
                {salon.city_label}
              </li>
              {salon.address && (
                <li>
                  <strong>{t("salon.detail.basicLabel.address")}</strong>{" "}
                  {salon.address}
                </li>
              )}
              <li>
                <strong>{t("salon.detail.basicLabel.services")}</strong>{" "}
                {t("salon.detail.basicServices")}
              </li>
              <li>
                <strong>{t("salon.detail.basicLabel.payments")}</strong>{" "}
                {t("salon.detail.basicPayments")}
              </li>
            </ul>
          </article>

          <article className="card">
            <h2 className="card-title">{t("salon.detail.bookingTitle")}</h2>
            <p className="card-text">
              {t("salon.detail.bookingText")}
            </p>
            <div className="salon-booking-widget">
              {/* Az Altegio foglalási widget scriptje betöltődik a háttérben
                  (a megfelelő szalonhoz tartozó URL-lel). */}
            </div>
            <Link className="btn btn-outline" to="/salons">
              {t("salon.detail.bookingBack")}
            </Link>
          </article>
        </div>
      </section>

      <section className="section section--salon-extra">
        <div className="container grid-two">
          <article className="card card--map">
            <h2 className="card-title">{t("salon.detail.mapTitle")}</h2>
            <div className="salon-map">
              <iframe
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label={salon.city_label}
                title={salon.city_label}
              ></iframe>
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-primary--magenta"
            >
              {t("salon.detail.mapOpen")}
            </a>
          </article>
          <article className="card">
            <h2 className="card-title">{t("salon.detail.infoTitle")}</h2>
            <p className="card-text">
              {t("salon.detail.infoText1")}
            </p>
            <p className="card-text">
              {t("salon.detail.infoText2")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};
