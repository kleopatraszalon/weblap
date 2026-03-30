import type { KioskCategory, KioskProduct, KioskService } from "./types";
import { API_BASE } from "../../apiClient";

function getApiBase() {
  const raw = (API_BASE || "").replace(/\/$/, "");
  if (raw) return raw;
  return "";
}

async function parseJsonSafe(r: Response) {
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    const snippet = text.slice(0, 120).replace(/\s+/g, " ");
    throw new Error(`Nem JSON válasz érkezett az API-ból: ${snippet}`);
  }
}

export async function fetchKioskServices(lang: string, locationId?: string | null) {
  const base = getApiBase();
  const qs = new URLSearchParams();
  qs.set("lang", lang || "hu");
  if (locationId) qs.set("locationId", locationId);

  const candidates = [
    `${base}/api/kiosk/services?${qs.toString()}`,
    `${base}/api/public/services${locationId ? `?locationId=${encodeURIComponent(locationId)}` : ""}`,
  ];

  let lastErr: any = null;
  for (const url of candidates) {
    try {
      const r = await fetch(url, { credentials: "include" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: any = await parseJsonSafe(r);

      if (data?.ok && Array.isArray(data?.services)) {
        return data as { ok: true; categories: KioskCategory[]; services: KioskService[] };
      }

      if (Array.isArray(data)) {
        return {
          ok: true,
          categories: [],
          services: data.map((s: any) => ({
            id: String(s.id),
            name: s.name ?? s.name_hu ?? "",
            name_hu: s.name_hu ?? s.name ?? null,
            name_en: s.name_en ?? null,
            name_ru: s.name_ru ?? null,
            list_price: s.list_price ?? s.price ?? null,
            base_price: s.base_price ?? s.price ?? null,
            duration_minutes: s.duration_minutes ?? s.duration_min ?? null,
            category_id: s.category_id ?? s.service_type_id ?? null,
            category_name: s.category_name ?? s.service_type_name ?? s.category ?? null,
            category_name_hu: s.category_name_hu ?? s.category_name ?? s.service_type_name ?? null,
            category_name_en: s.category_name_en ?? null,
            category_name_ru: s.category_name_ru ?? null,
          })),
        };
      }

      if (Array.isArray(data?.items)) {
        return {
          ok: true,
          categories: [],
          services: data.items.map((s: any) => ({
            id: String(s.id),
            name: s.name ?? s.name_hu ?? "",
            name_hu: s.name_hu ?? s.name ?? null,
            name_en: s.name_en ?? null,
            name_ru: s.name_ru ?? null,
            list_price: s.list_price ?? s.price ?? null,
            base_price: s.base_price ?? s.price ?? null,
            duration_minutes: s.duration_minutes ?? s.duration_min ?? null,
            category_id: s.category_id ?? s.service_type_id ?? null,
            category_name: s.category_name ?? s.service_type_name ?? s.category ?? null,
            category_name_hu: s.category_name_hu ?? s.category_name ?? s.service_type_name ?? null,
            category_name_en: s.category_name_en ?? null,
            category_name_ru: s.category_name_ru ?? null,
          })),
        };
      }

      throw new Error("Ismeretlen válaszformátum");
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("kiosk_services_failed");
}

async function safeJson<T>(r: Response): Promise<T> {
  const text = await r.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function fetchKioskProducts() {
  const base = getApiBase();
  const candidates = [
    `${base}/api/public/webshop/products`,
    `${base}/api/webshop/products`,
  ];

  for (const url of candidates) {
    try {
      const r = await fetch(url, { credentials: "include" });
      if (!r.ok) continue;
      const data = await safeJson<any>(r);
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      return items as KioskProduct[];
    } catch {
    }
  }

  return [] as KioskProduct[];
}
