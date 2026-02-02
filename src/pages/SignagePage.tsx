import React, { useEffect, useMemo, useRef, useState } from "react";
import "./signage.css";

type ServiceItem = { id: string; name: string; category: string; durationMin: number | null; price_text: string; priority: number; };
type Deal = { id: string; title: string; subtitle: string; price_text: string; valid_from: string | null; valid_to: string | null; };
type Professional = { id: string; name: string; title: string; note: string; available: boolean; priority: number; };

function huDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
function huTime(d: Date) {
  return d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const YT_ID = "lIgxZbdsr-I";
const YT_EMBED_URL =
  `https://www.youtube.com/embed/${YT_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;

export const SignagePage: React.FC = () => {
  const [clock, setClock] = useState(() => new Date());
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesMeta, setServicesMeta] = useState<string>("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [daily, setDaily] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  const svcPerPage = 10;
  const [svcPage, setSvcPage] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const applyScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const sx = w / 3840;
      const sy = h / 1080;
      const s = Math.min(sx, sy);
      rootRef.current?.style.setProperty("--scale", String(s));
    };
    applyScale();
    window.addEventListener("resize", applyScale);
    return () => window.removeEventListener("resize", applyScale);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const svcPages = useMemo(() => {
    const out: ServiceItem[][] = [];
    for (let i = 0; i < services.length; i += svcPerPage) out.push(services.slice(i, i + svcPerPage));
    return out.length ? out : [[]];
  }, [services]);

  const currentServices = svcPages[svcPage] || [];
  const shownDeals = useMemo(() => {
    const slots = 4;
    const arr: (Deal | null)[] = [];
    for (let i = 0; i < slots; i++) arr.push(deals[i] || null);
    return arr;
  }, [deals]);

  async function loadAll() {
    try {
      setErr("");
      const [s, d, p, da] = await Promise.all([
        fetch("/api/signage/services", { cache: "no-store" }).then(r => r.json()),
        fetch("/api/signage/deals", { cache: "no-store" }).then(r => r.json()),
        fetch("/api/signage/professionals", { cache: "no-store" }).then(r => r.json()),
        fetch("/api/signage/daily", { cache: "no-store" }).then(r => r.json()),
      ]);
      setServices(s.services || []);
      setServicesMeta(`Frissítve: ${new Date(s.fetchedAt).toLocaleString("hu-HU")}`);
      setDeals(d.deals || []);
      setProfessionals(p.professionals || []);
      setDaily(da);
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    const tRefresh = setInterval(loadAll, 60_000);
    const tSvc = setInterval(() => setSvcPage(p => (p + 1) % svcPages.length), 12_000);
    return () => { clearInterval(tRefresh); clearInterval(tSvc); };
  }, [svcPages.length]);

  return (
    <div className="sgViewport">
      <div className="sgCanvas" ref={rootRef}>
        <header className="sgTopbar">
          <div className="sgBrand">
            <div className="sgWordmark">
              <span className="sgWmMain">KLEOPÁTRA</span>
              <span className="sgWmSub">SZÉPSÉGSZALONOK</span>
            </div>
            <div className="sgSubtitle">Szolgáltatások • Napi akciók • Szakemberek</div>
          </div>
          <div className="sgClock">
            <div className="sgDate">{huDate(clock)}</div>
            <div className="sgTime">{huTime(clock)}</div>
          </div>
        </header>

        <main className="sgGrid">
          <section className="sgPanel sgServices">
            <div className="sgPanelHeader">
              <h2>Szolgáltatások</h2>
              <div className="sgMeta">{servicesMeta}</div>
            </div>

            <div className="sgSvcList">
              {currentServices.map((s) => (
                <div className="sgSvcRow" key={s.id}>
                  <div className="sgSvcName">{s.name}</div>
                  <div className="sgSvcMeta">
                    <span className="sgChip">{s.category || ""}</span>
                    {s.durationMin ? <span className="sgChipLite">{s.durationMin} perc</span> : null}
                  </div>
                  <div className="sgSvcPrice">{s.price_text || ""}</div>
                </div>
              ))}
              {!services.length && <div className="sgEmpty">Nincs megjeleníthető szolgáltatás.</div>}
            </div>

            <div className="sgFooter">
              <div className="sgHint">Oldal: {svcPage + 1}/{svcPages.length}</div>
              <div className="sgSite">kleoszalonok.hu</div>
            </div>
          </section>

          <section className="sgPanel sgVideo">
            <div className="sgPanelHeader">
              <h2>Kleo Fitness</h2>
              <div className="sgMeta">Videó</div>
            </div>
            <div className="sgVideoWrap">
              <iframe className="sgVideoFrame" src={YT_EMBED_URL} title="Kleo video" allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" />
            </div>
            <div className="sgVideoFooter">
              <div className="sgPill">Mai akciók: <b>{deals.length || 0}</b></div>
              <div className="sgPill">Elérhető szakember: <b>{professionals.length || 0}</b></div>
            </div>
          </section>

          <aside className="sgRight">
            <section className="sgPanel sgDeals">
              <div className="sgPanelHeader">
                <h2>Napi akciók</h2>
                <div className="sgMeta">4 kiemelt ajánlat</div>
              </div>

              <div className="sgDealGrid">
                {shownDeals.map((p, idx) => (
                  <div className="sgDealCard" key={idx}>
                    <div className="sgStripe" />
                    {p ? (
                      <>
                        <div className="sgDealTitle">{p.title}</div>
                        <div className="sgDealSub">{p.subtitle || ""}</div>
                        <div className="sgDealPrice">{p.price_text || ""}</div>
                        <div className="sgDealValid">{p.valid_from || p.valid_to ? `Érv.: ${p.valid_from || "—"} – ${p.valid_to || "—"}` : "Érvényes: ma"}</div>
                      </>
                    ) : (
                      <>
                        <div className="sgDealTitle">Hamarosan</div>
                        <div className="sgDealSub">Új napi akció</div>
                        <div className="sgDealPrice">—</div>
                        <div className="sgDealValid">Kérdezz a pultnál</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="sgPanel sgPros">
              <div className="sgPanelHeader">
                <h2>Elérhető szakemberek</h2>
                <div className="sgMeta">Ma</div>
              </div>

              <div className="sgProList">
                {professionals.slice(0, 6).map((p) => (
                  <div className="sgProRow" key={p.id}>
                    <div className="sgProName">{p.name}</div>
                    <div className="sgProMeta">
                      <span className="sgChip">{p.title || "Szakember"}</span>
                      {p.note ? <span className="sgChipLite">{p.note}</span> : null}
                    </div>
                  </div>
                ))}
                {!professionals.length && <div className="sgEmpty">Jelenleg nincs szabad szakember. Foglalj online.</div>}
              </div>
            </section>
          </aside>
        </main>

        <footer className="sgTicker">
          <div className="sgMarquee">
            Minden ami szépség, csak Neked! • Foglalás: online vagy a pultnál •
            Testépítés: {daily?.fitness?.text || "A fegyelem az, ami akkor is dolgozik, amikor nincs kedved."}
            • Szépségipar: {daily?.beauty?.text || "A konzisztens rutin többet ér, mint a ritka csodamegoldás."}
          </div>
        </footer>

        {err ? <div className="sgError">Hiba: {err}</div> : null}
      </div>
    </div>
  );
};

export default SignagePage;
