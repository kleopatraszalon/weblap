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

function catalogParams(locationId?: string | null, lang?: string) {
  const qs = new URLSearchParams();
  if (lang) qs.set("lang", lang);
  if (locationId) {
    // The kiosk API has used both query naming conventions during earlier releases.
    // Sending both keeps deployed API revisions compatible while location_id remains canonical elsewhere.
    qs.set("location_id", locationId);
    qs.set("locationId", locationId);
  }
  return qs.toString();
}

export async function fetchKioskServices(lang: string, locationId?: string | null) {
  const load = async (withLocation: boolean) => {
    const query = catalogParams(withLocation ? locationId : null, lang || "hu");
    return json(await fetch(`${base()}/api/kiosk/services?${query}`, { credentials: "include" })) as Promise<{
      ok: true;
      location?: { id: string; name: string };
      categories: KioskCategory[];
      services: KioskService[];
      menu?: { id: string; name: string; is_active: boolean; theme: Record<string, any> } | null;
    }>;
  };

  const scoped = await load(true);
  if (locationId && !(scoped.services?.length || scoped.categories?.length)) {
    // A missing/legacy location binding must not leave the kiosk with an empty sidebar.
    // Fall back to the active global kiosk catalogue; checkout still keeps the bound location.
    return load(false);
  }
  return scoped;
}

export async function fetchKioskProducts(locationId?: string | null) {
  const load = async (withLocation: boolean) => {
    const query = catalogParams(withLocation ? locationId : null);
    return json(await fetch(`${base()}/api/kiosk/products${query ? `?${query}` : ""}`, { credentials: "include" })) as Promise<{
      ok: true;
      location?: { id: string; name: string };
      categories: KioskCategory[];
      products: KioskProduct[];
      menu?: { id: string; name: string; is_active: boolean; theme: Record<string, any> } | null;
    }>;
  };

  const scoped = await load(true);
  if (locationId && !(scoped.products?.length || scoped.categories?.length)) return load(false);
  return scoped;
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
