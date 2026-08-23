import React,{useEffect,useMemo,useState}from"react";
import{useLocation,useNavigate}from"react-router-dom";
import{API_BASE}from"../apiClient";
import{BookingPageV6}from"./BookingPageV6";

type Location={id:string;name:string};
type Service={id:string;name:string;duration_minutes:number;price:number|string;category_name?:string;available_location_ids?:string[];available_everywhere?:boolean};

const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const money=(v:number|string)=>`${Math.round(Number(v||0)).toLocaleString("hu-HU")} Ft`;
const api=(p:string)=>fetch(`${API_BASE}${p}`,{credentials:"include"}).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.detail||d.error||`API hiba: ${r.status}`);return d});

const CSS=String.raw`
.b7{min-height:100vh;padding:38px 16px 86px;background:linear-gradient(#faf6f1,#fff 560px);font-family:Montserrat,Arial,sans-serif;color:#1b1512}.b7w{max-width:1160px;margin:auto}.b7hero{padding:38px;border-radius:24px;background:linear-gradient(125deg,#17100d,#38261d);color:#fff}.b7hero small{color:#dbc49d;font-weight:900;letter-spacing:.14em}.b7hero h1{margin:10px 0 8px;font-size:clamp(34px,5vw,58px);line-height:1.04}.b7hero p{max-width:820px;color:#e7ddd8}.b7card{margin-top:18px;padding:22px;border:1px solid #eadfd5;border-radius:20px;background:#fff;box-shadow:0 12px 35px #21150d0d}.b7card h2{margin:0 0 6px}.b7card>p{margin:0 0 18px;color:#766d66;font-size:12px}.b7toolbar{display:grid;grid-template-columns:1fr 250px;gap:10px;margin-bottom:16px}.b7toolbar input,.b7toolbar select{height:46px;border:1px solid #ddd2c8;border-radius:11px;padding:0 12px;background:#fff;font:inherit}.b7services{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.b7service,.b7salon{border:1px solid #eadfd5;border-radius:14px;background:#fff;padding:15px;text-align:left}.b7service{display:flex;justify-content:space-between;align-items:center;gap:14px}.b7service b,.b7service small{display:block}.b7service small{margin-top:5px;color:#766d66}.b7btn{border:0;border-radius:10px;padding:10px 13px;background:#1b1512;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap}.b7selected{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0}.b7chip{padding:8px 10px;border-radius:999px;background:#f5eee8;font-size:11px}.b7salons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.b7salon{cursor:pointer;min-height:120px}.b7salon:hover{border-color:#ec008c}.b7salon:disabled{cursor:not-allowed;opacity:.58;background:#faf7f4}.b7salon strong,.b7salon span{display:block}.b7salon span{margin-top:7px;color:#766d66;font-size:11px;line-height:1.45}.b7salon .no{color:#a61c64;font-weight:800}.b7back{margin-top:14px;border:0;background:transparent;color:#6d5f58;font-weight:800;cursor:pointer}.b7err{margin-top:12px;padding:11px 13px;border-radius:10px;background:#fff0f7;color:#92145f;font-size:12px}@media(max-width:760px){.b7toolbar,.b7services,.b7salons{grid-template-columns:1fr}.b7{padding:20px 10px 60px}.b7hero{padding:28px 20px}}`;

