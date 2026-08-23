import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomePage } from "./HomePage";

const CSS = String.raw`
/* Rebeka 2026-08-23: the black duplicate booking choice section is redundant. */
.kleo-v3-section--ink{display:none!important}

/* Entire promotional cards become obvious click targets once enhanced below. */
[data-kleo-clickable-card="true"]{cursor:pointer;position:relative;transition:transform .18s ease,box-shadow .18s ease}
[data-kleo-clickable-card="true"]:hover{transform:translateY(-2px)}
[data-kleo-clickable-card="true"]:focus-visible{outline:3px solid #ec008c;outline-offset:4px}
`;

const CARD_TITLES = ["Ajándékutalvány", "Ajándékutalványaink", "Iratkozz fel hírlevelünkre"];

function findClickableCard(start: Element): HTMLElement | null {
  let node: HTMLElement | null = start as HTMLElement;
  for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
    const link = node.querySelector<HTMLAnchorElement>("a[href]");
    if (link && node !== document.body && node !== document.documentElement) return node;
  }
  return null;
}

export const HomePageEnhanced: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cleanup: Array<() => void> = [];

    // Keep the comma visually attached to "szépség" even when the following text wraps.
    const heroTitle = document.querySelector<HTMLElement>(".kleo-v3-hero__copy h1");
    const emphasis = heroTitle?.querySelector<HTMLElement>("em");
    if (heroTitle && emphasis) {
      const next = emphasis.nextSibling;
      if (next?.nodeType === Node.TEXT_NODE && (next.textContent || "").trimStart().startsWith(",")) {
        emphasis.textContent = `${(emphasis.textContent || "").replace(/,\s*$/, "")},`;
        next.textContent = (next.textContent || "").replace(/^\s*,\s*/, " ");
      }
      emphasis.style.whiteSpace = "nowrap";
    }

    const candidates = Array.from(document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,p,span,strong"));
    for (const candidate of candidates) {
      const text = (candidate.textContent || "").trim();
      if (!CARD_TITLES.some((title) => text.startsWith(title))) continue;
      const card = findClickableCard(candidate);
      const link = card?.querySelector<HTMLAnchorElement>("a[href]");
      if (!card || !link || card.dataset.kleoClickableCard === "true") continue;

      card.dataset.kleoClickableCard = "true";
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", text);

      const activate = (event: Event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest("a,button,input,select,textarea,label")) return;
        const href = link.getAttribute("href") || "";
        if (!href) return;
        if (href.startsWith("/")) navigate(href);
        else window.location.href = href;
      };
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(event);
        }
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", keydown);
      cleanup.push(() => {
        card.removeEventListener("click", activate);
        card.removeEventListener("keydown", keydown);
      });
    }

    return () => cleanup.forEach((fn) => fn());
  }, [navigate]);

  return <><style>{CSS}</style><HomePage /></>;
};

export default HomePageEnhanced;
