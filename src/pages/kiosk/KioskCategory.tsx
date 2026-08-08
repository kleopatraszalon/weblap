import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { addToCart } from "./cartStore";
import { KioskCartPanel } from "./KioskCartPanel";
import type { KioskCategory, KioskProduct, KioskService } from "./types";

const FALLBACK_IMAGES=["/kiosk/tiles/fodraszat.png","/kiosk/tiles/kez_es_labapolas.png","/kiosk/tiles/kozmetika.png","/kiosk/tiles/masszazs.png","/kiosk/tiles/testkezeles.png","/kiosk/tiles/wellness_fitness_szolarium.png"];
function lang(): "hu" | "en" | "ru" { const v=localStorage.getItem("kiosk_lang"); return v==="en"||v==="ru"?v:"hu"; }
function normalize(v:string|null|undefined){return(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function serviceName(x:KioskService){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function productName(x:KioskProduct){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function servicePrice(x:KioskService){return Number(x.list_price??x.base_price??0)}
function productPrice(x:KioskProduct){return Number(x.sale_price??x.retail_price_gross??0)}
const slugify=(s:string)=>normalize(s);

export function KioskCategory(){
  const nav=useNavigate();
  const{slug=""}=useParams();
  const[loading,setLoading]=React.useState(true);
  const[err,setErr]=React.useState("");
  const[allServices,setAllServices]=React.useState<KioskService[]>([]);
  const[categories,setCategories]=React.useState<KioskCategory[]>([]);
  const[products,setProducts]=React.useState<KioskProduct[]>([]);
  const[menu,setMenu]=React.useState<any>(null);
  const[langTick,setLangTick]=React.useState(0);
  const[addedId,setAddedId]=React.useState("");
  const storedId=localStorage.getItem("kiosk_category_id")||"";
  const storedName=localStorage.getItem("kiosk_category_name")||"";

  React.useEffect(()=>{const h=()=>setLangTick(x=>x+1);window.addEventListener("kiosk-lang-change",h);return()=>window.removeEventListener("kiosk-lang-change",h)},[]);
  React.useEffect(()=>{(async()=>{try{
    setLoading(true);setErr("");const locationId=localStorage.getItem("kiosk_location_id");
    const svc=await fetchKioskServices(lang(),locationId);setAllServices(svc.services||[]);setCategories(svc.categories||[]);setMenu(svc.menu||null);
    if(svc.menu?.theme?.showProducts){const prod=await fetchKioskProducts();setProducts(prod||[])}else setProducts([]);
  }catch(e:any){setErr(e?.message||"API hiba")}finally{setLoading(false)}})()},[slug,langTick]);

  const activeCategory=React.useMemo(()=>{
    const wanted=normalize(storedName||slug);
    return categories.find(c=>(storedId&&String(c.id)===storedId)||normalize(c.name)===wanted)||categories[0]||null;
  },[categories,storedId,storedName,slug]);
  const services=React.useMemo(()=>activeCategory?allServices.filter(s=>String(s.category_id||"")===String(activeCategory.id)||normalize(s.category_name)===normalize(activeCategory.name)):[],[allServices,activeCategory]);
  const theme=menu?.theme||{};
  const showPrice=theme.showPrices!==false,showDuration=theme.showDuration!==false;
  const categoryImage=activeCategory?.image_path||FALLBACK_IMAGES[Math.max(0,categories.findIndex(x=>x.id===activeCategory?.id))%FALLBACK_IMAGES.length];

  function selectCategory(c:KioskCategory){localStorage.setItem("kiosk_category_id",String(c.id));localStorage.setItem("kiosk_category_name",c.name);nav(`/kiosk/cat/${slugify(c.name)||c.id}`)}
  function addService(s:KioskService){addToCart({id:s.id,title:serviceName(s),price:servicePrice(s),meta:{kind:"service",duration:s.duration_minutes,category_id:s.category_id,image_url:s.image_url||categoryImage}},1);setAddedId(s.id);window.setTimeout(()=>setAddedId(""),800)}
  function addProduct(p:KioskProduct){addToCart({id:p.id,title:productName(p),price:productPrice(p),meta:{kind:"product",image_url:p.image_url}},1);setAddedId(p.id);window.setTimeout(()=>setAddedId(""),800)}

  return <div className="kiosk-order-layout">
    <aside className="kiosk-category-rail">
      <button className="kiosk-back-home" onClick={()=>nav("/kiosk")}>← Főmenü</button>
      <div className="kiosk-rail-title">Kategóriák</div>
      <div className="kiosk-rail-list">{categories.map((c,i)=><button key={c.id} className={activeCategory?.id===c.id?"active":""} onClick={()=>selectCategory(c)}><img src={c.image_path||FALLBACK_IMAGES[i%FALLBACK_IMAGES.length]} alt=""/><span>{c.name}</span></button>)}</div>
    </aside>

    <section className="kiosk-catalog-page">
      <div className="kiosk-category-banner" style={{backgroundImage:`linear-gradient(90deg,rgba(18,12,8,.82),rgba(18,12,8,.15)),url(${categoryImage})`}}>
        <span>2. LÉPÉS</span><h1>{activeCategory?.name||storedName||"Szolgáltatások"}</h1><p>{activeCategory?.subtitle||"Válassz a szolgáltatások közül, majd add a kosárhoz."}</p>
      </div>
      {loading&&<div className="kioskInfo">Adatok betöltése a VIR adatbázisból…</div>}{err&&<div className="kioskError">{err}</div>}
      {!loading&&!err&&!services.length&&<div className="kioskInfo">Ebben a kategóriában jelenleg nincs aktív szolgáltatás.</div>}
      <div className="kiosk-service-grid">{services.map((s,index)=>{
        const image=s.image_url||s.category_image||categoryImage||FALLBACK_IMAGES[index%FALLBACK_IMAGES.length];
        return <article key={s.id} className={`kiosk-service-tile ${s.featured?"featured":""}`}>
          <button className="kiosk-service-touch" onClick={()=>addService(s)}>
            <div className="kiosk-service-image"><img src={image} alt={serviceName(s)}/>{s.badge_text&&<span className="kiosk-service-badge">{s.badge_text}</span>}{s.featured&&<span className="kiosk-service-featured">AJÁNLOTT</span>}</div>
            <div className="kiosk-service-content"><h3>{serviceName(s)}</h3>{s.description&&<p>{s.description}</p>}<div className="kiosk-service-facts">{showPrice&&<strong>{servicePrice(s).toLocaleString("hu-HU")} Ft</strong>}{showDuration&&s.duration_minutes!=null&&<span>{s.duration_minutes} perc</span>}</div></div>
          </button>
          <button className={`kiosk-add-button ${addedId===s.id?"added":""}`} onClick={()=>addService(s)}>{addedId===s.id?"✓ Hozzáadva":"+ Kosárba"}</button>
        </article>})}</div>

      {theme.showProducts&&products.length>0&&<section className="kiosk-upsell-section"><div className="kiosk-section-heading"><div><span>MÉG VALAMI?</span><h2>Kleoshop ajánlatok</h2></div></div><div className="kiosk-upsell-row">{products.slice(0,6).map(p=><article key={p.id}><img src={p.image_url||"/images/Logo.jpg"} alt={productName(p)}/><div><b>{productName(p)}</b><span>{productPrice(p).toLocaleString("hu-HU")} Ft</span></div><button onClick={()=>addProduct(p)}>{addedId===p.id?"✓":"+"}</button></article>)}</div></section>}
    </section>
    <KioskCartPanel/>
  </div>;
}
