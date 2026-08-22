import React from "react";
import type { KioskProduct, KioskService } from "./types";

type Props = {
  products: KioskProduct[];
  services: KioskService[];
  onProduct: (product: KioskProduct) => void;
  onService: (service: KioskService) => void;
};

const concerns = ["Ragyogás", "Hidratálás", "Anti-aging", "Érzékenység", "Relaxáció"];
const routines = ["Gyors, 15–30 perc", "Komplex kezelés", "Otthoni rutin"];

const clean = (value?: string | null) => (value || "").toLocaleLowerCase("hu-HU");
const price = (product: KioskProduct) => Number(product.sale_price ?? product.retail_price_gross ?? 0);

export function AiBeautyAdvisor({ products, services, onProduct, onService }: Props) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [concern, setConcern] = React.useState("");
  const [routine, setRoutine] = React.useState("");
  const [budget, setBudget] = React.useState(30000);

  const rankedProducts = React.useMemo(() => products
    .map((item) => {
      const haystack = clean(`${item.name} ${item.web_description} ${item.category_name}`);
      const keywords: Record<string, string[]> = {
        Ragyogás: ["ragyog", "vitamin", "fény", "bright", "glow"],
        Hidratálás: ["hidrat", "hyal", "moist", "száraz"],
        "Anti-aging": ["anti", "age", "retinol", "ránc", "collagen"],
        Érzékenység: ["érzékeny", "sensitive", "calm", "nyugtat"],
        Relaxáció: ["relax", "spa", "aroma", "wellness"],
      };
      const match = (keywords[concern] || []).filter((key) => haystack.includes(key)).length;
      return { item, score: match * 6 + (item.featured ? 3 : 0) + (price(item) <= budget ? 2 : -2) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3), [products, concern, budget]);

  const rankedServices = React.useMemo(() => services
    .map((item) => {
      const haystack = clean(`${item.name} ${item.description} ${item.category_name}`);
      const tokens = concern === "Relaxáció" ? ["massz", "relax", "wellness"] : concern === "Ragyogás" ? ["arc", "kozmet", "fény"] : concern === "Hidratálás" ? ["hidrat", "arc", "kozmet"] : concern === "Anti-aging" ? ["anti", "lifting", "arc", "ránc"] : ["érzékeny", "nyugtat", "kozmet"];
      const match = tokens.filter((key) => haystack.includes(key)).length;
      const durationFit = routine.startsWith("Gyors") ? Number(item.duration_minutes || 99) <= 30 : true;
      return { item, score: match * 6 + (item.featured ? 3 : 0) + (durationFit ? 2 : 0) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2), [services, concern, routine]);

  function reset() { setStep(0); setConcern(""); setRoutine(""); setBudget(30000); }
  function close() { setOpen(false); window.setTimeout(reset, 250); }

  return <>
    <button className="kiosk-ai-launch" onClick={() => setOpen(true)}>
      <span className="kiosk-ai-orb">✦</span>
      <span><small>KLEO AI · BEAUTY CONCIERGE</small><strong>Találjuk meg, ami neked való</strong></span>
      <b>2 perc →</b>
    </button>
    {open && <div className="kiosk-ai-backdrop" role="dialog" aria-modal="true" aria-label="Kleo AI termékajánló">
      <section className="kiosk-ai-modal">
        <header><div><span>✦ KLEO AI</span><h2>Személyes beauty concierge</h2></div><button onClick={close} aria-label="Bezárás">×</button></header>
        <div className="kiosk-ai-progress"><i style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
        {step === 0 && <div className="kiosk-ai-stage"><span className="kiosk-ai-step">01 · CÉL</span><h3>Mire vágyik most leginkább a bőröd és a tested?</h3><p>Válassz egy fő célt. Az ajánlást a szalon aktuális kínálatából állítjuk össze.</p><div className="kiosk-ai-choices">{concerns.map((item) => <button className={concern === item ? "selected" : ""} onClick={() => setConcern(item)} key={item}>{item}<span>→</span></button>)}</div><button className="kiosk-ai-next" disabled={!concern} onClick={() => setStep(1)}>Tovább</button></div>}
        {step === 1 && <div className="kiosk-ai-stage"><span className="kiosk-ai-step">02 · RUTIN</span><h3>Milyen élmény illik ma hozzád?</h3><div className="kiosk-ai-choices compact">{routines.map((item) => <button className={routine === item ? "selected" : ""} onClick={() => setRoutine(item)} key={item}>{item}<span>→</span></button>)}</div><label className="kiosk-ai-budget"><span><b>Ajánlott keret</b><strong>{budget.toLocaleString("hu-HU")} Ft</strong></span><input type="range" min="10000" max="60000" step="5000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label><div className="kiosk-ai-nav"><button onClick={() => setStep(0)}>← Vissza</button><button className="kiosk-ai-next" disabled={!routine} onClick={() => setStep(2)}>Ajánlás készítése ✦</button></div></div>}
        {step === 2 && <div className="kiosk-ai-stage results"><span className="kiosk-ai-step">03 · SZEMÉLYES AJÁNLÁS</span><h3>Ez a Kleo-rutin passzol hozzád</h3><p className="kiosk-ai-reason">A(z) <b>{concern.toLocaleLowerCase("hu-HU")}</b> célhoz, a választott időhöz és kerethez rangsorolva. Az ajánlás tájékoztató jellegű, nem orvosi diagnózis.</p><div className="kiosk-ai-results">
          {rankedServices.map(({ item }, index) => <article key={item.id}><div className="kiosk-ai-rank">0{index + 1}</div><div><small>SZALONÉLMÉNY</small><h4>{item.name_hu || item.name}</h4><p>{item.description || `${item.duration_minutes || 45} perces személyre szabható kezelés.`}</p><strong>{Number(item.list_price ?? item.base_price ?? 0).toLocaleString("hu-HU")} Ft</strong></div><button onClick={() => onService(item)}>+ Kosárba</button></article>)}
          {rankedProducts.map(({ item }, index) => <article key={item.id}><div className="kiosk-ai-rank">0{rankedServices.length + index + 1}</div><div><small>OTTHONI FOLYTATÁS</small><h4>{item.name_hu || item.name}</h4><p>{item.web_description || "A rutin otthoni kiegészítéséhez ajánlva."}</p><strong>{price(item).toLocaleString("hu-HU")} Ft</strong></div><button onClick={() => onProduct(item)}>+ Kosárba</button></article>)}
          {!rankedProducts.length && !rankedServices.length && <div className="kioskInfo">Ehhez a célhoz még nincs elérhető ajánlat.</div>}
        </div><div className="kiosk-ai-nav"><button onClick={() => setStep(1)}>← Finomítás</button><button className="kiosk-ai-next" onClick={close}>Kész</button></div></div>}
      </section>
    </div>}
  </>;
}
