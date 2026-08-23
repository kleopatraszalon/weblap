import React from "react";
import "./KioskHairMirror.css";

type VisualMode = "classic" | "pearl" | "silver" | "kids";
type Hair = { id:string; name:string; type:string; path:string; extra?:string };

const HAIRS:Hair[]=[
  {id:"bob",name:"Modern bob",type:"Rövid",path:"M72 245Q50 55 200 36Q350 55 328 245L292 215Q314 92 200 76Q86 92 108 215Z"},
  {id:"pixie",name:"Pixie",type:"Rövid",path:"M92 194Q58 72 172 45L155 20Q250 26 310 83L334 66Q342 153 306 198Q304 102 200 76Q105 96 92 194Z"},
  {id:"waves",name:"Hosszú hullám",type:"Hosszú",path:"M74 454Q33 321 76 182Q55 72 200 38Q347 70 326 184Q372 319 327 466L280 405Q332 276 291 157Q267 76 200 76Q116 86 106 168Q71 286 119 407Z"},
  {id:"curls",name:"Göndör álom",type:"Göndör",path:"M55 429Q21 328 67 224Q22 153 75 90Q112 35 180 46Q240 8 298 61Q373 100 330 198Q376 279 333 443L284 398Q328 296 291 197Q332 116 262 85Q206 48 151 83Q66 110 104 201Q68 300 113 403Z",extra:"M80 175a34 34 0 1 0 1 0M286 170a34 34 0 1 0 1 0M86 286a38 38 0 1 0 1 0M278 296a38 38 0 1 0 1 0"},
  {id:"fringe",name:"Frufrus lob",type:"Félhosszú",path:"M70 364Q45 90 200 42Q355 89 330 364L285 326Q315 189 282 119Q246 75 200 76Q151 73 111 124Q80 206 116 326ZM105 135Q135 66 200 73Q270 74 299 139Q248 105 218 151Q191 104 164 152Q139 112 105 135Z"},
  {id:"ponytail",name:"Magas lófarok",type:"Feltűzött",path:"M84 238Q49 79 200 42Q333 69 317 221L280 190Q294 94 200 76Q102 93 116 211Z M285 91Q387 92 353 273Q341 336 306 382Q330 199 285 91Z"},
  {id:"shag",name:"Wolf cut",type:"Trendi",path:"M68 360L95 284L56 298L91 212L58 190Q63 69 200 38Q338 69 340 192L309 211L344 295L304 280L332 367L273 306L290 192Q285 93 200 76Q108 93 109 197L129 308Z"},
  {id:"men",name:"Texturált rövid",type:"Unisex",path:"M87 177Q62 105 117 80L101 53L164 58L190 20L221 58L276 37L286 75Q344 96 313 178Q288 93 202 77Q116 93 87 177Z"},
];

const COLORS=["#241814","#5b3222","#9c6236","#d5aa62","#e9d6ac","#9b2534","#5f315f","#1c1b21"];

