// src/pages/PriceListPage.tsx
import React, { useEffect, useState } from "react";
import { getPublicServices, PublicService } from "../apiClient";

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
        console.error(err);
        setError("Nem sikerült betölteni a szolgáltatásokat.");
      })
      .finally(() => setLoading(false));
  }, []);

  // SZŰRÉS TELEPHELY SZERINT (location_id alapján)
  const filteredServices =
    selectedLocationId == null
      ? allServices
      : allServices.filter((s) => s.location_id === selectedLocationId);

  // KATEGÓRIÁKRA BONTVA (category_id alapján)
  const groupedByCategory: Record<string, PublicService[]> = {};
  filteredServices.forEach((s) => {
    const key = s.category_id?.toString() ?? "egyéb";
    if (!groupedByCategory[key]) groupedByCategory[key] = [];
    groupedByCategory[key].push(s);
  });

  const locationLabel =
    LOCATIONS.find((l) => l.id === selectedLocationId)?.label ||
    "Összes szalon";

  return (
    <main>
      <section className="section section--pricelist">
        <div className="container pricelist-block">
          {/* FEJLÉC */}
          <header className="pricelist-header">
            <p className="section-eyebrow">Szolgáltatásaink</p>
            <h1>Árlista és szolgáltatások</h1>
            <p className="hero-lead hero-lead--narrow">
              Válaszd ki a hozzád legközelebb eső Kleopátra Szépségszalont, és
              nézd meg az ott elérhető szolgáltatásokat.
            </p>
          </header>

          {/* HERO KÉP – szolgaltatasok.png, finoman animálva */}
          <div className="services-hero-image">
            <img
              src="/images/szolgaltatasok.png"
              alt="Kleopátra Szépségszalon – Szolgáltatások"
              className="services-hero-image__img"
            />
          </div>

          {/* TELEPHELYVÁLASZTÓ */}
          <div className="pricelist-location-filter">
            <label htmlFor="location-select">Telephely kiválasztása:</label>
            <select
              id="location-select"
              value={selectedLocationId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedLocationId(v === "" ? null : Number(v));
              }}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id ?? "all"} value={loc.id ?? ""}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* ÁLLAPOT ÜZENETEK */}
          {loading && <p>Betöltés...</p>}
          {error && <p className="form-msg form-msg--error">{error}</p>}

          {/* SZOLGÁLTATÁS LISTA */}
          {!loading && !error && (
            <div className="pricelist-content">
              <p className="pricelist-location-label">
                Jelenleg: <strong>{locationLabel}</strong>
              </p>

              {Object.keys(groupedByCategory).length === 0 && (
                <p>Nincs megjeleníthető szolgáltatás.</p>
              )}

              {Object.keys(groupedByCategory).map((catKey) => {
                const items = groupedByCategory[catKey];
                if (!items || items.length === 0) return null;

                return (
                  <section key={catKey} className="pricelist-category">
                    <h2 className="pricelist-category__title">
                      {categoryLabelFromId(catKey)}
                    </h2>
                    <div className="pricelist-category__table">
                      {items.map((s) => (
                        <div key={s.id} className="pricelist-row">
                          <div className="pricelist-row__name">{s.name}</div>
                          <div className="pricelist-row__duration">
                            {s.duration_min
                              ? `${s.duration_min} perc`
                              : "\u00A0"}
                          </div>
                          <div className="pricelist-row__price">
                            {s.price != null
                              ? `${s.price.toLocaleString("hu-HU")} Ft`
                              : "egyedi ár"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// Kategória címkék – az első oszlopodban lévő számok szerint
function categoryLabelFromId(id: string): string {
  switch (id) {
    case "1":
      return "Fodrászat";
    case "2":
      return "Kozmetika";
    case "3":
      return "Manikűr / műköröm";
    case "4":
      return "Pedikűr";
    case "5":
      return "Szolárium";
    case "6":
      return "Masszázs";
    case "7":
      return "Egyéb / kiegészítők";
    default:
      return "Egyéb szolgáltatások";
  }
}
