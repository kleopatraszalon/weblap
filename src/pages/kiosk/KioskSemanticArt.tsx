import React from "react";

const normalize = (value: string | null | undefined) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function includesAny(text: string, terms: string[]) { return terms.some((term) => text.includes(normalize(term))); }
function hasWord(text: string, word: string) {
  const normalizedWord = normalize(word);
  if (!normalizedWord) return false;
  return (` ${text} `).includes(` ${normalizedWord} `);
}
function hasAnyWord(text: string, words: string[]) { return words.some((word) => hasWord(text, word)); }

export type RetailGroup = "coffee" | "drink" | "chocolate" | "protein" | "water" | "tea" | "snack" | "other";

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
  if (includesAny(n,["anti aging","antiaging","fiatalit"])) return 11;
  if (includesAny(n,["arctiszt","kozmet","arckezeles","arc kezeles"])) return 10;
  if (includesAny(n,["nyirok","masszazs"])) return 14;
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

/**
 * Strict retail grouping. Broad fragments (for example `le`) are deliberately
 * forbidden because they caused unrelated products to leak into the drink tab.
 * More specific beverage types win before the generic `drink` bucket.
 */
export function retailGroup(value: string | null | undefined): RetailGroup {
  const n = normalize(value);
  if (!n) return "other";

  const proteinMarker = hasAnyWord(n, ["protein", "proteines", "proteines"]);
  const shakeMarker = hasAnyWord(n, ["shake", "turmix", "smoothie"]) || includesAny(n, ["protein shake", "proteinshake"]);
  if (proteinMarker && shakeMarker) return "protein";

  if (
    hasAnyWord(n, ["espresso", "cappuccino", "latte", "macchiato", "americano", "ristretto", "mocha", "kave", "kavek", "coffee"])
    || includesAny(n, ["jeges kave", "iced coffee", "flat white"])
  ) return "coffee";

  if (
    hasAnyWord(n, ["csoki", "csokik", "csokolade", "chocolate", "praline", "bonbon", "truffle"])
    || includesAny(n, ["forro csoki", "hot chocolate"])
  ) return "chocolate";

  if (hasAnyWord(n, ["tea", "teak"]) || includesAny(n, ["ice tea", "iced tea", "jeges tea", "zold tea", "green tea"])) return "tea";

  if (
    hasAnyWord(n, ["viz", "vizek", "water", "asvanyviz", "szodaviz"])
    || includesAny(n, ["szensavas viz", "mentes viz", "sparkling water", "mineral water"])
  ) return "water";

  if (
    hasAnyWord(n, ["cola", "pepsi", "fanta", "sprite", "tonic", "limonade", "juice", "udito", "uditok", "ital", "italok", "energiaital"])
    || includesAny(n, ["coca cola", "soft drink", "energy drink", "gyumolcsle", "narancsle", "almale"])
  ) return "drink";

  if (
    hasAnyWord(n, ["snack", "snackek", "granola", "muzli", "mandula", "dio", "mogyoro", "chips", "keksz", "szelet", "bar"])
    || (proteinMarker && hasAnyWord(n, ["szelet", "bar", "snack"]))
  ) return "snack";

  return "other";
}

export function productSemanticSlot(value: string | null | undefined) {
  const n = normalize(value);
  if (hasWord(n, "espresso")) return 0;
  if (hasWord(n, "cappuccino")) return 1;
  if (hasAnyWord(n, ["latte", "macchiato"])) return 2;
  if (includesAny(n,["jeges kave","iced coffee","ice coffee"])) return 3;
  if (hasAnyWord(n,["cola","pepsi","fanta","sprite","udito"])) return 4;
  if (hasWord(n,"limonade")) return 5;
  if (includesAny(n,["szensavas viz","sparkling water"])) return 6;
  if (retailGroup(n) === "water") return 7;
  if (includesAny(n,["jeges tea","ice tea","iced tea"])) return 8;
  if (retailGroup(n) === "tea") return 9;
  if (hasAnyWord(n,["praline","bonbon"])) return 11;
  if (retailGroup(n) === "chocolate") return 10;
  if (retailGroup(n) === "protein" && includesAny(n,["csoki","chocolate","kakao"])) return 13;
  if (retailGroup(n) === "protein") return 12;
  if (hasWord(n,"smoothie") && includesAny(n,["bogy","berry","eper","malna"])) return 14;
  if (hasWord(n,"smoothie")) return 15;
  if (hasAnyWord(n,["mandula","almond","dio","mogyoro"])) return 16;
  if (retailGroup(n) === "snack") return 17;
  if (retailGroup(n) === "coffee") return 0;
  if (retailGroup(n) === "drink") return 4;
  return 17;
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
      backgroundImage: `url(${service ? "/kiosk/art/service-semantic-sprite.webp" : "/kiosk/art/retail-semantic-sprite.webp"}?v=20260830-7)`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: spritePosition(slot, cols, rows),
    }}
  />;
}
