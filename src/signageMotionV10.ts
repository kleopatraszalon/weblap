type FloatingCard = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  nextTurnAt: number;
};

const DOCK_SELECTOR = ".sgx-widgetDock-v3";
const CARD_SELECTOR = ".sgx-widgetDock-v3 .sgx-widget";
const CONTENT_BAND_SELECTOR = ".sgGrid";
const cards = new Map<HTMLElement, FloatingCard>();
let raf = 0;
let lastNow = 0;

function isSignageRoute() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/signage");
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function speed() {
  return rand(22, 48);
}

function setRandomVelocity(card: FloatingCard) {
  const angle = rand(0, Math.PI * 2);
  const s = speed();
  card.vx = Math.cos(angle) * s;
  card.vy = Math.sin(angle) * s * 0.58;
  card.nextTurnAt = performance.now() + rand(4200, 9000);
}

function dockElement() {
  return document.querySelector<HTMLElement>(DOCK_SELECTOR);
}

function syncDockToContentBand(dock: HTMLElement) {
  const band = document.querySelector<HTMLElement>(CONTENT_BAND_SELECTOR);
  if (!band) return false;
  const rect = band.getBoundingClientRect();
  if (rect.width < 120 || rect.height < 80) return false;

  const insetX = Math.max(6, Math.min(18, rect.width * 0.008));
  const insetY = Math.max(5, Math.min(12, rect.height * 0.02));
  dock.dataset.motionRuntime = "floating-content-band-v12";
  dock.style.setProperty("position", "fixed", "important");
  dock.style.setProperty("left", `${rect.left + insetX}px`, "important");
  dock.style.setProperty("top", `${rect.top + insetY}px`, "important");
  dock.style.setProperty("right", "auto", "important");
  dock.style.setProperty("bottom", "auto", "important");
  dock.style.setProperty("width", `${Math.max(1, rect.width - insetX * 2)}px`, "important");
  dock.style.setProperty("height", `${Math.max(1, rect.height - insetY * 2)}px`, "important");
  dock.style.setProperty("display", "block", "important");
  dock.style.setProperty("overflow", "hidden", "important");
  dock.style.setProperty("pointer-events", "none", "important");
  return true;
}

function seedPosition(index: number, maxX: number, maxY: number) {
  const seeds = [
    [0.03, 0.08],
    [0.73, 0.10],
    [0.08, 0.72],
    [0.72, 0.70],
  ];
  const [sx, sy] = seeds[index % seeds.length];
  return { x: maxX * sx, y: maxY * sy };
}

function refreshCards() {
  if (!isSignageRoute()) return;
  const dock = dockElement();
  if (!dock || !syncDockToContentBand(dock)) return;

  const dockRect = dock.getBoundingClientRect();
  const live = Array.from(document.querySelectorAll<HTMLElement>(CARD_SELECTOR));

  live.forEach((el, index) => {
    el.dataset.motionV10 = "active";
    el.dataset.motionBand = "video-row-v12";
    el.style.setProperty("animation", "none", "important");
    el.style.setProperty("transition", "none", "important");
    el.style.setProperty("position", "absolute", "important");
    el.style.setProperty("left", "0", "important");
    el.style.setProperty("top", "0", "important");
    el.style.setProperty("will-change", "transform", "important");

    if (!cards.has(el)) {
      const rect = el.getBoundingClientRect();
      const maxX = Math.max(0, dockRect.width - rect.width);
      const maxY = Math.max(0, dockRect.height - rect.height);
      const pos = seedPosition(index, maxX, maxY);
      const card: FloatingCard = { el, x: pos.x, y: pos.y, vx: 0, vy: 0, phase: rand(0, Math.PI * 2), nextTurnAt: 0 };
      setRandomVelocity(card);
      cards.set(el, card);
    }
  });

  Array.from(cards.keys()).forEach((el) => {
    if (!document.contains(el) || !live.includes(el)) cards.delete(el);
  });
}

function tick(now: number) {
  if (!lastNow) lastNow = now;
  const dt = Math.min(0.05, Math.max(0, (now - lastNow) / 1000));
  lastNow = now;

  if (isSignageRoute()) {
    refreshCards();
    const dock = dockElement();
    if (dock) {
      const dockRect = dock.getBoundingClientRect();
      cards.forEach((card, index) => {
        const rect = card.el.getBoundingClientRect();
        const maxX = Math.max(0, dockRect.width - rect.width);
        const maxY = Math.max(0, dockRect.height - rect.height);

        if (now >= card.nextTurnAt) setRandomVelocity(card);
        card.x += card.vx * dt;
        card.y += card.vy * dt;

        if (card.x <= 0) { card.x = 0; card.vx = Math.abs(card.vx) || speed(); }
        else if (card.x >= maxX) { card.x = maxX; card.vx = -Math.abs(card.vx) || -speed(); }
        if (card.y <= 0) { card.y = 0; card.vy = Math.abs(card.vy) || speed() * 0.55; }
        else if (card.y >= maxY) { card.y = maxY; card.vy = -Math.abs(card.vy) || -speed() * 0.55; }

        const bob = Math.sin(now * 0.00135 + card.phase) * 3.5;
        const tilt = Math.sin(now * 0.00082 + card.phase) * 0.5;
        const pulse = 1 + Math.sin(now * 0.00105 + card.phase) * 0.006;
        card.el.style.setProperty(
          "transform",
          `translate3d(${card.x.toFixed(1)}px, ${(card.y + bob).toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}deg) scale(${pulse.toFixed(4)})`,
          "important",
        );
        card.el.style.setProperty("z-index", String(930 + ((index + Math.floor(now / 7000)) % 4)), "important");
      });
    }
  }

  raf = window.requestAnimationFrame(tick);
}

export function installSignageMotionV10() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageMotionV10Installed) return;
  (window as any).__kleoSignageMotionV10Installed = true;
  (window as any).__kleoSignageContentBandV12 = true;

  window.setTimeout(() => {
    refreshCards();
    lastNow = performance.now();
    raf = window.requestAnimationFrame(tick);
  }, 450);

  window.addEventListener("beforeunload", () => {
    if (raf) window.cancelAnimationFrame(raf);
  });
}
