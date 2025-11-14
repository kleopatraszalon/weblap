// src/apiClient.ts

// ===== TÍPUSOK =====

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
  category_id?: number | null;
  location_id?: number | null;
}

// ===== API BASE =====

const API_BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin)
).replace(/\/$/, "");

// DEBUG (nyugodtan hagyhatod, segít hibakeresésnél)
if (typeof window !== "undefined") {
  console.log("[apiClient] API_BASE =", API_BASE);
}

// ===== ÁLTALÁNOS FETCH =====

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  console.log("[apiClient] fetchJson:", url);

  const res = await fetch(url, init);
  const text = await res.text();

  if (!res.ok) {
    console.error("[apiClient] HTTP error", res.status, text);
    throw new Error(`API error ${res.status}: ${text || "Not Found"}`);
  }

  return text ? (JSON.parse(text) as T) : (null as any);
}

// ===== STATIKUS SZALONLISTA (fallback) =====

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

// ha valaha kell szalon API-ból, itt fallbackelünk a statikus listára
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
  return fetchJson<PublicService[]>("/api/public/services");
}
