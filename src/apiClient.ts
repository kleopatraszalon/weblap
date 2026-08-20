// src/apiClient.ts
// Egységes kliens a publikus Kleopátra API-hoz (weblap számára)

export interface PublicSalon {
  id: string;
  slug: string;
  city_label: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  phone_secondary?: string | null;
  hours?: string | null;
  review_count?: number | null;
  rating?: number | null;
}

export interface PublicService {
  id: string;
  name: string;
  duration_min: number | null;
  price: number | null;
  location_id: number | null;
  service_type_id?: number | null;
  [key: string]: any;
}

// Ellenőrzött publikus szalon-metaadatok. Az API-ból érkező dinamikus értékeléseket
// megtartjuk, de a vendég számára kritikus címet / telefont / nyitvatartást ezzel
// a réteggel normalizáljuk, hogy hibás háttéradat ne kerüljön ki a weboldalra.
const STATIC_SALONS: PublicSalon[] = [
  { id: "budapest-ix", slug: "budapest-ix", city_label: "Budapest IX.", address: "1095 Budapest, Mester u. 1.", latitude: 47.4829, longitude: 19.0691, phone: "+36 30 278 4571", hours: "Hétfő–Péntek 07:00–20:00, Szombat 07:00–16:00" },
  { id: "budapest-viii", slug: "budapest-viii", city_label: "Budapest VIII.", address: "1081 Budapest, Rákóczi út 63.", latitude: 47.4982, longitude: 19.077, phone: "+36 30 699 7991", hours: "Hétfő–Péntek 07:00–20:00, Szombat 07:00–19:00" },
  { id: "budapest-xii", slug: "budapest-xii", city_label: "Budapest XII.", address: "1122 Budapest, Krisztina krt. 23.", latitude: 47.5005, longitude: 19.0301, phone: "+36 30 434 9662", phone_secondary: "+36 1 201 9825", hours: "Hétfő–Péntek 07:00–20:00, Szombat 07:00–15:00" },
  { id: "budapest-xiii", slug: "budapest-xiii", city_label: "Budapest XIII.", address: "1132 Budapest, Visegrádi u. 3.", latitude: 47.512, longitude: 19.0522, phone: "+36 30 905 7765", phone_secondary: "+36 1 239 2566", hours: "Hétfő–Péntek 07:00–21:00, Szombat 07:00–15:00" },
  { id: "eger", slug: "eger", city_label: "Eger", address: "3300 Eger, Dr. Nagy János u. 8.", latitude: 47.9022, longitude: 20.3745, phone: "+36 30 303 8262", phone_secondary: "+36 36 786 248", hours: "Hétfő–Péntek 07:00–19:00, Szombat 07:00–16:00" },
  { id: "gyongyos", slug: "gyongyos", city_label: "Gyöngyös", address: "3200 Gyöngyös, Koháry út 29.", latitude: 47.7834, longitude: 19.9297, phone: "+36 30 684 6129", phone_secondary: "+36 37 500 366", hours: "Hétfő–Péntek 07:00–20:00, Szombat 07:00–19:00" },
  { id: "salgotarjan", slug: "salgotarjan", city_label: "Salgótarján", address: "3100 Salgótarján, Füleki út 44.", latitude: 48.1034, longitude: 19.8061, phone: "+36 30 248 0544", phone_secondary: "+36 32 786 997", hours: "Hétfő–Péntek 07:00–19:00, Szombat 07:00–15:00" },
];

function normalizeBase(value: unknown) {
  // A frontend minden végpontot /api/... formában hív. Ha Renderben a
  // VITE_API_BASE véletlenül már /api végződésű, korábban /api/api/... lett,
  // ami 404-et okozott. Itt mindig a host gyökerére normalizálunk.
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

const ENV_API_BASE = normalizeBase(
  (import.meta as any).env?.VITE_API_BASE ||
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== "undefined" ? (window as any).__KLEO_API_BASE__ : "")
);

const DEFAULT_API_BASE =
  typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:5000"
    : "https://kleoszalon-api-1.onrender.com";

// A publikus oldal akkor is a valódi backendhez fordul, ha a Render static site-on
// véletlenül nincs VITE_API_BASE környezeti változó beállítva.
export const API_BASE = ENV_API_BASE || DEFAULT_API_BASE;

if (typeof console !== "undefined") {
  console.log("[apiClient] API_BASE =", API_BASE);
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      mode: "cors",
      credentials: "include",
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch (error) {
    console.error("[apiClient] hálózati hiba", url, error);
    throw new Error("A Kleopátra szerver jelenleg nem érhető el. Kérjük, próbálja újra néhány másodperc múlva.");
  }

  if (!res.ok) {
    let message = `API hiba: ${res.status}`;
    try {
      const payload = await res.json();
      message = payload?.error || payload?.message || payload?.detail || message;
    } catch {
      try {
        const text = await res.text();
        if (text) message = text;
      } catch {
        // ignore
      }
    }
    console.error("[apiClient] HTTP error", res.status, url, message);
    throw new Error(message);
  }

  return res;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  return (await res.json()) as T;
}

export async function getPublicSalons(): Promise<PublicSalon[]> {
  try {
    const data = await fetchJson<PublicSalon[]>("/api/public/salons");
    if (!Array.isArray(data) || data.length === 0) return STATIC_SALONS;

    return data.map((salon) => {
      const trusted = STATIC_SALONS.find(
        (item) => item.slug === salon.slug || item.id === String(salon.id)
      );
      if (!trusted) return salon;

      return {
        ...salon,
        city_label: trusted.city_label,
        address: trusted.address,
        latitude: trusted.latitude,
        longitude: trusted.longitude,
        phone: trusted.phone,
        phone_secondary: trusted.phone_secondary,
        hours: trusted.hours,
      };
    });
  } catch (err) {
    console.error("getPublicSalons hiba, STATIC_SALONS fallback:", err);
    return STATIC_SALONS;
  }
}

export async function getPublicServices(): Promise<PublicService[]> {
  try {
    const data = await fetchJson<PublicService[]>("/api/public/services");
    if (!Array.isArray(data)) return [];
    return data;
  } catch (err) {
    console.error("getPublicServices hiba:", err);
    return [];
  }
}
