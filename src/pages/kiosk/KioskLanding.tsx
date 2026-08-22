import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchKioskContext, fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { KioskCartPanel } from "./KioskCartPanel";
import { AiBeautyAdvisor } from "./AiBeautyAdvisor";
import { addToCart } from "./cartStore";
import type { KioskCategory, KioskProduct, KioskService } from "./types";

const FALLBACK_IMAGES=["/kiosk/tiles/fodraszat.png","/kiosk/tiles/kez_es_labapolas.png","/kiosk/tiles/kozmetika.png","/kiosk/tiles/masszazs.png","/kiosk/tiles/testkezeles.png","/kiosk/tiles/wellness_fitness_szolarium.png"];
const slugify=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export function KioskLanding(){
  const nav=useNavigate();const[params]=useSearchParams();const previewLocation=params.get("location_id")||params.get("locationId")||"";
  const[serviceCategories,setServiceCategories]=React.useState<KioskCategory[]>([]);const[productCategories,setProductCategories]=React.useState<KioskCategory[]>([]);
  const[services,setServices]=React.useState<KioskService[]>([]);const[products,setProducts]=React.useState<KioskProduct[]>([]);
  const[locationId,setLocationId]=React.useState(previewLocation||"");const[locationName,setLocationName]=React.useState("Gyöngyös");const[menu,setMenu]=React.useState<any>(null);
  const[loading,setLoading]=React.useState(true);const[error,setError]=React.useState("");const[started,setStarted]=React.useState(()=>sessionStorage.getItem("kiosk_started")==="1");

  React.useEffect(()=>{(async()=>{try{
    setLoading(true);setError("");
    const ctx=await fetchKioskContext(previewLocation||undefined);const bound=ctx.bound_location||ctx.locations?.[0];if(!bound)throw new Error("A Gyöngyös kiosk telephelye nem található.");
    setLocationId(bound.id);setLocationName(bound.name);localStorage.setItem("kiosk_location_id",bound.id);window.dispatchEvent(new Event("kiosk-location-change"));
    const[svc,prod]=await Promise.all([fetchKioskServices(localStorage.getItem("kiosk_lang")||"hu",bound.id),fetchKioskProducts(bound.id)]);
    setServiceCategories(svc.categories||[]);setProductCategories(prod.categories||[]);setServices(svc.services||[]);setProducts(prod.products||[]);setMenu(svc.menu||prod.menu||null);
    if((svc.menu||prod.menu)?.theme?.showStartScreen===false){sessionStorage.setItem("kiosk_started","1");setStarted(true)}
  }catch(e:any){setError(e?.message||"A kiosk menü nem tölthető be.")}finally{setLoading(false)}})()},[previewLocation]);

  const theme=menu?.theme||{};const start=()=>{sessionStorage.setItem("kiosk_started","1");setStarted(true)};
  const layoutOrder=(Array.isArray(theme.layoutOrder)?theme.layoutOrder:["hero","services","products"]).filter((x:string)=>["hero","services","products"].includes(x));
  const visible=(key:string)=>theme.layoutVisibility?.[key]!==false;
  function openCategory(c:KioskCategory,type:"service"|"product"){localStorage.setItem("kiosk_category_id",String(c.id));localStorage.setItem("kiosk_category_name",c.name);localStorage.setItem("kiosk_catalog_type",type);nav(`/kiosk/cat/${slugify(c.name)||c.id}`)}

  if(theme.showStartScreen!==false&&!started){return <section className="kiosk-start-screen"><div className="kiosk-start-media" style={{backgroundImage:`linear-gradient(180deg,rgba(18,12,8,.08),rgba(18,12,8,.62)),url(${theme.heroImageUrl||"/images/szolgaltatasok.jpg"})`}}><div className="kiosk-pearl-stage" aria-hidden="true"><div className="kiosk-pearl-aura kiosk-pearl-aura-one"/><div className="kiosk-pearl-aura kiosk-pearl-aura-two"/><div className="kiosk-pearl-orbit"><i/><i/><i/></div><div className="kiosk-pearl-portrait"><img src="/images/home.png" alt=""/></div><div className="kiosk-pearl-chip kiosk-pearl-chip-ai"><span>✦</span><b>AI BEAUTY LAB</b><small>Személyes rutin 2 perc alatt</small></div><div className="kiosk-pearl-chip kiosk-pearl-chip-live"><i/><b>ÉLŐ SZALON</b><small>Gyöngyös · ma nyitva</small></div><div className="kiosk-pearl-index">K / 2026</div></div><div className="kiosk-start-brand"><img src={theme.logoUrl||"/images/kleo_logo@2x.png"} alt="Kleopátra"/><span>{locationName}</span></div><div className="kiosk-start-copy"><span className="kiosk-start-kicker">ÖNKISZOLGÁLÓ KIOSK · GYÖNGYÖS</span><h1>{theme.startTitle||"Üdvözlünk a Kleopátra Szépségszalonban!"}</h1><p>{theme.startSubtitle||"Érintsd meg a képernyőt a választás megkezdéséhez."}</p><div className="kiosk-pearl-services"><span>HAJ</span><span>BŐR</span><span>KÖRÖM</span><span>WELLNESS</span></div></div><div className="kiosk-start-actions"><div className="kiosk-fixed-location"><span>HELYSZÍN</span><b>{locationName}</b></div><button className="kiosk-start-button" onClick={start}>{theme.startButtonText||"Kezdés"}<span>→</span></button></div></div></section>}

  const rail=[...serviceCategories.map(c=>({...c,type:"service" as const})),...(theme.showProducts!==false?productCategories.map(c=>({...c,type:"product" as const})):[])];
  return <div className="kiosk-order-layout" style={{"--kiosk-radius":`${Number(theme.cardRadius||24)}px`} as React.CSSProperties}>
    <aside className="kiosk-category-rail"><div className="kiosk-location-card"><span>TELEPÍTETT KIOSK</span><strong>{locationName}</strong><small>Gyöngyös szalon</small></div><div className="kiosk-rail-title">Menü</div><div className="kiosk-rail-list">{rail.map((c,i)=><button key={`${c.type}-${c.id}`} onClick={()=>openCategory(c,c.type)}><img src={c.image_path||FALLBACK_IMAGES[i%FALLBACK_IMAGES.length]} alt=""/><span>{c.name}</span><small>{c.type==="product"?"TERMÉK":"SZOLGÁLTATÁS"}</small></button>)}</div></aside>
    <section className="kiosk-catalog-home">
      {error&&<div className="kioskError">{error}</div>}{menu&&menu.is_active===false&&<div className="kioskError">A Gyöngyös kiosk menüje jelenleg ki van kapcsolva.</div>}
      {loading&&<div className="kioskInfo">Gyöngyös kiosk menü betöltése…</div>}
      {!loading&&<AiBeautyAdvisor products={products} services={services} onProduct={p=>addToCart({id:p.id,title:p.name_hu||p.name,price:Number(p.sale_price??p.retail_price_gross??0),meta:{kind:"product",category_id:p.category_id,image_url:p.image_url||p.category_image}},1)} onService={s=>addToCart({id:s.id,title:s.name_hu||s.name,price:Number(s.list_price??s.base_price??0),meta:{kind:"service",duration:s.duration_minutes,category_id:s.category_id,image_url:s.image_url||s.category_image}},1)}/>}
      {!loading&&layoutOrder.filter(visible).map((block:string)=>block==="hero"?<div key={block} className="kiosk-catalog-hero" style={{backgroundImage:`linear-gradient(100deg,rgba(20,9,15,.88),rgba(20,9,15,.18)),url(${theme.heroImageUrl||"/images/szolgaltatasok.jpg"})`}}><div className="kiosk-live-pill"><i/> MA NYITVA · AZONNALI VÁLASZTÁS</div><span>{locationName} · BEAUTY STUDIO</span><h1>{theme.heroTitle||"A szépségélmény, ami rád hangolódik."}</h1><p>{theme.heroSubtitle||theme.welcomeText||"Válassz szolgáltatást, fedezz fel professzionális termékeket, vagy kérj személyes AI-ajánlást."}</p><div className="kiosk-hero-stats"><b>4.9 <small>★ vendégértékelés</small></b><b>2 perc <small>AI rutinajánló</small></b></div></div>:block==="services"?<CatalogBlock key={block} kicker="SZOLGÁLTATÁSOK" title="Válassz szolgáltatáscsoportot" categories={serviceCategories} fallbackOffset={0} onOpen={c=>openCategory(c,"service")} columns={Number(theme.categoryColumns||2)}/>:theme.showProducts!==false?<CatalogBlock key={block} kicker="KLEOSHOP" title="Professzionális otthoni ápolás" categories={productCategories} fallbackOffset={3} onOpen={c=>openCategory(c,"product")} columns={Number(theme.productColumns||theme.categoryColumns||2)}/>:null)}
    </section><KioskCartPanel/>
  </div>;
}

function CatalogBlock({kicker,title,categories,fallbackOffset,onOpen,columns}:{kicker:string;title:string;categories:KioskCategory[];fallbackOffset:number;onOpen:(c:KioskCategory)=>void;columns:number}){
  return <section className="kiosk-home-menu-block"><div className="kiosk-section-heading"><div><span>{kicker}</span><h2>{title}</h2></div><p>{categories.length} csoport</p></div><div className="kiosk-category-grid" style={{gridTemplateColumns:`repeat(${Math.max(1,Math.min(3,columns))},minmax(0,1fr))`}}>{categories.map((c,i)=><button key={c.id} className="kiosk-category-card" onClick={()=>onOpen(c)}><div className="kiosk-category-card-image"><img src={c.image_path||FALLBACK_IMAGES[(i+fallbackOffset)%FALLBACK_IMAGES.length]} alt={c.name}/></div><div className="kiosk-category-card-copy"><h3>{c.name}</h3>{c.subtitle&&<p>{c.subtitle}</p>}<span>Megnézem <b>→</b></span></div></button>)}{!categories.length&&<div className="kioskInfo">Ebben a menüben jelenleg nincs aktív csoport.</div>}</div></section>
}
