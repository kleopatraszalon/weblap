import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { SERVICE_PAGE_BY_SLUG } from "../data/servicePages";

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const service = SERVICE_PAGE_BY_SLUG.get(slug.toLowerCase());

  useEffect(() => {
    if (!service) return;

    const previousTitle = document.title;
    const existingDescription = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const descriptionWasCreated = !existingDescription;
    const description = existingDescription || document.createElement("meta");
    const previousDescription = existingDescription?.content || "";
    if (descriptionWasCreated) {
      description.name = "description";
      document.head.appendChild(description);
    }

    const existingCanonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const canonicalWasCreated = !existingCanonical;
    const canonical = existingCanonical || document.createElement("link");
    const previousCanonical = existingCanonical?.href || "";
    if (canonicalWasCreated) {
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    document.title = `${service.title} | Kleopátra Szépségszalonok`;
    description.content = service.lead;
    canonical.href = `https://www.kleoszalon.hu/szolgaltatasok/${service.slug}`;

    return () => {
      document.title = previousTitle;
      if (descriptionWasCreated) description.remove();
      else description.content = previousDescription;
      if (canonicalWasCreated) canonical.remove();
      else canonical.href = previousCanonical;
    };
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
