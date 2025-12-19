// src/utils/mailchimp.ts
/**
 * Mailchimp feliratkozás/lead beküldés kliens oldalról.
 *
 * Render/Vite környezetben a legegyszerűbb (API kulcs nélkül) az "Embedded form" POST URL használata.
 * Ezt nem tudom kitalálni helyetted, ezért konfigurálható környezeti változóval:
 *
 *   VITE_MAILCHIMP_POST_URL="https://XXXX.list-manage.com/subscribe/post?u=...&id=..."
 *
 * Megjegyzés: a Mailchimp tipikusan URL-encoded POST-ot vár. A válasz CORS miatt gyakran nem olvasható,
 * ezért a sikerességet inkább UI-flow-val (köszönő oldal) kezeljük.
 */
export async function submitToMailchimp(payload: Record<string, string>) {
  const url = import.meta.env.VITE_MAILCHIMP_POST_URL as string | undefined;
  if (!url) {
    // Fejlesztésben ne dobjon, csak jelezzen a konzolban.
    console.warn("[mailchimp] Missing VITE_MAILCHIMP_POST_URL. Payload:", payload);
    return;
  }

  const body = new URLSearchParams(payload);

  // no-cors: a böngésző nem engedi kiolvasni a választ, de a POST elküldhető.
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}
