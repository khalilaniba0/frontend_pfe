// Lignes : 61 | Couche : composant | Depend de : react
import React from "react";
import PropTypes from "prop-types";

export default function OffreRecommendationCard({ offre, onClick }) {
  const isUrgent =
    offre?.dateLimite &&
    new Date(offre.dateLimite) - new Date() < 7 * 86400000;

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
    >
      <div>
        <div className="mb-3 flex flex-col">
          {isUrgent && (
            <span className="mb-2 self-start rounded-full bg-red-50 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-red-600">
              URGENT
            </span>
          )}
          <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-primary">
            {offre?.poste || offre?.post}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 font-body text-sm text-text-secondary">
            <span className="material-symbols-outlined text-sm">business_center</span>
            {offre?.entreprise?.nom || "Entreprise confidentielle"}
          </p>
          {(offre?.type || offre?.modalite) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {offre?.type && (
                <span className="rounded-lg bg-bg-soft px-2.5 py-1 font-body text-xs font-medium text-text-secondary">
                  {offre.type}
                </span>
              )}
              {offre?.modalite && (
                <span className="rounded-lg bg-bg-page px-2.5 py-1 font-body text-xs font-medium text-text-secondary">
                  {offre.modalite}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        {offre?.localisation ? (
          <p className="flex items-center gap-1 font-body text-xs text-text-muted">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {offre.localisation}
          </p>
        ) : (
          <div />
        )}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

OffreRecommendationCard.propTypes = {
  offre: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

OffreRecommendationCard.defaultProps = {
  onClick: function () {},
};
