import type { CartItem, KioskCategory, KioskProduct, KioskService } from "./types";
import { API_BASE } from "../../apiClient";

const base = () => (API_BASE || "").replace(/\/$/, "");
async function json(r: Response) { const data = await r.json().catch(() => ({})); if (!r.ok) throw new Error(data.error || data.message || `HTTP ${r.status}`); return data; }

export async function fetchKioskContext(locationId?: string | null) {
  const qs = locationId ? `?location_id=${encodeURIComponent(locationId)}` : "";
  return json(await fetch(`${base()}/api/kiosk/context${qs}`, { credentials: "include" })) as Promise<{
    ok: true;
    bound_location?: { id: string; name: string } | null;
    device?: { id: string; device_key: string; name: string; location_id: string } | null;
    locations: { id: string; name: string }[];
    employees: { id: string; full_name: string; location_id?: string | null; photo_url?: string | null }[];
  }>;
}

export async function fetchKioskConfig(locationId?: string | null) {
  const qs = locationId ? `?location_id=${encodeURIComponent(locationId)}` : "";
  return json(await fetch(`${base()}/api/kiosk/config${qs}`, { credentials: "include" })) as Promise<{
    ok: true;
    location_id: string | null;
    location?: { id: string; name: string } | null;
    menu: null | { id: string; name: string; is_active: boolean; theme: Record<string, any>; updated_at?: string };
    sections?: { id: string; title: string; subtitle?: string; image_url?: string; enabled?: boolean; display_order?: number }[];
    productSections?: { id: string; title: string; subtitle?: string; image_url?: string; enabled?: boolean; display_order?: number }[];
  }>;
}

export async function fetchKioskServices(lang: string, locationId?: string | null) {
  const qs = new URLSearchParams({ lang: lang || "hu" });
  if (locationId) qs.set("locationId", locationId);
  const data = await json(await fetch(`${base()}/api/kiosk/services?${qs}`, { credentials: "include" }));
  return data as { ok: true; location?: { id: string; name: string }; categories: KioskCategory[]; services: KioskService[]; menu?: { id: string; name: string; is_active: boolean; theme: Record<string, any> } | null };
}

export async function fetchKioskProducts(locationId?: string | null) {
  const qs = locationId ? `?locationId=${encodeURIComponent(locationId)}` : "";
  const data = await json(await fetch(`${base()}/api/kiosk/products${qs}`, { credentials: "include" }));
  return data as { ok: true; location?: { id: string; name: string }; categories: KioskCategory[]; products: KioskProduct[]; menu?: { id: string; name: string; is_active: boolean; theme: Record<string, any> } | null };
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
