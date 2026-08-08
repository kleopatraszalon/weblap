import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchKioskContext, fetchKioskServices } from "./kioskApi";
import { KioskCartPanel } from "./KioskCartPanel";
import type { KioskCategory } from "./types";

const FALLBACK_IMAGES=["/kiosk/tiles/fodraszat.png","/kiosk/tiles/kez_es_labapolas.png","/kiosk/tiles/kozmetika.png","/kiosk/tiles/masszazs.png","/kiosk/tiles/testkezeles.png","/kiosk/tiles/wellness_fitness_szolarium.png"];
const slugify=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export function KioskLanding(){
  const nav=useNavigate();
  const[params]=useSearchParams();
  const queryLocation=params.get("location_id")||params.get("locationId")||"";
  const[locations,setLocations]=React.useState<{id:string;name:string}[]>([]);
  const[categories,setCategories]=React.useState<KioskCategory[]>([]);
  const[locationId,setLocationId]=React.useState(()=>queryLocation||localStorage.getItem("kiosk_location_id")||"");
  const[menu,setMenu]=React.useState<any>(null);
  const[loading,setLoading]=React.useState(true);
  const[error,setError]=React.useState("");
  const[started,setStarted]=React.useState(()=>sessionStorage.getItem("kiosk_started")==="1");

  React.useEffect(()=>{
    fetchKioskContext(locationId||undefined).then(d=>{
      setLocations(d.locations||[]);
      if(!locationId&&d.locations?.[0]?.id){
        setLocationId(d.locations[0].id);
        localStorage.setItem("kiosk_location_id",d.locations[0].id);
        window.dispatchEvent(new Event("kiosk-location-change"));
      }
    }).catch(e=>setError(e.message));
  },[]);

  React.useEffect(()=>{
    if(!locationId)return;
    setLoading(true);setError("");
    localStorage.setItem("kiosk_location_id",locationId);
    window.dispatchEvent(new Event("kiosk-location-change"));
    fetchKioskServices(localStorage.getItem("kiosk_lang")||"hu",locationId).then(svc=>{
      setCategories(svc.categories||[]);setMenu(svc.menu||null);
      if(svc.menu?.theme?.showStartScreen===false){sessionStorage.setItem("kiosk_started","1");setStarted(true)}
    }).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[locationId]);

  const theme=menu?.theme||{};
  const selectedLocation=locations.find(x=>x.id===locationId)?.name||"Kleopátra Szépségszalon";
  const start=()=>{sessionStorage.setItem("kiosk_started","1");setStarted(true)};
  function changeLocation(id:string){setLocationId(id);sessionStorage.removeItem("kiosk_started");setStarted(theme.showStartScreen===false)}
  function openCategory(c:KioskCategory){localStorage.setItem("kiosk_category_id",String(c.id));localStorage.setItem("kiosk_category_name",c.name);nav(`/kiosk/cat/${slugify(c.name)||c.id}`)}

  if(theme.showStartScreen!==false&&!started){return <section className="kiosk-start-screen">
    <div className="kiosk-start-media" style={{backgroundImage:`linear-gradient(180deg,rgba(18,12,8,.08),rgba(18,12,8,.62)),url(${theme.heroImageUrl||"/images/szolgaltatasok.jpg"})`}}>
      <div className="kiosk-start-brand"><img src={theme.logoUrl||"/images/kleo_logo@2x.png"} alt="Kleopátra"/><span>{selectedLocation}</span></div>
      <div className="kiosk-start-copy"><span className="kiosk-start-kicker">ÖNKISZOLGÁLÓ KIOSK</span><h1>{theme.startTitle||"Üdvözlünk a Kleopátra Szépségszalonban!"}</h1><p>{theme.startSubtitle||"Érintsd meg a képernyőt a szolgáltatás kiválasztásához."}</p></div>
      <div className="kiosk-start-actions">
        <label><span>Szalon</span><select value={locationId} onChange={e=>changeLocation(e.target.value)}>{locations.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <button className="kiosk-start-button" onClick={start}>{theme.startButtonText||"Kezdés"}<span>→</span></button>
      </div>
    </div>
  </section>}

  return <div className="kiosk-order-layout">
    <aside className="kiosk-category-rail">
      <div className="kiosk-location-card"><span>AKTUÁLIS SZALON</span><select value={locationId} onChange={e=>changeLocation(e.target.value)}>{locations.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
      <div className="kiosk-rail-title">Kategóriák</div>
      <div className="kiosk-rail-list">{categories.map((c,i)=><button key={c.id} onClick={()=>openCategory(c)}><img src={c.image_path||FALLBACK_IMAGES[i%FALLBACK_IMAGES.length]} alt=""/><span>{c.name}</span></button>)}</div>
    </aside>

    <section className="kiosk-catalog-home">
      <div className="kiosk-catalog-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(18,12,8,.82),rgba(18,12,8,.12)),url(${theme.heroImageUrl||"/images/szolgaltatasok.jpg"})`}}>
        <span>{selectedLocation}</span><h1>{theme.heroTitle||"Mit szeretnél ma?"}</h1><p>{theme.heroSubtitle||theme.welcomeText||"Válassz kategóriát, majd szolgáltatást néhány érintéssel."}</p>
      </div>
      {error&&<div className="kioskError">{error}</div>}
      {menu&&menu.is_active===false&&<div className="kioskError">Ennek a szalonnak a kiosk menüje jelenleg ki van kapcsolva.</div>}
      <div className="kiosk-section-heading"><div><span>1. LÉPÉS</span><h2>Válassz kategóriát</h2></div><p>Nagy érintőfelületek, gyors választás.</p></div>
      {loading?<div className="kioskInfo">Kiosk menü betöltése…</div>:<div className="kiosk-category-grid">
        {categories.map((c,i)=><button key={c.id} className="kiosk-category-card" onClick={()=>openCategory(c)}>
          <div className="kiosk-category-card-image"><img src={c.image_path||FALLBACK_IMAGES[i%FALLBACK_IMAGES.length]} alt={c.name}/></div>
          <div className="kiosk-category-card-copy"><h3>{c.name}</h3>{c.subtitle&&<p>{c.subtitle}</p>}<span>Megnézem <b>→</b></span></div>
        </button>)}
        {!categories.length&&menu?.is_active!==false&&<div className="kioskInfo">A kioskban jelenleg nincs engedélyezett szolgáltatás.</div>}
      </div>}
    </section>
    <KioskCartPanel/>
  </div>;
}
