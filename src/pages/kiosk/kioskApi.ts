import type { KioskCategory, KioskProduct, KioskService } from "./types";

function getApiBase() {
  // Vite dev: /api proxy -> backend
  return "/api";
}

export async function fetchKioskServices(lang: string, locationId?: string | null) {
  const base = getApiBase();
  const qs = new URLSearchParams();
  qs.set("lang", lang || "hu");
  if (locationId) qs.set("locationId", locationId);

  const r = await fetch(`${base}/kiosk/services?${qs.toString()}`);
  if (!r.ok) throw new Error(`kiosk_services_http_${r.status}`);
  const data = await r.json();
  if (!data?.ok) throw new Error(data?.error || "kiosk_services_failed");
  return data as { ok: true; categories: KioskCategory[]; services: KioskService[] };
}


async function safeJson<T>(r: Response): Promise<T> {
  return r.json().catch(() => ([] as unknown as T));
}

export async function fetchKioskProducts() {
  const candidates = [
    `${getApiBase()}/public/webshop/products`,
    `${getApiBase()}/webshop/products`,
  ];

  for (const url of candidates) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const data = await safeJson<any>(r);
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      return items as KioskProduct[];
    } catch {
      // try next endpoint
    }
  }

  return [] as KioskProduct[];
}
