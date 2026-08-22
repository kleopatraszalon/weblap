import React from "react";

type Game = { id: string; icon: string; title: string; hint: string; kind: "find" | "count" | "memory" | "sequence" | "tictactoe" | "math" | "word" | "merge"; level?: "big" };

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

const BIG_GAMES: Game[] = [
  { id: "tictactoe", icon: "❌", title: "Amőba a robot ellen", hint: "Rakj ki három jelet egy sorban!", kind: "tictactoe", level: "big" },
  { id: "math", icon: "🧠", title: "Matek Sprint", hint: "Oldj meg 10 feladatot, és gyűjts pontot!", kind: "math", level: "big" },
  { id: "word", icon: "🔤", title: "Szókeverő", hint: "Rakd helyes sorrendbe az összekevert szót!", kind: "word", level: "big" },
  { id: "merge", icon: "🔢", title: "Számduplázó", hint: "Egyesítsd az azonos számokat, és érd el a 128-at!", kind: "merge", level: "big" },
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

function TicTacToe({ win }: { win: () => void }) {
  const [board, setBoard] = React.useState<string[]>(Array(9).fill(""));
  const [message, setMessage] = React.useState("Te vagy az X. Te kezdesz!");
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = (b:string[]) => lines.find(l => b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]])?.map(i=>b[i])[0];
  const play = (index:number) => { if (board[index] || winner(board)) return; const next=[...board];next[index]="X";if(winner(next)==="X"){setBoard(next);setMessage("Nyertél! 🎉");setTimeout(win,500);return;}const empty=next.map((v,i)=>v?-1:i).filter(i=>i>=0);if(!empty.length){setBoard(Array(9).fill(""));setMessage("Döntetlen – új kör!");return;}const block=lines.find(l=>l.filter(i=>next[i]==="X").length===2&&l.some(i=>!next[i]))?.find(i=>!next[i]);const robot=block??empty[Math.floor(Math.random()*empty.length)];next[robot]="O";setBoard(next);if(winner(next)==="O"){setMessage("A robot nyert. Próbáld újra!");setTimeout(()=>setBoard(Array(9).fill("")),900);}};
  return <div className="kids-big-game"><b>{message}</b><div className="kids-ttt-board">{board.map((v,i)=><button key={i} onClick={()=>play(i)}>{v}</button>)}</div></div>;
}

function MathSprint({ win }: { win: () => void }) {
  const make=()=>{const a=3+Math.floor(Math.random()*16),b=2+Math.floor(Math.random()*10),mul=Math.random()>.55;return{q:mul?`${a} × ${b}`:`${a+b} − ${b}`,a:mul?a*b:a}};
  const [task,setTask]=React.useState(make);const [round,setRound]=React.useState(1);const [score,setScore]=React.useState(0);const options=React.useMemo(()=>shuffle([task.a,task.a+2,Math.max(0,task.a-2)]),[task]);
  const answer=(n:number)=>{const next=score+(n===task.a?1:0);setScore(next);if(round===10){if(next>=7)win();else{setRound(1);setScore(0);setTask(make());}}else{setRound(round+1);setTask(make());}};
  return <div className="kids-big-game"><b>{round}/10. feladat · {score} pont</b><div className="kids-math-question">{task.q} = ?</div><div className="kids-answer-row">{options.map(n=><button key={n} onClick={()=>answer(n)}>{n}</button>)}</div><small>A kupához legalább 7 jó válasz kell.</small></div>;
}

