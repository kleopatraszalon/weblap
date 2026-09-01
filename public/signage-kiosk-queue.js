(() => {
  'use strict';

  if (!/^\/signage(?:\/|$)/i.test(window.location.pathname)) return;

  const API_ORIGIN = (() => {
    const host = window.location.hostname;
    if (host.endsWith('.onrender.com') && !host.startsWith('kleoszalon-api')) {
      return 'https://kleoszalon-api-1.onrender.com';
    }
    if ((host === 'localhost' || host === '127.0.0.1') && window.location.port !== '5000') {
      return 'http://localhost:5000';
    }
    return window.location.origin;
  })();

  const style = document.createElement('style');
  style.id = 'sg-kiosk-queue-style';
  style.textContent = `
    .sgDeals.sgKioskQueueHost{position:relative;overflow:hidden}
    #sgKioskQueueOverlay{position:absolute;inset:0;z-index:40;background:var(--sg-offwhite,#fffaf5);display:flex;flex-direction:column;color:#21140e}
    #sgKioskQueueOverlay *{box-sizing:border-box}
    .sgKqHeader{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 20px 12px;border-bottom:1px solid rgba(18,12,8,.10)}
    .sgKqTitle{font-size:34px;font-weight:1000;letter-spacing:-.02em}
    .sgKqMeta{font-size:15px;font-weight:800;opacity:.58;text-align:right}
    .sgKqColumns{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px 16px 18px;min-height:0;flex:1}
    .sgKqColumn{min-width:0;border:1px solid rgba(18,12,8,.10);border-radius:16px;background:#fff;overflow:hidden;display:flex;flex-direction:column}
    .sgKqColumn.ready{background:#fffaf0}
    .sgKqColumnTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;border-bottom:1px solid rgba(18,12,8,.08);font-size:20px;font-weight:1000}
    .sgKqCount{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;padding:0 8px;border-radius:999px;background:rgba(122,24,76,.10);font-size:14px}
    .sgKqList{padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;min-height:0}
    .sgKqCard{display:grid;grid-template-columns:minmax(118px,auto) 42px minmax(0,1fr);align-items:center;gap:10px;padding:9px 10px;border-radius:12px;background:#f8f2ee;border:1px solid rgba(18,12,8,.07);min-height:62px}
    .ready .sgKqCard{background:#fff3cf}
    .sgKqCode{font-size:25px;line-height:1;font-weight:1000;letter-spacing:.02em;color:#7a184c;white-space:nowrap}
    .ready .sgKqCode{color:#855200}
    .sgKqAvatar{width:42px;height:42px;border-radius:50%;object-fit:cover;background:#eadfd9;border:2px solid rgba(122,24,76,.14)}
    .sgKqAvatarFallback{display:grid;place-items:center;font-weight:1000;font-size:16px;color:#7a184c}
    .sgKqPerson{min-width:0}
    .sgKqLabel{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.48}
    .sgKqName{font-size:16px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
    .sgKqEmpty{display:grid;place-items:center;min-height:105px;text-align:center;padding:18px;font-size:16px;font-weight:700;opacity:.48}
    .sgKqError{display:grid;place-items:center;flex:1;text-align:center;padding:22px;font-size:17px;font-weight:800;color:#8e1c1c}
  `;
  document.head.appendChild(style);

  const initials = (name) => String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0] || '')
    .join('')
    .toUpperCase() || '?';

  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const resolvePhoto = (raw) => {
    const value = String(raw || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `${API_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
  };

  const card = (row) => {
    const name = String(row?.specialist_name || 'Szakember kijelölése folyamatban');
    const photo = resolvePhoto(row?.specialist_photo_url);
    const avatar = photo
      ? `<img class="sgKqAvatar" src="${esc(photo)}" alt="" onerror="this.outerHTML='<div class=\'sgKqAvatar sgKqAvatarFallback\'>${esc(initials(name))}</div>'">`
      : `<div class="sgKqAvatar sgKqAvatarFallback">${esc(initials(name))}</div>`;
    return `<div class="sgKqCard"><div class="sgKqCode">${esc(row?.kiosk_queue_code || '')}</div>${avatar}<div class="sgKqPerson"><div class="sgKqLabel">Szakember</div><div class="sgKqName">${esc(name)}</div></div></div>`;
  };

  const list = (rows, emptyText) => Array.isArray(rows) && rows.length
    ? rows.slice(0, 5).map(card).join('')
    : `<div class="sgKqEmpty">${esc(emptyText)}</div>`;

  const ensureOverlay = () => {
    const host = document.querySelector('.sgDeals');
    if (!host) return null;
    host.classList.add('sgKioskQueueHost');
    let overlay = host.querySelector('#sgKioskQueueOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sgKioskQueueOverlay';
      overlay.innerHTML = '<div class="sgKqError">KIOSK sorhívó betöltése…</div>';
      host.appendChild(overlay);
    }
    return overlay;
  };

  let loading = false;
  const refresh = async () => {
    const overlay = ensureOverlay();
    if (!overlay || loading) return;
    loading = true;
    try {
      const params = new URLSearchParams();
      const locationId = new URLSearchParams(window.location.search).get('location_id');
      if (locationId) params.set('location_id', locationId);
      const suffix = params.toString() ? `?${params}` : '';
      const response = await fetch(`${API_ORIGIN}/api/signage/wallboard/queue.json${suffix}`, {
        cache: 'no-store',
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const waiting = Array.isArray(data?.waiting) ? data.waiting : [];
      const ready = Array.isArray(data?.ready) ? data.ready : [];
      const salon = String(data?.location?.name || '');
      overlay.innerHTML = `
        <div class="sgKqHeader">
          <div class="sgKqTitle">KIOSK sorhívó</div>
          <div class="sgKqMeta">${esc(salon)}${salon ? '<br>' : ''}Automatikus frissítés · 3 mp</div>
        </div>
        <div class="sgKqColumns">
          <section class="sgKqColumn waiting">
            <div class="sgKqColumnTitle"><span>Várakozik</span><span class="sgKqCount">${waiting.length}</span></div>
            <div class="sgKqList">${list(waiting, 'Nincs várakozó kioskos rendelés.')}</div>
          </section>
          <section class="sgKqColumn ready">
            <div class="sgKqColumnTitle"><span>Mehet a szakemberhez</span><span class="sgKqCount">${ready.length}</span></div>
            <div class="sgKqList">${list(ready, 'Jelenleg nincs hívható sorszám.')}</div>
          </section>
        </div>`;
    } catch (error) {
      overlay.innerHTML = `<div class="sgKqHeader"><div class="sgKqTitle">KIOSK sorhívó</div><div class="sgKqMeta">Újracsatlakozás…</div></div><div class="sgKqError">A sorhívó adatforrás átmenetileg nem érhető el.</div>`;
      console.error('[signage-kiosk-queue]', error);
    } finally {
      loading = false;
    }
  };

  const observer = new MutationObserver(() => {
    if (!document.querySelector('#sgKioskQueueOverlay')) refresh();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const boot = () => {
    refresh();
    window.setInterval(refresh, 3000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
