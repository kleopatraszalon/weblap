import React, { ReactNode } from "react";

export type PublicPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  compact?: boolean;
};

export function PublicPageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "Kleopátra Szépségszalonok",
  actions,
  compact = false,
}: PublicPageHeroProps) {
  return (
    <section className={`public-page-hero${compact ? " public-page-hero--compact" : ""}`}>
      <div className="container public-page-hero__grid">
        <div className="public-page-hero__content">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="public-page-hero__lead">{lead}</div>
          {actions ? <div className="public-page-hero__actions">{actions}</div> : null}
        </div>
        {image ? (
          <div className="public-page-hero__media">
            <img src={image} alt={imageAlt} />
          </div>
        ) : (
          <div className="public-page-hero__mark" aria-hidden="true">K</div>
        )}
      </div>
    </section>
  );
}

export default PublicPageHero;
