type MotionTarget = {
  selector: string;
  intensity: number;
};

const TOP_TARGETS: MotionTarget[] = [
  { selector: ".sgTopbar > .sgFlashBox", intensity: 1 },
  { selector: ".sgTopbar > .sgWeather", intensity: 0.9 },
  { selector: ".sgTopbar > .sgNamedayBox", intensity: 1 },
  { selector: ".sgTopbar > .sgClock", intensity: 0.62 },
];

const SMART_WIDGET_SELECTOR = ".sgx-widgetDock-v3 .sgx-widget";
const SMART_TEXT_SELECTOR = ".sgx-widgetDock-v3 .sgx-widget strong, .sgx-widgetDock-v3 .sgx-widget small";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function isSignageRoute() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/signage");
}

function setMotion(el: HTMLElement, intensity = 1) {
  el.classList.add("sgRandomMotion");
  el.style.setProperty("--sg-rand-x", `${rand(-18, 18) * intensity}px`);
  el.style.setProperty("--sg-rand-y", `${rand(-5, 5) * intensity}px`);
  el.style.setProperty("--sg-rand-rot", `${rand(-0.38, 0.38) * intensity}deg`);
  el.style.setProperty("--sg-rand-scale", `${rand(0.992, 1.014)}`);
  el.style.setProperty("--sg-rand-dur", `${rand(2.9, 6.8)}s`);
}

function setWeatherDayMotion(el: HTMLElement) {
  el.classList.add("sgRandomWeatherDay");
  el.style.setProperty("--sg-wx-x", `${rand(-5, 5)}px`);
  el.style.setProperty("--sg-wx-y", `${rand(-6, 6)}px`);
  el.style.setProperty("--sg-wx-rot", `${rand(-1.1, 1.1)}deg`);
  el.style.setProperty("--sg-wx-scale", `${rand(0.985, 1.02)}`);
  el.style.setProperty("--sg-wx-dur", `${rand(3.2, 7.4)}s`);
}

function setContentMotion(el: HTMLElement) {
  el.classList.add("sgRandomContentMotion");
  el.style.setProperty("--sg-content-x", `${rand(-10, 10)}px`);
  el.style.setProperty("--sg-content-y", `${rand(-2.5, 2.5)}px`);
  el.style.setProperty("--sg-content-dur", `${rand(3.5, 8)}s`);
}

function collectTopTargets(): Array<{ el: HTMLElement; intensity: number }> {
  return TOP_TARGETS.flatMap(({ selector, intensity }) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector)).map((el) => ({ el, intensity })),
  );
}

function collectSmartWidgets() {
  return Array.from(document.querySelectorAll<HTMLElement>(SMART_WIDGET_SELECTOR));
}

function setSmartWidgetMotion(el: HTMLElement, index = 0) {
  el.classList.add("sgSmartWidgetMotion");
  el.style.setProperty("--sg-smart-x", `${rand(-34, 34)}px`);
  el.style.setProperty("--sg-smart-y", `${rand(-8, 8)}px`);
  el.style.setProperty("--sg-smart-rot", `${rand(-0.7, 0.7)}deg`);
  el.style.setProperty("--sg-smart-scale", `${rand(0.985, 1.025)}`);
  el.style.setProperty("--sg-smart-dur", `${rand(2.2, 4.6)}s`);
  el.style.setProperty("--sg-smart-delay", `${Math.max(0, index) * 0.12}s`);
}

function setSmartTextMotion(el: HTMLElement) {
  el.classList.add("sgSmartContentMotion");
  const parent = el.parentElement;
  const room = parent ? Math.max(0, parent.clientWidth - 36) : 0;
  const overflow = room > 0 ? Math.max(0, el.scrollWidth - room) : 0;
  const travel = overflow > 8 ? Math.min(overflow + 18, 180) : rand(10, 24);
  const direction = Math.random() < 0.5 ? -1 : 1;
  el.style.setProperty("--sg-smart-text-x", `${direction * travel}px`);
  el.style.setProperty("--sg-smart-text-dur", `${rand(3.4, 7.2)}s`);
}

function attachSmartWidgetClasses() {
  if (!isSignageRoute()) return;
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  if (dock) {
    dock.classList.add("sgSmartDockMotion");
    dock.dataset.motionActive = "random-roll-v7";
  }

  collectSmartWidgets().forEach((el, index) => {
    if (!el.classList.contains("sgSmartWidgetMotion")) setSmartWidgetMotion(el, index);
  });
  document.querySelectorAll<HTMLElement>(SMART_TEXT_SELECTOR).forEach((el) => {
    if (!el.classList.contains("sgSmartContentMotion")) setSmartTextMotion(el);
  });
}