function WordGame({ win }: { win: () => void }) {
  const words=["SZIVÁRVÁNY","KALAND","BARÁTSÁG","VARÁZSLAT","CSILLAG","MOSOLY"];const [word,setWord]=React.useState(()=>words[Math.floor(Math.random()*words.length)]);const [picked,setPicked]=React.useState<number[]>([]);const letters=React.useMemo(()=>shuffle(word.split("")),[word]);const built=picked.map(i=>letters[i]).join("");
  const pick=(i:number)=>{const next=[...picked,i];setPicked(next);if(next.map(x=>letters[x]).join("")===word)setTimeout(win,350);};
  return <div className="kids-big-game"><b>{built||"Koppints a betűkre!"}</b><div className="kids-word-slots">{word.split("").map((_,i)=><span key={i}>{built[i]||"_"}</span>)}</div><div className="kids-letter-bank">{letters.map((l,i)=><button key={i} disabled={picked.includes(i)} onClick={()=>pick(i)}>{l}</button>)}</div><button className="kids-reset-game" onClick={()=>{setPicked([]);setWord(words[Math.floor(Math.random()*words.length)])}}>Új szó</button></div>;
}

function MergeGame({ win }: { win: () => void }) {
  const [cells,setCells]=React.useState<number[]>(()=>shuffle([2,2,4,4,8,8,16,16,32,32,64,64]));const [selected,setSelected]=React.useState<number|null>(null);
  const tap=(i:number)=>{if(selected===null){setSelected(i);return;}if(selected===i){setSelected(null);return;}const next=[...cells];if(next[selected]===next[i]){next[i]*=2;next[selected]=2;setCells(shuffle(next));if(next[i]>=128)setTimeout(win,300);}setSelected(null);};
  return <div className="kids-big-game"><b>Azonos szám + azonos szám = dupla érték</b><div className="kids-merge-board">{cells.map((n,i)=><button key={i} className={selected===i?"selected":""} data-value={n} onClick={()=>tap(i)}>{n}</button>)}</div></div>;
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
    <button className="kids-arcade-launch" type="button" onClick={() => {setGame(null);setOpen(true)}}><span>🎮</span><b>JÁTÉKSAROK</b><small>14 játék · kicsiknek és nagyoknak</small></button>
    {open && <div className="kids-arcade-layer" role="dialog" aria-modal="true" aria-label="KIDS Játéksarok">
      <div className="kids-arcade-window">
        <header><button className="kids-arcade-back" onClick={() => {setGame(null);setWon(false)}} disabled={!game}>← Játékok</button><div><span>🎈 KLEO KIDS</span><h2>{game?.title || "Válassz egy játékot!"}</h2></div><button className="kids-arcade-close" onClick={() => setOpen(false)} aria-label="Játékok bezárása">×</button></header>
        {!game ? <div className="kids-game-menu"><h3>🎈 Kisebbeknek</h3>{GAMES.map(item => <button key={item.id} onClick={() => pick(item)}><span>{item.icon}</span><b>{item.title}</b><small>{item.hint}</small><i>Játssz! →</i></button>)}<h3 className="big-title">🚀 Nagyobbaknak · 8+</h3>{BIG_GAMES.map(item => <button className="big-game-card" key={item.id} onClick={() => pick(item)}><span>{item.icon}</span><b>{item.title}</b><small>{item.hint}</small><i>Kihívás →</i></button>)}</div> : <div className="kids-game-stage"><p>{won ? "Ügyes vagy! Teljesítetted a kihívást! 🎉" : game.hint}</p>{won ? <div className="kids-game-win"><span>🏆</span><button onClick={() => {setWon(false);setGame({...game})}}>Még egyszer!</button><button onClick={() => {setGame(null);setWon(false)}}>Másik játék</button></div> : game.kind === "find" ? <FindGame game={game} win={()=>setWon(true)}/> : game.kind === "count" ? <CountGame game={game} win={()=>setWon(true)}/> : game.kind === "memory" ? <MemoryGame game={game} win={()=>setWon(true)}/> : game.kind === "sequence" ? <SequenceGame game={game} win={()=>setWon(true)}/> : game.kind === "tictactoe" ? <TicTacToe win={()=>setWon(true)}/> : game.kind === "math" ? <MathSprint win={()=>setWon(true)}/> : game.kind === "word" ? <WordGame win={()=>setWon(true)}/> : <MergeGame win={()=>setWon(true)}/>}</div>}
      </div>
    </div>}
  </>;
}
