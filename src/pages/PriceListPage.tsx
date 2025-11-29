// src/pages/PriceListPage.tsx
import React, { useEffect, useState } from "react";
import { getPublicServices, PublicService } from "../apiClient";
import { useI18n } from "../i18n";

// Telephelyek – location_id -> cím
const LOCATIONS = [
  { id: null as number | null, label: "Összes szalon" },
  { id: 1, label: "Budapest IX. – Mester u. 1." },
  { id: 2, label: "Budapest VIII. – Rákóczi u. 63." },
  { id: 3, label: "Budapest XII. – Krisztina krt. 23." },
  { id: 4, label: "Budapest XIII. – Visegrádi u. 3." },
  { id: 5, label: "Eger – Dr. Nagy János u. 8." },
  { id: 6, label: "Gyöngyös – Koháry u. 29." },
  { id: 7, label: "Salgótarján – Füleki u. 44." },
];

export const PriceListPage: React.FC = () => {
  const { t } = useI18n();

  const [allServices, setAllServices] = useState<PublicService[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ÖSSZES SZOLGÁLTATÁS LEKÉRÉSE
  useEffect(() => {
    setLoading(true);
    setError(null);

    getPublicServices()
      .then((data) => {
        console.log("Szolgáltatások betöltve:", data);
        setAllServices(data);
      })
      .catch((err) => {
        console.error("Hiba a szolgáltatások betöltésekor:", err);
        setError(t("pricelist.error"));
      })
      .finally(() => setLoading(false));
  }, [t]);

  const filteredServices = allServices.filter((s) =>
    selectedLocationId ? s.location_id === selectedLocationId : true
  );

  // Szétbontjuk kategóriák szerint (public.services.category_id)
  const categories = new Map<string, PublicService[]>();
  for (const s of filteredServices) {
    const key = String(s.category_id ?? "other");
    if (!categories.has(key)) {
      categories.set(key, []);
    }
    categories.get(key)!.push(s);
  }

  return (
    <main>
      <section className="section section--pricelist">
        <div className="container pricelist-block">
          {/* FEJLÉC */}
          <header className="pricelist-header">
            <p className="section-eyebrow">{t("pricelist.eyebrow")}</p>
            <h1>{t("pricelist.title")}</h1>
            <p className="hero-lead hero-lead--narrow">
              {t("pricelist.lead")}
            </p>
          </header>

          {/* HERO KÉP */}
          <div className="services-hero-image">
            <img
              src="/images/szolgaltatasok.png"
              alt={t("services.heroAlt")}
              className="services-hero-image__img"
            />
          </div>

          {/* TELEPHELYVÁLASZTÓ */}
          <div className="pricelist-location-filter">
            <label htmlFor="location-select">
              {t("pricelist.location.label")}
            </label>
            <select
              id="location-select"
              value={selectedLocationId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedLocationId(value ? Number(value) : null);
              }}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id ?? "all"} value={loc.id ?? ""}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* ÁLLAPOTÜZENETEK */}
          {loading && (
            <p className="webshop-status">{t("pricelist.loading")}</p>
          )}
          {error && (
            <p className="webshop-status webshop-status--error">{error}</p>
          )}

          {/* SZOLGÁLTATÁS LISTA */}
          {!loading && !error && (
            <div className="pricelist-content">
              {Array.from(categories.entries()).map(([catKey, services]) => (
                <div key={catKey} className="pricelist-category">
                  <h2>{categoryLabelFromId(catKey, t)}</h2>
                  <table className="pricelist-table">
                    <thead>
                      <tr>
                        <th>{t("pricelist.table.header.service")}</th>
                        <th>{t("pricelist.table.header.duration")}</th>
                        <th>{t("pricelist.table.header.price")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.duration_min} perc</td>
                          <td>
                            {s.price_gross?.toLocaleString("hu-HU")} Ft
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {categories.size === 0 && (
                <p className="webshop-status">
                  {t("pricelist.noServicesForLocation")}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

function categoryLabelFromId(
  categoryId: string | null | undefined,
  t: (key: string) => string
): string {
  switch (String(categoryId)) {
    case "1":
      return t("pricelist.category.hair");
    case "2":
      return t("pricelist.category.cosmetics");
    case "3":
      return t("pricelist.category.manicure");
    case "4":
      return t("pricelist.category.pedicure");
    case "5":
      return t("pricelist.category.solarium");
    case "6":
      return t("pricelist.category.massage");
    case "7":
      return t("pricelist.category.other");
    default:
      return t("pricelist.category.fallback");
  }
}
