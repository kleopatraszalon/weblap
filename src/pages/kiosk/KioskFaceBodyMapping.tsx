import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, readCart, writeCart } from "./cartStore";
import { fetchKioskServices } from "./kioskApi";
import type { KioskService } from "./types";

type ViewMode = "face" | "body-front" | "body-back";
type Zone = { id: string; label: string; x: number; y: number; w?: number; h?: number };

type MappingDraft = {
  serviceId: string;
  view: ViewMode;
  zones: string[];
  note: string;
  updatedAt: string;
};

const STORAGE_KEY = "kiosk_face_body_mapping_v1";

const FACE_ZONES: Zone[] = [
  { id: "forehead", label: "Homlok", x: 50, y: 20, w: 27, h: 11 },
  { id: "temple-left", label: "Bal halánték", x: 31, y: 32, w: 13, h: 11 },
  { id: "temple-right", label: "Jobb halánték", x: 69, y: 32, w: 13, h: 11 },
  { id: "eye-left", label: "Bal szemkörnyék", x: 38, y: 39, w: 17, h: 9 },
  { id: "eye-right", label: "Jobb szemkörnyék", x: 62, y: 39, w: 17, h: 9 },
  { id: "nose", label: "Orr", x: 50, y: 49, w: 14, h: 18 },
  { id: "cheek-left", label: "Bal orca", x: 34, y: 53, w: 20, h: 17 },
  { id: "cheek-right", label: "Jobb orca", x: 66, y: 53, w: 20, h: 17 },
  { id: "upper-lip", label: "Felső ajak", x: 50, y: 63, w: 20, h: 8 },
  { id: "chin", label: "Áll", x: 50, y: 75, w: 23, h: 13 },
  { id: "jaw-left", label: "Bal állív", x: 35, y: 70, w: 17, h: 11 },
  { id: "jaw-right", label: "Jobb állív", x: 65, y: 70, w: 17, h: 11 },
  { id: "neck-front", label: "Nyak", x: 50, y: 91, w: 28, h: 12 },
];

const BODY_FRONT_ZONES: Zone[] = [
  { id: "decollete", label: "Dekoltázs", x: 50, y: 19, w: 31, h: 10 },
  { id: "arm-left-front", label: "Bal kar", x: 28, y: 36, w: 13, h: 32 },
  { id: "arm-right-front", label: "Jobb kar", x: 72, y: 36, w: 13, h: 32 },
  { id: "abdomen", label: "Has", x: 50, y: 42, w: 27, h: 22 },
  { id: "waist-left", label: "Bal derék", x: 39, y: 48, w: 12, h: 18 },
  { id: "waist-right", label: "Jobb derék", x: 61, y: 48, w: 12, h: 18 },
  { id: "thigh-left-front", label: "Bal comb", x: 42, y: 67, w: 15, h: 29 },
  { id: "thigh-right-front", label: "Jobb comb", x: 58, y: 67, w: 15, h: 29 },
  { id: "shin-left", label: "Bal lábszár", x: 43, y: 88, w: 13, h: 22 },
  { id: "shin-right", label: "Jobb lábszár", x: 57, y: 88, w: 13, h: 22 },
];

const BODY_BACK_ZONES: Zone[] = [
  { id: "shoulders", label: "Vállöv", x: 50, y: 22, w: 37, h: 11 },
  { id: "upper-back", label: "Felső hát", x: 50, y: 33, w: 29, h: 15 },
  { id: "lower-back", label: "Derék / alsó hát", x: 50, y: 48, w: 27, h: 15 },
  { id: "arm-left-back", label: "Bal kar", x: 28, y: 37, w: 13, h: 32 },
  { id: "arm-right-back", label: "Jobb kar", x: 72, y: 37, w: 13, h: 32 },
  { id: "glute-left", label: "Bal far", x: 43, y: 59, w: 17, h: 14 },
  { id: "glute-right", label: "Jobb far", x: 57, y: 59, w: 17, h: 14 },
  { id: "thigh-left-back", label: "Bal comb", x: 42, y: 73, w: 15, h: 27 },
  { id: "thigh-right-back", label: "Jobb comb", x: 58, y: 73, w: 15, h: 27 },
  { id: "calf-left", label: "Bal vádli", x: 43, y: 91, w: 13, h: 19 },
  { id: "calf-right", label: "Jobb vádli", x: 57, y: 91, w: 13, h: 19 },
];

function zonesFor(view: ViewMode) {
  return view === "face" ? FACE_ZONES : view === "body-front" ? BODY_FRONT_ZONES : BODY_BACK_ZONES;
}