export function KioskHairMirror({ visualMode }: { visualMode:VisualMode }) {
  const [open,setOpen]=React.useState(false),[accepted,setAccepted]=React.useState(false),[started,setStarted]=React.useState(false),[error,setError]=React.useState("");
  const [photo,setPhoto]=React.useState(""),[hair,setHair]=React.useState(HAIRS[0]),[color,setColor]=React.useState(COLORS[0]);
  const [chosen,setChosen]=React.useState(false);
  const [scale,setScale]=React.useState(1),[x,setX]=React.useState(0),[y,setY]=React.useState(0);
  const videoRef=React.useRef<HTMLVideoElement>(null),streamRef=React.useRef<MediaStream|null>(null);
  const stop=React.useCallback(()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;},[]);
  const close=()=>{stop();setOpen(false);setPhoto("");setAccepted(false);setStarted(false);setChosen(false);setError("");};
  React.useEffect(()=>()=>stop(),[stop]);
  const camera=async()=>{setError("");try{stop();const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:960}},audio:false});streamRef.current=stream;if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}}catch{setError("A kamera nem indítható. Ellenőrizd a kameraengedélyt, vagy válassz képet!");}};
  const capture=()=>{const v=videoRef.current;if(!v||!v.videoWidth)return;const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;const ctx=c.getContext("2d");if(!ctx)return;ctx.translate(c.width,0);ctx.scale(-1,1);ctx.drawImage(v,0,0);setPhoto(c.toDataURL("image/jpeg",.9));stop();};
  const upload=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{stop();setPhoto(String(reader.result||""));};reader.readAsDataURL(f);};
  return <>
    <button className="hair-mirror-launch" onClick={()=>setOpen(true)}><span>✂️</span><b>{visualMode==="kids"?"PRÓBÁLJ FRIZURÁT!":"KLEO HAIR MIRROR"}</b><small>{visualMode==="silver"?"AI STYLE SCAN":"Virtuális frizurapróba"}</small></button>
    {open&&<div className="hair-mirror-layer" role="dialog" aria-modal="true" aria-label="Kleo Hair Mirror">
      <section className="hair-mirror-window">
        <header><div><small>{visualMode==="silver"?"KLEO // VISUAL LAB":"KLEOPÁTRA BEAUTY LAB"}</small><h2>{visualMode==="kids"?"Milyen haj állna jól? 🌈":"Kleo Hair Mirror"}</h2></div><button onClick={close} aria-label="Bezárás">×</button></header>
        {!started?<div className="hair-consent"><span>📷</span><h3>Virtuális frizurapróba</h3><p>A kamera képe csak ezen a készüléken jelenik meg. Nem töltjük fel, nem mentjük el, és a bezáráskor töröljük.</p><label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><b>Megértettem és engedélyezem a kamera használatát.</b></label><button disabled={!accepted} onClick={()=>{setStarted(true);setTimeout(camera,30)}}>Kamera indítása</button><label className={`hair-upload ${accepted?"":"disabled"}`}>Vagy fénykép kiválasztása<input disabled={!accepted} type="file" accept="image/*" capture="user" onChange={e=>{setStarted(true);upload(e)}}/></label></div>:
        <div className="hair-mirror-body">
          <div className="hair-preview">
            {!photo?<video ref={videoRef} muted playsInline/>:<img src={photo} alt="Frizurapróba"/>}
            <div className="hair-face-guide"/>
            <svg className="hair-overlay" viewBox="0 0 400 500" style={{color,transform:`translate(${x}px,${y}px) scale(${scale})`}} aria-hidden="true"><path d={hair.path}/>{hair.extra&&<path d={hair.extra}/>}</svg>
            {!photo&&<div className="hair-camera-actions"><button onClick={camera}>Kamera</button><button onClick={capture}>📸 Fénykép</button></div>}
            {photo&&<button className="hair-retake" onClick={()=>{setPhoto("");setTimeout(camera,30)}}>↻ Új kép</button>}
            {error&&<p className="hair-error">{error}</p>}
          </div>
          <aside><h3>Válassz frizurát</h3><div className="hair-styles">{HAIRS.map(item=><button className={item.id===hair.id?"active":""} key={item.id} onClick={()=>{setHair(item);setChosen(false)}}><span>{item.type}</span><b>{item.name}</b></button>)}</div><h3>Hajszín</h3><div className="hair-colors">{COLORS.map(c=><button key={c} className={c===color?"active":""} style={{background:c}} onClick={()=>{setColor(c);setChosen(false)}} aria-label="Hajszín"/>)}</div><h3>Igazítás</h3><div className="hair-adjust"><button onClick={()=>setY(y-8)}>↑</button><button onClick={()=>setY(y+8)}>↓</button><button onClick={()=>setX(x-8)}>←</button><button onClick={()=>setX(x+8)}>→</button><button onClick={()=>setScale(Math.max(.7,scale-.06))}>−</button><button onClick={()=>setScale(Math.min(1.4,scale+.06))}>＋</button></div><button className="hair-consult" onClick={()=>setChosen(true)}>{chosen?"✓ Elmentve ehhez a próbaalkalomhoz":"Ezt a frizurát szeretném →"}</button>{chosen&&<p><b>{hair.name}</b> kiválasztva. Mutasd meg a fodrásznak a konzultáción!</p>}<p>A látvány tájékoztató jellegű. A fodrász személyes konzultáción pontosítja a megvalósíthatóságot.</p></aside>
        </div>}
      </section>
    </div>}
  </>;
}
