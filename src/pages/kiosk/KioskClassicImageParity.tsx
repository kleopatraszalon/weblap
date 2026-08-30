import React from "react";
import { fetchKioskServices } from "./kioskApi";
import type { KioskCategory, KioskService } from "./types";

const IMAGE = {
  beautyPlus: "/kiosk/tiles/01_beauty_plus.png",
  gift: "/kiosk/tiles/03_ajandekutalvanyok.png",
  hair: "/kiosk/tiles/04_fodraszat.png",
  handsFeet: "/kiosk/tiles/05_kez_es_labapolas.png",
  cosmetics: "/kiosk/tiles/06_kozmetika.png",
  men: "/kiosk/tiles/07_ferfiaknak.png",
  massage: "/kiosk/tiles/08_masszazs.png",
  body: "/kiosk/tiles/09_testkezeles.png",
  teens: "/kiosk/tiles/10_tinik_es_gyerekek.png",
  kids: "/kiosk/tiles/11_gyerekeknek_kids_project.png",
  wellness: "/kiosk/tiles/12_wellness_fitness_szolarium.png",
} as const;

const FALLBACK_IMAGES = [IMAGE.hair, IMAGE.handsFeet, IMAGE.cosmetics, IMAGE.massage, IMAGE.body, IMAGE.wellness];

