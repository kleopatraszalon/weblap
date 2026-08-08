import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";

type Location = { id: string; name: string };
type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number | string;
  category_name?: string;
};
type Employee = { id: string; full_name: string; photo_url?: string | null };
type Slot = { employee_id: string; employee_name: string; start: string; end: string };

const api = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.message || `API hiba: ${response.status}`);
    return data;
  });

const ymd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });

const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

const BOOKING_CSS = String.raw`
  .kb-page,.kb-page *{box-sizing:border-box!important}
  .kb-page{
    --gold:#b69861;--gold2:#d9c49c;--pink:#ec008c;--ink:#120c08;--muted:#716960;--line:#e8e0d6;--cream:#f8f4ee;
    width:100%!important;max-width:none!important;min-height:100vh!important;margin:0!important;padding:46px 20px 90px!important;
    background:radial-gradient(circle at 8% 0%,rgba(182,152,97,.16),transparent 28%),radial-gradient(circle at 95% 9%,rgba(236,0,140,.08),transparent 25%),linear-gradient(180deg,#faf7f2 0,#fff 520px)!important;
    color:var(--ink)!important;font-family:Montserrat,"Open Sans",Arial,sans-serif!important;
  }
  .kb-wrap{width:100%!important;max-width:1120px!important;margin:0 auto!important}
  .kb-hero{position:relative!important;overflow:hidden!important;margin:0 auto 26px!important;padding:52px 56px!important;border:1px solid rgba(182,152,97,.35)!important;border-radius:28px!important;background:linear-gradient(122deg,#120c08 0%,#241914 60%,#39251d 100%)!important;box-shadow:0 28px 75px rgba(18,12,8,.16)!important;color:#fff!important}
  .kb-hero:before{content:""!important;position:absolute!important;left:0!important;top:0!important;bottom:0!important;width:5px!important;background:linear-gradient(180deg,var(--gold),var(--pink))!important}
  .kb-hero:after{content:""!important;position:absolute!important;right:-90px!important;top:-150px!important;width:360px!important;height:360px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;box-shadow:0 0 0 70px rgba(182,152,97,.03)!important}
  .kb-kicker{position:relative!important;z-index:1!important;display:block!important;margin:0 0 12px!important;color:var(--gold2)!important;font-size:11px!important;font-weight:800!important;letter-spacing:.18em!important;text-transform:uppercase!important}
  .kb-hero h1{position:relative!important;z-index:1!important;max-width:820px!important;margin:0!important;color:#fff!important;font-size:clamp(38px,5vw,68px)!important;font-weight:600!important;line-height:1.02!important;letter-spacing:-.045em!important;text-transform:none!important}
  .kb-hero h1 em{color:#ff57b6!important;font-style:normal!important}
  .kb-hero p{position:relative!important;z-index:1!important;max-width:760px!important;margin:18px 0 0!important;color:rgba(255,255,255,.75)!important;font-size:15px!important;line-height:1.7!important}
  .kb-steps{position:relative!important;z-index:1!important;display:flex!important;flex-wrap:wrap!important;gap:10px!important;margin-top:26px!important}
  .kb-steps span{display:inline-flex!important;align-items:center!important;gap:8px!important;min-height:40px!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.15)!important;border-radius:999px!important;background:rgba(255,255,255,.04)!important;color:rgba(255,255,255,.84)!important;font-size:11px!important;font-weight:700!important}
  .kb-steps b{display:grid!important;place-items:center!important;width:23px!important;height:23px!important;border-radius:50%!important;background:rgba(182,152,97,.2)!important;color:var(--gold2)!important;font-size:9px!important}

  .kb-progress{display:grid!important;grid-template-columns:auto 1fr auto 1fr auto!important;align-items:center!important;gap:12px!important;max-width:720px!important;margin:0 auto 24px!important;padding:0 8px!important}
  .kb-progress>div{display:flex!important;align-items:center!important;gap:8px!important;color:#999088!important;font-size:10px!important;font-weight:800!important;letter-spacing:.07em!important;text-transform:uppercase!important}
  .kb-progress b{display:grid!important;place-items:center!important;width:34px!important;height:34px!important;border:1px solid #d9d0c7!important;border-radius:50%!important;background:#fff!important;color:#897f76!important;box-shadow:0 5px 16px rgba(18,12,8,.04)!important}
  .kb-progress i{height:1px!important;background:#ddd5cc!important}
  .kb-progress .active{color:var(--ink)!important}.kb-progress .active b{border-color:var(--gold)!important;color:var(--gold)!important;box-shadow:0 0 0 5px rgba(182,152,97,.08)!important}
  .kb-progress .done{color:var(--ink)!important}.kb-progress .done b{border-color:var(--pink)!important;background:var(--pink)!important;color:#fff!important}

  .kb-error{display:flex!important;align-items:center!important;gap:10px!important;margin:0 0 18px!important;padding:13px 15px!important;border:1px solid rgba(236,0,140,.23)!important;border-radius:13px!important;background:#fff4fa!important;color:#8f0f58!important;font-size:12px!important;box-shadow:0 8px 24px rgba(236,0,140,.05)!important}
  .kb-error b{display:grid!important;place-items:center!important;width:25px!important;height:25px!important;border-radius:50%!important;background:var(--pink)!important;color:#fff!important}

  .kb-card{position:relative!important;overflow:hidden!important;width:100%!important;margin:0 0 20px!important;padding:32px!important;border:1px solid var(--line)!important;border-radius:22px!important;background:rgba(255,255,255,.98)!important;box-shadow:0 18px 48px rgba(18,12,8,.065)!important}
  .kb-card:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:0!important;height:4px!important;background:linear-gradient(90deg,var(--gold) 0 76%,var(--pink) 76%)!important}
  .kb-card.disabled{opacity:.58!important}
  .kb-head{display:grid!important;grid-template-columns:58px minmax(0,1fr)!important;gap:18px!important;align-items:start!important;margin-bottom:25px!important}
  .kb-num{display:grid!important;place-items:center!important;width:56px!important;height:56px!important;border:1px solid rgba(182,152,97,.36)!important;border-radius:17px!important;background:linear-gradient(145deg,#fff,#f8f3ec)!important;color:var(--gold)!important;font-size:16px!important;font-weight:800!important;box-shadow:inset 0 0 0 5px #fff!important}
  .kb-head small{display:block!important;margin:0 0 4px!important;color:var(--gold)!important;font-size:10px!important;font-weight:800!important;letter-spacing:.15em!important;text-transform:uppercase!important}
  .kb-head h2{margin:0!important;color:var(--ink)!important;font-size:28px!important;font-weight:650!important;line-height:1.1!important;letter-spacing:-.035em!important;text-transform:none!important}
  .kb-head p{max-width:800px!important;margin:8px 0 0!important;color:var(--muted)!important;font-size:12px!important;line-height:1.6!important}

  .kb-grid{display:grid!important;gap:15px!important}.kb-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}.kb-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .kb-field{display:grid!important;gap:7px!important;min-width:0!important;margin:0!important}
  .kb-field>span{color:#625a53!important;font-size:10px!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important}
  .kb-field>small{display:block!important;min-height:28px!important;color:#918880!important;font-size:10px!important;line-height:1.45!important}
  .kb-page select,.kb-page input,.kb-page textarea{appearance:auto!important;-webkit-appearance:auto!important;width:100%!important;max-width:none!important;min-width:0!important;height:52px!important;margin:0!important;padding:0 14px!important;border:1px solid #ddd4ca!important;border-radius:12px!important;background:#fff!important;color:var(--ink)!important;font:600 13px Montserrat,"Open Sans",Arial,sans-serif!important;line-height:1.2!important;box-shadow:none!important;outline:none!important}
  .kb-page textarea{height:auto!important;min-height:100px!important;padding:13px 14px!important;resize:vertical!important}
  .kb-page select:focus,.kb-page input:focus,.kb-page textarea:focus{border-color:var(--pink)!important;box-shadow:0 0 0 4px rgba(236,0,140,.07)!important}
  .kb-page select:disabled,.kb-page input:disabled{background:#f5f2ee!important;color:#9c948c!important;cursor:not-allowed!important}
  .kb-page button{font-family:Montserrat,"Open Sans",Arial,sans-serif!important}
  .kb-add{align-self:end!important;height:52px!important;border:0!important;border-radius:12px!important;padding:0 18px!important;background:var(--ink)!important;color:#fff!important;font-size:11px!important;font-weight:800!important;cursor:pointer!important;transition:.18s!important}
  .kb-add:hover:not(:disabled){transform:translateY(-1px)!important;box-shadow:0 10px 24px rgba(18,12,8,.15)!important}.kb-add:disabled{opacity:.35!important;cursor:not-allowed!important}

  .kb-service-row{display:grid!important;grid-template-columns:1fr 1fr auto!important;gap:12px!important;align-items:end!important}
  .kb-selected{margin-top:18px!important;padding:15px!important;border:1px solid #eee6dd!important;border-radius:16px!important;background:linear-gradient(180deg,#fcfaf7,#fff)!important}
  .kb-chip{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:11px 10px!important;border-bottom:1px solid #eee7df!important}.kb-chip:last-of-type{border-bottom:0!important}
  .kb-chip b,.kb-chip small{display:block!important}.kb-chip b{color:#2b2521!important;font-size:12px!important}.kb-chip small{margin-top:3px!important;color:#867d75!important;font-size:10px!important}
  .kb-chip button{display:grid!important;place-items:center!important;flex:0 0 28px!important;width:28px!important;height:28px!important;border:1px solid #e3dad1!important;border-radius:50%!important;background:#fff!important;color:#81786f!important;font-size:17px!important;cursor:pointer!important}.kb-chip button:hover{border-color:var(--pink)!important;color:var(--pink)!important}
  .kb-total{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;margin-top:8px!important;padding:14px 10px 2px!important;color:#625a53!important;font-size:11px!important;font-weight:700!important}.kb-total strong{color:var(--pink)!important;font-size:20px!important}

  .kb-live{display:flex!important;align-items:center!important;gap:9px!important;margin:0 0 18px!important;padding:11px 13px!important;border:1px solid #ece5dd!important;border-radius:12px!important;background:#faf8f5!important;color:#706860!important;font-size:11px!important;font-weight:700!important}
  .kb-live i{display:block!important;width:9px!important;height:9px!important;border-radius:50%!important;background:#c9c1b9!important}.kb-live i.on{background:#42a678!important;box-shadow:0 0 0 5px rgba(66,166,120,.09)!important}.kb-live i.loading{background:var(--gold)!important;animation:kbpulse 1s infinite!important}
  @keyframes kbpulse{0%,100%{box-shadow:0 0 0 0 rgba(182,152,97,.3)}50%{box-shadow:0 0 0 7px rgba(182,152,97,0)}}
  .kb-choice{display:grid!important;grid-template-columns:1.4fr 1fr .65fr!important;gap:10px!important;margin-top:17px!important}.kb-choice>div{padding:14px!important;border:1px solid rgba(182,152,97,.26)!important;border-radius:13px!important;background:linear-gradient(135deg,#fffaf4,#fff)!important}.kb-choice span,.kb-choice strong{display:block!important}.kb-choice span{color:#8c837b!important;font-size:9px!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important}.kb-choice strong{margin-top:6px!important;color:#312a25!important;font-size:12px!important}
  .kb-empty{margin-top:17px!important;padding:24px!important;border:1px dashed #d8cec4!important;border-radius:15px!important;background:#faf8f5!important;text-align:center!important}.kb-empty h3{margin:5px 0!important;color:#3c352f!important;font-size:16px!important;text-transform:none!important}.kb-empty p{margin:0!important;color:#79716a!important;font-size:11px!important}

  .kb-consent{display:flex!important;align-items:flex-start!important;gap:8px!important;margin:16px 0 19px!important;color:#6d655e!important;font-size:11px!important}.kb-consent input{width:16px!important;height:16px!important;min-height:16px!important;margin:0!important;padding:0!important;accent-color:var(--pink)!important}
  .kb-checkout{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:22px!important;align-items:center!important;margin-top:8px!important;padding:22px!important;border:1px solid rgba(182,152,97,.29)!important;border-radius:17px!important;background:linear-gradient(120deg,#fffaf5,#fff 68%,#fff5fb)!important}
  .kb-summary>span{color:var(--gold)!important;font-size:9px!important;font-weight:800!important;letter-spacing:.15em!important}.kb-summary h3{margin:5px 0!important;color:var(--ink)!important;font-size:17px!important;text-transform:none!important}.kb-summary p{margin:0!important;color:#777069!important;font-size:11px!important;line-height:1.5!important}.kb-facts{display:flex!important;flex-wrap:wrap!important;gap:8px!important;margin-top:10px!important}.kb-facts b{padding:6px 9px!important;border:1px solid #ebe4dd!important;border-radius:999px!important;background:#fff!important;color:#645c55!important;font-size:9px!important}
  .kb-price{text-align:right!important}.kb-price span,.kb-price strong,.kb-price small{display:block!important}.kb-price span{color:#847b74!important;font-size:9px!important;font-weight:800!important;text-transform:uppercase!important}.kb-price strong{margin-top:3px!important;color:var(--pink)!important;font-size:27px!important;letter-spacing:-.035em!important}.kb-price small{color:#948b84!important;font-size:10px!important}
  .kb-actions{display:flex!important;justify-content:flex-end!important;gap:10px!important;margin-top:18px!important}.kb-submit,.kb-wait,.kb-secondary{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:50px!important;padding:0 22px!important;border-radius:12px!important;font-size:11px!important;font-weight:800!important;text-decoration:none!important;cursor:pointer!important}.kb-submit{min-width:260px!important;border:1px solid var(--pink)!important;background:var(--pink)!important;color:#fff!important;box-shadow:0 14px 30px rgba(236,0,140,.18)!important}.kb-wait{border:1px solid var(--gold)!important;background:#fff!important;color:#6b5732!important}.kb-submit:disabled,.kb-wait:disabled{opacity:.38!important;cursor:not-allowed!important;box-shadow:none!important}
  .kb-voice{display:flex!important;justify-content:flex-end!important;gap:8px!important;margin-top:13px!important;color:#8a8179!important;font-size:10px!important}.kb-voice a{color:var(--pink)!important;font-weight:800!important;text-decoration:none!important}
  .kb-success{max-width:680px!important;margin:55px auto!important;padding:46px!important;border:1px solid var(--line)!important;border-radius:24px!important;background:#fff!important;text-align:center!important;box-shadow:0 24px 65px rgba(18,12,8,.1)!important}.kb-success-mark{display:grid!important;place-items:center!important;width:60px!important;height:60px!important;margin:0 auto 18px!important;border:1px solid var(--gold)!important;border-radius:50%!important;color:var(--pink)!important;font-size:28px!important}.kb-success h1{margin:0 0 10px!important;color:var(--ink)!important;font-size:32px!important;text-transform:none!important}.kb-success p{color:var(--muted)!important}.kb-success-id{margin:15px 0!important;color:#5d554e!important;font-size:12px!important}.kb-secondary{border:1px solid var(--gold)!important;color:#67512b!important;background:#fff!important}

  @media(max-width:900px){.kb-page{padding:28px 14px 64px!important}.kb-hero{padding:38px 30px!important;border-radius:22px!important}.kb-grid.three{grid-template-columns:1fr 1fr!important}.kb-service-row{grid-template-columns:1fr 1fr!important}.kb-add{grid-column:1/-1!important}.kb-choice{grid-template-columns:1fr 1fr!important}.kb-choice>div:first-child{grid-column:1/-1!important}}
  @media(max-width:640px){.kb-hero{padding:31px 23px!important}.kb-hero h1{font-size:38px!important}.kb-steps{display:grid!important}.kb-progress{grid-template-columns:auto 1fr auto 1fr auto!important}.kb-progress>div span{display:none!important}.kb-card{padding:22px 17px!important;border-radius:18px!important}.kb-head{grid-template-columns:45px minmax(0,1fr)!important;gap:12px!important}.kb-num{width:44px!important;height:44px!important;border-radius:13px!important;font-size:13px!important}.kb-head h2{font-size:22px!important}.kb-grid.two,.kb-grid.three,.kb-service-row{grid-template-columns:1fr!important}.kb-add{grid-column:auto!important}.kb-choice{grid-template-columns:1fr!important}.kb-choice>div:first-child{grid-column:auto!important}.kb-checkout{grid-template-columns:1fr!important}.kb-price{text-align:left!important}.kb-actions{display:grid!important}.kb-submit{min-width:0!important;width:100%!important}.kb-voice{justify-content:flex-start!important;flex-wrap:wrap!important}}
`;

