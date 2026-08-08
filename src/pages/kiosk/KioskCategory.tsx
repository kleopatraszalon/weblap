import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { addToCart } from "./cartStore";
import type { KioskProduct, KioskService } from "./types";

function lang(): "hu" | "en" | "ru" { const v=localStorage.getItem("kiosk_lang"); return v==="en"||v==="ru"?v:"hu"; }
function normalize(v:string|null|undefined){return(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function serviceName(x:KioskService){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function productName(x:KioskProduct){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function servicePrice(x:KioskService){return Number(x.list_price??x.base_price??0)}
function productPrice(x:KioskProduct){return Number(x.sale_price??x.retail_price_gross??0)}

export function KioskCategory(){
 const nav=useNavigate();const{slug=""}=useParams();const[loading,setLoading]=React.useState(true);const[err,setErr]=React.useState("");const[services,setServices]=React.useState<KioskService[]>([]);const[products,setProducts]=React.useState<KioskProduct[]>([]);const[langTick,setLangTick]=React.useState(0);
 const storedId=localStorage.getItem("kiosk_category_id")||"";const storedName=localStorage.getItem("kiosk_category_name")||"";const title=storedName||slug.replace(/-/g," ");
 React.useEffect(()=>{const h=()=>setLangTick(x=>x+1);window.addEventListener("kiosk-lang-change",h);return()=>window.removeEventListener("kiosk-lang-change",h)},[]);
 React.useEffect(()=>{(async()=>{try{setLoading(true);setErr("");const locationId=localStorage.getItem("kiosk_location_id");const[svc,prod]=await Promise.all([fetchKioskServices(lang(),locationId),fetchKioskProducts()]);const wantedSlug=normalize(storedName||slug);const filtered=(svc.services||[]).filter(s=>(storedId&&String(s.category_id||"")===storedId)||(storedName&&normalize(s.category_name)===normalize(storedName))||normalize(s.category_name)===wantedSlug||normalize(s.name).includes(wantedSlug));setServices(filtered);const productTerms=[wantedSlug,"ajandekutalvany","beauty","voucher","gift"].filter(Boolean);setProducts((prod||[]).filter(p=>{const h=normalize([p.name,p.name_hu,p.name_en,p.name_ru,p.main_category,p.sub_category,p.service_category,p.web_description].filter(Boolean).join(" "));return productTerms.some(t=>t.length>2&&h.includes(t))}).slice(0,12))}catch(e:any){setErr(e?.message||"API hiba")}finally{setLoading(false)}})()},[slug,langTick,storedId,storedName]);
 function addService(s:KioskService){addToCart({id:s.id,title:serviceName(s),price:servicePrice(s),meta:{kind:"service",duration:s.duration_minutes,category_id:s.category_id}},1)}
 function addProduct(p:KioskProduct){addToCart({id:p.id,title:productName(p),price:productPrice(p),meta:{kind:"product"}},1)}
 return <div className="kioskCategoryPage">
  <div className="kioskBackRow"><button className="kioskBtn" onClick={()=>nav("/kiosk")}>← Vissza</button><button className="kioskBtn kioskPrimaryBtn" onClick={()=>nav("/kiosk/pay")}>Kosár / továbblépés</button></div>
  <div className="kioskPanelTitle">{title}</div>
  {loading&&<div className="kioskInfo">Adatok betöltése a VIR adatbázisból…</div>}{err&&<div className="kioskError">{err}</div>}
  {!loading&&!err&&!services.length&&!products.length&&<div className="kioskInfo">Ebben a kategóriában jelenleg nincs aktív tétel.</div>}
  <div className="kioskCategoryScroll">
   {!!services.length&&<><div className="kioskSectionMiniTitle">Szolgáltatások</div><div className="kioskServicesGrid">{services.map(s=><button key={s.id} className="kioskServiceCard" onClick={()=>addService(s)}><div className="kioskServiceName">{serviceName(s)}</div><div className="kioskServiceMeta"><span>{servicePrice(s).toLocaleString("hu-HU")} Ft</span>{s.duration_minutes!=null&&<span> · {s.duration_minutes} perc</span>}</div><div className="kioskServiceCta">Kosárba</div></button>)}</div></>}
   {!!products.length&&<><div className="kioskSectionMiniTitle">Kapcsolódó termékek</div><div className="kioskServicesGrid">{products.map(p=><button key={p.id} className="kioskServiceCard" onClick={()=>addProduct(p)}><div className="kioskServiceName">{productName(p)}</div><div className="kioskServiceMeta">{productPrice(p).toLocaleString("hu-HU")} Ft</div><div className="kioskServiceDesc">{p.web_description||p.sub_category||p.main_category||"Kleopátra termék"}</div><div className="kioskServiceCta">Kosárba</div></button>)}</div></>}
  </div>
 </div>
}
