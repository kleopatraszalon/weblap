type KleoVideoTopic = "GYM" | "FODRÁSZAT" | "KOZMETIKA";

type KleoYoutubeVideo = {
  id: string;
  title: string;
  channel: string;
  topic: KleoVideoTopic;
};

const VIDEO_POOL: KleoYoutubeVideo[] = [
  {
    id: "UItWltVZZmE",
    title: "20 MIN Full Body Workout · Beginner",
    channel: "Pamela Reif",
    topic: "GYM",
  },
  {
    id: "AnYl6Nk9GOA",
    title: "10 MIN AB Workout · No Equipment",
    channel: "Pamela Reif",
    topic: "GYM",
  },
  {
    id: "SM-OspCx4qk",
    title: "Perfect Hairdresser Blowout",
    channel: "Brad Mondo",
    topic: "FODRÁSZAT",
  },
  {
    id: "98dPekpSVGQ",
    title: "Hairdresser Guide to Hair Coloring",
    channel: "Brad Mondo",
    topic: "FODRÁSZAT",
  },
  {
    id: "y7UyKEb2ZHw",
    title: "Normal & Combination Skincare Routine",
    channel: "Doctorly",
    topic: "KOZMETIKA",
  },
  {
    id: "NMDE3LQbBBQ",
    title: "Basics of Building a Skincare Routine",
    channel: "Doctorly",
    topic: "KOZMETIKA",
  },
];

const SMART_WIDGETS = ".sgx-widgetDock-v3 .sgx-widget";
const VIDEO_FRAME = ".sgVideoFrame";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

function isSignageRoute() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/signage");
}

function youtubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`;
}

function pickNextVideo(previousId: string) {
  const candidates = VIDEO_POOL.filter((video) => video.id !== previousId);
  const pool = candidates.length ? candidates : VIDEO_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

function decorateSmartWidgets() {
  if (!isSignageRoute()) return;
  const widgets = Array.from(document.querySelectorAll<HTMLElement>(SMART_WIDGETS));
  widgets.forEach((widget, index) => {
    widget.dataset.motionV8 = "active";
    widget.style.setProperty("--sg-v8-dur", `${rand(7.6, 13.8).toFixed(2)}s`);
    widget.style.setProperty("--sg-v8-delay", `${(-rand(0, 8)).toFixed(2)}s`);
    widget.style.setProperty("--sg-v8-text-dur", `${rand(5.2, 9.8).toFixed(2)}s`);
    widget.style.setProperty("--sg-v8-phase", `${index}`);
  });
}

function updateVideoCaption(video: KleoYoutubeVideo) {
  const panel = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  if (!panel) return;
  panel.dataset.youtubeRandom = "smart-signage-v8";
  panel.dataset.youtubeTopic = video.topic.toLowerCase();

  const heading = panel.querySelector<HTMLElement>(".sgPanelHeader h2");
  const nextHeading = `KLEO TV · ${video.topic}`;
  if (heading && heading.textContent !== nextHeading) heading.textContent = nextHeading;

  const meta = panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta");
  const nextMeta = `${video.channel} · ${video.title}`;
  if (meta && meta.textContent !== nextMeta) meta.textContent = nextMeta;
}

export function installSignageMotionV8() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageMotionV8Installed) return;
  (window as any).__kleoSignageMotionV8Installed = true;

  let currentVideo: KleoYoutubeVideo | null = null;
  let videoTimer = 0;
  let cadenceTimer = 0;
  let reapplyTimer = 0;

  const applyCurrentVideo = () => {
    if (!isSignageRoute() || !currentVideo) return;
    const frame = document.querySelector<HTMLIFrameElement>(VIDEO_FRAME);
    if (!frame) return;

    const expected = youtubeEmbedUrl(currentVideo.id);
    if (frame.src !== expected) frame.src = expected;
    frame.dataset.kleoYoutubeId = currentVideo.id;
    frame.dataset.kleoYoutubeTopic = currentVideo.topic.toLowerCase();
    updateVideoCaption(currentVideo);
  };

  const rotateVideo = () => {
    if (!isSignageRoute()) {
      videoTimer = window.setTimeout(rotateVideo, 5000);
      return;
    }

    currentVideo = pickNextVideo(currentVideo?.id || "");
    applyCurrentVideo();
    videoTimer = window.setTimeout(rotateVideo, randInt(72_000, 138_000));
  };

  const randomizeCadence = () => {
    if (isSignageRoute()) decorateSmartWidgets();
    cadenceTimer = window.setTimeout(randomizeCadence, randInt(10_000, 18_000));
  };

  const observer = new MutationObserver(() => {
    if (!isSignageRoute()) return;
    decorateSmartWidgets();
    if (!currentVideo) return;

    const frame = document.querySelector<HTMLIFrameElement>(VIDEO_FRAME);
    const expectedFragment = `/embed/${currentVideo.id}`;
    if (frame && frame.src.includes(expectedFragment)) return;

    window.clearTimeout(reapplyTimer);
    reapplyTimer = window.setTimeout(applyCurrentVideo, 120);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  window.setTimeout(() => {
    decorateSmartWidgets();
    currentVideo = pickNextVideo("");
    applyCurrentVideo();
    videoTimer = window.setTimeout(rotateVideo, randInt(72_000, 138_000));
    randomizeCadence();
  }, 900);

  window.addEventListener("beforeunload", () => {
    observer.disconnect();
    window.clearTimeout(videoTimer);
    window.clearTimeout(cadenceTimer);
    window.clearTimeout(reapplyTimer);
  });
}