export function BookingPageV2() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [servicePickerId, setServicePickerId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState(ymd(new Date()));
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [waitDone, setWaitDone] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);

  useEffect(() => {
    api("/api/public/booking/catalog")
      .then((data) => setLocations(data.locations || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setServices([]); setEmployees([]); setServiceType(""); setServicePickerId(""); setServiceIds([]);
    setSelectedTime(""); setEmployeeId(""); setAllSlots([]); setAvailabilityLoaded(false); setWaitDone(false);
    if (!locationId) return;
    setCatalogLoading(true); setError("");
    api(`/api/public/booking/catalog?location_id=${encodeURIComponent(locationId)}`)
      .then((data) => { setServices(data.services || []); setEmployees(data.employees || []); })
      .catch((e) => setError(e.message))
      .finally(() => setCatalogLoading(false));
  }, [locationId]);

  const selectedServices = useMemo(() => services.filter((s) => serviceIds.includes(s.id)), [services, serviceIds]);
  const serviceTypes = useMemo(() => Array.from(new Set(services.map((s) => s.category_name || "Egyéb szolgáltatások"))).sort((a,b)=>a.localeCompare(b,"hu")), [services]);
  const filteredServices = useMemo(() => !serviceType ? [] : services.filter((s) => (s.category_name || "Egyéb szolgáltatások") === serviceType), [services, serviceType]);
  const totalPrice = useMemo(() => selectedServices.reduce((sum,s)=>sum+Number(s.price||0),0), [selectedServices]);
  const totalDuration = useMemo(() => selectedServices.reduce((sum,s)=>sum+Number(s.duration_minutes||30),0), [selectedServices]);

  const serviceKey = serviceIds.join(",");
  const employeeKey = employees.map((e) => e.id).join(",");

  useEffect(() => {
    setSelectedTime(""); setEmployeeId(""); setAllSlots([]); setAvailabilityLoaded(false); setWaitDone(false);
    if (!locationId || !serviceIds.length || !employees.length || !date) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setAvailabilityLoading(true); setError("");
      try {
        const results = await Promise.allSettled(employees.map(async (employee) => {
          const q = new URLSearchParams({location_id:locationId,date,service_ids:serviceIds.join(","),employee_id:employee.id});
          const data = await api(`/api/public/booking/availability?${q}`);
          return (data.slots || []) as Slot[];
        }));
        if (cancelled) return;
        const merged = results.flatMap((r) => r.status === "fulfilled" ? r.value : []).sort((a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime() || a.employee_name.localeCompare(b.employee_name,"hu"));
        setAllSlots(merged); setAvailabilityLoaded(true);
        if (!merged.length && results.every((r)=>r.status === "rejected")) setError("A szabad kapacitások lekérése nem sikerült.");
      } catch (e:any) { if (!cancelled) { setError(e.message); setAvailabilityLoaded(true); } }
      finally { if (!cancelled) setAvailabilityLoading(false); }
    }, 260);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [locationId, serviceKey, employeeKey, date]);

  const availableTimes = useMemo(() => {
    const source = employeeId ? allSlots.filter((s)=>s.employee_id===employeeId) : allSlots;
    const seen = new Map<string,Slot>(); source.forEach((s)=>{if(!seen.has(s.start))seen.set(s.start,s)});
    return Array.from(seen.values()).sort((a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime());
  }, [allSlots, employeeId]);

  const availableEmployees = useMemo(() => {
    const source = selectedTime ? allSlots.filter((s)=>s.start===selectedTime) : allSlots;
    const ids = new Set(source.map((s)=>s.employee_id));
    return employees.filter((e)=>ids.has(e.id));
  }, [allSlots, employees, selectedTime]);

  const selectedSlot = useMemo(() => !selectedTime || !employeeId ? null : allSlots.find((s)=>s.start===selectedTime && s.employee_id===employeeId) || null, [allSlots, selectedTime, employeeId]);
  const locationName = locations.find((l)=>l.id===locationId)?.name || "";
  const employeeName = employees.find((e)=>e.id===employeeId)?.full_name || "";

  function addService(){ if(!servicePickerId)return; setServiceIds((v)=>v.includes(servicePickerId)?v:[...v,servicePickerId]); setServicePickerId(""); }
  function removeService(id:string){ setServiceIds((v)=>v.filter((x)=>x!==id)); }
  function chooseType(value:string){ setServiceType(value); setServicePickerId(""); }
  function chooseTime(value:string){
    setSelectedTime(value);
    if (!value) return;
    if (employeeId && !allSlots.some((s)=>s.start===value && s.employee_id===employeeId)) setEmployeeId("");
    const free = Array.from(new Set(allSlots.filter((s)=>s.start===value).map((s)=>s.employee_id)));
    if (!employeeId && free.length===1) setEmployeeId(free[0]);
  }
  function chooseEmployee(value:string){
    setEmployeeId(value);
    if (!value) return;
    if (selectedTime && !allSlots.some((s)=>s.start===selectedTime && s.employee_id===value)) setSelectedTime("");
    const free = allSlots.filter((s)=>s.employee_id===value);
    if (!selectedTime && free.length===1) setSelectedTime(free[0].start);
  }

  async function submit(){
    if(!selectedSlot)return setError("Válasszon szabad időpontot és munkatársat.");
    if(!name.trim()||(!phone.trim()&&!email.trim()))return setError("A foglaláshoz név és telefonszám vagy e-mail cím szükséges.");
    setSaving(true);setError("");
    try{
      const result=await api("/api/public/booking/book",{method:"POST",body:JSON.stringify({location_id:locationId,employee_id:selectedSlot.employee_id,service_ids:serviceIds,client_name:name.trim(),phone:phone.trim(),email:email.trim(),start_time:selectedSlot.start,note:note.trim(),marketing_consent:marketing,booking_source:"online"})});
      setDone(result);
    }catch(e:any){setError(e.message);if(/foglalt|időközben/i.test(e.message||"")){setSelectedTime("");setEmployeeId("");}}
    finally{setSaving(false)}
  }

  async function joinWaitlist(){
    if(!locationId||!serviceIds.length)return;
    if(!name.trim()||(!phone.trim()&&!email.trim()))return setError("A várólistához név és telefonszám vagy e-mail cím szükséges.");
    setSaving(true);setError("");
    try{await api("/api/public/booking/waitlist",{method:"POST",body:JSON.stringify({location_id:locationId,employee_id:employeeId||null,service_ids:serviceIds,client_name:name.trim(),phone:phone.trim(),email:email.trim(),preferred_from:`${date}T00:00:00`,preferred_to:`${date}T23:59:59`,note:note.trim(),booking_source:"online"})});setWaitDone(true)}
    catch(e:any){setError(e.message)}finally{setSaving(false)}
  }

  if(done) return <main className="kb-page"><style>{BOOKING_CSS}</style><section className="kb-success"><div className="kb-success-mark">✓</div><span className="kb-kicker">KLEOPÁTRA ONLINE FOGLALÁS</span><h1>Foglalási igény rögzítve</h1><p>{done.confirmation_required?"A szalon munkatársa ellenőrzi az időpontot, majd visszaigazolást küld.":"Az időpont sikeresen visszaigazolva."}</p><div className="kb-success-id">Foglalási azonosító: <b>{done.id}</b></div><Link to="/" className="kb-secondary">Vissza a főoldalra</Link></section></main>;

  const step1Ready=Boolean(locationId&&serviceIds.length), step2Ready=Boolean(selectedSlot), step3Ready=Boolean(name.trim()&&(phone.trim()||email.trim()));

  return <main className="kb-page">
    <style>{BOOKING_CSS}</style>
    <div className="kb-wrap">
      <section className="kb-hero">
        <span className="kb-kicker">ONLINE IDŐPONTFOGLALÁS</span>
        <h1>Az Ön ideje. <em>Az Ön szépsége.</em></h1>
        <p>Válasszon szalont, szolgáltatástípust és konkrét kezelést. Ezután csak a valóban szabad időpontokat és az adott időpontban elérhető munkatársakat mutatjuk.</p>
        <div className="kb-steps"><span><b>01</b>Szalon és szolgáltatás</span><span><b>02</b>Időpont és munkatárs</span><span><b>03</b>Adatok és véglegesítés</span></div>
      </section>

      <div className="kb-progress"><div className={step1Ready?"done":"active"}><b>1</b><span>Választás</span></div><i/><div className={step2Ready?"done":step1Ready?"active":""}><b>2</b><span>Időpont</span></div><i/><div className={step3Ready?"done":step2Ready?"active":""}><b>3</b><span>Adatok</span></div></div>
      {error&&<div className="kb-error"><b>!</b><span>{error}</span></div>}

      <section className="kb-card">
        <div className="kb-head"><div className="kb-num">01</div><div><small>KEZDJÜK AZ ALAPOKKAL</small><h2>Szalon és szolgáltatás</h2><p>A szolgáltatás kiválasztása két lépésben történik: először a szolgáltatás típusa, utána a konkrét szolgáltatás.</p></div></div>
        <div className="kb-grid two">
          <label className="kb-field"><span>Szalon</span><select value={locationId} onChange={(e)=>setLocationId(e.target.value)}><option value="">Válasszon szalont</option>{locations.map((l)=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
          <div className="kb-service-row">
            <label className="kb-field"><span>1. Szolgáltatás típusa</span><select value={serviceType} disabled={!locationId||catalogLoading} onChange={(e)=>chooseType(e.target.value)}><option value="">{catalogLoading?"Betöltés…":"Válasszon típust"}</option>{serviceTypes.map((t)=><option key={t} value={t}>{t}</option>)}</select></label>
            <label className="kb-field"><span>2. Konkrét szolgáltatás</span><select value={servicePickerId} disabled={!serviceType} onChange={(e)=>setServicePickerId(e.target.value)}><option value="">Válasszon szolgáltatást</option>{filteredServices.map((s)=><option key={s.id} value={s.id} disabled={serviceIds.includes(s.id)}>{s.name} — {s.duration_minutes||30} perc — {Number(s.price||0).toLocaleString("hu-HU")} Ft</option>)}</select></label>
            <button className="kb-add" type="button" onClick={addService} disabled={!servicePickerId}>Hozzáadás</button>
          </div>
        </div>
        {selectedServices.length>0&&<div className="kb-selected">{selectedServices.map((s)=><div className="kb-chip" key={s.id}><span><b>{s.name}</b><small>{s.category_name||"Szolgáltatás"} · {s.duration_minutes||30} perc · {Number(s.price||0).toLocaleString("hu-HU")} Ft</small></span><button type="button" onClick={()=>removeService(s.id)} aria-label={`${s.name} eltávolítása`}>×</button></div>)}<div className="kb-total"><span>{selectedServices.length} szolgáltatás · {totalDuration} perc</span><strong>{totalPrice.toLocaleString("hu-HU")} Ft</strong></div></div>}
      </section>

      <section className={`kb-card ${!step1Ready?"disabled":""}`}>
        <div className="kb-head"><div className="kb-num">02</div><div><small>VALÓS IDEJŰ SZABAD KAPACITÁS</small><h2>Időpont és munkatárs</h2><p>Ha időpontot választ, csak az akkor szabad munkatársak jelennek meg. Ha munkatársat választ előbb, csak az ő ténylegesen szabad időpontjai maradnak a listában.</p></div></div>
        <div className="kb-live"><i className={availabilityLoading?"loading":availabilityLoaded?"on":""}/>{availabilityLoading?"Szabad kapacitások ellenőrzése az adatbázisban…":availabilityLoaded?`${allSlots.length} szabad munkatárs–időpont kombináció betöltve`:"A kapacitás a szolgáltatás kiválasztása után automatikusan betöltődik"}</div>
        <div className="kb-grid three">
          <label className="kb-field"><span>Dátum</span><input type="date" min={ymd(new Date())} value={date} disabled={!step1Ready} onChange={(e)=>setDate(e.target.value)}/></label>
          <label className="kb-field"><span>Szabad időpont</span><select value={selectedTime} disabled={!step1Ready||availabilityLoading||!availableTimes.length} onChange={(e)=>chooseTime(e.target.value)}><option value="">Válasszon időpontot</option>{availableTimes.map((s)=><option key={s.start} value={s.start}>{hhmm(s.start)}</option>)}</select><small>{employeeId?`${employeeName} szabad időpontjai`:"Az adott napon elérhető időpontok"}</small></label>
          <label className="kb-field"><span>Szabad munkatárs</span><select value={employeeId} disabled={!step1Ready||availabilityLoading||!availableEmployees.length} onChange={(e)=>chooseEmployee(e.target.value)}><option value="">Válasszon munkatársat</option>{availableEmployees.map((e)=><option key={e.id} value={e.id}>{e.full_name}</option>)}</select><small>{selectedTime?`${hhmm(selectedTime)} időpontban szabad munkatársak`:"Az adott napon elérhető munkatársak"}</small></label>
        </div>
        {availabilityLoaded&&!availabilityLoading&&allSlots.length===0&&<div className="kb-empty"><h3>Nincs szabad időpont ezen a napon</h3><p>Válasszon másik napot, vagy adja meg adatait és kérjen várólistás értesítést.</p></div>}
        {selectedSlot&&<div className="kb-choice"><div><span>Kiválasztott időpont</span><strong>{prettyDate(selectedSlot.start)} · {hhmm(selectedSlot.start)}</strong></div><div><span>Munkatárs</span><strong>{selectedSlot.employee_name}</strong></div><div><span>Időtartam</span><strong>{totalDuration} perc</strong></div></div>}
      </section>

      <section className={`kb-card ${!step1Ready?"disabled":""}`}>
        <div className="kb-head"><div className="kb-num">03</div><div><small>MÁR CSAK EGY LÉPÉS</small><h2>Vendégadatok és véglegesítés</h2><p>Az adatokat közvetlenül a VIR ügyfél- és foglalási adatbázisába mentjük.</p></div></div>
        <div className="kb-grid two">
          <label className="kb-field"><span>Név *</span><input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Teljes név"/></label>
          <label className="kb-field"><span>Telefonszám</span><input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+36 30 123 4567"/></label>
          <label className="kb-field"><span>E-mail</span><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email@pelda.hu"/></label>
          <label className="kb-field"><span>Megjegyzés</span><textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Opcionális megjegyzés"/></label>
        </div>
        <label className="kb-consent"><input type="checkbox" checked={marketing} onChange={(e)=>setMarketing(e.target.checked)}/><span>Hozzájárulok marketing célú kapcsolattartáshoz.</span></label>
        <div className="kb-checkout"><div className="kb-summary"><span>FOGLALÁSI ÖSSZEFOGLALÓ</span><h3>{locationName||"Válasszon szalont"}</h3><p>{selectedServices.map((s)=>s.name).join(" · ")||"Még nincs kiválasztott szolgáltatás"}</p><div className="kb-facts"><b>{selectedSlot?`${prettyDate(selectedSlot.start)} · ${hhmm(selectedSlot.start)}`:"Időpont nincs kiválasztva"}</b><b>{employeeName||"Munkatárs nincs kiválasztva"}</b></div></div><div className="kb-price"><span>Összesen</span><strong>{totalPrice.toLocaleString("hu-HU")} Ft</strong><small>{totalDuration||0} perc</small></div></div>
        <div className="kb-actions">{availabilityLoaded&&allSlots.length===0&&<button type="button" className="kb-wait" disabled={saving||waitDone} onClick={joinWaitlist}>{waitDone?"Várólista-igény rögzítve ✓":"Kérek várólistás értesítést"}</button>}<button type="button" className="kb-submit" disabled={!selectedSlot||!step3Ready||saving} onClick={submit}>{saving?"Foglalás mentése…":"Időpontfoglalás véglegesítése"}</button></div>
        <div className="kb-voice"><span>Inkább szóban intézné?</span><Link to="/hangos-idopontfoglalas">Foglalás hangasszisztenssel →</Link></div>
      </section>
    </div>
  </main>;
}