const normalize = (value: string | null | undefined) =>
  (value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function semanticImageFor(value: string | null | undefined): string | null {
  const n = normalize(value);
  if (!n) return null;

  if (/(ajandek|utalvany|voucher|gift)/.test(n)) return IMAGE.gift;
  if (/(beauty\s*\+|beauty plus|csomag|package|berlet|alkalom|komplex program)/.test(n)) return IMAGE.beautyPlus;
  if (/(gyerek|kids|kisgyerek|kislany|kisfiu|junior)/.test(n)) return IMAGE.kids;
  if (/(tini|teen|9-14|12-17|fiatal bor)/.test(n)) return IMAGE.teens;
  if (/(ferfi|barber|szakall|borotv|men\b)/.test(n)) return IMAGE.men;

  if (/(cocochoco|keratin|hajbotox|haj botox|hajegyen|dauer|balayage|ombre|melir|hajfest|festes|hajvagas|vagas|frizura|hajapolas|hajkezeles|fodras|hajto|hajveg|fejbor|hair|blow|styling)/.test(n)) return IMAGE.hair;
  if (/(manik|pedik|korom|korm|gellakk|gel lakk|mukorom|mukorm|nail|kezapolas|labapolas|talp|sarok|paraffin|diszites)/.test(n)) return IMAGE.handsFeet;
  if (/(szemoldok|szempilla|lash|brow|smink|makeup|kozmet|arckez|arc kez|anti-aging|anti aging|tisztito kezeles|hidrat|hamlaszt|peeling|mikroderm|mezoter|radiofrekvencia arc|borfiatal|borfeszesites arc|skin|acne|akne)/.test(n)) return IMAGE.cosmetics;
  if (/(masszazs|massage|nyirokmassz|nyirok massz|relax|svéd|sved|talpmassz|hatmassz|nyakmassz)/.test(n)) return IMAGE.massage;
  if (/(kavit|zsirbont|zsir bont|cellulit|alakform|testkezel|test kez|body shaping|bodyshape|rf test|radiofrekvencia test|feszesito test|bőrfeszesítő test|borfeszesito test|cryolip|kriolip|pressoter|vacuum|vákuum|vakuum|comb|has|fenek|derék|derek)/.test(n)) return IMAGE.body;
  if (/(wellness|spa|szolarium|szolárium|fitness|infra|szauna|relaxacio|relaxáció)/.test(n)) return IMAGE.wellness;
  if (/(szortelen|szőrtelen|gyanta|wax|lezeres szor|lézeres szőr)/.test(n)) return IMAGE.cosmetics;

  if (n.includes("haj") || n.includes("fodras")) return IMAGE.hair;
  if (n.includes("kez") || n.includes("lab") || n.includes("korom") || n.includes("manik") || n.includes("pedik")) return IMAGE.handsFeet;
  if (n.includes("kozmet") || n.includes("arc") || n.includes("bor") || n.includes("smink")) return IMAGE.cosmetics;
  if (n.includes("massz")) return IMAGE.massage;
  if (n.includes("test") || n.includes("alak") || n.includes("cellulit") || n.includes("kavit") || n.includes("zsirbont") || n.includes("feszes")) return IMAGE.body;
  if (n.includes("wellness") || n.includes("fitness") || n.includes("spa") || n.includes("szol")) return IMAGE.wellness;
  return null;
}

function fallbackImageFor(name: string, index = 0) {
  return semanticImageFor(name) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function buildImageMap(categories: KioskCategory[], services: KioskService[]) {
  const images = new Map<string, string>();

  categories.forEach((category, index) => {
    const semantic = semanticImageFor(`${category.name} ${category.subtitle || ""}`);
    const image = semantic || category.image_path || fallbackImageFor(category.name, index);
    images.set(normalize(category.name), image);
  });

  services.forEach((service, index) => {
    const serviceName = service.name_hu || service.name;
    const fullText = [
      service.name_hu,
      service.name,
      service.description,
      service.category_name_hu,
      service.category_name,
      service.category_subtitle,
    ].filter(Boolean).join(" ");
    const semantic = semanticImageFor(fullText);
    const image = semantic || service.image_url || service.category_image || fallbackImageFor(fullText || serviceName, index);

    [service.name_hu, service.name].filter(Boolean).forEach((name) => images.set(normalize(name), image));
    const categoryName = service.category_name_hu || service.category_name;
    if (categoryName && !images.has(normalize(categoryName))) {
      images.set(normalize(categoryName), semanticImageFor(categoryName) || service.category_image || image);
    }
  });

  return images;
}

/**
 * Keeps every kiosk theme on the same service imagery as Classic while also
 * correcting obviously mismatched API thumbnails from the actual service name.
 */
export function KioskClassicImageParity() {
  const imageMapRef = React.useRef<Map<string, string>>(new Map());
  const observerRef = React.useRef<MutationObserver | null>(null);

  const imageFor = React.useCallback((label: string, index = 0) =>
    imageMapRef.current.get(normalize(label)) || semanticImageFor(label) || fallbackImageFor(label, index), []);

  const applyImages = React.useCallback(() => {
    document.querySelectorAll<HTMLElement>(".kiosk-theme-service-art").forEach((node, index) => {
      const label = node.getAttribute("aria-label") || "";
      const image = imageFor(label, index);
      node.style.setProperty("background-image", `url(\"${image}\")`, "important");
      node.style.setProperty("background-position", "center", "important");
      node.style.setProperty("background-size", "cover", "important");
      node.style.setProperty("background-repeat", "no-repeat", "important");
    });

    document.querySelectorAll<HTMLButtonElement>(".kiosk-rail-list > button").forEach((button, index) => {
      const type = button.querySelector("small")?.textContent || "";
      if (/TERMÉK|PRODUCT|ТОВАР/i.test(type)) return;
      const label = button.querySelector("span")?.textContent || "";
      const img = button.querySelector<HTMLImageElement>("img");
      if (!img || !label) return;
      const image = imageFor(label, index);
      if (img.getAttribute("src") !== image) img.src = image;
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
    });

    document.querySelectorAll<HTMLImageElement>(".kiosk-category-card-image img").forEach((img, index) => {
      const label = img.getAttribute("alt") || img.closest("button")?.textContent || "";
      if (!label) return;
      const semantic = semanticImageFor(label);
      if (semantic && img.getAttribute("src") !== semantic) img.src = semantic;
    });

    if ((localStorage.getItem("kiosk_catalog_type") || "service") === "service") {
      document.querySelectorAll<HTMLImageElement>(".kiosk-service-image img").forEach((img, index) => {
        const serviceName = img.getAttribute("alt") || "";
        if (!serviceName) return;
        const image = imageFor(serviceName, index);
        if (img.getAttribute("src") !== image) img.src = image;
        img.style.objectFit = "cover";
        img.style.objectPosition = "center";
      });
    }
  }, [imageFor]);

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
