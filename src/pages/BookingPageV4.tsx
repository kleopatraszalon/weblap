import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../apiClient";

type Location = { id: string; name: string };
type Service = { id: string; name: string; duration_minutes: number; price: number | string; category_name?: string };
type Employee = { id: string; full_name: string; photo_url?: string | null };
type Slot = { employee_id: string; employee_name: string; start: string; end: string };
type SearchMode = "service" | "time" | "location" | "employee";
type Recommendation = { service_id?: string; id?: string; name?: string; service_name?: string; reason?: string; price?: number | string; duration_minutes?: number };

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

const ymd = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const money = (value: number | string) => `${Math.round(Number(value || 0)).toLocaleString("hu-HU")} Ft`;
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });

const CSS = String.raw`
.kb4,.kb4 *{box-sizing:border-box}.kb4{--ink:#16100d;--gold:#b69861;--pink:#ec008c;--line:#eadfd5;--muted:#766d66;min-height:100vh;padding:42px 18px 90px;background:linear-gradient(180deg,#fbf7f2 0,#fff 620px);font-family:Montserrat,Arial,sans-serif;color:var(--ink)}
.kb4-wrap{max-width:1180px;margin:0 auto}.kb4-hero{padding:48px;border-radius:28px;background:linear-gradient(125deg,#17100d,#34231b);color:white;box-shadow:0 28px 80px rgba(25,13,8,.16)}
.kb4-hero small{display:block;color:#d9c49c;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.kb4-hero h1{max-width:850px;margin:10px 0 12px;font-size:clamp(38px,5vw,66px);line-height:1.02;letter-spacing:-.04em}.kb4-hero h1 em{font-style:normal;color:#ff57b6}.kb4-hero p{max-width:800px;color:rgba(255,255,255,.76);line-height:1.65}
.kb4-modes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:22px 0}.kb4-mode{padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff;text-align:left;cursor:pointer;box-shadow:0 10px 30px rgba(28,18,12,.05)}.kb4-mode.active{border-color:var(--pink);box-shadow:0 0 0 3px rgba(236,0,140,.08)}.kb4-mode b,.kb4-mode span{display:block}.kb4-mode b{font-size:14px}.kb4-mode span{margin-top:6px;color:var(--muted);font-size:11px;line-height:1.45}
.kb4-card{margin-top:18px;padding:28px;border:1px solid var(--line);border-radius:22px;background:#fff;box-shadow:0 16px 46px rgba(28,18,12,.055)}.kb4-card h2{margin:0 0 8px;font-size:24px}.kb4-card>p{margin:0 0 20px;color:var(--muted);font-size:12px;line-height:1.55}
.kb4-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.kb4-field{display:grid;gap:7px}.kb4-field span{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:#655c56}.kb4 input,.kb4 select{width:100%;height:50px;padding:0 13px;border:1px solid #ddd2c8;border-radius:12px;background:#fff;font:600 13px Montserrat,Arial,sans-serif}.kb4 input:focus,.kb4 select:focus{outline:none;border-color:var(--pink);box-shadow:0 0 0 3px rgba(236,0,140,.07)}
.kb4-services{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}.kb4-service{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;border:1px solid #eee5dc;border-radius:14px;background:#fff}.kb4-service b,.kb4-service small{display:block}.kb4-service small{margin-top:4px;color:#8b8179}.kb4-service button,.kb4-primary,.kb4-secondary{border:0;border-radius:11px;padding:11px 14px;font-weight:800;cursor:pointer}.kb4-service button,.kb4-primary{background:var(--ink);color:#fff}.kb4-secondary{background:#f5efe9;color:var(--ink)}
.kb4-selected{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.kb4-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;background:#f7f1eb;font-size:11px;font-weight:700}.kb4-chip button{border:0;background:transparent;cursor:pointer;color:var(--pink);font-weight:900}
.kb4-reco{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.kb4-reco article{padding:14px;border:1px solid #eadfd5;border-radius:14px;background:linear-gradient(145deg,#fffaf4,#fff)}.kb4-reco b,.kb4-reco small{display:block}.kb4-reco small{margin:6px 0 10px;color:var(--muted);line-height:1.45}
.kb4-slots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:16px}.kb4-slot{padding:12px;border:1px solid #e5dbd1;border-radius:12px;background:#fff;cursor:pointer;text-align:left}.kb4-slot.active{border-color:var(--pink);background:#fff5fa}.kb4-slot b,.kb4-slot small{display:block}.kb4-slot small{margin-top:4px;color:var(--muted)}
.kb4-consent{display:flex;align-items:flex-start;gap:9px;margin-top:12px;color:#655d57;font-size:11px;line-height:1.5}.kb4-consent input{width:16px;height:16px;margin-top:1px}.kb4-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}.kb4-error{margin-top:14px;padding:12px 14px;border-radius:12px;background:#fff0f7;color:#92145f;font-size:12px}.kb4-success{margin-top:14px;padding:14px;border-radius:12px;background:#effaf5;color:#246848;font-size:12px;font-weight:700}
@media(max-width:900px){.kb4-modes,.kb4-grid,.kb4-reco{grid-template-columns:repeat(2,minmax(0,1fr))}.kb4-slots{grid-template-columns:repeat(3,minmax(0,1fr))}.kb4-hero{padding:34px}}
@media(max-width:620px){.kb4{padding:24px 12px 70px}.kb4-modes,.kb4-grid,.kb4-services,.kb4-reco{grid-template-columns:1fr}.kb4-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.kb4-card{padding:20px}.kb4-hero{padding:28px 22px;border-radius:22px}}
`;

