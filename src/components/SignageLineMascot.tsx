import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./SignageLineMascot.css";

/**
 * Original Kleopátra one-line mascot for the public signage screen.
 * The drawing is intentionally generic/original and does not reproduce
 * any existing cartoon character or copyrighted animation asset.
 */
export default function SignageLineMascot() {
  const [host, setHost] = useState<Element | null>(null);

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

  if (!host || !window.location.pathname.startsWith("/signage")) return null;

  return createPortal(
    <div className="kleoLineMascotLayer" aria-hidden="true">
      <div className="kleoLineMascotTrack">
        <svg
          className="kleoLineMascot"
          viewBox="0 0 280 210"
          role="presentation"
          focusable="false"
        >
          <path className="klm-line" d="M4 177 C48 177 67 174 99 177 C147 181 185 173 276 177" />

          <g className="klm-person">
            <circle className="klm-head" cx="139" cy="69" r="29" />
            <path className="klm-hair" d="M120 48 C128 34 138 39 141 29 C147 39 158 35 163 49" />
            <path className="klm-face" d="M160 65 C177 65 181 71 164 77" />
            <circle className="klm-eye" cx="151" cy="63" r="2.8" />
            <path className="klm-body" d="M138 98 C132 116 132 141 138 159" />

            <g className="klm-arm-left">
              <path d="M135 116 C116 121 105 132 94 145 C88 151 84 151 78 148" />
              <path d="M78 148 l-7 -5 M78 148 l-4 8" />
            </g>

            <g className="klm-arm-right">
              <path d="M141 115 C161 108 174 96 187 81 C193 74 201 73 211 75" />
              <path d="M211 75 l10 -5 M211 75 l10 4" />
            </g>

            <g className="klm-leg-a">
              <path d="M138 159 C125 168 113 174 99 177" />
            </g>
            <g className="klm-leg-b">
              <path d="M138 159 C151 168 163 175 179 177" />
            </g>

            <path className="klm-accent" d="M136 32 l5 -9 l5 9 l10 2 l-7 7 l2 10 l-10 -5 l-9 5 l2 -10 l-8 -7 z" />
          </g>

          <g className="klm-sparkles">
            <path d="M224 50 v18 M215 59 h18" />
            <path d="M239 84 v12 M233 90 h12" />
            <circle cx="220" cy="94" r="3" />
          </g>
        </svg>
      </div>
    </div>,
    host,
  );
}
