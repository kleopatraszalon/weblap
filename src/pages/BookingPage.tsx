import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../apiClient";
import { interpretVoiceBooking, slotMatchesPreference, VoiceTimePreference } from "./voiceBooking";
import "./BookingPage.css";

type Location = { id: string; name: string };
type Service = { id: string; name: string; duration_minutes: number; price: number | string; category_name?: string };
type Employee = { id: string; full_name: string; photo_url?: string | null };
type Slot = { employee_id: string; employee_name: string; start: string; end: string };

const api = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json", ...(init?.headers || {}) }, ...init }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || `API hiba: ${r.status}`);
    return data;
  });

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const normalize = (v: string) => String(v || "").toLocaleLowerCase("hu-HU").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function BookingPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(ymd(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);
  const [waitDone, setWaitDone] = useState(false);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("Mondja el például: Jövő kedden délután arckezelést szeretnék Annánál.");
  const [voiceUnderstood, setVoiceUnderstood] = useState<string[]>([]);
  const [voicePreference, setVoicePreference] = useState<VoiceTimePreference | undefined>();
  const [pendingVoiceTranscript, setPendingVoiceTranscript] = useState("");
  const [voiceUsed, setVoiceUsed] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    api("/api/public/booking/catalog")
      .then((d) => setLocations(d.locations || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!locationId) {
      setServices([]);
      setEmployees([]);
      return;
    }
    setLoading(true);
    api(`/api/public/booking/catalog?location_id=${encodeURIComponent(locationId)}`)
      .then((d) => {
        setServices(d.services || []);
        setEmployees(d.employees || []);
        if (!pendingVoiceTranscript) {
          setServiceIds([]);
          setEmployeeId("");
          setSlots([]);
          setSlot(null);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [locationId]);

  useEffect(() => {
    if (pendingVoiceTranscript && locationId && services.length) {
      const text = pendingVoiceTranscript;
      setPendingVoiceTranscript("");
      applyVoiceCommand(text, true);
    }
  }, [services, employees, pendingVoiceTranscript, locationId]);

  useEffect(() => {
    const Ctor = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    setVoiceSupported(Boolean(Ctor));
    return () => {
      try { recognitionRef.current?.abort?.(); } catch { /* noop */ }
    };
  }, []);

  const selected = useMemo(() => services.filter((s) => serviceIds.includes(s.id)), [services, serviceIds]);
  const total = useMemo(() => selected.reduce((a, s) => a + Number(s.price || 0), 0), [selected]);
  const duration = useMemo(() => selected.reduce((a, s) => a + Number(s.duration_minutes || 30), 0), [selected]);
  const categories = useMemo(() => Array.from(new Set(services.map((s) => s.category_name || "Egyéb"))), [services]);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hu-HU";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } catch { /* optional browser feature */ }
  }

  async function searchAvailability(preference = voicePreference, forceVoice = false) {
    if (!locationId || !serviceIds.length) return;
    setLoading(true);
    setError("");
    setSlot(null);
    try {
      const q = new URLSearchParams({ location_id: locationId, date, service_ids: serviceIds.join(",") });
      if (employeeId) q.set("employee_id", employeeId);
      const d = await api(`/api/public/booking/availability?${q}`);
      const found: Slot[] = d.slots || [];
      setSlots(found);

      if (forceVoice || voiceUsed) {
        const preferred = found.filter((s) => slotMatchesPreference(s.start, preference));
        const best = preferred[0] || found[0] || null;
        if (best) {
          setSlot(best);
          const when = new Date(best.start).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
          const alternatives = (preferred.length ? preferred : found).slice(0, 3).map((s) => new Date(s.start).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })).join(", ");
          const msg = `Találtam szabad időpontot. Az első megfelelő időpont ${when}, ${best.employee_name}. További lehetőségek: ${alternatives}. A kiválasztott időpontot a képernyőn is látja.`;
          setVoiceMessage(msg);
          speak(msg);
        } else {
          const msg = "Erre a napra nem találtam szabad időpontot. Válasszon másik napot, vagy kérjen várólistát.";
          setVoiceMessage(msg);
          speak(msg);
        }
      }
    } catch (e: any) {
      setError(e.message);
      if (forceVoice || voiceUsed) speak(`Nem sikerült lekérni a szabad időpontokat. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function submit(fromVoice = false) {
    if (!slot || !name || (!phone && !email)) {
      const msg = "A foglaláshoz név és telefonszám vagy e-mail cím szükséges.";
      setError(msg);
      if (fromVoice) speak(msg);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const d = await api("/api/public/booking/book", {
        method: "POST",
        body: JSON.stringify({
          location_id: locationId,
          employee_id: slot.employee_id,
          service_ids: serviceIds,
          client_name: name,
          phone,
          email,
          start_time: slot.start,
          note,
          marketing_consent: marketing,
          booking_source: fromVoice || voiceUsed ? "voice" : "online",
        }),
      });
      setDone(d);
      if (fromVoice || voiceUsed) speak("A foglalási igényt sikeresen rögzítettem. A visszaigazolást a megadott elérhetőségre küldjük.");
    } catch (e: any) {
      setError(e.message);
      if (fromVoice || voiceUsed) speak(`A foglalás nem sikerült. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function waitlist() {
    if (!name || (!phone && !email)) return setError("A várólistához is szükséges elérhetőség.");
    setLoading(true);
    setError("");
    try {
      await api("/api/public/booking/waitlist", {
        method: "POST",
        body: JSON.stringify({
          location_id: locationId,
          employee_id: employeeId || null,
          service_ids: serviceIds,
          client_name: name,
          phone,
          email,
          preferred_from: `${date}T00:00:00`,
          preferred_to: `${date}T23:59:59`,
          note,
          booking_source: voiceUsed ? "voice" : "online",
        }),
      });
      setWaitDone(true);
      if (voiceUsed) speak("A várólista igényt rögzítettem.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function applyVoiceCommand(text: string, catalogReady = false) {
    const cleaned = text.trim();
    if (!cleaned) return;
    setVoiceTranscript(cleaned);
    setVoiceUsed(true);

    const normalized = normalize(cleaned);
    if ((normalized.includes("foglalom") || normalized.includes("megerositem") || normalized.includes("igen ezt")) && slot) {
      void submit(true);
      return;
    }

    const intent = interpretVoiceBooking(cleaned, { locations, services, employees });
    setVoiceUnderstood(intent.understood);
    if (intent.date) setDate(intent.date);
    if (intent.timePreference) setVoicePreference(intent.timePreference);

    if (intent.locationId && intent.locationId !== locationId) {
      setLocationId(intent.locationId);
      setPendingVoiceTranscript(cleaned);
      const locationName = locations.find((x) => x.id === intent.locationId)?.name || "a kiválasztott szalon";
      const msg = `${locationName} kiválasztva. Betöltöm a szolgáltatásokat és a szakembereket.`;
      setVoiceMessage(msg);
      speak(msg);
      return;
    }

    if (intent.serviceIds.length) setServiceIds(intent.serviceIds);
    if (intent.employeeId) setEmployeeId(intent.employeeId);

    const effectiveServices = intent.serviceIds.length ? intent.serviceIds : serviceIds;
    const effectiveLocation = intent.locationId || locationId;
    const effectiveDate = intent.date || date;

    if (!effectiveLocation) {
      const msg = "Melyik Kleopátra szalonba szeretne időpontot?";
      setVoiceMessage(msg); speak(msg); return;
    }
    if (!effectiveServices.length) {
      if (!catalogReady && services.length === 0) {
        setPendingVoiceTranscript(cleaned);
        return;
      }
      const msg = "Milyen szolgáltatást szeretne? Mondja ki a szolgáltatás nevét.";
      setVoiceMessage(msg); speak(msg); return;
    }
    if (!intent.date && !effectiveDate) {
      const msg = "Melyik napra szeretne jönni? Például: holnap délután vagy jövő kedden.";
      setVoiceMessage(msg); speak(msg); return;
    }

    const msg = `Értettem: ${intent.understood.join(", ") || "a megadott feltételek"}. Megkeresem a szabad időpontokat.`;
    setVoiceMessage(msg);
    speak(msg);
    window.setTimeout(() => void searchAvailability(intent.timePreference || voicePreference, true), 120);
  }

  function startListening() {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setVoiceSupported(false);
      setVoiceOpen(true);
      return;
    }
    try {
      recognitionRef.current?.abort?.();
      const recognition = new Ctor();
      recognition.lang = "hu-HU";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => { setListening(true); setVoiceOpen(true); setVoiceMessage("Hallgatom… Mondja el, mikor és milyen szolgáltatást szeretne."); };
      recognition.onend = () => setListening(false);
      recognition.onerror = (event: any) => {
        setListening(false);
        const msg = event?.error === "not-allowed" ? "A mikrofon használata nincs engedélyezve a böngészőben." : "Nem sikerült felismerni a beszédet. Próbálja újra.";
        setVoiceMessage(msg);
      };
      recognition.onresult = (event: any) => {
        const text = String(event?.results?.[0]?.[0]?.transcript || "").trim();
        if (text) applyVoiceCommand(text);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
      setVoiceMessage("A mikrofon most nem indítható. A hangpanel szövegmezőjét továbbra is használhatja.");
    }
  }

  if (done) {
    return <main className="online-booking-page"><section className="booking-success"><span>✓</span><h1>Foglalási igény rögzítve</h1><p>{done.confirmation_required ? "A szalon munkatársa ellenőrzi az időpontot, majd visszaigazolást küld." : "Az időpont visszaigazolva."}</p><b>Foglalási azonosító: {done.id}</b><small>{done.booking_source === "online_voice" ? "Hangalapú foglalás · " : ""}Online kedvezmény: {done.online_discount_percent || 0}%</small></section></main>;
  }

  return <main className="online-booking-page">
    <header className="booking-hero">
      <span>ONLINE IDŐPONTFOGLALÁS</span>
      <h1>Foglaljon időpontot néhány lépésben</h1>
      <p>Válasszon szalont, szolgáltatásokat, szakembert és valós időben elérhető időpontot.</p>
      <div className="booking-hero-actions">
        <button className={`voice-booking-trigger ${listening ? "listening" : ""}`} onClick={startListening} type="button"><span className="voice-dot">●</span>{listening ? "Hallgatom…" : "Foglalás hanggal"}</button>
        <button className="voice-booking-info" onClick={() => setVoiceOpen((v) => !v)} type="button">Hogyan működik?</button>
      </div>
    </header>

    {voiceOpen && <section className="voice-booking-panel">
      <div className="voice-booking-head"><div><span>HANGASSZISZTENS</span><h2>Beszéljen természetesen</h2></div><button type="button" onClick={startListening} disabled={listening}>{listening ? "Hallgatom…" : "🎙 Új mondat"}</button></div>
      <p className="voice-message">{voiceMessage}</p>
      {!voiceSupported && <p className="voice-warning">Ebben a böngészőben a beszédfelismerés nem támogatott vagy nincs engedélyezve. Írja be ugyanazt a mondatot az alábbi mezőbe.</p>}
      <div className="voice-command-row"><input value={voiceTranscript} onChange={(e) => setVoiceTranscript(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") applyVoiceCommand(voiceTranscript); }} placeholder="Pl. Jövő péntek délután arckezelést szeretnék Annánál"/><button type="button" onClick={() => applyVoiceCommand(voiceTranscript)}>Értelmezés</button></div>
      {voiceUnderstood.length > 0 && <div className="voice-understood">{voiceUnderstood.map((x) => <span key={x}>✓ {x}</span>)}</div>}
      <small>A hangasszisztens ugyanazt a valós idejű foglalási API-t használja, mint a kézi foglalás. A foglalás csak a végleges megerősítéskor kerül mentésre.</small>
    </section>}

    {error && <div className="booking-public-error">{error}</div>}

    <div className="booking-public-grid">
      <section className="booking-public-card">
        <h2>1. Szalon és szolgáltatás</h2>
        <label>Szalon<select value={locationId} onChange={(e) => setLocationId(e.target.value)}><option value="">Válasszon szalont</option>{locations.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        {categories.map((cat) => <div className="booking-service-group" key={cat}><h3>{cat}</h3>{services.filter((s) => (s.category_name || "Egyéb") === cat).map((s) => <label className={serviceIds.includes(s.id) ? "selected" : ""} key={s.id}><input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => setServiceIds((v) => v.includes(s.id) ? v.filter((id) => id !== s.id) : [...v, s.id])}/><span><b>{s.name}</b><small>{s.duration_minutes || 30} perc · {Number(s.price || 0).toLocaleString("hu-HU")} Ft</small></span></label>)}</div>)}
        {selected.length > 0 && <div className="booking-summary"><b>{selected.length} szolgáltatás · {duration} perc</b><strong>{total.toLocaleString("hu-HU")} Ft</strong></div>}
      </section>

      <section className="booking-public-card">
        <h2>2. Szakember és időpont</h2>
        <label>Szakember<select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}><option value="">Bármelyik elérhető szakember</option>{employees.map((x) => <option key={x.id} value={x.id}>{x.full_name}</option>)}</select></label>
        <label>Dátum<input type="date" min={ymd(new Date())} value={date} onChange={(e) => setDate(e.target.value)}/></label>
        <button className="booking-search-button" disabled={!serviceIds.length || loading} onClick={() => searchAvailability()}>{loading ? "Keresés…" : "Szabad időpontok keresése"}</button>
        <div className="booking-slots">{slots.map((s) => <button className={slot?.start === s.start && slot.employee_id === s.employee_id ? "selected" : ""} key={`${s.employee_id}-${s.start}`} onClick={() => setSlot(s)}><b>{new Date(s.start).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</b><small>{s.employee_name}</small></button>)}</div>
        {!loading && serviceIds.length > 0 && slots.length === 0 && <div className="booking-no-slots"><p>Nincs szabad időpont ezen a napon.</p><button onClick={waitlist} disabled={!name || (!phone && !email)}>Kérek várólistát</button>{waitDone && <small>Várólista-igény rögzítve.</small>}</div>}
      </section>

      <section className="booking-public-card">
        <h2>3. Vendégadatok</h2>
        <label>Név<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Teljes név"/></label>
        <label>Telefonszám<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+36..."/></label>
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@pelda.hu"/></label>
        <label>Megjegyzés<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcionális megjegyzés"/></label>
        <label className="booking-consent"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}/><span>Hozzájárulok marketing célú kapcsolattartáshoz.</span></label>
        {slot && <div className="booking-final"><p><b>{new Date(slot.start).toLocaleDateString("hu-HU")}</b> · {new Date(slot.start).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</p><small>{slot.employee_name}{voiceUsed ? " · hangasszisztenssel kiválasztva" : ""}</small></div>}
        <button className="booking-submit" disabled={!slot || loading} onClick={() => submit(false)}>{loading ? "Mentés…" : "Foglalás véglegesítése"}</button>
        {voiceUsed && slot && <button className="voice-confirm-button" type="button" disabled={loading} onClick={() => submit(true)}>🎙 Hangos foglalás megerősítése</button>}
      </section>
    </div>
  </main>;
}
