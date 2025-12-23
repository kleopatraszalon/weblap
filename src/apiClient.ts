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
  // az API egyéb mezői is jöhetnek, de ezek kellenek a weblaphoz
  [key: string]: any;
}

// Statikus fallback szalonlista – ha az API nem érhető el
const STATIC_SALONS: PublicSalon[] = [
  {
    id: "budapest-ix",
    slug: "budapest-ix",
    city_label: "Kleopátra Szépségszalon – Budapest IX.",
    address: "Mester u. 1.",
  },
  {
    id: "budapest-viii",
    slug: "budapest-viii",
    city_label: "Kleopátra Szépségszalon – Budapest VIII.",
    address: "Rákóczi u. 63.",
  },
  {
    id: "budapest-xii",
    slug: "budapest-xii",
    city_label: "Kleopátra Szépségszalon – Budapest XII.",
    address: "Krisztina krt. 23.",
  },
  {
    id: "budapest-xiii",
    slug: "budapest-xiii",
    city_label: "Kleopátra Szépségszalon – Budapest XIII.",
    address: "Visegrádi u. 3.",
  },
  {
    id: "eger",
    slug: "eger",
    city_label: "Kleopátra Szépségszalon – Eger",
    address: "Dr. Nagy János u. 8.",
  },
  {
    id: "gyongyos",
    slug: "gyongyos",
    city_label: "Kleopátra Szépségszalon – Gyöngyös",
    address: "Koháry u. 29.",
  },
  {
    id: "salgotarjan",
    slug: "salgotarjan",
    city_label: "Kleopátra Szépségszalon – Salgótarján",
    address: "Füleki u. 44.",
  },
];

// API_BASE – a Vite-ból érkező környezeti változó
const RAW_API_BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  (typeof window !== "undefined"
    ? (window as any).__KLEO_API_BASE__ || ""
    : "");

export const API_BASE = RAW_API_BASE.replace(/\/$/, "");

// DEBUG (nyugodtan maradhat, segít hibakeresésnél)
if (typeof console !== "undefined") {
  console.log("[apiClient] API_BASE =", API_BASE || "(nincs beállítva)");
}

// Alacsony szintű fetch wrapper
async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    ...init,
  });

  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch {
      // ignore
    }
    console.error("[apiClient] HTTP error", res.status, text);
    throw new Error(`API hiba: ${res.status}`);
  }

  return res;
}

// JSON helper
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (typeof console !== "undefined") {
    console.log("[apiClient] fetchJson:", path);
  }
  const res = await apiFetch(path, init);
  return (await res.json()) as T;
}

// ===== SZALONOK =====

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

// ===== SZOLGÁLTATÁSOK =====

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
