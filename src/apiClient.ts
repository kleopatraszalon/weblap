// src/apiClient.ts
// Egységes kliens a publikus Kleopátra API-hoz (weblap számára)

export interface PublicSalon {
  id: string;
  slug: string;
  city_label: string;
  address?: string | null;
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

const STATIC_SALONS: PublicSalon[] = [
  { id: "budapest-ix", slug: "budapest-ix", city_label: "Kleopátra Szépségszalon – Budapest IX.", address: "Mester u. 1." },
  { id: "budapest-viii", slug: "budapest-viii", city_label: "Kleopátra Szépségszalon – Budapest VIII.", address: "Rákóczi u. 63." },
  { id: "budapest-xii", slug: "budapest-xii", city_label: "Kleopátra Szépségszalon – Budapest XII.", address: "Krisztina krt. 23." },
  { id: "budapest-xiii", slug: "budapest-xiii", city_label: "Kleopátra Szépségszalon – Budapest XIII.", address: "Visegrádi u. 3." },
  { id: "eger", slug: "eger", city_label: "Kleopátra Szépségszalon – Eger", address: "Dr. Nagy János u. 8." },
  { id: "gyongyos", slug: "gyongyos", city_label: "Kleopátra Szépségszalon – Gyöngyös", address: "Koháry u. 29." },
  { id: "salgotarjan", slug: "salgotarjan", city_label: "Kleopátra Szépségszalon – Salgótarján", address: "Füleki u. 44." },
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
    return data;
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
