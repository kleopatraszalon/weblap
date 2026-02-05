import React, { useEffect, useMemo, useRef, useState } from "react";
import "./signage.css";
import "./signageDeals.css";
import "./signagePros.css";
import "./signageLayout.css";

type ServiceItem = {
  id: string;
  name: string;
  category?: string | null;
  durationMin?: number | null;
  price_text?: string | null;
  priority?: number | null;
};

type Deal = {
  id: string;
  title: string;
  subtitle?: string | null;
  price_text?: string | null;
  valid_from?: string | null;
  valid_to?: string | null;
  active?: boolean | null;
  priority?: number | null;
};

type Professional = {
  id: string;
  name: string;
  title?: string | null;
  note?: string | null;
  priority?: number | null;
  is_free?: boolean | null;
  available?: boolean | null;
  photo_url?: string | null;
  show?: boolean | null;
};

type VideoItem = {
  id: string;
  youtube_id: string;
  title?: string | null;
  duration_sec?: number | null;
  priority?: number | null;
  enabled?: boolean | null;
};

function huDate(d: Date) {
  return d.toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
function huTime(d: Date) {
  return d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function makeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function isFree(p: Professional): boolean {
  // Új logika: ha van is_free, azt használjuk; különben fallback az available-re; ha az sincs, szabad
  return (p.is_free ?? p.available ?? true) === true;
}

function isAbsUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

function pickArray<T>(data: any, keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  for (const k of keys) {
    const v = data?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

function mapService(x: any, i: number): ServiceItem {
  return {
    id: String(x?.id ?? x?.service_id ?? `svc_${i}`),
    name: String(x?.name ?? ""),
    category: (x?.category ?? x?.category_name ?? x?.group ?? null) as any,
    durationMin: (x?.durationMin ?? x?.duration_min ?? x?.duration ?? null) as any,
    price_text: (x?.price_text ?? x?.priceText ?? x?.price ?? null) as any,
    priority: (x?.priority ?? x?.prio ?? 0) as any,
  };
}

function mapDeal(x: any, i: number): Deal {
  return {
    id: String(x?.id ?? x?.deal_id ?? `deal_${i}`),
    title: String(x?.title ?? ""),
    subtitle: (x?.subtitle ?? x?.sub_title ?? null) as any,
    price_text: (x?.price_text ?? x?.priceText ?? null) as any,
    valid_from: (x?.valid_from ?? x?.validFrom ?? null) as any,
    valid_to: (x?.valid_to ?? x?.validTo ?? null) as any,
    active: (x?.active ?? x?.enabled ?? true) as any,
    priority: (x?.priority ?? x?.prio ?? 0) as any,
  };
}

function mapPro(x: any, i: number): Professional {
  return {
    id: String(x?.id ?? x?.pro_id ?? `pro_${i}`),
    name: String(x?.name ?? ""),
    title: (x?.title ?? null) as any,
    note: (x?.note ?? null) as any,
    photo_url: (x?.photo_url ?? x?.photoUrl ?? null) as any,
    is_free: (x?.is_free ?? x?.isFree ?? null) as any,
    available: (x?.available ?? null) as any,
    show: (x?.show ?? x?.enabled ?? null) as any,
    priority: (x?.priority ?? x?.prio ?? 0) as any,
  };
}

function mapVideo(x: any, i: number): VideoItem {
  return {
    id: String(x?.id ?? x?.video_id ?? `vid_${i}`),
    youtube_id: String(x?.youtube_id ?? x?.youtubeId ?? x?.youtube ?? ""),
    title: (x?.title ?? null) as any,
    duration_sec: (x?.duration_sec ?? x?.durationSec ?? 60) as any,
    priority: (x?.priority ?? x?.prio ?? 0) as any,
    enabled: (x?.enabled ?? x?.active ?? true) as any,
  };
}

function normalizeOrigin(raw: string): string {
  // - levágjuk a záró /-t
  // - levágjuk a véletlen "/api" suffixet (különben /api/api lesz)
  return String(raw || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/?$/, "");
}

function resolveApiOrigin(): string {
  // Vite: csak VITE_* env-ek vannak a kliensben
  // Renderen a signage kijelző (weblap) általában MÁS domainen fut, mint az API,
  // ezért itt az ENV a legbiztosabb megoldás: VITE_API_ORIGIN=https://<api-host>
  const env: any = (import.meta as any).env || {};
  const fromEnv = normalizeOrigin(env.VITE_API_ORIGIN || env.VITE_API_URL || env.VITE_BACKEND_URL || "");
  if (fromEnv) return fromEnv;

  // Auto fallback:
  try {
    const host = window.location.hostname;

    // 1) Ha bármelyik onrender-es frontend / weblap domaint látjuk,
    // és NEM az API service vagyunk, akkor alapértelmezett API hostra menjünk.
    // (Ha nálad nem ez az API domain, állítsd be VITE_API_ORIGIN-t Renderen!)
    if (host.endsWith(".onrender.com") && !host.startsWith("kleoszalon-api")) {
      return "https://kleoszalon-api-jon.onrender.com";
    }

    // 2) Local dev: a backend tipikusan :5000
    if ((host === "localhost" || host === "127.0.0.1") && window.location.port !== "5000") {
      return "http://localhost:5000";
    }

    // 3) Default: ugyanaz a host (akkor jó, ha reverse proxy van)
    return window.location.origin;
  } catch {
    return "";
  }
}


export const SignagePage: React.FC = () => {
  const [clock, setClock] = useState(() => new Date());

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesMeta, setServicesMeta] = useState<string>("");

  const [deals, setDeals] = useState<Deal[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlist, setPlaylist] = useState<VideoItem[]>([]);
  const [videoIdx, setVideoIdx] = useState(0);

  const [daily, setDaily] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  const svcPerPage = 10;
  const [svcPage, setSvcPage] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const API_ORIGIN = useMemo(() => resolveApiOrigin(), []);
  const apiUrl = (path: string) => (API_ORIGIN ? `${API_ORIGIN}${path}` : path);

  async function fetchJson(path: string) {
    const url = apiUrl(path);

    // Kijelző/public endpointok: nem kell cookie -> legyen egyszerűbb a CORS
    const res = await fetch(url, {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
    });

    const text = await res.text();
    const ct = (res.headers.get("content-type") || "").toLowerCase();

    if (!res.ok) {
      throw new Error(`API ${res.status} @ ${url}: ${text.slice(0, 220)}`);
    }

    // Ha véletlenül a weblap (index.html) jön vissza JSON helyett, ezt rögtön látni fogod:
    if (!ct.includes("application/json")) {
      throw new Error(`API nem JSON @ ${url}. Content-Type=${ct || "n/a"}. Első 220 karakter: ${text.slice(0, 220)}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`API JSON parse hiba @ ${url}. Első 220 karakter: ${text.slice(0, 220)}`);
    }
  }

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

  const visiblePros = useMemo(() => professionals.filter((p) => p.show !== false), [professionals]);

  const freeCount = useMemo(() => visiblePros.filter(isFree).length, [visiblePros]);

  const currentVideo = useMemo(() => {
    const list = playlist.length ? playlist : videos;
    if (!list.length) return null;
    const idx = Math.max(0, Math.min(videoIdx, list.length - 1));
    return list[idx];
  }, [playlist, videos, videoIdx]);

  async function loadAll() {
    try {
      setErr("");
      console.info("[signage] API_ORIGIN =", API_ORIGIN);

      const [s, d, p, da, v] = await Promise.all([
        fetchJson("/api/signage/services"),
        fetchJson("/api/signage/deals"),
        fetchJson("/api/signage/professionals"),
        fetchJson("/api/signage/daily"),
        fetchJson("/api/signage/videos"),
      ]);

      const svcArr = pickArray<any>(s, ["services", "items", "rows"]).map(mapService).filter((x) => x.name);
      const dealArr = pickArray<any>(d, ["deals", "items", "rows"]).map(mapDeal).filter((x) => x.title);
      const proArr = pickArray<any>(p, ["professionals", "items", "rows"]).map(mapPro).filter((x) => x.name);
      const vidArr = pickArray<any>(v, ["videos", "items", "rows"]).map(mapVideo).filter((x) => x.youtube_id);

      const fetchedAt = s?.fetchedAt ? new Date(s.fetchedAt).toLocaleString("hu-HU") : "";
      setServices(svcArr);
      setServicesMeta(fetchedAt ? `Frissítve: ${fetchedAt}` : "");

      // deals: csak az aktívakat, prioritás szerint
      setDeals(dealArr.filter((x) => x.active !== false).sort((a, b) => Number(a.priority ?? 0) - Number(b.priority ?? 0)));

      // pros: prioritás szerint
      setProfessionals(proArr.sort((a, b) => Number(a.priority ?? 0) - Number(b.priority ?? 0)));

      setDaily(da);

      // videos: enabled
      setVideos(vidArr.filter((x) => x.enabled !== false).sort((a, b) => Number(a.priority ?? 0) - Number(b.priority ?? 0)));
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tRefresh = setInterval(loadAll, 60_000);
    const tSvc = setInterval(() => setSvcPage((p) => (p + 1) % svcPages.length), 12_000);
    return () => {
      clearInterval(tRefresh);
      clearInterval(tSvc);
    };
  }, [svcPages.length]);

  useEffect(() => {
    const enabled = (videos || []).filter((v) => v.youtube_id);
    if (!enabled.length) {
      setPlaylist([]);
      setVideoIdx(0);
      return;
    }
    setPlaylist(shuffle(enabled));
    setVideoIdx(0);
  }, [videos]);

  useEffect(() => {
    if (!currentVideo) return;
    const ms = Math.max(10, Number(currentVideo.duration_sec || 60)) * 1000;
    const t = setTimeout(() => {
      const list = playlist.length ? playlist : videos;
      if (!list.length) return;
      if (videoIdx + 1 >= list.length) {
        setPlaylist(shuffle(list));
        setVideoIdx(0);
      } else {
        setVideoIdx(videoIdx + 1);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [currentVideo, playlist, videos, videoIdx]);

  return (
    <div className="sgViewport">
      <div className="sgCanvas" ref={rootRef}>
        <header className="sgTopbar">
          <div className="sgBrand">
            <img className="sgLogo" src="/images/kleo_logo@2x.png" alt="KLEO" />
            <div className="sgSubtitle">Szolgáltatások • Napi akciók • Szakemberek</div>
          </div>
          <div className="sgClock">
            <div className="sgDate">{huDate(clock)}</div>
            <div className="sgTime">{huTime(clock)}</div>
          </div>
        </header>

        <main className="sgGrid sgGrid5">
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
              <div className="sgHint">
                Oldal: {svcPage + 1}/{svcPages.length}
              </div>
              <div className="sgSite">kleoszalonok.hu</div>
            </div>
          </section>

          {/* PROFESSIONALS (bal oszlop) */}
          <section className="sgPanel sgPros">
            <div className="sgPanelHeader">
              <h2>Elérhető szakemberek</h2>
              <div className="sgMeta">Ma</div>
            </div>

            <div className="sgProList sgProBig">
              {visiblePros.slice(0, 4).map((p) => {
                const free = isFree(p);
                const raw = String(p.photo_url || "").trim();
                const photoSrc = raw
                  ? isAbsUrl(raw)
                    ? raw
                    : apiUrl(raw.startsWith("/") ? raw : `/${raw}`)
                  : "";
                return (
                  <div className="sgProRow sgProRowBig" key={p.id}>
                    <div className="sgProLeft">
                      {photoSrc ? <img className="sgProPhoto" src={photoSrc} alt={p.name} /> : <div className="sgProPhoto sgProPhotoPh" />}
                    </div>
                    <div className="sgProMain">
                      <div className="sgProName sgProNameBig">{p.name}</div>
                      <div className="sgProMeta">
                        <span className="sgChip">{p.title || "Szakember"}</span>
                        {p.note ? <span className="sgChipLite">{p.note}</span> : null}
                        <span className={`sgStatus ${free ? "sgStatusFree" : "sgStatusBusy"}`}>{free ? "Szabad" : "Foglalt"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!visiblePros.length && <div className="sgEmpty">Nincs rögzített szakember.</div>}
            </div>
          </section>

          <section className="sgPanel sgVideo">
            <div className="sgPanelHeader">
              <h2>Kleo Fitness</h2>
              <div className="sgMeta">{currentVideo ? currentVideo.title || currentVideo.youtube_id : "Nincs videó"}</div>
            </div>
            <div className="sgVideoWrap">
              {currentVideo ? (
                <iframe
                  className="sgVideoFrame"
                  src={makeEmbedUrl(currentVideo.youtube_id)}
                  title="Kleo video"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="sgEmpty">Adj hozzá videót az admin felületen.</div>
              )}
            </div>
            <div className="sgVideoFooter">
              <div className="sgPill">
                Mai akciók: <b>{deals.length || 0}</b>
              </div>
              <div className="sgPill">
                Szabad szakember: <b>{freeCount}</b>
              </div>
            </div>
          </section>

          {/* DEALS */}
          <section className="sgPanel sgDeals">
            <div className="sgPanelHeader">
              <h2 className="sgDealsTitleBig">Napi akciók</h2>
              <div className="sgMeta">4 kiemelt ajánlat</div>
            </div>

            <div className="sgDealList">
              {shownDeals.map((p, idx) => (
                <div className="sgDealRow" key={idx}>
                  <div className="sgStripe" />
                  <div className="sgDealRowMain">
                    <div className="sgDealTitle sgDealTitleBig">{p ? p.title : "Hamarosan"}</div>
                    <div className="sgDealSub">{p ? p.subtitle || "" : "Új napi akció"}</div>
                  </div>
                  <div className="sgDealRowPrice sgDealRowPriceBig">{p ? p.price_text || "" : "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* PROFESSIONALS (jobb oszlop) */}
          <section className="sgPanel sgPros">
            <div className="sgPanelHeader">
              <h2>Elérhető szakemberek</h2>
              <div className="sgMeta">Ma</div>
            </div>

            <div className="sgProList sgProBig">
              {visiblePros.slice(4, 8).map((p) => {
                const free = isFree(p);
                const raw = String(p.photo_url || "").trim();
                const photoSrc = raw
                  ? isAbsUrl(raw)
                    ? raw
                    : apiUrl(raw.startsWith("/") ? raw : `/${raw}`)
                  : "";
                return (
                  <div className="sgProRow sgProRowBig" key={p.id}>
                    <div className="sgProLeft">
                      {photoSrc ? <img className="sgProPhoto" src={photoSrc} alt={p.name} /> : <div className="sgProPhoto sgProPhotoPh" />}
                    </div>
                    <div className="sgProMain">
                      <div className="sgProName sgProNameBig">{p.name}</div>
                      <div className="sgProMeta">
                        <span className="sgChip">{p.title || "Szakember"}</span>
                        {p.note ? <span className="sgChipLite">{p.note}</span> : null}
                        <span className={`sgStatus ${free ? "sgStatusFree" : "sgStatusBusy"}`}>{free ? "Szabad" : "Foglalt"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!visiblePros.length && <div className="sgEmpty">Nincs rögzített szakember.</div>}
            </div>
          </section>
        </main>

        <footer className="sgTicker">
          <div className="sgMarquee">
            Minden ami szépség, csak Neked! • Foglalás: online vagy a pultnál • Testépítés:{" "}
            {daily?.fitness?.text || "A fegyelem akkor is dolgozik, amikor a motiváció eltűnik."} • Szépségipar:{" "}
            {daily?.beauty?.text || "A konzisztens rutin többet ér, mint a ritka csodamegoldás."}
          </div>
        </footer>

        {err ? <div className="sgError">Hiba: {err}</div> : null}
      </div>
    </div>
  );
};

export default SignagePage;
