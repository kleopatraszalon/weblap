import React from "react";
import { retailGroup, type RetailGroup } from "./KioskSemanticArt";

type Props = { name: string; className?: string };

const palette: Record<RetailGroup, { bg1: string; bg2: string; ink: string; accent: string }> = {
  coffee: { bg1: "#f4e3cf", bg2: "#d6a875", ink: "#5d3824", accent: "#9c5e2d" },
  tea: { bg1: "#e7f1dc", bg2: "#a9c68c", ink: "#41613a", accent: "#6d9654" },
  drink: { bg1: "#ffe6dc", bg2: "#f6a57c", ink: "#7b3927", accent: "#e56b45" },
  water: { bg1: "#e1f3fb", bg2: "#9ed5e8", ink: "#2d657c", accent: "#4da9cb" },
  chocolate: { bg1: "#f2e0d8", bg2: "#c8947a", ink: "#61382d", accent: "#8f543f" },
  protein: { bg1: "#ece7fa", bg2: "#b7a9df", ink: "#4a416e", accent: "#7868b0" },
  snack: { bg1: "#f4edcf", bg2: "#d9bd73", ink: "#66501d", accent: "#a98531" },
  other: { bg1: "#f2eee9", bg2: "#d8ccc0", ink: "#5f554d", accent: "#8d7d70" },
};

function Coffee() {
  return <>
    <ellipse cx="120" cy="151" rx="61" ry="13" fill="#000" opacity=".08" />
    <path d="M63 78h96v55c0 24-18 42-42 42h-12c-24 0-42-18-42-42V78Z" fill="#fff" opacity=".94" />
    <path d="M159 91h16c24 0 24 42 0 42h-16" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    <ellipse cx="111" cy="82" rx="42" ry="12" fill="#6b3d25" />
    <path d="M92 55c-12-17 10-20 2-38M119 54c-12-17 10-20 2-38M145 57c-12-17 10-20 2-38" fill="none" stroke="#fff" strokeOpacity=".85" strokeWidth="6" strokeLinecap="round" />
  </>;
}

function Tea() {
  return <>
    <ellipse cx="120" cy="154" rx="61" ry="12" fill="#000" opacity=".07" />
    <path d="M61 78h99v55c0 23-19 42-42 42h-15c-23 0-42-19-42-42V78Z" fill="#fff" opacity=".92" />
    <path d="M160 91h16c23 0 23 39 0 39h-16" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    <ellipse cx="111" cy="82" rx="43" ry="11" fill="#9fbc73" />
    <path d="M112 81c9-24 29-28 41-23-3 17-16 29-41 23Z" fill="#628a4b" />
    <path d="M111 82c8-11 18-18 31-22" fill="none" stroke="#4f7340" strokeWidth="4" strokeLinecap="round" />
  </>;
}

function Drink() {
  return <>
    <ellipse cx="120" cy="163" rx="53" ry="10" fill="#000" opacity=".08" />
    <path d="M77 56h84l-10 111H87L77 56Z" fill="#fff" opacity=".92" />
    <path d="M86 87h66l-6 72H92l-6-72Z" fill="#f08a55" opacity=".9" />
    <path d="M126 56l20-31" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <circle cx="106" cy="117" r="15" fill="#fff" opacity=".3" />
    <circle cx="132" cy="137" r="11" fill="#fff" opacity=".25" />
    <path d="M98 68c18 8 34 8 50 0" fill="none" stroke="#fff" strokeWidth="5" opacity=".7" />
  </>;
}

function Water() {
  return <>
    <ellipse cx="120" cy="167" rx="45" ry="9" fill="#000" opacity=".07" />
    <path d="M105 33h31v17c0 8 8 13 12 22 6 12 4 70 1 88-2 11-10 16-28 16s-26-5-28-16c-3-18-5-76 1-88 4-9 11-14 11-22V33Z" fill="#fff" opacity=".72" stroke="currentColor" strokeWidth="4" />
    <rect x="103" y="30" width="35" height="12" rx="5" fill="currentColor" opacity=".85" />
    <path d="M96 102c19 9 34 9 52 0v47c-16 7-35 7-52 0v-47Z" fill="#63bada" opacity=".8" />
    <path d="M104 121c11-7 24-7 35 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".85" />
  </>;
}

function Chocolate() {
  return <>
    <ellipse cx="120" cy="160" rx="56" ry="11" fill="#000" opacity=".07" />
    <g transform="rotate(-7 118 103)">
      <rect x="70" y="51" width="99" height="105" rx="10" fill="#6f3e2c" />
      {[0,1,2].map(r => [0,1,2,3].map(c => <rect key={`${r}-${c}`} x={78+c*22} y={60+r*29} width="17" height="23" rx="3" fill="#8a543d" stroke="#b77b61" strokeWidth="2" />))}
    </g>
    <path d="M155 47l22 16-17 23" fill="#fff" opacity=".9" />
  </>;
}

function Protein() {
  return <>
    <ellipse cx="120" cy="164" rx="47" ry="10" fill="#000" opacity=".08" />
    <path d="M93 44h55l-7 17 13 99c1 10-8 16-34 16s-35-6-34-16L99 61l-6-17Z" fill="#fff" opacity=".92" stroke="currentColor" strokeWidth="4" />
    <rect x="96" y="32" width="48" height="17" rx="7" fill="currentColor" opacity=".9" />
    <path d="M94 108c17 7 35 7 53 0l5 47c-20 7-42 7-63 0l5-47Z" fill="#9f8cd1" opacity=".88" />
    <path d="M108 128h24M120 116v24" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
  </>;
}

function Snack() {
  return <>
    <ellipse cx="120" cy="159" rx="58" ry="11" fill="#000" opacity=".07" />
    <path d="M72 68c0-9 8-16 17-16h62c9 0 17 7 17 16l-8 86H80l-8-86Z" fill="#fff" opacity=".9" stroke="currentColor" strokeWidth="4" />
    <path d="M82 87h76l-6 59H88l-6-59Z" fill="#d9bd73" opacity=".9" />
    <ellipse cx="104" cy="111" rx="12" ry="18" fill="#b98739" transform="rotate(-24 104 111)" />
    <ellipse cx="134" cy="119" rx="11" ry="17" fill="#a96f2f" transform="rotate(23 134 119)" />
    <path d="M91 71h58" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".45" />
  </>;
}

export function KioskRetailInlineArt({ name, className = "" }: Props) {
  const group = retailGroup(name);
  const p = palette[group];
  const id = React.useId().replace(/:/g, "");
  return <svg
    className={`kiosk-semantic-art kiosk-retail-inline-art ${className}`}
    viewBox="0 0 240 190"
    role="img"
    aria-label={name}
    preserveAspectRatio="xMidYMid slice"
    style={{ color: p.ink }}
  >
    <defs>
      <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={p.bg1} />
        <stop offset="1" stopColor={p.bg2} />
      </linearGradient>
      <radialGradient id={`glow-${id}`} cx=".25" cy=".2" r=".8">
        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="240" height="190" fill={`url(#bg-${id})`} />
    <circle cx="45" cy="36" r="56" fill={`url(#glow-${id})`} />
    <circle cx="203" cy="154" r="62" fill={p.accent} opacity=".12" />
    {group === "coffee" ? <Coffee /> : group === "tea" ? <Tea /> : group === "drink" ? <Drink /> : group === "water" ? <Water /> : group === "chocolate" ? <Chocolate /> : group === "protein" ? <Protein /> : <Snack />}
  </svg>;
}

export default KioskRetailInlineArt;
