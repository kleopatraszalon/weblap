import type { KioskCategory, KioskService } from "./types";

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
