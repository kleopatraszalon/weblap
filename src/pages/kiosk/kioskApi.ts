import type { CartItem, KioskCategory, KioskProduct, KioskService } from "./types";
import { API_BASE } from "../../apiClient";

const base = () => (API_BASE || "").replace(/\/$/, "");
async function json(r: Response) { const data = await r.json().catch(() => ({})); if (!r.ok) throw new Error(data.error || data.message || `HTTP ${r.status}`); return data; }

export async function fetchKioskContext(locationId?: string | null) {
  const qs = locationId ? `?location_id=${encodeURIComponent(locationId)}` : "";
  return json(await fetch(`${base()}/api/kiosk/context${qs}`, { credentials: "include" })) as Promise<{
    ok: true;
    locations: { id: string; name: string }[];
    employees: { id: string; full_name: string; location_id?: string | null; photo_url?: string | null }[];
  }>;
}

export async function fetchKioskServices(lang: string, locationId?: string | null) {
  const qs = new URLSearchParams({ lang: lang || "hu" });
  if (locationId) qs.set("locationId", locationId);
  const data = await json(await fetch(`${base()}/api/kiosk/services?${qs}`, { credentials: "include" }));
  return data as { ok: true; categories: KioskCategory[]; services: KioskService[] };
}

export async function fetchKioskProducts() {
  const candidates = [`${base()}/api/public/webshop/products`, `${base()}/api/webshop/products`];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { credentials: "include" });
      if (!r.ok) continue;
      const data: any = await r.json();
      return (Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []) as KioskProduct[];
    } catch { /* try next */ }
  }
  return [] as KioskProduct[];
}

export async function createKioskWorkOrder(input: {
  location_id: string;
  employee_id?: string | null;
  client_name: string;
  phone?: string;
  email?: string;
  note?: string;
  payment_method: string;
  items: CartItem[];
}) {
  return json(await fetch(`${base()}/api/kiosk/workorders`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }));
}
