type MotionNode = {
  el: HTMLElement;
  phase: number;
  speedA: number;
  speedB: number;
  ampX: number;
  ampY: number;
  rot: number;
  scale: number;
  boostUntil: number;
  boostDir: number;
};

const TOP_SELECTORS = [
  ".sgTopbar > .sgFlashBox",
  ".sgTopbar > .sgWeather",
  ".sgTopbar > .sgNamedayBox",
  ".sgTopbar > .sgClock",
];
const SMART_SELECTOR = ".sgx-widgetDock-v3 .sgx-widget";

const nodes = new Map<HTMLElement, MotionNode>();
let raf = 0;
let boostTimer = 0;

function isSignageRoute() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/signage");
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function collect(): HTMLElement[] {
  const top = TOP_SELECTORS.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)));
  const smart = Array.from(document.querySelectorAll<HTMLElement>(SMART_SELECTOR));
  return [...top, ...smart];
}

function ensureNode(el: HTMLElement, index: number, smart: boolean): MotionNode {
  const existing = nodes.get(el);
  if (existing) return existing;
  const item: MotionNode = {
    el,
    phase: rand(0, Math.PI * 2) + index * 0.7,
    speedA: rand(0.00042, 0.00072),
    speedB: rand(0.00022, 0.00038),
    ampX: smart ? rand(52, 96) : rand(34, 68),
    ampY: smart ? rand(9, 18) : rand(7, 14),
    rot: smart ? rand(0.5, 1.15) : rand(0.35, 0.8),
    scale: smart ? rand(0.012, 0.026) : rand(0.008, 0.018),
    boostUntil: 0,
    boostDir: 1,
  };
  el.dataset.motionV9 = "active";
  el.style.setProperty("animation", "none", "important");
  el.style.setProperty("transition", "none", "important");
  el.style.setProperty("will-change", "transform", "important");
  el.style.setProperty("transform-origin", "center center", "important");
  nodes.set(el, item);
  return item;
}

function refreshNodes() {
  if (!isSignageRoute()) return;
  const live = new Set(collect());
  let index = 0;
  live.forEach((el) => {
    const smart = el.matches(SMART_SELECTOR);
    ensureNode(el, index++, smart);
  });
  Array.from(nodes.keys()).forEach((el) => {
    if (!document.contains(el) || !live.has(el)) nodes.delete(el);
  });
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  if (dock) {
    dock.dataset.motionRuntime = "raf-v9";
    dock.style.setProperty("overflow", "visible", "important");
  }
  const root = document.querySelector<HTMLElement>(".sgx");
  if (root) root.dataset.motionRuntime = "raf-v9";
}

function tick(now: number) {
  if (isSignageRoute()) {
    refreshNodes();
    nodes.forEach((n) => {
      const smart = n.el.matches(SMART_SELECTOR);
      const x = Math.sin(now * n.speedA + n.phase) * n.ampX + Math.sin(now * n.speedB + n.phase * 1.8) * n.ampX * 0.34;
      const y = Math.cos(now * n.speedA * 0.83 + n.phase) * n.ampY;
      const r = Math.sin(now * n.speedB * 1.3 + n.phase) * n.rot;
      const s = 1 + Math.sin(now * n.speedA * 0.61 + n.phase) * n.scale;

      let boost = 0;
      if (n.boostUntil > now) {
        const remaining = Math.max(0, n.boostUntil - now);
        const p = 1 - remaining / 2800;
        boost = Math.sin(Math.PI * Math.min(1, Math.max(0, p))) * (smart ? 145 : 92) * n.boostDir;
      }

      n.el.style.setProperty(
        "transform",
        `translate3d(${(x + boost).toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)})`,
        "important",
      );
    });
  }
  raf = window.requestAnimationFrame(tick);
}

function scheduleBoost() {
  if (isSignageRoute()) {
    refreshNodes();
    const list = Array.from(nodes.values());
    if (list.length) {
      const target = list[Math.floor(Math.random() * list.length)];
      target.boostUntil = performance.now() + 2800;
      target.boostDir = Math.random() < 0.5 ? -1 : 1;
    }
  }
  boostTimer = window.setTimeout(scheduleBoost, Math.round(rand(5200, 9800)));
}

export function installSignageMotionV9() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageMotionV9Installed) return;
  (window as any).__kleoSignageMotionV9Installed = true;

  window.setTimeout(() => {
    refreshNodes();
    raf = window.requestAnimationFrame(tick);
    boostTimer = window.setTimeout(scheduleBoost, 3200);
  }, 250);

  window.addEventListener("beforeunload", () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (boostTimer) window.clearTimeout(boostTimer);
  });
}
