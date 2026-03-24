import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchKioskServices } from "./kioskApi";
import { addToCart } from "./cartStore";
import { UpsellModal } from "./UpsellModal";
import type { KioskService } from "./types";

const UPSELL_BY_SLUG: Record<string, { title: string; items: { id: string; title: string; price: number; image?: string }[] }> = {
  fodraszat: {
    title: "Ajánlat: Hajápolás vagy ital?",
    items: [
      { id: "buffet_coffee", title: "Kávé", price: 690, image: "/kiosk/buffet/coffee.jpg" },
      { id: "buffet_shake", title: "Protein shake", price: 1290, image: "/kiosk/buffet/shake.jpg" },
    ],
  },
  masszazs: {
    title: "Ajánlat: Relax ital / vitamin",
    items: [
      { id: "buffet_water", title: "Ásványvíz", price: 490, image: "/kiosk/buffet/water.jpg" },
      { id: "buffet_vit", title: "Vitamin ital", price: 990, image: "/kiosk/buffet/vitamin.jpg" },
    ],
  },
};

function lang() {
  return "hu";
}

export function KioskCategory() {
  const nav = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [services, setServices] = React.useState<KioskService[]>([]);

  const [upsellOpen, setUpsellOpen] = React.useState(false);
  const upsellCfg = UPSELL_BY_SLUG[slug || ""];

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const locationId = localStorage.getItem("kiosk_location_id");
        const data = await fetchKioskServices(lang(), locationId);

        const wanted = (slug || "").toLowerCase();
        // Egyszerű szűrés: kategória névben vagy szolgáltatás névben szerepeljen a kulcsszó
        const filtered = data.services.filter((s) => {
          const cat = (s.category_name || "").toLowerCase();
          const nm = (s.name || "").toLowerCase();
          if (wanted === "beauty-plus") return true;
          if (wanted === "vendegszamla") return false;
          if (wanted === "ajandekutalvany") return cat.includes("utal") || nm.includes("utal");
          if (wanted === "kezlab") return cat.includes("kéz") || cat.includes("láb") || nm.includes("manik") || nm.includes("pedik");
          if (wanted === "ferfiaknak") return cat.includes("férfi") || nm.includes("férfi");
          if (wanted === "tinik") return nm.includes("tini") || nm.includes("gyerek");
          if (wanted === "kids") return nm.includes("kids") || nm.includes("gyerek");
          return cat.includes(wanted) || nm.includes(wanted);
        });

        setServices(filtered.length ? filtered : data.services);
      } catch (e: any) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  function onPick(s: KioskService) {
    addToCart({ id: s.id, title: s.name, price: s.base_price || 0, meta: { duration: s.duration_minutes } }, 1);
    if (upsellCfg) setUpsellOpen(true);
  }

  function addUpsell(id: string) {
    const item = upsellCfg?.items.find((x) => x.id === id);
    if (item) addToCart({ id: item.id, title: item.title, price: item.price }, 1);
    setUpsellOpen(false);
  }

  return (
    <div className="kioskCategoryPage">
      <div className="kioskBackRow">
        <button className="kioskBtn" onClick={() => nav("/kiosk")}>← Vissza</button>
        <button className="kioskBtn kioskPrimaryBtn" onClick={() => nav("/kiosk/pay")}>Fizetés</button>
      </div>

      <div className="kioskPanelTitle">{(slug || "").replace(/-/g, " ")}</div>

      {loading ? <div className="kioskInfo">Betöltés…</div> : null}
      {err ? <div className="kioskError">Hiba: {err}</div> : null}

      <div className="kioskServicesGrid">
        {services.map((s) => (
          <button key={s.id} className="kioskServiceCard" onClick={() => onPick(s)}>
            <div className="kioskServiceName">{s.name}</div>
            <div className="kioskServiceMeta">
              {s.base_price != null ? <span>{Number(s.base_price).toLocaleString("hu-HU")} Ft</span> : <span>—</span>}
              {s.duration_minutes != null ? <span> • {s.duration_minutes} perc</span> : null}
            </div>
            <div className="kioskServiceCta">Kosárba</div>
          </button>
        ))}
      </div>

      <UpsellModal
        open={upsellOpen}
        title={upsellCfg?.title || "Ajánlat"}
        items={upsellCfg?.items || []}
        onAdd={addUpsell}
        onClose={() => setUpsellOpen(false)}
      />
    </div>
  );
}
