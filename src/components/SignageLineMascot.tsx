import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./SignageLineMascot.css";

const WOMAN_ART = "/images/signage/kleo-woman-gta.webp";
const CYCLE_MS = 22_000;
const STOP_START = 0.45;
const STOP_END = 0.59;
const TICKER_CLEARANCE_PX = 6;

/**
 * Kleopátra signage character.
 * Keeps the legacy layer class because the live-deploy workflow uses it as a
 * bundle marker, but the visible mascot is now a full-colour illustrated woman.
 */
export default function SignageLineMascot() {
  const [host, setHost] = useState<Element | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.location.pathname.startsWith("/signage")) return;

    let frame = 0;
    let attempts = 0;
    const findHost = () => {
      const node = document.querySelector(".sgx");
      if (node) {
        setHost(node);
        return;
      }
      if (attempts++ < 180) frame = window.requestAnimationFrame(findHost);
    };

    findHost();
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!host) return;

    let disposed = false;
    let motion: Animation | null = null;
    let restartTimer = 0;
    let stopTimer = 0;
    let resumeTimer = 0;
    let resizeTimer = 0;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearCycle = () => {
      motion?.cancel();
      motion = null;
      window.clearTimeout(restartTimer);
      window.clearTimeout(stopTimer);
      window.clearTimeout(resumeTimer);
      trackRef.current?.classList.remove("is-at-video");
    };

    const runCycle = () => {
      if (disposed) return;
      const track = trackRef.current;
      const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
      const ticker = document.querySelector<HTMLElement>(".sgTicker");

      if (!track || !video || !ticker) {
        restartTimer = window.setTimeout(runCycle, 500);
        return;
      }

      clearCycle();

      const videoRect = video.getBoundingClientRect();
      const tickerRect = ticker.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const womanWidth = Math.max(140, trackRect.width || 240);
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Anchor the artwork by its bottom edge to the TOP of the pink ticker.
      // Positive clearance keeps the shoe soles visibly above the magenta line.
      const walkBottom = Math.max(0, viewportHeight - tickerRect.top + TICKER_CLEARANCE_PX);
      track.style.setProperty("--kleo-walk-bottom", `${walkBottom}px`);

      const startX = -womanWidth - 40;
      const desiredStop = videoRect.left + Math.min(videoRect.width * 0.08, 70) - womanWidth * 0.46;
      const stopX = Math.max(18, Math.min(desiredStop, viewportWidth - womanWidth - 18));
      const endX = viewportWidth + womanWidth + 50;

      if (reducedMotion.matches) {
        track.style.opacity = "0.88";
        track.style.transform = `translate3d(${stopX}px,0,0)`;
        track.classList.add("is-at-video");
        return;
      }

      track.style.transform = `translate3d(${startX}px,0,0)`;
      track.style.opacity = "0";

      motion = track.animate(
        [
          { transform: `translate3d(${startX}px,0,0)`, opacity: 0, offset: 0 },
          { transform: `translate3d(${startX + 70}px,0,0)`, opacity: 0.97, offset: 0.045 },
          { transform: `translate3d(${stopX}px,0,0)`, opacity: 0.97, offset: STOP_START },
          { transform: `translate3d(${stopX}px,0,0)`, opacity: 1, offset: STOP_END },
          { transform: `translate3d(${endX - 90}px,0,0)`, opacity: 0.96, offset: 0.965 },
          { transform: `translate3d(${endX}px,0,0)`, opacity: 0, offset: 1 },
        ],
        {
          duration: CYCLE_MS,
          easing: "linear",
          fill: "forwards",
        },
      );

      stopTimer = window.setTimeout(() => {
        if (!disposed) track.classList.add("is-at-video");
      }, CYCLE_MS * STOP_START);

      resumeTimer = window.setTimeout(() => {
        if (!disposed) track.classList.remove("is-at-video");
      }, CYCLE_MS * STOP_END);

      motion.onfinish = () => {
        if (!disposed) restartTimer = window.setTimeout(runCycle, 4_500);
      };
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(runCycle, 220);
    };

    const startTimer = window.setTimeout(runCycle, 350);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(resizeTimer);
      clearCycle();
      window.removeEventListener("resize", handleResize);
    };
  }, [host]);

  if (!host || !window.location.pathname.startsWith("/signage")) return null;

  return createPortal(
    <div className="kleoLineMascotLayer kleoWomanMascotLayer" data-mascot="kleo-woman-gta-v1" aria-hidden="true">
      <div className="kleoLineMascotTrack kleoWomanTrack" ref={trackRef}>
        <div className="kleoWomanMotion">
          <img className="kleoWomanArtwork" src={WOMAN_ART} alt="" draggable={false} />
          <span className="kleoWomanVideoGlow" />
        </div>
      </div>
    </div>,
    host,
  );
}
