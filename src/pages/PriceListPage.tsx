import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getPublicServices, PublicService } from "../apiClient";
import PublicPageHero from "../components/PublicPageHero";

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
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicServices()
      .then(setAllServices)
      .catch((err) => {
        console.error(err);
        setError("Nem sikerült betölteni a szolgáltatásokat. Kérjük, próbáld meg később.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = selectedLocationId == null
    ? allServices
    : allServices.filter((s) => s.location_id === selectedLocationId);

  const groupedByCategory: Record<string, PublicService[]> = {};
  filteredServices.forEach((s) => {
    const key = s.category_id?.toString() ?? "egyéb";
    if (!groupedByCategory[key]) groupedByCategory[key] = [];
    groupedByCategory[key].push(s);
  });

  const locationLabel = LOCATIONS.find((l) => l.id === selectedLocationId)?.label || "Összes szalon";

  return (
    <main>
      <PublicPageHero
        eyebrow="Árlista"
        title={<>Aktuális szolgáltatások és <span className="highlight">árak</span></>}
        lead={<p>Válaszd ki a szalont, és nézd meg az ott elérhető szolgáltatásokat, időtartamokat és árakat. A lista a központi rendszer aktuális adataiból töltődik.</p>}
        image="/images/szolgaltatasok.jpg"
        imageAlt="Kleopátra árlista és szolgáltatások"
        actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/salons" className="btn btn-outline">Szalonjaink</NavLink></>}
      />

      <section className="public-section">
        <div className="container pricelist-block">
          <div className="notice-card">
            Az árak forintban értendők. Az időszakos kedvezmények, kuponok, bérletek és egyéb promóciók feltételei eltérhetnek, ezért a foglaláskor és a szalonban megjelenő aktuális információ az irányadó.
          </div>

          <div className="pricelist-location-filter">
            <label htmlFor="location-select">Szalon kiválasztása</label>
            <select id="location-select" value={selectedLocationId ?? ""} onChange={(e) => {
              const v = e.target.value;
              setSelectedLocationId(v === "" ? null : Number(v));
            }}>
              {LOCATIONS.map((loc) => <option key={loc.id ?? "all"} value={loc.id ?? ""}>{loc.label}</option>)}
            </select>
          </div>

          {loading && <div className="notice-card">Szolgáltatások betöltése…</div>}
          {error && <div className="notice-card form-msg--error">{error}</div>}

          {!loading && !error && (
            <div className="pricelist-content">
              <p className="pricelist-location-label">Megjelenített árlista: <strong>{locationLabel}</strong></p>
              {Object.keys(groupedByCategory).length === 0 && <div className="notice-card">Ehhez a szűréshez jelenleg nincs megjeleníthető szolgáltatás.</div>}
              {Object.keys(groupedByCategory).map((catKey) => {
                const items = groupedByCategory[catKey];
                if (!items?.length) return null;
                return (
                  <section key={catKey} className="pricelist-category">
                    <h2 className="pricelist-category__title">{categoryLabelFromId(catKey)}</h2>
                    <div className="pricelist-category__table">
                      {items.map((s) => (
                        <div key={s.id} className="pricelist-row">
                          <div className="pricelist-row__name">{s.name}</div>
                          <div className="pricelist-row__duration">{s.duration_min ? `${s.duration_min} perc` : ""}</div>
                          <div className="pricelist-row__price">{s.price != null ? `${Number(s.price).toLocaleString("hu-HU")} Ft` : "egyedi ár"}</div>
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

      <section className="public-section public-section--soft">
        <div className="container public-cta">
          <div><h2>Megtaláltad a szolgáltatást?</h2><p>A foglalóban kiválaszthatod a szalont, a szolgáltatást, a szakembert és a szabad időpontot.</p></div>
          <NavLink to="/booking" className="btn btn-primary">Foglalás indítása</NavLink>
        </div>
      </section>
    </main>
  );
};

function categoryLabelFromId(id: string): string {
  switch (id) {
    case "1": return "Fodrászat";
    case "2": return "Kozmetika";
    case "3": return "Manikűr / műköröm";
    case "4": return "Pedikűr";
    case "5": return "Szolárium";
    case "6": return "Masszázs";
    case "7": return "Egyéb / kiegészítők";
    default: return "Egyéb szolgáltatások";
  }
}
