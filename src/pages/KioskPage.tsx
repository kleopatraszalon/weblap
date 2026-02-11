import React, { useEffect, useMemo, useState } from "react";
import "./kiosk.css";
import { API_BASE } from "../apiClient";

type KioskService = { id: string; name: string; price: number | null; durationMin: number | null; imageKey?: string };
type KioskCategory = { id: string; name: string; imageKey?: string; items: KioskService[] };

type CartItem = { service: KioskService; qty: number };

function moneyFt(x: any) {
  const n = Number(x || 0);
  return `${Math.round(n)} Ft`;
}

export function KioskPage() {
  const [cats, setCats] = useState<KioskCategory[]>([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [err, setErr] = useState<string>("");

  const params = new URLSearchParams(window.location.search);
  const locationId = params.get("locationId") || "";

  async function load() {
    setErr("");
    const url = `${API_BASE}/kiosk/services?lang=hu${locationId ? `&locationId=${encodeURIComponent(locationId)}` : ""}`;
    const r = await fetch(url);
    const text = await r.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
    if (!r.ok || !data?.ok) throw new Error(data?.error ? String(data.error) : `HTTP ${r.status}`);
    const categories: KioskCategory[] = data.categories || [];
    setCats(categories);
    setActiveCatId(categories[0]?.id || null);
  }

  useEffect(() => { load().catch(e => setErr(String(e?.message || e))); }, []);

  const activeCat = useMemo(() => cats.find(c => c.id === activeCatId) || null, [cats, activeCatId]);

  const sum = useMemo(() => {
    return cart.reduce((a, it) => a + (Number(it.service.price || 0) * it.qty), 0);
  }, [cart]);

  function addService(s: KioskService) {
    setCart(prev => {
      const idx = prev.findIndex(x => x.service.id === s.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { service: s, qty: 1 }];
    });
  }

  function clearCart() { setCart([]); }

  return (
    <div className="kiosk">
      <div className="kiosk__top">
        <img className="kiosk__logo" src="/images/kleo_logo@2x.png" alt="Kleopátra" />
        <div className="kiosk__title">
          <h1>Érintéses rendelés</h1>
          <p>Válassz szolgáltatást, majd fejezd be a rendelést.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span className="kiosk__chip">1. Menü</span>
          <span className="kiosk__chip">2. Fizetés</span>
          <span className="kiosk__chip">3. Sorszám</span>
        </div>
      </div>

      <div className="kiosk__layout">
        <div className="kiosk__panel">
          <h2>Kategóriák</h2>
          {err ? <div className="kiosk__err">Hiba: {err}</div> : null}
          {cats.length === 0 && !err ? <div>Betöltés…</div> : null}
          {cats.map(c => (
            <button
              key={c.id}
              className="kiosk__btn"
              onClick={() => setActiveCatId(c.id)}
              style={c.id === activeCatId ? { borderColor: "rgba(227,0,122,.6)", boxShadow: "0 0 0 3px rgba(227,0,122,.10)" } : undefined}
            >
              <span>{c.name}</span>
              <span className="kiosk__chip">→</span>
            </button>
          ))}
        </div>

        <div className="kiosk__panel">
          <h2>Szolgáltatások {activeCat ? `— ${activeCat.name}` : ""}</h2>
          {!activeCat ? <div>Válassz kategóriát.</div> : null}
          {activeCat ? (
            <div className="kiosk__grid">
              {activeCat.items.map(s => (
                <button key={s.id} className="kiosk__svc" onClick={() => addService(s)}>
                  <div className="kiosk__svcName">{s.name}</div>
                  <div className="kiosk__svcMeta">
                    {s.price != null ? moneyFt(s.price) : ""}{s.durationMin ? ` • ${s.durationMin} perc` : ""}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="kiosk__panel">
          <h2>Kosár</h2>
          {cart.length === 0 ? <div>Még nincs kiválasztás.</div> : null}
          {cart.map(it => (
            <div key={it.service.id} className="kiosk__cartItem">
              <div>
                <b>{it.service.name}</b>
                <div style={{ opacity: .75, fontSize: 12 }}>{it.qty} × {moneyFt(it.service.price || 0)}</div>
              </div>
              <div style={{ fontWeight: 900 }}>{moneyFt((it.service.price || 0) * it.qty)}</div>
            </div>
          ))}
          <div className="kiosk__sum">Összesen: {moneyFt(sum)}</div>
          <div className="kiosk__actions">
            <button className="kiosk__ghost" onClick={clearCart}>Törlés</button>
            <button className="kiosk__primary" disabled={cart.length === 0}>Tovább a fizetéshez</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KioskPage;
