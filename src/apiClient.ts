// src/apiClient.ts

export interface PublicService {
  id: string;
  name: string;
  duration_min: number | null;
  price: number | null;
  category_id?: number | null;
  location_id?: number | null;
}

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, init);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${text || "Not Found"}`);
  }

  return text ? (JSON.parse(text) as T) : (null as any);
}

// … és a többi (getPublicServices, getPublicSalons) maradhat ahogy megbeszéltük
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

// ===== ALAP API URL – CSAK EGYSZER! =====

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

// ===== ÁLTALÁNOS JSON FETCH =====

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, init);

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return text ? (JSON.parse(text) as T) : (null as any);
}

// ===== STATIKUS SZALONLISTA (BIZTONSÁGI TARTALÉK) =====

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

// Ha valahol mégis kell API-s szalon lekérdezés, itt van fallbackkel
export async function getPublicSalons(): Promise<PublicSalon[]> {
  try {
    const data = await fetchJson<PublicSalon[]>("/api/public/salons");
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(
        "getPublicSalons: üres vagy hibás válasz, STATIC_SALONS visszaadva."
      );
      return STATIC_SALONS;
    }
    return data;
  } catch (err) {
    console.error("getPublicSalons hiba, STATIC_SALONS fallback:", err);
    return STATIC_SALONS;
  }
}

// ===== SZOLGÁLTATÁSOK TELEPHELY SZERINT =====

export async function getPublicServices(
  locationId?: number | null
): Promise<PublicService[]> {
  const qs = locationId ? `?locationId=${locationId}` : "";
  return fetchJson<PublicService[]>(`/api/public/services${qs}`);
}
