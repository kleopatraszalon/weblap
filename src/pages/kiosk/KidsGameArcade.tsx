import React from "react";

type Game = { id: string; icon: string; title: string; hint: string; kind: "find" | "count" | "memory" | "sequence" };

const GAMES: Game[] = [
  { id: "stars", icon: "🌟", title: "Csillagvadász", hint: "Kapd el a ragyogó csillagot!", kind: "find" },
  { id: "bubbles", icon: "🫧", title: "Buborékpukkasztó", hint: "Pukkaszd ki a buborékot!", kind: "find" },
  { id: "animals", icon: "🐰", title: "Állatkereső", hint: "Találd meg a nyuszit!", kind: "find" },
  { id: "rainbow", icon: "🌈", title: "Szivárványszínek", hint: "Koppints a kért színre!", kind: "sequence" },
  { id: "count", icon: "🐥", title: "Csibeszámláló", hint: "Hány csibét látsz?", kind: "count" },
  { id: "fruit", icon: "🍓", title: "Gyümölcskosár", hint: "Hány eper bújt el?", kind: "count" },
  { id: "memory", icon: "🦊", title: "Állatos memória", hint: "Találd meg az összes párt!", kind: "memory" },
  { id: "beauty", icon: "🎀", title: "Masnis memória", hint: "Párosítsd a vidám képeket!", kind: "memory" },
  { id: "music", icon: "🎵", title: "Dallamsor", hint: "Ismételd meg a képsort!", kind: "sequence" },
  { id: "magic", icon: "🪄", title: "Varázssor", hint: "Koppints sorban a jelekre!", kind: "sequence" },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - .5);

function FindGame({ game, win }: { game: Game; win: () => void }) {
  const target = game.id === "stars" ? "🌟" : game.id === "bubbles" ? "🫧" : "🐰";
  const decoys = game.id === "animals" ? ["🐻", "🦊", "🐱", "🐶", "🐼", "🦁", "🐨", "🐸"] : game.id === "stars" ? ["☁️", "🌙", "✨", "☀️", "🪐", "🌸", "💫", "🌈"] : ["💧", "🔵", "⚪", "🩵", "💙", "🌊", "❄️", "☁️"];
  const [cells, setCells] = React.useState(() => shuffle([...decoys, target]));
  const choose = (item: string) => item === target ? win() : setCells(shuffle(cells));
  return <div className="kids-find-grid">{cells.map((item, i) => <button key={`${item}-${i}`} onClick={() => choose(item)}>{item}</button>)}</div>;
}

function CountGame({ game, win }: { game: Game; win: () => void }) {
  const amount = React.useMemo(() => 3 + Math.floor(Math.random() * 4), [game.id]);
  const icon = game.id === "fruit" ? "🍓" : "🐥";
  const answers = shuffle([amount, amount + 1, Math.max(1, amount - 1)]);
  return <div className="kids-count-game"><div className="kids-count-pile">{Array.from({length: amount}, (_, i) => <span key={i}>{icon}</span>)}</div><div className="kids-answer-row">{answers.map(n => <button key={n} onClick={() => n === amount && win()}>{n}</button>)}</div></div>;
}

function MemoryGame({ game, win }: { game: Game; win: () => void }) {
  const symbols = game.id === "beauty" ? ["🎀", "🌸", "💖", "👑"] : ["🐰", "🐻", "🦊", "🐱"];
  const [cards] = React.useState(() => shuffle([...symbols, ...symbols]));
  const [open, setOpen] = React.useState<number[]>([]);
  const [done, setDone] = React.useState<number[]>([]);
  const flip = (index: number) => {
    if (open.length === 2 || open.includes(index) || done.includes(index)) return;
    const next = [...open, index]; setOpen(next);
    if (next.length === 2) setTimeout(() => {
      if (cards[next[0]] === cards[next[1]]) {
        const completed = [...done, ...next]; setDone(completed); setOpen([]);
        if (completed.length === cards.length) win();
      } else setOpen([]);
    }, 550);
  };
  return <div className="kids-memory-grid">{cards.map((card, i) => <button key={i} className={open.includes(i) || done.includes(i) ? "open" : ""} onClick={() => flip(i)}>{open.includes(i) || done.includes(i) ? card : "?"}</button>)}</div>;
}

