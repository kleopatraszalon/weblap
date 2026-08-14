const RUN_KEY = "kleo_campaign_run_id";
const UTM_KEY = "kleo_campaign_utm";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let installed = false;

function currentCampaignId() {
  try {
    const fromUrl = new URL(window.location.href).searchParams.get("campaign_run_id") || "";
    if (UUID_RE.test(fromUrl)) {
      sessionStorage.setItem(RUN_KEY, fromUrl);
      const params = new URL(window.location.href).searchParams;
      sessionStorage.setItem(
        UTM_KEY,
        JSON.stringify({
          source: params.get("utm_source") || "",
          medium: params.get("utm_medium") || "",
          campaign: params.get("utm_campaign") || "",
          content: params.get("utm_content") || "",
        }),
      );
      return fromUrl;
    }
    const stored = sessionStorage.getItem(RUN_KEY) || "";
    return UUID_RE.test(stored) ? stored : "";
  } catch {
    return "";
  }
}

function bookingRequest(url: string, init?: RequestInit) {
  if (String(init?.method || "GET").toUpperCase() !== "POST") return false;
  return /\/api\/public\/(?:marketing\/)?booking\/book(?:\?|$)/.test(url);
}

export function installMarketingAttribution() {
  if (installed || typeof window === "undefined" || typeof window.fetch !== "function") return;
  installed = true;
  currentCampaignId();
  const originalFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const campaignRunId = currentCampaignId();
    if (!campaignRunId || !bookingRequest(url, init) || typeof init?.body !== "string") {
      return originalFetch(input, init);
    }

    try {
      const payload = JSON.parse(init.body);
      const marker = `[campaign:${campaignRunId}]`;
      const note = String(payload?.note || "").trim();
      if (!note.includes(marker)) payload.note = note ? `${note}\n${marker}` : marker;
      payload.campaign_run_id = campaignRunId;
      try {
        payload.campaign_utm = JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
      } catch {
        payload.campaign_utm = {};
      }
      return originalFetch(input, { ...init, body: JSON.stringify(payload) });
    } catch {
      return originalFetch(input, init);
    }
  }) as typeof window.fetch;
}
