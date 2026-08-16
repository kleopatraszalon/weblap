import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { SERVICE_PAGE_BY_SLUG } from "../data/servicePages";

function setMeta(name: string, content: string) {
  let node = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = SERVICE_PAGE_BY_SLUG.get(slug.toLowerCase());

  useEffect(() => {
    if (!service) return;
    document.title = `${service.title} | Kleopátra Szépségszalonok`;
    setMeta("description", service.lead);

    const canonicalHref = `https://www.kleoszalon.hu/szolgaltatasok/${service.slug}`;
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;
  }, [service]);

  if (!service) return <Navigate to="/szolgaltatasok" replace />;

  const related = (service.related || [])
    .map((relatedSlug) => SERVICE_PAGE_BY_SLUG.get(relatedSlug))
    .filter(Boolean);

  return (
    <main>
      <PublicPageHero
        eyebrow={service.eyebrow}
        title={service.title}
        lead={<p>{service.lead}</p>}
        actions={
          <>
            <Link to="/booking" className="btn btn-primary">Időpontfoglalás</Link>
            <Link to="/araink" className="btn btn-outline">Árak</Link>
          </>
        }
      />

      <section className="public-section">
        <div className="container">
          <div className="public-section__header">
            <p className="section-eyebrow">{service.category}</p>
            <h2>Részletek a szolgáltatásról</h2>
            <p>{service.description}</p>
          </div>

          <div className="feature-grid">
            {service.benefits.map((benefit) => (
              <article className="feature-card" key={benefit}>
                <span className="feature-card__kicker">Kleopátra</span>
                <h3>{benefit}</h3>
                <p>Az aktuális elérhetőség és a pontos szolgáltatási tartalom szalononként eltérhet.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="public-section public-section--soft">
          <div className="container">
            <header className="public-section__header">
              <p className="section-eyebrow">Kapcsolódó kezelések</p>
              <h2>Fedezd fel a kapcsolódó szolgáltatásokat</h2>
            </header>
            <div className="feature-grid">
              {related.map((item) => item && (
                <Link key={item.slug} to={`/szolgaltatasok/${item.slug}`} className="feature-card card--service">
                  <span className="feature-card__kicker">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.lead}</p>
                  <span className="link-btn">Részletek →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="public-section">
        <div className="container public-cta">
          <div>
            <h2>Megnéznéd a szabad időpontokat?</h2>
            <p>Válassz szalont és foglalj időpontot online az aktuálisan elérhető szolgáltatások közül.</p>
          </div>
          <div className="public-page-hero__actions">
            <Link to="/booking" className="btn btn-primary">Időpontfoglalás</Link>
            <Link to="/szalonok" className="btn btn-outline">Szalonok</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ServiceDetailPage;
