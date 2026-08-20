import type { ServicePageDefinition } from "./servicePages";

export const EXTRA_SERVICE_PAGES: ServicePageDefinition[] = [
  {
    slug: "gellakk",
    title: "Géllakk",
    eyebrow: "Kéz- és lábápolás",
    lead: "Tartós, fényes géllakk manikűr gondos előkészítéssel és széles színválasztékkal a Kleopátra szalonokban.",
    description: "A géllakk a természetes köröm megerősítésére és tartós színezésére szolgáló kézápolási szolgáltatás. A kezelés része a köröm előkészítése, formázása, a választott géllakk rétegek felvitele és a befejező ápolás. A pontos technika és az elérhető színek szalononként eltérhetnek.",
    benefits: ["Tartós, fényes eredmény", "Precíz körömelőkészítés", "Széles szín- és díszítési választék"],
    category: "Kéz- és lábápolás",
    related: ["kez-es-labapolas", "japan-manikur"],
  },
  {
    slug: "japan-manikur",
    title: "Japán manikűr",
    eyebrow: "Természetes körömápolás",
    lead: "Természetes hatású körömápoló kezelés a körömlemez fényének és ápolt megjelenésének támogatására.",
    description: "A japán manikűr festék nélküli körömápolási eljárás, amelynél a köröm előkészítése után speciális ápoló anyagokat dolgozunk a körömlemezbe, majd magas fényűre polírozzuk. Jó választás lehet azoknak, akik természetes, visszafogott megjelenést szeretnének.",
    benefits: ["Természetes, festék nélküli megjelenés", "Fényes, ápolt körömfelület", "Kíméletes kézápolási alternatíva"],
    category: "Kéz- és lábápolás",
    related: ["kez-es-labapolas", "gellakk"],
  },
];

export const EXTRA_SERVICE_PAGE_BY_SLUG = new Map(EXTRA_SERVICE_PAGES.map((item) => [item.slug, item]));
