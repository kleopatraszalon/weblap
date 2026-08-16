import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export type FranchiseExtraField = {
  key: string;
  label: string;
  required?: boolean;
  type?: "text" | "number" | "textarea" | "select" | "datetime-local";
  options?: string[];
  helperText?: string;
};

type Props = {
  variant: "lp" | "sp" | "franchise" | "franchise-v1" | "franchise-info";
  extraFields?: FranchiseExtraField[];
  compact?: boolean;
  successPath?: string;
};

const LEAD_ENDPOINT = String(import.meta.env.VITE_FRANCHISE_LEAD_ENDPOINT || "/api/franchise-leads");

function campaignData() {
  const params = new URLSearchParams(window.location.search);
  return {
    page_url: window.location.href,
    referrer: document.referrer || "",
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

function defaultSuccessPath(variant: Props["variant"]) {
  if (variant === "lp" || variant === "franchise-v1") return "/ajanlat";
  return "/koszonjuk";
}

export function FranchiseLeadForm({ variant, extraFields = [], compact = false, successPath }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const valid = useMemo(() => {
    const basics = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && phone.trim().length >= 6 && consent;
    return basics && extraFields.every((field) => !field.required || String(extra[field.key] || "").trim().length > 0);
  }, [name, email, phone, consent, extra, extraFields]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          consent,
          source: "franchise-funnel",
          variant,
          extra,
          tracking: campaignData(),
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message || detail?.error || `HTTP ${response.status}`);
      }

      navigate(successPath || defaultSuccessPath(variant), { replace: true });
    } catch (submitError) {
      console.error("Franchise lead submit failed", submitError);
      setError("A beküldés most nem sikerült. Kérlek, próbáld újra, vagy vedd fel velünk a kapcsolatot.");
    } finally {
      setBusy(false);
    }
  }

  const detailed = variant === "sp" || variant === "franchise-info";

  return (
    <form onSubmit={onSubmit} className={compact ? "franchise-lead-form is-compact" : "franchise-lead-form"}>
      <div className="feature-grid">
        <label className="feature-card">
          <strong>Név *</strong>
          <input className="fr-input" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="feature-card">
          <strong>E-mail *</strong>
          <input className="fr-input" type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="feature-card">
          <strong>Telefonszám *</strong>
          <input className="fr-input" type="tel" name="phone" autoComplete="tel" placeholder="+36 ..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <small>Lehetőleg +36-os formátumban add meg.</small>
        </label>
      </div>

      {extraFields.length > 0 && (
        <div className="feature-grid" style={{ marginTop: 20 }}>
          {extraFields.map((field) => (
            <label className="feature-card" key={field.key}>
              <strong>{field.label}{field.required ? " *" : ""}</strong>
              {field.type === "textarea" ? (
                <textarea className="fr-input" rows={4} value={extra[field.key] || ""} onChange={(e) => setExtra((prev) => ({ ...prev, [field.key]: e.target.value }))} required={field.required} />
              ) : field.type === "select" ? (
                <select className="fr-input" value={extra[field.key] || ""} onChange={(e) => setExtra((prev) => ({ ...prev, [field.key]: e.target.value }))} required={field.required}>
                  <option value="">Válassz…</option>
                  {(field.options || []).map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              ) : (
                <input className="fr-input" type={field.type || "text"} value={extra[field.key] || ""} onChange={(e) => setExtra((prev) => ({ ...prev, [field.key]: e.target.value }))} required={field.required} />
              )}
              {field.helperText && <small>{field.helperText}</small>}
            </label>
          ))}
        </div>
      )}

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 20, lineHeight: 1.5 }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required style={{ marginTop: 5 }} />
        <span>Hozzájárulok, hogy a Kleopátra Szépségszalonok a megadott adataimat kapcsolatfelvétel és franchise tájékoztatás céljából kezelje.</span>
      </label>

      {error && <p role="alert" style={{ color: "#8b1e1e", fontWeight: 700 }}>{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={!valid || busy} style={{ marginTop: 18 }}>
        {busy ? "Küldés…" : detailed ? "Elküldöm a jelentkezésem" : "Kérem a franchise információt"}
      </button>
    </form>
  );
}

export default FranchiseLeadForm;
