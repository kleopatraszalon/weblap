import React from "react";
import "../styles/franchiseLanding.css";
import { SparkleIcon } from "../components/FranchiseLanding";
import FranchiseLeadForm, { FranchiseExtraField } from "../components/FranchiseLeadForm";
import { useNoIndex } from "../hooks/useNoIndex";

const SP_FIELDS: FranchiseExtraField[] = [
  {
    key: "Q1VEGZ",
    label: "Mi a legmagasabb iskolai végzettséged?",
    type: "select",
    options: ["Alapfokú", "Középfokú", "Szakmunkás bizonyítvány", "OKJ", "Felsőfokú"],
  },
  { key: "Q2SZAK", label: "Milyen szakterületű a legmagasabb végzettséged?", required: true },
  {
    key: "Q3JOGVISZ",
    label: "Jelenleg milyen jogviszonyban dolgozol?",
    type: "select",
    required: true,
    options: ["Alkalmazott", "Vállakozó", "Befektető", "Egyéb"],
  },
  { key: "Q5ISMERET", label: "Milyen szépségiparban szerzett ismereteid vannak?", type: "textarea" },
  { key: "Q6MIERT", label: "Miért szeretnél franchise partnerünk lenni?", type: "textarea", required: true },
  {
    key: "Q7OSSZEG",
    label: "Milyen összeget tudsz az elindulásra szánni?",
    type: "select",
    required: true,
    options: ["20.000.000 Ft", "25.000.000 Ft", "30.000.000 Ft"],
  },
  {
    key: "Q8VALLALK",
    label: "Van saját vállalkozásod?",
    type: "select",
    required: true,
    options: ["Korlátolt felelősségű társaság (Kft)", "Betéti társaság", "Egyéni vállalkozás", "Még nincs, de szeretnék", "Egyéb"],
  },
  {
    key: "Q9CEGNEV",
    label: "Ha van céged, kérlek add meg nevét és adószámát.",
    required: true,
    helperText: "Ha még nincs céged, írd be: Nincs.",
  },
  {
    key: "Q10VOLTMAR",
    label: "Volt már franchise üzleted?",
    type: "select",
    required: true,
    options: ["Igen", "Nem"],
  },
  {
    key: "Q11VEZETO",
    label: "Van tapasztalatod vezetői pozícióban?",
    type: "select",
    required: true,
    options: ["Igen", "Nem"],
  },
  { key: "Q12VAROS", label: "Melyik városban/régióban szeretnél szalont nyitni?", required: true },
];

const SUPPORT = [
  ["Marketing", "Központi márka- és kampánytámogatás, hogy ne egyedül kelljen felépítened a vendégszerzést."],
  ["Technológia", "Digitális ügyfélkezelési, foglalási és vállalatirányítási háttér a napi működéshez."],
  ["Tudás", "Betanítás, működési standardok, szakmai és vezetői támogatás."],
  ["Beszerzés", "Központi beszerzési lehetőségek és egységesített alapanyag-háttér."],
];

