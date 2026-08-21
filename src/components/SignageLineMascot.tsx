import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./SignageLineMascot.css";

/**
 * Original Kleopátra single-line style mascot for the public signage screen.
 * The artwork is an original salon-themed continuous sketch and does not use
 * frames, assets or traced geometry from an existing cartoon character.
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
        <svg className="kleoLineMascot" viewBox="0 0 420 250" role="presentation" focusable="false">
          <path
            className="klm-ground"
            d="M6 210 C58 210 83 207 116 210 C137 212 149 213 162 208"
          />

          <g className="klm-character">
            <g className="klm-bodyGroup">
              <path
                className="klm-mainStroke"
                d="M162 208
                   C173 201 182 190 187 177
                   C191 166 192 149 190 134
                   C188 120 184 108 188 96
                   C191 87 198 82 207 80
                   C216 78 224 81 230 86
                   C235 90 238 96 238 102
                   C238 108 234 112 229 115
                   C240 116 247 120 249 125
                   C250 131 244 135 235 135
                   C231 143 223 148 214 148
                   C207 148 200 145 194 140
                   C196 151 198 164 197 177
                   C196 192 191 202 184 210"
              />

              <path
                className="klm-hairStroke"
                d="M190 94 C187 79 194 67 207 61 C202 72 213 72 216 60 C219 72 229 68 236 63 C235 76 230 83 222 86"
              />

              <path className="klm-eyeStroke" d="M224 99 C226 98 228 98 230 99" />
              <path className="klm-browStroke" d="M220 94 C224 91 230 91 233 94" />
              <path className="klm-smileStroke" d="M228 126 C232 129 237 129 241 126" />

              <path
                className="klm-lapelStroke"
                d="M193 139 C183 145 177 155 176 168 M196 143 C205 151 212 159 215 170"
              />
            </g>

            <g className="klm-leftArm">
              <path
                className="klm-limbStroke"
                d="M190 126 C175 128 163 134 152 144 C144 151 137 153 129 150"
              />
              <path className="klm-handStroke" d="M129 150 C124 147 120 144 117 140 M129 150 C124 152 120 155 118 159" />
            </g>

            <g className="klm-rightArm">
              <path
                className="klm-limbStroke"
                d="M197 126 C211 121 222 114 232 104 C238 98 246 95 254 97"
              />
              <path className="klm-handStroke" d="M254 97 C260 91 265 90 270 91 M254 97 C261 99 266 103 269 108" />
            </g>

            <g className="klm-legs">
              <g className="klm-legA">
                <path className="klm-limbStroke" d="M184 209 C177 218 168 224 157 228 C151 230 145 232 139 235" />
                <path className="klm-shoeStroke" d="M139 235 C133 236 127 235 124 232" />
              </g>
              <g className="klm-legB">
                <path className="klm-limbStroke" d="M196 207 C203 218 211 224 221 228 C227 231 233 233 239 235" />
                <path className="klm-shoeStroke" d="M239 235 C246 236 252 235 256 232" />
              </g>
            </g>

            <g className="klm-accessory">
              <path className="klm-accentStroke" d="M272 82 C282 74 294 76 300 85 C306 94 302 106 291 110 C281 113 272 106 271 96 C270 90 271 86 272 82 Z" />
              <path className="klm-accentStroke" d="M279 96 C284 99 290 99 295 95" />
              <path className="klm-accentStroke" d="M286 110 C286 119 286 127 286 136" />
            </g>

            <g className="klm-sparkles">
              <path d="M315 72 V88 M307 80 H323" />
              <path d="M333 103 V114 M327 108.5 H339" />
              <circle cx="311" cy="113" r="2.6" />
            </g>
          </g>

          <path
            className="klm-ground klm-groundTail"
            d="M184 210 C216 208 250 211 283 210 C328 209 361 211 414 210"
          />
        </svg>
      </div>
    </div>,
    host,
  );
}