function readDraft(): MappingDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(draft: MappingDraft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function KioskFaceBodyMapping() {
  const nav = useNavigate();
  const initial = React.useMemo(() => readDraft(), []);
  const [services, setServices] = React.useState<KioskService[]>([]);
  const [serviceId, setServiceId] = React.useState(initial?.serviceId || "");
  const [view, setView] = React.useState<ViewMode>(initial?.view || "face");
  const [selectedZones, setSelectedZones] = React.useState<string[]>(initial?.zones || []);
  const [note, setNote] = React.useState(initial?.note || "");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const locationId = localStorage.getItem("kiosk_location_id") || undefined;
    const lang = localStorage.getItem("kiosk_lang") || "hu";
    fetchKioskServices(lang, locationId)
      .then((data) => setServices(data.services || []))
      .catch((e) => setError(e?.message || "A kezelések betöltése sikertelen."))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    saveDraft({ serviceId, view, zones: selectedZones, note, updatedAt: new Date().toISOString() });
  }, [serviceId, view, selectedZones, note]);

  const currentZones = zonesFor(view);
  const selectedService = services.find((service) => String(service.id) === serviceId);

  function toggleZone(id: string) {
    setSaved(false);
    setSelectedZones((prev) => prev.includes(id) ? prev.filter((zone) => zone !== id) : [...prev, id]);
  }

  function changeView(next: ViewMode) {
    setSaved(false);
    setView(next);
    setSelectedZones([]);
  }

  function clearMapping() {
    setSelectedZones([]);
    setNote("");
    setSaved(false);
  }

  function attachTreatment() {
    if (!selectedService) return setError("Válassz kezelést a térképhez.");
    if (!selectedZones.length) return setError("Jelölj ki legalább egy kezelési területet.");
    setError("");

    const mapping = {
      view,
      zones: selectedZones,
      zone_labels: currentZones.filter((zone) => selectedZones.includes(zone.id)).map((zone) => zone.label),
      note: note.trim(),
      mapped_at: new Date().toISOString(),
    };
    const cart = readCart();
    const existing = cart.find((item) => item.id === selectedService.id);
    const title = selectedService.name_hu || selectedService.name;
    const price = Number(selectedService.list_price ?? selectedService.base_price ?? 0);
    const meta = {
      kind: "service",
      duration: selectedService.duration_minutes,
      category_id: selectedService.category_id,
      image_url: selectedService.image_url || selectedService.category_image,
      face_body_mapping: mapping,
    };

    if (existing) {
      writeCart(cart.map((item) => item.id === selectedService.id ? { ...item, title, price, meta: { ...(item.meta || {}), ...meta } } : item));
    } else {
      addToCart({ id: selectedService.id, title, price, meta }, 1);
    }

    saveDraft({ serviceId, view, zones: selectedZones, note, updatedAt: new Date().toISOString() });
    setSaved(true);
  }

  return <div className="kiosk-mapping-page">
    <div className="kiosk-mapping-toolbar">
      <button type="button" onClick={() => nav("/kiosk")}>← Főmenü</button>
      <div><span>17. FUNKCIÓ</span><b>Face / Body Mapping</b></div>
      <button type="button" className="mapping-pay-link" onClick={() => nav("/kiosk/pay")}>Kosár →</button>
    </div>

    <section className="kiosk-mapping-hero">
      <div>
        <span className="mapping-kicker">KEZELÉSI TÉRKÉP · KLEOPÁTRA 2026</span>
        <h1>Mutasd meg pontosan, hol szeretnéd a kezelést.</h1>
        <p>Válassz kezelést, jelöld meg az arc vagy a test érintett területeit, majd kösd a térképet közvetlenül a kiválasztott szolgáltatáshoz.</p>
      </div>
      <div className="mapping-hero-stat"><strong>{selectedZones.length}</strong><span>kijelölt terület</span></div>
    </section>

    {error && <div className="kioskError">{error}</div>}
    {saved && <div className="kiosk-mapping-success">✓ A kezelési térkép hozzá lett kötve a kosárban lévő szolgáltatáshoz.</div>}

    <div className="kiosk-mapping-grid">
      <section className="mapping-control-card">
        <div className="mapping-step"><span>01</span><div><b>Kezelés kiválasztása</b><small>A kiosk aktuális szolgáltatáslistájából</small></div></div>
        <label className="mapping-service-select">
          <span>Kezelés</span>
          <select value={serviceId} onChange={(e) => { setServiceId(e.target.value); setSaved(false); }} disabled={loading}>
            <option value="">{loading ? "Kezelések betöltése…" : "Válassz kezelést"}</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.category_name ? `${service.category_name} · ` : ""}{service.name_hu || service.name}</option>)}
          </select>
        </label>
        {selectedService && <div className="mapping-service-summary"><b>{selectedService.name_hu || selectedService.name}</b><span>{selectedService.duration_minutes ? `${selectedService.duration_minutes} perc · ` : ""}{Number(selectedService.list_price ?? selectedService.base_price ?? 0).toLocaleString("hu-HU")} Ft</span></div>}

        <div className="mapping-step"><span>02</span><div><b>Nézet kiválasztása</b><small>Arc, test elöl vagy test hátul</small></div></div>
        <div className="mapping-view-tabs">
          <button className={view === "face" ? "active" : ""} onClick={() => changeView("face")}><span>◉</span>Arc</button>
          <button className={view === "body-front" ? "active" : ""} onClick={() => changeView("body-front")}><span>♙</span>Test · elöl</button>
          <button className={view === "body-back" ? "active" : ""} onClick={() => changeView("body-back")}><span>♟</span>Test · hátul</button>
        </div>

        <div className="mapping-step"><span>03</span><div><b>Megjegyzés</b><small>Opcionális információ a szakembernek</small></div></div>
        <textarea className="mapping-note" value={note} onChange={(e) => { setNote(e.target.value); setSaved(false); }} placeholder="Pl. érzékeny terület, kerülendő rész, korábbi kezelés…" />

        <div className="mapping-actions">
          <button className="mapping-clear" type="button" onClick={clearMapping}>Törlés</button>
          <button className="mapping-attach" type="button" onClick={attachTreatment}>Kezeléshez kötés <span>→</span></button>
        </div>
      </section>

      <section className="mapping-canvas-card">
        <div className="mapping-canvas-head"><div><span>04</span><b>Érintsd meg a kezelendő zónákat</b></div><small>Több terület is kijelölhető</small></div>
        <div className={`mapping-anatomy mapping-${view}`}>
          <AnatomyFigure view={view} />
          {currentZones.map((zone) => <button
            key={zone.id}
            type="button"
            className={`mapping-zone ${selectedZones.includes(zone.id) ? "selected" : ""}`}
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w || 16}%`, height: `${zone.h || 10}%` }}
            onClick={() => toggleZone(zone.id)}
            aria-pressed={selectedZones.includes(zone.id)}
            title={zone.label}
          ><span>{selectedZones.includes(zone.id) ? "✓" : "+"}</span><b>{zone.label}</b></button>)}
        </div>
        <div className="mapping-selected-list">
          <span>Kijelölve</span>
          <div>{selectedZones.length ? currentZones.filter((zone) => selectedZones.includes(zone.id)).map((zone) => <button key={zone.id} onClick={() => toggleZone(zone.id)}>{zone.label} ×</button>) : <small>Még nincs kijelölt terület.</small>}</div>
        </div>
      </section>
    </div>
  </div>;
}

function AnatomyFigure({ view }: { view: ViewMode }) {
  if (view === "face") return <svg className="mapping-figure-svg" viewBox="0 0 300 420" aria-hidden="true">
    <defs><linearGradient id="faceFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".09"/><stop offset="1" stopColor="currentColor" stopOpacity=".025"/></linearGradient></defs>
    <path d="M150 35c-62 0-101 48-101 118 0 83 36 153 101 188 65-35 101-105 101-188 0-70-39-118-101-118Z" fill="url(#faceFill)" stroke="currentColor" strokeWidth="2"/>
    <path d="M88 149c19-13 40-14 57-3M155 146c18-11 40-10 58 3M150 139v70l-18 11 18 5 18-5M114 258c24 20 49 21 72 0M77 116c18-42 44-59 73-59s55 17 73 59M111 342v46M189 342v46" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".45"/>
  </svg>;

  const back = view === "body-back";
  return <svg className="mapping-figure-svg" viewBox="0 0 300 620" aria-hidden="true">
    <path d="M150 28c-28 0-48 21-48 49s20 49 48 49 48-21 48-49-20-49-48-49Z" fill="currentColor" opacity=".055" stroke="currentColor" strokeWidth="2"/>
    <path d="M104 120c-28 16-48 54-51 101l-11 121 24 4 21-102 13 118-18 125-16 110h37l28-109 19-105 19 105 28 109h37l-16-110-18-125 13-118 21 102 24-4-11-121c-3-47-23-85-51-101-18 15-75 15-92 0Z" fill="currentColor" opacity=".055" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d={back ? "M112 149c25 14 51 14 76 0M150 133v213M106 214c28 13 60 13 88 0M118 347c21 11 43 11 64 0" : "M150 133v213M111 189h78M120 255h60M110 344h80"} fill="none" stroke="currentColor" strokeWidth="2" opacity=".36" strokeLinecap="round"/>
  </svg>;
}

export default KioskFaceBodyMapping;
