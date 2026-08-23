import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { API_BASE } from "../apiClient";
import { useWebsiteCms } from "../websiteCms";

type Service = {
  id: string;
  name: string;
  duration_minutes?: number | null;
  department_name?: string | null;
  category_name?: string | null;
  base_price?: number | string | null;
  level_prices?: { normal?: number | null; top?: number | null; master?: number | null } | null;
};

type CategoryGroup = { name: string; services: Service[] };
type DepartmentGroup = { name: string; categories: CategoryGroup[] };

const CSS = String.raw`
.kleo-service-tree{display:grid;gap:18px;margin-top:30px}.kleo-department{border:1px solid #e8ddd5;border-radius:20px;background:#fff;overflow:hidden;box-shadow:0 10px 30px rgba(26,17,12,.035)}.kleo-department>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 24px;cursor:pointer}.kleo-department>summary::-webkit-details-marker,.kleo-category>summary::-webkit-details-marker{display:none}.kleo-department>summary h2{margin:0;font-size:clamp(24px,3vw,38px)}.kleo-department>summary span,.kleo-category>summary span{font-size:11px;color:#786e67;font-weight:800}.kleo-department>summary::after,.kleo-category>summary::after{content:"＋";font-size:20px}.kleo-department[open]>summary::after,.kleo-category[open]>summary::after{content:"−"}.kleo-department__body{padding:0 24px 24px}.kleo-category{border-top:1px solid #eee5de}.kleo-category>summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:17px 2px;cursor:pointer;list-style:none}.kleo-category>summary h3{margin:0;font-size:18px}.kleo-service-list{display:grid;gap:8px;padding:0 0 18px}.kleo-service-row{display:grid;grid-template-columns:minmax(220px,1.6fr) 105px repeat(3,110px) 34px;gap:0;align-items:stretch;border:1px solid #eee5dd;border-radius:13px;overflow:hidden;text-decoration:none;color:inherit;background:#fff}.kleo-service-row:hover{border-color:#ec008c}.kleo-service-row>span{padding:13px 12px;border-right:1px solid #f0e9e3;display:flex;align-items:center}.kleo-service-row>span:last-child{border-right:0}.kleo-service-row__name{display:block!important}.kleo-service-row__name strong,.kleo-service-row__name small{display:block}.kleo-service-row__name small{margin-top:4px;color:#7a716a;font-size:10px}.kleo-service-row__price{font-weight:800;font-size:12px}.kleo-service-row__arrow{justify-content:center;color:#ec008c;font-size:18px}.kleo-service-head{display:grid;grid-template-columns:minmax(220px,1.6fr) 105px repeat(3,110px) 34px;color:#756b64;font-size:9px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:0 1px 7px}.kleo-service-head span{padding:0 12px}.kleo-service-loading{padding:24px;border:1px solid #eadfd5;border-radius:16px;background:#fff}.kleo-service-note{margin-top:18px;color:#746a63;font-size:12px;line-height:1.6}@media(max-width:850px){.kleo-service-head{display:none}.kleo-service-row{grid-template-columns:1fr repeat(3,minmax(80px,.5fr)) 34px}.kleo-service-row>span:nth-child(2){display:none}.kleo-service-row__name small{display:block}}@media(max-width:620px){.kleo-department>summary,.kleo-department__body{padding-left:16px;padding-right:16px}.kleo-service-row{grid-template-columns:1fr 34px}.kleo-service-row__price{display:none!important}.kleo-service-row__name small::after{content:" · Árak a részletes oldalon"}}
`;

const DEPARTMENT_ORDER = ["Fodrászat", "Kéz- és lábápolás", "Kozmetika", "Masszázs"];
const money = (value: number | string | null | undefined) => {
  const number = Number(value || 0);
  return number > 0 ? `${Math.round(number).toLocaleString("hu-HU")} Ft` : "—";
};
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const normalizeDepartment = (name?: string | null) => {
  const value = (name || "Egyéb szolgáltatások").trim();
  const low = value.toLowerCase();
  if (low.includes("fodrás") || low.includes("haj")) return "Fodrászat";
  if (low.includes("kéz") || low.includes("láb") || low.includes("köröm") || low.includes("manik") || low.includes("pedik")) return "Kéz- és lábápolás";
  if (low.includes("kozmet") || low.includes("arc") || low.includes("szemp") || low.includes("szemöld")) return "Kozmetika";
  if (low.includes("massz")) return "Masszázs";
  return value;
};

const FALLBACK: Service[] = [
  { id: "balayage", name: "Balayage", department_name: "Fodrászat", category_name: "Hajfestés" },
  { id: "hajvagas", name: "Női hajvágás", department_name: "Fodrászat", category_name: "Hajvágás" },
  { id: "alkalmi-frizura", name: "Alkalmi frizura", department_name: "Fodrászat", category_name: "Alkalmi frizura" },
  { id: "gellakk", name: "Géllakk", department_name: "Kéz- és lábápolás", category_name: "Géllakk" },
  { id: "japan-manikur", name: "Japán manikűr", department_name: "Kéz- és lábápolás", category_name: "Manikűr" },
  { id: "arckezelesek", name: "Arckezelések", department_name: "Kozmetika", category_name: "Arckezelések" },
  { id: "szempillalifting", name: "Szempilla lifting", department_name: "Kozmetika", category_name: "Szempilla" },
  { id: "relax-masszazs", name: "Relaxáló masszázs", department_name: "Masszázs", category_name: "Relaxáló masszázs" },
];

