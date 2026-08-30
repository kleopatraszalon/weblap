import React from "react";
import "./KioskHairMirror.css";

type VisualMode = "classic" | "pearl" | "silver" | "kids" | "noir" | "rose-gold" | "aqua" | "zen";
export type HairMirrorStyle = {
  id: string;
  name: string;
  type?: string;
  imageUrl: string;
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  enabled?: boolean;
};
export type HairMirrorConfig = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  accent?: string;
  allowCamera?: boolean;
  allowUpload?: boolean;
  showFaceGuide?: boolean;
  styles?: HairMirrorStyle[];
};

const DEFAULT_CONFIG:Required<Omit<HairMirrorConfig,"styles">> & {styles:HairMirrorStyle[]}={
  enabled:true,
  title:"Milyen haj állna jól?",
  subtitle:"Fotóalapú frizurapróba",
  accent:"#ec008c",
  allowCamera:true,
  allowUpload:true,
  showFaceGuide:true,
  styles:[],
};

function configOf(input?:HairMirrorConfig){
  return {...DEFAULT_CONFIG,...(input||{}),styles:Array.isArray(input?.styles)?input!.styles!.filter(s=>s&&s.enabled!==false&&s.imageUrl):[]};
}

export function KioskHairMirror({ visualMode, config }: { visualMode:VisualMode; config?:HairMirrorConfig }) {
  const cfg=React.useMemo(()=>configOf(config),[config]);
  const [open,setOpen]=React.useState(false),[accepted,setAccepted]=React.useState(false),[started,setStarted]=React.useState(false),[error,setError]=React.useState("");
  const [photo,setPhoto]=React.useState(""),[styleId,setStyleId]=React.useState("");
  const [chosen,setChosen]=React.useState(false);
  const [scale,setScale]=React.useState(1),[x,setX]=React.useState(0),[y,setY]=React.useState(0),[rotate,setRotate]=React.useState(0);
  const videoRef=React.useRef<HTMLVideoElement>(null),streamRef=React.useRef<MediaStream|null>(null);
  const selected=cfg.styles.find(s=>s.id===styleId)||cfg.styles[0]||null;

  const applyDefaults=React.useCallback((style:HairMirrorStyle|null)=>{
    setScale(Number(style?.scale||1));setX(Number(style?.x||0));setY(Number(style?.y||0));setRotate(Number(style?.rotate||0));setChosen(false);
  },[]);
  React.useEffect(()=>{if(selected&&styleId!==selected.id){setStyleId(selected.id);applyDefaults(selected)}},[selected,styleId,applyDefaults]);

  const stop=React.useCallback(()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;},[]);
  const close=()=>{stop();setOpen(false);setPhoto("");setAccepted(false);setStarted(false);setChosen(false);setError("");};
  React.useEffect(()=>()=>stop(),[stop]);
  const camera=async()=>{if(!cfg.allowCamera)return;setError("");try{stop();const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:960}},audio:false});streamRef.current=stream;if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}}catch{setError("A kamera nem indítható. Ellenőrizd a kameraengedélyt, vagy válassz képet!");}};
  const capture=()=>{const v=videoRef.current;if(!v||!v.videoWidth)return;const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;const ctx=c.getContext("2d");if(!ctx)return;ctx.translate(c.width,0);ctx.scale(-1,1);ctx.drawImage(v,0,0);setPhoto(c.toDataURL("image/jpeg",.9));stop();};
  const upload=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{stop();setPhoto(String(reader.result||""));};reader.readAsDataURL(f);};
  const start=()=>{setStarted(true);if(cfg.allowCamera)setTimeout(camera,30)};

  if(cfg.enabled===false)return null;
  return <>
    <button className="hair-mirror-launch" style={{"--hair-accent":cfg.accent} as React.CSSProperties} onClick={()=>setOpen(true)}><span>✂️</span><b>{visualMode==="kids"?"PRÓBÁLJ FRIZURÁT!":"KLEO HAIR MIRROR"}</b><small>{cfg.subtitle}</small></button>
    {open&&<div className="hair-mirror-layer" role="dialog" aria-modal="true" aria-label="Kleo Hair Mirror" style={{"--hair-accent":cfg.accent} as React.CSSProperties}>
      <section className="hair-mirror-window">
        <header><div><small>{visualMode==="silver"?"KLEO // PHOTO TRY-ON":"KLEOPÁTRA BEAUTY LAB"}</small><h2>{visualMode==="kids"?`${cfg.title} 🌈`:cfg.title}</h2></div><button onClick={close} aria-label="Bezárás">×</button></header>
        {!started?<div className="hair-consent"><span>📷</span><h3>Valódi hajfotós frizurapróba</h3><p>A rajzolt hajakat megszüntettük. A rendszer valódi, átlátszó hátterű hajfotókat illeszt a kameraképre vagy a feltöltött fényképre. A vendég képe nem kerül feltöltésre és bezáráskor törlődik.</p><label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><b>Megértettem és engedélyezem a kamera / fénykép helyi használatát.</b></label>{cfg.allowCamera&&<button disabled={!accepted} onClick={start}>Kamera indítása</button>}{cfg.allowUpload&&<label className={`hair-upload ${accepted?"":"disabled"}`}>Fénykép kiválasztása<input disabled={!accepted} type="file" accept="image/*" capture="user" onChange={e=>{setStarted(true);upload(e)}}/></label>}{!cfg.allowCamera&&!cfg.allowUpload&&<p className="hair-error-static">A hajpróba bemeneti módjai az adminban ki vannak kapcsolva.</p>}</div>:
        <div className="hair-mirror-body">
          <div className="hair-preview">
            {!photo?<video ref={videoRef} muted playsInline/>:<img className="hair-user-photo" src={photo} alt="Frizurapróba"/>}
            {cfg.showFaceGuide!==false&&<div className="hair-face-guide"/>}
            {selected&&<img className="hair-photo-overlay" src={selected.imageUrl} alt="" style={{transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${scale}) rotate(${rotate}deg)`}}/>}
            {!selected&&<div className="hair-no-style"><span>✂️</span><b>Nincs valódi haj feltöltve</b><small>Az admin felületen adj hozzá átlátszó PNG/WebP frizuraképeket.</small></div>}
            {!photo&&cfg.allowCamera&&<div className="hair-camera-actions"><button onClick={camera}>Kamera</button><button onClick={capture}>📸 Fénykép</button></div>}
            {photo&&cfg.allowCamera&&<button className="hair-retake" onClick={()=>{setPhoto("");setTimeout(camera,30)}}>↻ Új kép</button>}
            {error&&<p className="hair-error">{error}</p>}
          </div>
          <aside><h3>Válassz valódi frizurát</h3><div className="hair-styles hair-styles-photo">{cfg.styles.map(item=><button className={item.id===selected?.id?"active":""} key={item.id} onClick={()=>{setStyleId(item.id);applyDefaults(item)}}><img src={item.imageUrl} alt=""/><span>{item.type||"Frizura"}</span><b>{item.name}</b></button>)}</div>{!cfg.styles.length&&<p className="hair-admin-empty">A frizurakönyvtár üres. Tölts fel valódi haj-overlayeket a VIR → Kiosk → Mapping & haj admin felületén.</p>}<h3>Igazítás</h3><div className="hair-adjust"><button onClick={()=>setY(y-8)}>↑</button><button onClick={()=>setY(y+8)}>↓</button><button onClick={()=>setX(x-8)}>←</button><button onClick={()=>setX(x+8)}>→</button><button onClick={()=>setScale(Math.max(.45,scale-.06))}>−</button><button onClick={()=>setScale(Math.min(2,scale+.06))}>＋</button><button onClick={()=>setRotate(Math.max(-45,rotate-2))}>↶</button><button onClick={()=>setRotate(Math.min(45,rotate+2))}>↷</button></div><button className="hair-consult" disabled={!selected} onClick={()=>setChosen(true)}>{chosen?"✓ Elmentve ehhez a próbaalkalomhoz":"Ezt a frizurát szeretném →"}</button>{chosen&&selected&&<p><b>{selected.name}</b> kiválasztva. Mutasd meg a fodrásznak a konzultáción!</p>}<p>A látvány tájékoztató jellegű. A fotóalapú overlay valós hajfotót használ, de a fodrász személyes konzultáción pontosítja a megvalósíthatóságot.</p></aside>
        </div>}
      </section>
    </div>}
  </>;
}
