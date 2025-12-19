import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

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
    address: "Rákóczi út 63.",
  },
  {
    id: "budapest-xii",
    slug: "budapest-xii",
    city_label: "Kleopátra Szépségszalon – Budapest XII.",
    address: "Krisztina körút 23.",
  },
  {
    id: "budapest-xiii",
    slug: "budapest-xiii",
    city_label: "Kleopátra Szépségszalon – Budapest XIII.",
    address: "Visegrádi utca 3.",
  },
  {
    id: "eger",
    slug: "eger",
    city_label: "Kleopátra Szépségszalon – Eger",
    address: "Dr. Nagy János utca 8.",
  },
  {
    id: "gyongyos",
    slug: "gyongyos",
    city_label: "Kleopátra Szépségszalon – Gyöngyös",
    address: "Koháry utca 29.",
  },
  {
    id: "salgotarjan",
    slug: "salgotarjan",
    city_label: "Kleopátra Szépségszalon – Salgótarján",
    address: "Füleki út 44.",
  },
];

const CENTRAL_WIDGET_SRC = "https://w714308.alteg.io/widgetJS";

export const SalonsPage: React.FC = () => {
  const { t } = useI18n();
  const salons = STATIC_SALONS;
  const salonCount = salons.length;

  // Központi Altegio foglalási widget betöltése (minden szalonra)
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CENTRAL_WIDGET_SRC}"]`
    );
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = CENTRAL_WIDGET_SRC;
    script.async = true;
    script.charset = "UTF-8";
    document.body.appendChild(script);
  }, []);

  return (
    <main>
      {/* HERO – szalonlista, arany + magenta felirat a képen */}
      <section className="page-hero page-hero--salons">
        <div className="page-hero__image-wrap">
          <img
            src="/images/szalonok.jpg"
            alt={t("salons.list.heroAlt")}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay" />
        </div>

        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow section-eyebrow--magenta">
            {t("salons.list.eyebrow")}
          </p>
          <h1 className="hero-title">
            <span className="hero-part hero-part-default">
              {t("salons.list.titlePrefix")}
            </span>{" "}
            {salonCount > 0 && (
              <span className="hero-part hero-part-magenta">
                {salonCount}
              </span>
            )}{" "}
            <span className="hero-part hero-part-gold">
              {t("salons.list.titleSuffix")}
            </span>
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("salons.list.lead")}
          </p>
        </div>
      </section>

      {/* SZALON-KÁRTYÁK */}
      <section className="section section--salons">
        <div className="container">
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

      {/* TÉRKÉP + FACEBOOK BLOKK */}
      <section className="section section--salons-extra">
        <div className="container grid-two">
          <article className="card card--map">
            <h2 className="card-title">{t("salons.list.mapTitle")}</h2>
            <p className="card-text">{t("salons.list.mapText")}</p>
            <div className="salon-map salon-map--global">
              <iframe
                src="https://www.google.com/maps?q=Kleop%C3%A1tra%20Sz%C3%A9ps%C3%A9gszalon&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label={t("salons.list.mapTitle")}
                title={t("salons.list.mapTitle")}
              ></iframe>
            </div>
          </article>

          <article className="card card--facebook">
            <h2 className="card-title">
              {t("salons.list.facebookTitle")}
            </h2>
            <p className="card-text">{t("salons.list.facebookText")}</p>
            <div className="salons-facebook-frame">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fkleovisegradi3%2F&tabs=timeline&width=500&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                style={{
                  border: "none",
                  overflow: "hidden",
                  width: "100%",
                  height: "400px",
                }}
                scrolling="no"
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </article>
        </div>
      </section>

      {/* ÁLTALÁNOS ONLINE FOGLALÁS BLOKK */}
      <section className="section section--salons-booking-global">
        <div className="container">
          <div className="salons-booking-global">
            <h2>{t("salons.list.bookingTitle")}</h2>
            <p>{t("salons.list.bookingText")}</p>
            <div className="salons-booking-widget">
              {/* A központi Altegio widget scriptje (w714308) a háttérben betöltődik. */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SalonsPage;