export const BookingPageV7:React.FC=()=>{
  const location=useLocation(),navigate=useNavigate();
  const params=useMemo(()=>new URLSearchParams(location.search),[location.search]);
  const locationId=UUID_RE.test(params.get("location_id")||"")?String(params.get("location_id")):"";
  const initialIds=useMemo(()=>Array.from(new Set([...(params.get("service_ids")||"").split(","),params.get("service_id")||""].map(x=>x.trim()).filter(x=>UUID_RE.test(x)))).slice(0,6),[location.search]);
  const[services,setServices]=useState<Service[]>([]),[locations,setLocations]=useState<Location[]>([]),[selectedIds,setSelectedIds]=useState<string[]>(initialIds),[query,setQuery]=useState(""),[category,setCategory]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");

  useEffect(()=>{if(locationId)return;setLoading(true);setError("");api("/api/public/booking/global-catalog").then(d=>{setServices(d.services||[]);setLocations(d.locations||[])}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[locationId]);
  useEffect(()=>{setSelectedIds(initialIds)},[initialIds.join(",")]);

  if(locationId)return <BookingPageV6/>;

  const selected=services.filter(s=>selectedIds.includes(s.id));
  const categories=Array.from(new Set(services.map(s=>s.category_name||"Egyéb szolgáltatások"))).sort((a,b)=>a.localeCompare(b,"hu"));
  const visible=services.filter(s=>{const q=query.trim().toLocaleLowerCase("hu");return(!q||`${s.name} ${s.category_name||""}`.toLocaleLowerCase("hu").includes(q))&&(!category||(s.category_name||"Egyéb szolgáltatások")===category)});
  const salonSupports=(locId:string)=>selected.length>0&&selected.every(s=>s.available_everywhere||s.available_location_ids?.includes(locId));
  const chooseService=(id:string)=>setSelectedIds([id]);
  const chooseSalon=(id:string)=>{
    const next=new URLSearchParams(params);
    next.delete("service_id");
    next.set("service_ids",selectedIds.join(","));
    next.set("location_id",id);
    if(!next.get("source"))next.set("source","booking-service-first");
    navigate(`${location.pathname}?${next.toString()}`);
  };

  return <main className="b7"><style>{CSS}</style><div className="b7w">
    <section className="b7hero"><small>KLEOPÁTRA BOOKING 4.1</small><h1>Először válassz szolgáltatást.</h1><p>Nem kell előre szalont választanod. A szolgáltatás kiválasztása után megmutatjuk az összes szalont, és külön jelezzük, ha az adott szolgáltatás valamelyik helyen nem érhető el.</p></section>

    {selectedIds.length===0?<section className="b7card"><h2>1. Szolgáltatás</h2><p>Ugyanazt a központi szolgáltatáslistát használjuk minden szalonhoz. Válaszd ki, mit szeretnél.</p><div className="b7toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Keresés a szolgáltatások között…"/><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">Minden kategória</option>{categories.map(x=><option key={x} value={x}>{x}</option>)}</select></div>{loading?<p>Szolgáltatások betöltése…</p>:<div className="b7services">{visible.map(s=><div className="b7service" key={s.id}><div><b>{s.name}</b><small>{s.category_name||"Szolgáltatás"} · {s.duration_minutes} perc · {money(s.price)}</small></div><button className="b7btn" onClick={()=>chooseService(s.id)}>Kiválasztom</button></div>)}</div>}{error&&<div className="b7err">{error}</div>}</section>:
    <><section className="b7card"><h2>1. Kiválasztott szolgáltatás</h2><div className="b7selected">{selected.map(s=><span className="b7chip" key={s.id}>{s.name}</span>)}</div><button className="b7back" onClick={()=>setSelectedIds([])}>← Másik szolgáltatást választok</button></section>
    <section className="b7card"><h2>2. Szalon</h2><p>Válaszd ki, melyik szalonba mennél. Ha a szolgáltatás egy adott szalonban nem foglalható, azt itt rögtön jelezzük.</p><div className="b7salons">{locations.map(loc=>{const ok=salonSupports(loc.id);return <button key={loc.id} className="b7salon" disabled={!ok} onClick={()=>ok&&chooseSalon(loc.id)}><strong>{loc.name}</strong><span className={ok?"":"no"}>{ok?"Elérhető · tovább a szabad időpontokhoz":"Ebben a szalonban ez a szolgáltatás jelenleg nem elérhető."}</span></button>})}</div>{error&&<div className="b7err">{error}</div>}</section></>}
  </div></main>;
};

export default BookingPageV7;
