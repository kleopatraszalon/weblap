// src/apiClient.ts

// ---- Alap API URL beállítása (Vite + proxy) ----
const RAW_API_BASE = import.meta.env.VITE_API_BASE;

// Fejlesztéskor (ha nincs külön env), menjen simán /api-re, amit a Vite proxy kezel
export const API_BASE =
  (RAW_API_BASE && RAW_API_BASE.replace(/\/+$/, "")) || "/api";

console.log("[apiClient] API_BASE =", API_BASE);

// ---- Általános fetch wrapper ----
async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  // Public endpointokra ("/public/") ne vigyünk credentials-t,
  // minden másra marad az include (admin / belépett user).
  const isPublic = path.startsWith("/public/");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: isPublic ? "omit" : "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API hiba:", res.status, text);
    throw new Error(`API hiba: ${res.status} ${res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    // ha nem JSON a válasz, térjünk vissza null-lal
    // @ts-expect-error – engedjük, hogy null is lehessen
    return null;
  }

  return (await res.json()) as T;
}

// Ezt használjuk általános API híváshoz (pl. WebshopPage)
export const apiFetch = request;

// ====== TÍPUSOK – iránymutatás, nyugodtan bővíthető a valós séma szerint ======

export interface PublicSalon {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface PublicService {
  id: string;
  name_hu?: string;
  name_en?: string;
  name_ru?: string;
  category_id?: string;
  base_price?: number;
  duration_minutes?: number;
}

// ====== SZALONOK (SalonPage / SalonDetailPage) ======

export async function getPublicSalons(): Promise<PublicSalon[]> {
  // GET /api/public/salons – backend oldalon ehhez legyen endpointod
  return request<PublicSalon[]>("/public/salons");
}

export async function getPublicSalonById(id: string): Promise<PublicSalon> {
  // GET /api/public/salons/:id
  return request<PublicSalon>(`/public/salons/${id}`);
}

// ====== SZOLGÁLTATÁSOK (PriceListPage) ======

export async function getPublicServices(): Promise<PublicService[]> {
  // GET /api/public/services – ha máshol van az endpoint, ezt a path-ot írd át
  return request<PublicService[]>("/public/services");
}
