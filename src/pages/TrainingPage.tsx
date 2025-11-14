import React, { useState, FormEvent } from "react";

export const TrainingPage: React.FC = () => {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let correct = 0;
    if (q1 === "c") correct++;
    if (q2 === "c") correct++;
    setResult(`Eredmény: ${correct} / 2 helyes válasz.`);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Oktatás</p>
          <h1>Kleopátra Akadémia</h1>
          <p className="hero-lead hero-lead--narrow">
            Belső képzési rendszerünk a szakmai fejlődést, az egységes
            vendégélményt és a márkaérték hosszú távú építését szolgálja.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">Belső képzések</h2>
            <p className="card-text">
              Folyamatos tréningek fodrász, kozmetikus és kéz- és lábápoló
              kollégáink számára, hogy mindig naprakész technikákkal dolgozhassanak.
            </p>
          </article>

          <article className="card">
            <h2 className="card-title">Mini teszt – alap kozmetikai tudás</h2>
            <form className="quiz-form" onSubmit={handleSubmit}>
              <div className="quiz-question">
                <p>
                  <strong>
                    1. Melyik bőrtípusra jellemző a zsíros T-vonal, szárazabb
                    orcákkal?
                  </strong>
                </p>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="a"
                    checked={q1 === "a"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  Száraz bőr
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="b"
                    checked={q1 === "b"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  Normál bőr
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="c"
                    checked={q1 === "c"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  Kombinált bőr
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="d"
                    checked={q1 === "d"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  Érzékeny bőr
                </label>
              </div>

              <div className="quiz-question">
                <p>
                  <strong>
                    2. Milyen gyakran ajánlott az arcbőr kíméletes radírozása
                    normál bőrtípusnál?
                  </strong>
                </p>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="a"
                    checked={q2 === "a"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  Naponta
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="b"
                    checked={q2 === "b"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  Hetente 2–3 alkalommal
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="c"
                    checked={q2 === "c"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  Hetente egyszer
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="d"
                    checked={q2 === "d"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  Soha
                </label>
              </div>

              <button type="submit" className="btn btn-primary quiz-submit">
                Teszt kiértékelése
              </button>
              {result && <p className="form-msg">{result}</p>}
            </form>
          </article>
        </div>
      </section>
    </main>
  );
};