export const ServicesPage: React.FC = () => {
  const { pages } = useWebsiteCms();
  const p = pages.services;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/public/booking/v4/pricelist`, { credentials: "include" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.detail || data?.error || "Az árlista nem tölthető be.");
        return data;
      })
      .then((data) => { if (active) setServices(Array.isArray(data.services) ? data.services : []); })
      .catch((error) => { if (active) setLoadError(error?.message || "Az árlista átmenetileg nem érhető el."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const groups = useMemo<DepartmentGroup[]>(() => {
    const source = services.length ? services : FALLBACK;
    const departments = new Map<string, Map<string, Service[]>>();
    source.forEach((service) => {
      const department = normalizeDepartment(service.department_name);
      const category = (service.category_name || "További szolgáltatások").trim();
      if (!departments.has(department)) departments.set(department, new Map());
      const categories = departments.get(department)!;
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category)!.push(service);
    });
    return Array.from(departments.entries())
      .map(([name, categories]) => ({
        name,
        categories: Array.from(categories.entries())
          .map(([categoryName, categoryServices]) => ({ name: categoryName, services: [...categoryServices].sort((a, b) => a.name.localeCompare(b.name, "hu")) }))
          .sort((a, b) => a.name.localeCompare(b.name, "hu")),
      }))
      .sort((a, b) => {
        const ai = DEPARTMENT_ORDER.indexOf(a.name);
        const bi = DEPARTMENT_ORDER.indexOf(b.name);
        if (ai >= 0 || bi >= 0) return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
        return a.name.localeCompare(b.name, "hu");
      });
  }, [services]);

  return <main>
    <style>{CSS}</style>
    <PublicPageHero
      eyebrow={p.eyebrow}
      title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>}
      lead={<p>{p.lead}</p>}
      image={p.imageUrl}
      imageAlt="Kleopátra Szépségszalon szolgáltatások"
      actions={<><NavLink to="/prices" className="btn btn-primary">Teljes árlista</NavLink><NavLink to="/booking" className="btn btn-outline">Időpontfoglalás</NavLink></>}
    />

    <section className="public-section"><div className="container">
      <header className="public-section__header">
        <p className="section-eyebrow">Részleg → kategória → szolgáltatás</p>
        <h2>Átlátható, háromszintű szolgáltatásrendszer</h2>
        <p>Nyisd le először a fő részleget, azon belül a kategóriát, majd válaszd ki a konkrét szolgáltatást. A foglalható szolgáltatások saját oldalt kapnak, így közvetlenül használhatók keresőből és hirdetésekből is.</p>
      </header>

      {loading && <div className="kleo-service-loading">Aktuális szolgáltatások és árak betöltése…</div>}
      <div className="kleo-service-tree">
        {groups.map((department, departmentIndex) => (
          <details className="kleo-department" key={department.name} open={departmentIndex === 0}>
            <summary><h2>{department.name}</h2><span>{department.categories.reduce((sum, category) => sum + category.services.length, 0)} szolgáltatás</span></summary>
            <div className="kleo-department__body">
              {department.categories.map((category, categoryIndex) => (
                <details className="kleo-category" key={`${department.name}-${category.name}`} open={departmentIndex === 0 && categoryIndex === 0}>
                  <summary><h3>{category.name}</h3><span>{category.services.length} tétel</span></summary>
                  <div className="kleo-service-head"><span>Szolgáltatás</span><span>Időtartam</span><span>Normál</span><span>TOP</span><span>Master</span><span /></div>
                  <div className="kleo-service-list">
                    {category.services.map((service) => {
                      const normal = service.level_prices?.normal ?? service.base_price;
                      return <NavLink key={service.id || service.name} to={`/szolgaltatasok/${slugify(service.name)}`} className="kleo-service-row">
                        <span className="kleo-service-row__name"><strong>{service.name}</strong><small>{category.name}{service.duration_minutes ? ` · ${service.duration_minutes} perc` : ""}</small></span>
                        <span>{service.duration_minutes ? `${service.duration_minutes} perc` : "—"}</span>
                        <span className="kleo-service-row__price">{money(normal)}</span>
                        <span className="kleo-service-row__price">{money(service.level_prices?.top)}</span>
                        <span className="kleo-service-row__price">{money(service.level_prices?.master)}</span>
                        <span className="kleo-service-row__arrow">→</span>
                      </NavLink>;
                    })}
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
      {loadError && <p className="kleo-service-note">Az élő árlista most nem volt elérhető, ezért az alap szolgáltatási struktúrát mutatjuk. Az aktuális árakhoz használd az Árlista oldalt.</p>}
    </div></section>

    <section className="public-section public-section--soft"><div className="container public-cta"><div><h2>Megtaláltad a szolgáltatást?</h2><p>A részletes oldalon elolvashatod, mit jelent a kezelés, kinek ajánlott, megnézheted a Normál, TOP és Master árakat, majd közvetlenül foglalhatsz.</p></div><div className="public-page-hero__actions"><NavLink to="/prices" className="btn btn-outline">Árak összehasonlítása</NavLink><NavLink to="/booking" className="btn btn-primary">Foglalok</NavLink></div></div></section>
  </main>;
};
