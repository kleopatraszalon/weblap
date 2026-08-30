import React from "react";

const normalize = (value: string | null | undefined) =>
  (value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function includesAny(text: string, terms: string[]) { return terms.some((term) => text.includes(term)); }

export function serviceSemanticSlot(value: string | null | undefined) {
  const n = normalize(value);
  if (includesAny(n,["cocochoco","keratin"])) return 2;
  if (includesAny(n,["tartos hajegyen","hajegyenes","egyenesites"])) return 3;
  if (includesAny(n,["hajfest","festes","balayage","melir","szinezes"])) return 1;
  if (includesAny(n,["alkalmi friz","konty","frizura"])) return 4;
  if (includesAny(n,["ferfi haj","ferfi fodr","barber"])) return 5;
  if (includesAny(n,["szakall"])) return 6;
  if (includesAny(n,["hajhosszabbit","hosszabbitas"])) return 23;
  if (includesAny(n,["gyerek haj","gyerek fodr","tini haj"])) return 19;
  if (includesAny(n,["hajvag","fodrasz","haj"])) return 0;
  if (includesAny(n,["gellakk","gel lakk"])) return 8;
  if (includesAny(n,["pedik","labapolas","lab apolas"])) return 9;
  if (includesAny(n,["manik","kezapolas","kez apolas","korom"])) return 7;
  if (includesAny(n,["szemoldok lamin"])) return 24;
  if (includesAny(n,["szempilla lift","lash lift","lifting"])) return 25;
  if (includesAny(n,["szempilla","szemoldok"])) return 13;
  if (includesAny(n,["sminktanacs"])) return 28;
  if (includesAny(n,["menyasszony","bridal"])) return 29;
  if (includesAny(n,["smink"])) return 12;
  if (includesAny(n,["aha","gyumolcssav"])) return 27;
  if (includesAny(n,["anti-aging","anti aging","antiaging","fiatalit"])) return 11;
  if (includesAny(n,["arctiszt","kozmet","arckezeles","arc kezeles"])) return 10;
  if (includesAny(n,["nyirok","masszazs","masszazs"])) return 14;
  if (includesAny(n,["radiofrek","rf ","borfeszes","feszesites"])) return 17;
  if (includesAny(n,["kavit","zsirbont"])) return 16;
  if (includesAny(n,["cellulit","narancsbor"])) return 15;
  if (includesAny(n,["lezer","szortelen","gyanta"])) return 18;
  if (includesAny(n,["iszap","meregtelen","testtekercs","test tekercs"])) return 26;
  if (includesAny(n,["wellness","spa","szolarium"])) return 21;
  if (includesAny(n,["ajandek","utalvany"])) return 20;
  if (includesAny(n,["protein","shake"])) return 30;
  if (includesAny(n,["kave","coffee","ital","udito"])) return 31;
  if (includesAny(n,["termek","otthoni apolas","sampon","balzsam","krem"])) return 22;
  if (includesAny(n,["test","alak","comb","has","fenek"])) return 15;
  return 10;
}

export function productSemanticSlot(value: string | null | undefined) {
  const n = normalize(value);
  if (includesAny(n,["espresso"])) return 0;
  if (includesAny(n,["cappuccino"])) return 1;
  if (includesAny(n,["latte","macchiato"])) return 2;
  if (includesAny(n,["jeges kave","iced coffee","ice coffee"])) return 3;
  if (includesAny(n,["cola","udito","soda","pepsi","coca"])) return 4;
  if (includesAny(n,["limonade","limonádé"])) return 5;
  if (includesAny(n,["szensavas viz","sparkling water"])) return 6;
  if (includesAny(n,["viz","water","asvanyviz"])) return 7;
  if (includesAny(n,["jeges tea","ice tea","iced tea"])) return 8;
  if (includesAny(n,["tea","green tea","zold tea"])) return 9;
  if (includesAny(n,["praline","bonbon"])) return 11;
  if (includesAny(n,["csoki","csokolade","chocolate"])) return 10;
  if (includesAny(n,["protein"]) && includesAny(n,["csoki","chocolate","kakao"])) return 13;
  if (includesAny(n,["protein"])) return 12;
  if (includesAny(n,["smoothie"]) && includesAny(n,["bogy","berry","eper","malna"])) return 14;
  if (includesAny(n,["smoothie"])) return 15;
  if (includesAny(n,["mandula","almond","dio","mogyoro"])) return 16;
  if (includesAny(n,["muzli","granola","szelet","snack"])) return 17;
  return 17;
}

export function retailGroup(value: string | null | undefined) {
  const n = normalize(value);
  if (includesAny(n,["espresso","cappuccino","latte","macchiato","kave","coffee"])) return "coffee";
  if (includesAny(n,["protein","shake","smoothie"])) return "protein";
  if (includesAny(n,["csoki","csokolade","chocolate","praline","bonbon"])) return "chocolate";
  if (includesAny(n,["tea"])) return "tea";
  if (includesAny(n,["viz","water","asvanyviz"])) return "water";
  if (includesAny(n,["cola","udito","ital","limonade","limonádé","juice","le"])) return "drink";
  if (includesAny(n,["snack","szelet","granola","muzli","mandula","dio","mogyoro"])) return "snack";
  return "other";
}

function spritePosition(slot: number, cols: number, rows: number) {
  const col = slot % cols;
  const row = Math.floor(slot / cols);
  const x = cols === 1 ? 0 : (col * 100) / (cols - 1);
  const y = rows === 1 ? 0 : (row * 100) / (rows - 1);
  return `${x}% ${y}%`;
}

export function KioskSemanticArt({ kind, name, source, className = "" }: {
  kind: "service" | "product";
  name: string;
  source?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const hasSource = Boolean(source && source.trim()) && !failed;
  if (hasSource) return <img className={className} src={source || ""} alt={name} onError={() => setFailed(true)} />;
  const service = kind === "service";
  const slot = service ? serviceSemanticSlot(name) : productSemanticSlot(name);
  const cols = service ? 4 : 3;
  const rows = service ? 8 : 6;
  return <span
    className={`kiosk-semantic-art ${className}`}
    role="img"
    aria-label={name}
    style={{
      backgroundImage: `url(${service ? "/kiosk/art/service-semantic-sprite.webp" : "/kiosk/art/retail-semantic-sprite.webp"}?v=20260830-5)`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: spritePosition(slot, cols, rows),
    }}
  />;
}