function SequenceGame({ game, win }: { game: Game; win: () => void }) {
  const palette = game.id === "rainbow" ? [{v:"#ff5f8f",e:"🍓"},{v:"#ffd45b",e:"☀️"},{v:"#65d4b3",e:"🍀"},{v:"#8c7cf2",e:"🦄"}] : game.id === "music" ? [{v:"#ff88b7",e:"🎵"},{v:"#7bd9c1",e:"🎶"},{v:"#ffd35c",e:"🎼"},{v:"#a98af4",e:"🔔"}] : [{v:"#ff88b7",e:"⭐"},{v:"#7bd9c1",e:"🌙"},{v:"#ffd35c",e:"💖"},{v:"#a98af4",e:"🪄"}];
  const [order] = React.useState(() => shuffle(palette).slice(0, 3));
  const [step, setStep] = React.useState(0);
  const choose = (emoji: string) => { if (emoji === order[step].e) { const next = step + 1; setStep(next); if (next === order.length) win(); } else setStep(0); };
  return <div className="kids-sequence-game"><div className="kids-sequence-prompt">{order.map((x,i)=><span key={x.e} className={i < step ? "done" : i === step ? "current" : ""}>{x.e}</span>)}</div><div className="kids-answer-row colors">{palette.map(x=><button key={x.e} style={{background:x.v}} onClick={()=>choose(x.e)}>{x.e}</button>)}</div></div>;
}

export function KidsGameArcade({ active }: { active: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [game, setGame] = React.useState<Game | null>(null);
  const [won, setWon] = React.useState(false);
  React.useEffect(() => { if (!active) { setOpen(false); setGame(null); } }, [active]);
  React.useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, [open]);
  if (!active) return null;
  const pick = (next: Game) => { setGame(next); setWon(false); setOpen(true); };
  return <>
    <button className="kids-arcade-launch" type="button" onClick={() => {setGame(null);setOpen(true)}}><span>🎮</span><b>JÁTÉKSAROK</b><small>10 vidám játék</small></button>
    {open && <div className="kids-arcade-layer" role="dialog" aria-modal="true" aria-label="KIDS Játéksarok">
      <div className="kids-arcade-window">
        <header><button className="kids-arcade-back" onClick={() => {setGame(null);setWon(false)}} disabled={!game}>← Játékok</button><div><span>🎈 KLEO KIDS</span><h2>{game?.title || "Válassz egy játékot!"}</h2></div><button className="kids-arcade-close" onClick={() => setOpen(false)} aria-label="Játékok bezárása">×</button></header>
        {!game ? <div className="kids-game-menu">{GAMES.map(item => <button key={item.id} onClick={() => pick(item)}><span>{item.icon}</span><b>{item.title}</b><small>{item.hint}</small><i>Játssz! →</i></button>)}</div> : <div className="kids-game-stage"><p>{won ? "Ügyes vagy! Megcsináltad! 🎉" : game.hint}</p>{won ? <div className="kids-game-win"><span>🏆</span><button onClick={() => {setWon(false);setGame({...game})}}>Még egyszer!</button><button onClick={() => {setGame(null);setWon(false)}}>Másik játék</button></div> : game.kind === "find" ? <FindGame key={`${game.id}-${Number(won)}`} game={game} win={()=>setWon(true)}/> : game.kind === "count" ? <CountGame key={game.id} game={game} win={()=>setWon(true)}/> : game.kind === "memory" ? <MemoryGame key={game.id} game={game} win={()=>setWon(true)}/> : <SequenceGame key={game.id} game={game} win={()=>setWon(true)}/>}</div>}
      </div>
    </div>}
  </>;
}
