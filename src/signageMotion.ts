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

function attachClasses() {
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

function randomizeSome() {
  if (!isSignageRoute()) return;
  attachClasses();

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

function triggerRandomRoll() {
  if (!isSignageRoute()) return;
  const targets = collectTopTargets();
  if (!targets.length) return;
  const { el } = targets[Math.floor(Math.random() * targets.length)];
  const direction = Math.random() < 0.5 ? -1 : 1;
  el.style.setProperty("--sg-roll-from", `${direction * rand(10, 24)}px`);
  el.style.setProperty("--sg-roll-to", `${direction * -rand(10, 24)}px`);
  el.style.setProperty("--sg-roll-dur", `${rand(3.6, 5.4)}s`);
  el.classList.remove("sgRandomRoll");
  // Restart the one-shot animation even if the same card is picked twice.
  void el.offsetWidth;
  el.classList.add("sgRandomRoll");
  window.setTimeout(() => el.classList.remove("sgRandomRoll"), 5600);
}

export function installSignageMotion() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageMotionInstalled) return;
  (window as any).__kleoSignageMotionInstalled = true;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new MutationObserver(() => attachClasses());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const scheduleMove = () => {
    if (!isSignageRoute()) {
      window.setTimeout(scheduleMove, 5000);
      return;
    }
    randomizeSome();
    window.setTimeout(scheduleMove, randInt(3200, 7600));
  };

  const scheduleRoll = () => {
    if (isSignageRoute()) triggerRandomRoll();
    window.setTimeout(scheduleRoll, randInt(14000, 29000));
  };

  window.setTimeout(() => {
    attachClasses();
    randomizeSome();
    scheduleMove();
  }, 450);
  window.setTimeout(scheduleRoll, randInt(6500, 11000));
}