function attachTopClasses() {
  if (!isSignageRoute()) return;
  collectTopTargets().forEach(({ el, intensity }) => {
    if (!el.classList.contains("sgRandomMotion")) setMotion(el, intensity);
  });
  document.querySelectorAll<HTMLElement>(".sgTopbar .sgWxDay").forEach((el) => {
    if (!el.classList.contains("sgRandomWeatherDay")) setWeatherDayMotion(el);
  });
  document
    .querySelectorAll<HTMLElement>(".sgTopbar .sgInfoBody, .sgTopbar .sgInfoTitle, .sgTopbar .sgWxRow")
    .forEach((el) => {
      if (!el.classList.contains("sgRandomContentMotion")) setContentMotion(el);
    });
}

function attachClasses() {
  attachSmartWidgetClasses();
  attachTopClasses();
}

function randomizeTopSome() {
  if (!isSignageRoute()) return;
  attachTopClasses();

  const targets = shuffle(collectTopTargets());
  const count = Math.min(targets.length, randInt(1, 3));
  targets.slice(0, count).forEach(({ el, intensity }) => setMotion(el, intensity));

  const weatherDays = shuffle(Array.from(document.querySelectorAll<HTMLElement>(".sgTopbar .sgWxDay")));
  weatherDays.slice(0, randInt(1, Math.max(1, Math.min(3, weatherDays.length)))).forEach(setWeatherDayMotion);

  const content = shuffle(
    Array.from(
      document.querySelectorAll<HTMLElement>(
        ".sgTopbar .sgInfoBody, .sgTopbar .sgInfoTitle, .sgTopbar .sgWxRow",
      ),
    ),
  );
  content.slice(0, Math.min(content.length, randInt(1, 2))).forEach(setContentMotion);
}

function randomizeSmartWidgets() {
  if (!isSignageRoute()) return;
  attachSmartWidgetClasses();
  const widgets = shuffle(collectSmartWidgets());
  widgets.forEach((el, index) => setSmartWidgetMotion(el, index));

  const text = shuffle(Array.from(document.querySelectorAll<HTMLElement>(SMART_TEXT_SELECTOR)));
  const minCount = Math.min(3, text.length);
  const count = text.length ? Math.min(text.length, randInt(minCount, text.length)) : 0;
  text.slice(0, count).forEach(setSmartTextMotion);
}

function triggerRandomTopRoll() {
  if (!isSignageRoute()) return;
  const targets = collectTopTargets();
  if (!targets.length) return;
  const { el } = targets[Math.floor(Math.random() * targets.length)];
  const direction = Math.random() < 0.5 ? -1 : 1;
  el.style.setProperty("--sg-roll-from", `${direction * rand(10, 24)}px`);
  el.style.setProperty("--sg-roll-to", `${direction * -rand(10, 24)}px`);
  el.style.setProperty("--sg-roll-dur", `${rand(3.6, 5.4)}s`);
  el.classList.remove("sgRandomRoll");
  void el.offsetWidth;
  el.classList.add("sgRandomRoll");
  window.setTimeout(() => el.classList.remove("sgRandomRoll"), 5600);
}

function triggerSmartWidgetRoll() {
  if (!isSignageRoute()) return;
  const widgets = collectSmartWidgets();
  if (!widgets.length) return;
  const el = widgets[Math.floor(Math.random() * widgets.length)];
  const direction = Math.random() < 0.5 ? -1 : 1;
  el.style.setProperty("--sg-smart-roll-a", `${direction * rand(70, 125)}px`);
  el.style.setProperty("--sg-smart-roll-b", `${direction * -rand(35, 70)}px`);
  el.style.setProperty("--sg-smart-roll-c", `${direction * rand(14, 30)}px`);
  el.style.setProperty("--sg-smart-roll-dur", `${rand(3.8, 5.8)}s`);
  el.classList.remove("sgSmartRoll");
  void el.offsetWidth;
  el.classList.add("sgSmartRoll");
  window.setTimeout(() => el.classList.remove("sgSmartRoll"), 6200);
}

export function installSignageMotion() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageMotionInstalled) return;
  (window as any).__kleoSignageMotionInstalled = true;

  const prefersReducedMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  const observer = new MutationObserver(() => attachClasses());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const scheduleMove = () => {
    if (!isSignageRoute()) {
      window.setTimeout(scheduleMove, 4000);
      return;
    }

    // These are the four Smart Signage cards shown at the bottom of the screen.
    // They always move because this is an unattended display mode and explicit signage behavior.
    randomizeSmartWidgets();

    // Decorative top-bar motion still respects the operating system accessibility preference.
    if (!prefersReducedMotion) randomizeTopSome();
    window.setTimeout(scheduleMove, randInt(2200, 4300));
  };

  const scheduleRoll = () => {
    if (isSignageRoute()) {
      triggerSmartWidgetRoll();
      if (!prefersReducedMotion && Math.random() > 0.45) triggerRandomTopRoll();
    }
    window.setTimeout(scheduleRoll, randInt(8000, 15500));
  };

  window.setTimeout(() => {
    attachClasses();
    randomizeSmartWidgets();
    if (!prefersReducedMotion) randomizeTopSome();
    scheduleMove();
  }, 350);
  window.setTimeout(scheduleRoll, randInt(3800, 7200));
}
