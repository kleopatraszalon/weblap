import React from "react";
import { fetchKioskServices } from "./kioskApi";
import type { KioskCategory, KioskService } from "./types";

const FALLBACK_IMAGES = [
  "/kiosk/tiles/fodraszat.png",
  "/kiosk/tiles/kez_es_labapolas.png",
  "/kiosk/tiles/kozmetika.png",
  "/kiosk/tiles/masszazs.png",
  "/kiosk/tiles/testkezeles.png",
  "/kiosk/tiles/wellness_fitness_szolarium.png",
];

const normalize = (value: string | null | undefined) =>
  (value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function fallbackImageFor(name: string, index = 0) {
  const n = normalize(name);
  if (n.includes("haj") || n.includes("fodras")) return FALLBACK_IMAGES[0];
  if (n.includes("kez") || n.includes("lab") || n.includes("korom") || n.includes("manik") || n.includes("pedik")) return FALLBACK_IMAGES[1];
  if (n.includes("kozmet") || n.includes("arc") || n.includes("bor") || n.includes("smink") || n.includes("szortelen")) return FALLBACK_IMAGES[2];
  if (n.includes("massz")) return FALLBACK_IMAGES[3];
  if (n.includes("test") || n.includes("alak") || n.includes("cellulit") || n.includes("kavit") || n.includes("zsirbont") || n.includes("feszes")) return FALLBACK_IMAGES[4];
  if (n.includes("wellness") || n.includes("fitness") || n.includes("spa") || n.includes("szol")) return FALLBACK_IMAGES[5];
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function buildImageMap(categories: KioskCategory[], services: KioskService[]) {
  const images = new Map<string, string>();

  categories.forEach((category, index) => {
    const image = category.image_path || fallbackImageFor(category.name, index);
    images.set(normalize(category.name), image);
  });

  services.forEach((service, index) => {
    const name = service.category_name_hu || service.category_name || service.name_hu || service.name;
    const image = service.category_image || service.image_url || fallbackImageFor(name, index);
    const key = normalize(name);
    if (key && !images.has(key)) images.set(key, image);
  });

  return images;
}

/**
 * Theme artwork used to replace the real catalogue thumbnails. This controller
 * restores exactly the same API-provided category artwork/fallback logic that
 * Classic uses, regardless of the selected visual theme.
 */
export function KioskClassicImageParity() {
  const imageMapRef = React.useRef<Map<string, string>>(new Map());
  const observerRef = React.useRef<MutationObserver | null>(null);

  const applyImages = React.useCallback(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".kiosk-theme-service-art");
    nodes.forEach((node, index) => {
      const label = node.getAttribute("aria-label") || "";
      const image = imageMapRef.current.get(normalize(label)) || fallbackImageFor(label, index);
      node.style.setProperty("background-image", `url(\"${image}\")`, "important");
      node.style.setProperty("background-position", "center", "important");
      node.style.setProperty("background-size", "cover", "important");
      node.style.setProperty("background-repeat", "no-repeat", "important");
    });
  }, []);

  const refresh = React.useCallback(async () => {
    const locationId = localStorage.getItem("kiosk_location_id") || undefined;
    const lang = localStorage.getItem("kiosk_lang") || "hu";
    try {
      const data = await fetchKioskServices(lang, locationId);
      imageMapRef.current = buildImageMap(data.categories || [], data.services || []);
    } catch {
      imageMapRef.current = new Map();
    }
    requestAnimationFrame(applyImages);
  }, [applyImages]);

  React.useEffect(() => {
    refresh();

    const onRefresh = () => refresh();
    const onTheme = () => requestAnimationFrame(applyImages);
    window.addEventListener("kiosk-location-change", onRefresh as EventListener);
    window.addEventListener("kiosk-lang-change", onRefresh as EventListener);
    window.addEventListener("kiosk-visual-mode-change", onTheme as EventListener);

    observerRef.current = new MutationObserver(() => requestAnimationFrame(applyImages));
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("kiosk-location-change", onRefresh as EventListener);
      window.removeEventListener("kiosk-lang-change", onRefresh as EventListener);
      window.removeEventListener("kiosk-visual-mode-change", onTheme as EventListener);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [applyImages, refresh]);

  return null;
}

export default KioskClassicImageParity;