export function FranchiseInfoPage() {
  const videoUrl = String(import.meta.env.VITE_FRANCHISE_INFO_VIDEO_URL || import.meta.env.VITE_FRANCHISE_VIDEO_URL || "");
  useNoIndex();

  return (
    <main className="fr-landing">
      <section className="fr-hero">
        <div className="fr-hero-inner">
          <div className="fr-badge"><SparkleIcon /></div>
          <p className="section-eyebrow">SP · SALES PAGE</p>
          <h1 className="fr-title">Köszönjük az érdeklődésed! Íme a Kleopátra Szépségszalonok Franchise Program részletes bemutatása.</h1>
          <p className="fr-sub">Ismerd meg a számokat, a folyamatokat és azt a támogatási rendszert, amellyel egy felépített márka és működési modell mellett indíthatod el a saját szalonodat.</p>

          <div className="fr-video-card" role="region" aria-label="Kleopátra franchise sales videó">
            {videoUrl ? (
              <video controls preload="metadata" poster="/images/franchise.png" style={{ width: "100%", borderRadius: 20, display: "block" }}>
                <source src={videoUrl} />
                A böngésződ nem támogatja a videó lejátszását.
              </video>
            ) : (
              <div style={{ padding: "34px 16px" }}>
                <h2 className="fr-video-title">Franchise bemutató</h2>
                <p className="fr-video-sub">A sales videó a VITE_FRANCHISE_INFO_VIDEO_URL beállítással kapcsolható be.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="fr-section">
        <div className="fr-container">
          <p className="section-eyebrow">1 · A Kleopátra-modell</p>
          <h2 className="fr-h2">Miért működhet jól a komplex szépségszalon modell?</h2>
          <p className="fr-lead">A vendég egy helyen több szolgáltatást is igénybe vehet: fodrászatot, kozmetikát, kéz- és lábápolást, valamint további szépségápolási szolgáltatásokat. Ez támogatja a magasabb látogatási értéket és a szolgáltatások közötti keresztértékesítést.</p>
          <div className="feature-grid">
            <article className="feature-card"><h3>Magasabb kosárérték lehetősége</h3><p>Egy vendég több, egymáshoz kapcsolódó szolgáltatást is igénybe vehet egy márkán belül.</p></article>
            <article className="feature-card"><h3>Keresztértékesítés</h3><p>A már meglévő vendégkörből további szolgáltatásokra is képezhető kereslet, ami javíthatja a marketing hatékonyságát.</p></article>
            <article className="feature-card"><h3>Egységes ügyfélélmény</h3><p>Az arculat, a működési standardok és az ügyfélkezelés közös rendszerben tartható.</p></article>
          </div>
        </div>
      </section>

      <section className="fr-section" style={{ background: "rgba(255,255,255,.035)" }}>
        <div className="fr-container">
          <p className="section-eyebrow">2 · Befektetés</p>
          <h2 className="fr-h2">A befektetés fő számai</h2>
          <div className="feature-grid">
            <article className="feature-card"><span className="feature-card__kicker">Egyszeri belépési díj</span><h3>5.000.000 Ft + ÁFA</h3><p>Márka- és arculathasználat, működési know-how, betanítás és indulási támogatás.</p></article>
            <article className="feature-card"><span className="feature-card__kicker">Induló beruházás</span><h3>kb. 15.000.000 Ft + ÁFA-tól</h3><p>A végleges összeg az üzlet méretétől, állapotától, gépparktól, berendezéstől és induló készlettől függ.</p></article>
            <article className="feature-card"><span className="feature-card__kicker">Folyamatos royalty</span><h3>a forgalom 10%-a</h3><p>A központi rendszerhez, marketinghez, HR- és szakmai támogatáshoz kapcsolódó folyamatos franchise díj.</p></article>
          </div>
          <p className="fr-lead" style={{ marginTop: 22 }}>A befektetési és megtérülési számok nem minősülnek hozamgaranciának. A tényleges eredmény a lokációtól, költségstruktúrától, kapacitástól, vezetéstől és piaci környezettől függ; a konkrét projekt előtt egyedi üzleti terv szükséges.</p>
        </div>
      </section>

      <section className="fr-section">
        <div className="fr-container">
          <p className="section-eyebrow">3 · Kleopátra-háttér</p>
          <h2 className="fr-h2">Mit ad a központ, és mi a partner feladata?</h2>
          <div className="feature-grid">{SUPPORT.map(([title,text])=><article className="feature-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="feature-grid" style={{ marginTop: 20 }}>
            <article className="feature-card"><h3>A partner: vezetés</h3><p>Irányítja a napi működést, szervezi és motiválja a helyi csapatot.</p></article>
            <article className="feature-card"><h3>A partner: minőség</h3><p>Felügyeli, hogy a vendégek a Kleopátra standardoknak megfelelő szolgáltatást kapják.</p></article>
            <article className="feature-card"><h3>A partner: helyi jelenlét</h3><p>Aktívan építi a szalon helyi ismertségét és üzleti kapcsolatait.</p></article>
          </div>
        </div>
      </section>

      <section className="fr-section" style={{ background: "rgba(255,255,255,.035)" }}>
        <div className="fr-container">
          <p className="section-eyebrow">4 · Kinek nem való?</p>
          <h2 className="fr-h2">A franchise aktív partneri működést igényel</h2>
          <div className="feature-grid">
            <article className="feature-card"><h3>Nem passzív befektetés</h3><p>Olyan partnerrel működik jól, aki a vállalkozás vezetésében ténylegesen részt vesz vagy megfelelő menedzsmentet biztosít.</p></article>
            <article className="feature-card"><h3>Rendszerkövetés szükséges</h3><p>A márka egységességéhez a közös működési és minőségi standardokat be kell tartani.</p></article>
            <article className="feature-card"><h3>Megfelelő finanszírozás kell</h3><p>Az induló beruházás mellett az első időszak biztonságos működéséhez is megfelelő tartalék szükséges.</p></article>
          </div>
        </div>
      </section>

      <section className="fr-section">
        <div className="fr-container">
          <p className="section-eyebrow">5 · Gyakori kérdések</p>
          <h2 className="fr-h2">A legfontosabb válaszok</h2>
          <div className="feature-grid">
            <article className="feature-card"><h3>Kell szakmai végzettség?</h3><p>A tulajdonosnak nem szükséges fodrásznak vagy kozmetikusnak lennie; a megfelelő szakembereket és a működést viszont biztosítani kell.</p></article>
            <article className="feature-card"><h3>Segítünk helyszínt választani?</h3><p>Igen. A lokáció az üzleti terv egyik kritikus eleme, ezért a kiválasztás és értékelés a franchise folyamat része.</p></article>
            <article className="feature-card"><h3>Mennyi idő a nyitás?</h3><p>A korábbi tervezési keret jellemzően 3–6 hónap; a tényleges idő az üzlethelyiség, engedélyek, kivitelezés és toborzás függvénye.</p></article>
          </div>
        </div>
      </section>

      <section className="fr-section" style={{ background: "rgba(255,255,255,.035)" }}>
        <div className="fr-container">
          <p className="section-eyebrow">6 · Jelentkezési folyamat</p>
          <h2 className="fr-h2">A következő lépések</h2>
          <div className="feature-grid">
            <article className="feature-card"><span className="feature-card__kicker">01</span><h3>SP_form kitöltése</h3><p>Megismerjük a hátteredet, tapasztalatodat, finanszírozási keretedet és tervezett lokációdat.</p></article>
            <article className="feature-card"><span className="feature-card__kicker">02</span><h3>Konzultáció</h3><p>A megfelelő érdeklődőkkel személyes vagy online egyeztetés következik.</p></article>
            <article className="feature-card"><span className="feature-card__kicker">03</span><h3>Üzleti terv és helyszín</h3><p>Közösen értékeljük a várost, a lokációt, a beruházási igényt és az üzleti feltételeket.</p></article>
            <article className="feature-card"><span className="feature-card__kicker">04</span><h3>Szerződés és indulás</h3><p>Megfelelő döntés esetén elindul a kialakítás, betanítás és nyitási folyamat.</p></article>
          </div>
        </div>
      </section>

      <section className="fr-section" id="sp-form">
        <div className="fr-container">
          <p className="section-eyebrow">SP_form · RÉSZLETES JELENTKEZÉS</p>
          <h2 className="fr-h2">Készen állsz a következő lépésre?</h2>
          <p className="fr-lead">Töltsd ki az alábbi részletes adatlapot. Az adatok közvetlenül a franchise Mailchimp Audience megfelelő merge mezőibe kerülnek, és segítenek abban, hogy a konzultáción már konkrét lehetőségekről beszélhessünk.</p>
          <FranchiseLeadForm variant="sp" extraFields={SP_FIELDS} successPath="/koszonjuk" />
        </div>
      </section>
    </main>
  );
}

export default FranchiseInfoPage;
