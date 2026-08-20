import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { API_BASE } from "../apiClient";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";
import { SERVICE_PAGES } from "../data/servicePages";
import { EXTRA_SERVICE_PAGES } from "../data/serviceSeoExtras";

type Location = { id: string; name: string };
type PriceService = {
  id: string; name: string; duration_minutes: number; category_name: string;
  department_code: "hair"|"handsfeet"|"beauty"|"massage"; department_name: string; base_price: number|string;
  level_prices?: { trainee?: number|null; normal?: number|null; top?: number|null; master?: number|null };
};

const DEPARTMENTS = [
  ["", "Összes részleg"], ["hair", "Fodrászat"], ["handsfeet", "Kéz- és lábápolás"], ["beauty", "Kozmetika"], ["massage", "Masszázs"],
] as const;
const SEO_SERVICE_PAGES=[...SERVICE_PAGES,...EXTRA_SERVICE_PAGES];
const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const serviceSlug=(name:string)=>{
  const n=normalize(name);
  if(n.includes("gel-lakk")||n.includes("gellakk"))return "gellakk";
  if(n.includes("japan")&&n.includes("manikur"))return "japan-manikur";
  const exact=SEO_SERVICE_PAGES.find(p=>normalize(p.title)===n||normalize(p.slug)===n);
  if(exact)return exact.slug;
  const partial=SEO_SERVICE_PAGES.find(p=>n.includes(normalize(p.title))||normalize(p.title).includes(n));
  return partial?.slug||n;
};
const money=(v:number|null|undefined)=>v==null?"—":`${Math.round(Number(v)).toLocaleString("hu-HU")} Ft`;

const CSS=`
.price-v4-filters{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:18px 0 22px}.price-v4-filters label{display:grid;gap:6px;font-size:11px;font-weight:800;color:#625a53}.price-v4-filters select,.price-v4-filters input{height:48px;padding:0 12px;border:1px solid #ded4ca;border-radius:11px;background:#fff;font:600 12px Montserrat,Arial,sans-serif}
.price-v4-departments,.price-v4-categories{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.price-v4-departments button,.price-v4-categories button{border:1px solid #e5dbd2;border-radius:999px;padding:9px 13px;background:#fff;font-weight:750;cursor:pointer}.price-v4-departments button.active{background:#17100d;color:#fff;border-color:#17100d}.price-v4-categories{margin-top:8px}.price-v4-categories button{font-size:11px;padding:8px 11px}.price-v4-categories button.active{background:#ec008c;color:#fff;border-color:#ec008c}.price-v4-filter-label{margin:18px 0 0;color:#8c7766;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.price-v4-table{overflow-x:auto;border:1px solid #e8ded5;border-radius:18px;background:#fff}.price-v4-head,.price-v4-row{display:grid;grid-template-columns:minmax(250px,2fr) 100px repeat(3,minmax(120px,1fr));gap:0;min-width:850px;align-items:center}.price-v4-head{background:#f8f3ee;color:#6f655e;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.06em}.price-v4-head>div,.price-v4-row>div{padding:13px 15px;border-right:1px solid #eee5dd}.price-v4-head>div:last-child,.price-v4-row>div:last-child{border-right:0}.price-v4-row{border-top:1px solid #eee5dd;font-size:12px}.price-v4-row a{color:#17100d;font-weight:800;text-decoration:none}.price-v4-row a:hover{color:#ec008c;text-decoration:underline}.price-v4-price{font-weight:750;text-align:right}.price-v4-category{margin-top:28px}.price-v4-category h3{margin:0 0 10px;font-size:19px}.price-v4-category small{color:#857b73}.price-v4-count{color:#796f68;font-size:12px;margin:10px 0 0}.price-v4-head>div:first-child{position:sticky;left:0;z-index:3;background:#f8f3ee}.price-v4-row>div:first-child{position:sticky;left:0;z-index:2;background:#fff}
@media(max-width:850px){.price-v4-filters{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.price-v4-filters{grid-template-columns:1fr}.price-v4-departments,.price-v4-categories{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.price-v4-departments::-webkit-scrollbar,.price-v4-categories::-webkit-scrollbar{display:none}.price-v4-departments button,.price-v4-categories button{white-space:nowrap}}
`;