export const BookingPageV4: React.FC = () => {
  const [mode, setMode] = useState<SearchMode>("service");
  const [locations, setLocations] = useState<Location[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locationId, setLocationId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState(ymd(new Date()));
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookingForOther, setBookingForOther] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedServices = useMemo(() => services.filter((s) => serviceIds.includes(s.id)), [services, serviceIds]);
  const selectedMinutes = selectedServices.reduce((sum, s) => sum + Number(s.duration_minutes || 0), 0);
  const selectedTotal = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const visibleServices = useMemo(() => mode === "time" ? services.filter((s) => Number(s.duration_minutes || 0) <= availableMinutes) : services, [services, mode, availableMinutes]);

  useEffect(() => {
    api("/api/public/booking/catalog")
      .then((data) => setLocations(data.locations || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!locationId) {
      setServices([]); setEmployees([]); setServiceIds([]); setSlots([]); setSlot(null); return;
    }
    setError("");
    api(`/api/public/booking/catalog?location_id=${encodeURIComponent(locationId)}`)
      .then((data) => { setServices(data.services || []); setEmployees(data.employees || []); })
      .catch((e) => setError(e.message));
  }, [locationId]);

  useEffect(() => {
    if (!locationId || !serviceIds.length) { setSlots([]); setSlot(null); return; }
    const q = new URLSearchParams({ location_id: locationId, date, service_ids: serviceIds.join(",") });
    if (employeeId) q.set("employee_id", employeeId);
    setLoading(true);
    api(`/api/public/booking/availability?${q.toString()}`)
      .then((data) => { setSlots(data.slots || []); setSlot(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [locationId, serviceIds, employeeId, date]);

  useEffect(() => {
    if (!locationId || !serviceIds.length) { setRecommendations([]); return; }
    const q = new URLSearchParams({ location_id: locationId, service_ids: serviceIds.join(",") });
    api(`/api/public/booking/recommendations?${q.toString()}`)
      .then((data) => setRecommendations(data.recommendations || []))
      .catch(() => setRecommendations([]));
  }, [locationId, serviceIds]);

  const addService = (id: string) => setServiceIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  const removeService = (id: string) => setServiceIds((prev) => prev.filter((x) => x !== id));

  const submit = async () => {
    setError(""); setSuccess("");
    if (!locationId || !slot || !serviceIds.length) return setError("Válassz szalont, szolgáltatást és szabad időpontot.");
    if (!name.trim() || !phone.trim() || !email.trim()) return setError("A név, telefonszám és e-mail cím kötelező.");
    if (bookingForOther && !guestName.trim()) return setError("Add meg annak a nevét, akinek az időpont szól.");
    if (!privacyAccepted) return setError("A foglaláshoz az adatkezelési tájékoztató elfogadása szükséges.");
    setLoading(true);
    try {
      const result = await api("/api/public/booking/book", {
        method: "POST",
        body: JSON.stringify({
          location_id: locationId,
          employee_id: slot.employee_id,
          service_ids: serviceIds,
          client_name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          start_time: slot.start,
          booking_source: "online",
        }),
      });
      if (result?.id) {
        try {
          await api("/api/public/booking/v4/booking-meta", {
            method: "POST",
            body: JSON.stringify({
              appointment_id: result.id,
              booking_for_other: bookingForOther,
              guest_name: bookingForOther ? guestName.trim() : undefined,
              guest_phone: bookingForOther ? guestPhone.trim() : undefined,
              email: email.trim(),
              phone: phone.trim(),
              marketing_consent: marketingConsent,
            }),
          });
        } catch (metaError) {
          console.warn("Booking 4.0 metaadat mentési hiba", metaError);
        }
      }
      setSuccess(`Foglalás rögzítve${result?.id ? ` · azonosító: ${result.id}` : ""}.`);
    } catch (e: any) { setError(e.message || "A foglalás sikertelen."); }
    finally { setLoading(false); }
  };

  const modeItems: Array<[SearchMode, string, string]> = [
    ["service", "Szolgáltatást keresek", "Válaszd ki, mit szeretnél, és mutatjuk a lehetőségeket."],
    ["time", "Időpont alapján keresek", "Mondd meg, mikor és mennyi időd van."],
    ["location", "Szalon alapján keresek", "Kezdd a kedvenc szalonoddal."],
    ["employee", "Szakemberhez foglalok", "Keresd meg a megszokott kollégádat."],
  ];

  return <main className="kb4"><style>{CSS}</style><div className="kb4-wrap">
    <section className="kb4-hero"><small>Kleopátra Booking 4.0</small><h1>Foglalj úgy, ahogy <em>neked kényelmes.</em></h1><p>Nem kell egy kötött folyamatot követned. Indulhatsz szolgáltatásból, időpontból, szalonból vagy szakemberből, és több szolgáltatást is hozzáadhatsz egyetlen foglaláshoz.</p></section>

    <section className="kb4-modes">{modeItems.map(([id, title, desc]) => <button key={id} className={`kb4-mode ${mode === id ? "active" : ""}`} onClick={() => setMode(id)}><b>{title}</b><span>{desc}</span></button>)}</section>

    <section className="kb4-card"><h2>Keresés</h2><p>A mezők sorrendje rugalmas. A rendszer minden választás után újraszűri a lehetőségeket.</p>
      <div className="kb4-grid">
        <label className="kb4-field"><span>Szalon</span><select value={locationId} onChange={(e) => setLocationId(e.target.value)}><option value="">Válassz szalont</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
        <label className="kb4-field"><span>Dátum</span><input type="date" min={ymd(new Date())} value={date} onChange={(e) => setDate(e.target.value)} /></label>
        {mode === "time" ? <label className="kb4-field"><span>Rendelkezésre álló idő</span><select value={availableMinutes} onChange={(e) => setAvailableMinutes(Number(e.target.value))}><option value={30}>30 perc</option><option value={45}>45 perc</option><option value={60}>60 perc</option><option value={90}>90 perc</option><option value={120}>120 perc</option><option value={180}>180 perc</option></select></label> : <label className="kb4-field"><span>Szakember</span><select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} disabled={!locationId}><option value="">Mindegy, kihez</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}</select></label>}
      </div>

      {locationId && <><div className="kb4-services">{visibleServices.map((s) => <div className="kb4-service" key={s.id}><div><b>{s.name}</b><small>{s.category_name || "Szolgáltatás"} · {s.duration_minutes} perc · {money(s.price)}</small></div><button onClick={() => addService(s.id)} disabled={serviceIds.includes(s.id)}>+</button></div>)}</div>
      {!!selectedServices.length && <div className="kb4-selected">{selectedServices.map((s) => <span className="kb4-chip" key={s.id}>{s.name}<button onClick={() => removeService(s.id)}>×</button></span>)}<span className="kb4-chip">Összesen: {selectedMinutes} perc · {money(selectedTotal)}</span></div>}</>}
    </section>

    {!!recommendations.length && <section className="kb4-card"><h2>Ehhez ajánljuk</h2><p>Kiegészítő szolgáltatások a választásod alapján.</p><div className="kb4-reco">{recommendations.slice(0, 6).map((r, i) => { const id = String(r.service_id || r.id || ""); const svc = services.find((s) => s.id === id); return <article key={`${id}-${i}`}><b>{r.name || r.service_name || svc?.name || "Ajánlott szolgáltatás"}</b><small>{r.reason || "Jól kombinálható a kiválasztott szolgáltatásoddal."}</small>{id && <button className="kb4-secondary" onClick={() => addService(id)}>Hozzáadom</button>}</article>; })}</div></section>}

    <section className="kb4-card"><h2>Szabad időpontok</h2><p>{loading ? "Frissítjük a szabad kapacitásokat…" : serviceIds.length ? "Válassz a valós idejű szabad időpontok közül." : "Előbb válassz legalább egy szolgáltatást."}</p><div className="kb4-slots">{slots.map((s) => <button key={`${s.employee_id}-${s.start}`} className={`kb4-slot ${slot?.start === s.start && slot?.employee_id === s.employee_id ? "active" : ""}`} onClick={() => setSlot(s)}><b>{hhmm(s.start)}</b><small>{s.employee_name}</small></button>)}</div></section>

    <section className="kb4-card"><h2>Vendégadatok</h2><p>A foglalás véglegesítéséhez biztos elérhetőséget kérünk.</p><div className="kb4-grid">
      <label className="kb4-field"><span>Név *</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label className="kb4-field"><span>Telefonszám *</span><input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></label>
      <label className="kb4-field"><span>E-mail *</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
    </div>
    <label className="kb4-consent"><input type="checkbox" checked={bookingForOther} onChange={(e) => setBookingForOther(e.target.checked)} /><span>Más részére foglalok.</span></label>
    {bookingForOther && <div className="kb4-grid"><label className="kb4-field"><span>Vendég neve *</span><input value={guestName} onChange={(e) => setGuestName(e.target.value)} /></label><label className="kb4-field"><span>Vendég telefonszáma</span><input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} /></label></div>}
    <label className="kb4-consent"><input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} /><span>Elolvastam és elfogadom az adatkezelési tájékoztatót, és kérem a foglalás teljesítését. *</span></label>
    <label className="kb4-consent"><input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} /><span>Szeretnék értesülni az akciókról és újdonságokról. Ez külön, opcionális marketinghozzájárulás.</span></label>
    {error && <div className="kb4-error">{error}</div>}{success && <div className="kb4-success">{success}</div>}
    <div className="kb4-actions"><button className="kb4-primary" onClick={submit} disabled={loading || !slot}>Foglalás véglegesítése</button></div></section>
  </div></main>;
};

export default BookingPageV4;
