import React, { useState, FormEvent } from "react";
import { useI18n } from "../i18n";

export const TrainingPage: React.FC = () => {
  const { t } = useI18n();
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let correct = 0;
    if (q1 === "c") correct++;
    if (q2 === "c") correct++;
    const prefix = t("training.quiz.resultPrefix");
    const suffix = t("training.quiz.resultSuffix");
    setResult(`${prefix} ${correct} / 2 ${suffix}`);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">{t("training.hero.eyebrow")}</p>
          <h1>{t("training.hero.title")}</h1>
          <p className="hero-lead hero-lead--narrow">{t("training.hero.lead")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">{t("training.card1.title")}</h2>
            <p className="card-text">{t("training.card1.text")}</p>
          </article>

          <article className="card">
            <h2 className="card-title">{t("training.card2.title")}</h2>
            <form className="quiz-form" onSubmit={handleSubmit}>
              <div className="quiz-question">
                <p>
                  <strong>{t("training.quiz.q1.question")}</strong>
                </p>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="a"
                    checked={q1 === "a"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  {t("training.quiz.q1.optionA")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="b"
                    checked={q1 === "b"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  {t("training.quiz.q1.optionB")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="c"
                    checked={q1 === "c"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  {t("training.quiz.q1.optionC")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="d"
                    checked={q1 === "d"}
                    onChange={(e) => setQ1(e.target.value)}
                  />{" "}
                  {t("training.quiz.q1.optionD")}
                </label>
              </div>

              <div className="quiz-question">
                <p>
                  <strong>{t("training.quiz.q2.question")}</strong>
                </p>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="a"
                    checked={q2 === "a"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  {t("training.quiz.q2.optionA")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="b"
                    checked={q2 === "b"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  {t("training.quiz.q2.optionB")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="c"
                    checked={q2 === "c"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  {t("training.quiz.q2.optionC")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="d"
                    checked={q2 === "d"}
                    onChange={(e) => setQ2(e.target.value)}
                  />{" "}
                  {t("training.quiz.q2.optionD")}
                </label>
              </div>

              <button type="submit" className="btn btn-primary quiz-submit">
{t("training.quiz.submit")}
              </button>
              {result && <p className="form-msg">{result}</p>}
            </form>
          </article>
        </div>
      </section>
    </main>
  );
};