export const PriceListPage: React.FC = () => {
  const { pages }=useWebsiteCms(); const p=pages.prices;
  const [locations,setLocations]=useState<Location[]>([]); const [services,setServices]=useState<PriceService[]>([]);
  const [locationId,setLocationId]=useState(""); const [department,setDepartment]=useState(""); const [category,setCategory]=useState(""); const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");

  useEffect(()=>{
    setLoading(true);setError("");
    const q=locationId?`?location_id=${encodeURIComponent(locationId)}`:"";
    fetch(`${API_BASE}/api/public/booking/v4/pricelist${q}`,{credentials:"include"}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Az árlista nem tölthető be.");return d;})
      .then(d=>{setLocations(d.locations||[]);setServices(d.services||[]);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[locationId]);

  const categories=useMemo(()=>Array.from(new Set(services.filter(s=>!department||s.department_code===department).map(s=>s.category_name).filter(Boolean))).sort((a,b)=>a.localeCompare(b,"hu")),[services,department]);
  useEffect(()=>{if(category&&!categories.includes(category))setCategory("");},[category,categories]);
  const filtered=useMemo(()=>services.filter(s=>(!department||s.department_code===department)&&(!category||s.category_name===category)&&(!search||normalize(s.name).includes(normalize(search)))),[services,department,category,search]);
  const grouped=useMemo(()=>filtered.reduce<Record<string,PriceService[]>>((acc,s)=>{(acc[s.category_name||"Egyéb"]??=[]).push(s);return acc;},{}),[filtered]);
  const locationName=locations.find(l=>l.id===locationId)?.name||"Összes szalon";

  return <main><style>{CSS}</style>
    <PublicPageHero eyebrow={p.eyebrow} title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>} lead={<p>A teljes árlistát itt önállóan böngészheted. Szűrj részlegre, kategóriára vagy szalonra, és hasonlítsd össze egy helyen a Normál, TOP és Master szakemberi árakat.</p>} image={p.imageUrl} imageAlt="Kleopátra árlista és szolgáltatások" actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/services" className="btn btn-outline">Szolgáltatások</NavLink></>} />
    <section className="public-section"><div className="container pricelist-block">
      <header className="public-section__header"><p className="section-eyebrow">Böngészhető árlista</p><h2>Találd meg gyorsan a szolgáltatást és a megfelelő árkategóriát</h2><p>Először válassz részleget, utána akár egy konkrét kategóriát. A szolgáltatás nevére kattintva megnyílik a részletes szolgáltatásoldal; az árlista maga szándékosan tömör marad.</p></header>
      <div className="notice-card">Az árak forintban értendők. A TOP és Master oszlop csak ott mutat külön összeget, ahol az adott szakemberszinthez külön ár van beállítva. A foglaláskor a rendszer a kiválasztott szalon és szakember alapján véglegesíti az aktuális árat.</div>
      <p className="price-v4-filter-label">1. Részleg</p>
      <div className="price-v4-departments">{DEPARTMENTS.map(([code,label])=><button key={code||"all"} type="button" className={department===code?"active":""} onClick={()=>{setDepartment(code);setCategory("")}}>{label}</button>)}</div>
      {categories.length>0&&<><p className="price-v4-filter-label">2. Kategória</p><div className="price-v4-categories"><button type="button" className={!category?"active":""} onClick={()=>setCategory("")}>Összes</button>{categories.map(c=><button type="button" className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div></>}
      <div className="price-v4-filters">
        <label>Szalon<select value={locationId} onChange={e=>setLocationId(e.target.value)}><option value="">Összes szalon</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
        <label>Részleg<select value={department} onChange={e=>{setDepartment(e.target.value);setCategory("")}}>{DEPARTMENTS.map(([code,label])=><option key={code||"all"} value={code}>{label}</option>)}</select></label>
        <label>Kategória<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Összes kategória</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></label>
        <label>Keresés<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="pl. balayage, géllakk…" /></label>
      </div>
      {loading&&<div className="notice-card">Árlista betöltése…</div>}{error&&<div className="notice-card form-msg--error">{error}</div>}
      {!loading&&!error&&<><p className="price-v4-count"><strong>{filtered.length}</strong> szolgáltatás · {locationName}</p>{!filtered.length&&<div className="notice-card">Ehhez a szűréshez jelenleg nincs találat.</div>}{Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b,"hu")).map(([cat,items])=><section className="price-v4-category" key={cat}><h3>{cat} <small>· {items[0]?.department_name}</small></h3><div className="price-v4-table"><div className="price-v4-head"><div>Szolgáltatás</div><div>Időtartam</div><div>Normál</div><div>TOP</div><div>Master</div></div>{items.map(s=><div className="price-v4-row" key={s.id}><div><NavLink to={`/szolgaltatasok/${serviceSlug(s.name)}`}>{s.name}</NavLink></div><div>{s.duration_minutes?`${s.duration_minutes} perc`:"—"}</div><div className="price-v4-price">{money(s.level_prices?.normal??Number(s.base_price||0))}</div><div className="price-v4-price">{money(s.level_prices?.top)}</div><div className="price-v4-price">{money(s.level_prices?.master)}</div></div>)}</div></section>)}</>}
    </div></section>
    <section className="public-section public-section--soft"><div className="container public-cta"><div><h2>Megtaláltad, amit keresel?</h2><p>A részletes szolgáltatásoldalról vagy innen közvetlenül is továbbléphetsz a Booking 4.0 foglalóba.</p></div><NavLink to="/booking" className="btn btn-primary">Foglalás indítása</NavLink></div></section>
  </main>;
};
