import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { resolveEntrepriseMediaUrl } from "service/restApiEntreprise";

const ETAPE_LABELS = {
  soumise: { label: "Candidature reçue", color: "badge-inactive" },
  preselectionne: {
    label: "En cours d'examen",
    color: "badge-pending",
  },
  entretien_planifie: {
    label: "Entretien prévu",
    color: "badge-pending",
  },
  entretien_passe: {
    label: "Entretien passé",
    color: "badge-inactive",
  },
  accepte: { label: "Accepté", color: "badge-active" },
  refuse: { label: "Refusé", color: "badge-inactive" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function CandidatureCard({ candidature, onAnnuler, onOpenDetails }) {
  const offre = candidature?.offre || {};
  // NOTE: Si le backend ne populate pas `offre` dans GET /candidature/mesCandidatures,
  // on utilise candidature.nom comme fallback (qui stocke le nom du candidat, pas le poste).
  const poste = offre?.poste || offre?.post || offre?.titre || candidature?.nom || "Poste inconnu";
  const entrepriseNom =
    offre?.entreprise?.nom || offre?.nomEntreprise || "Entreprise";
  const localisation = offre?.localisation || "";
  const etape = candidature?.etape || candidature?.status || "soumise";
  const etapeInfo =
    ETAPE_LABELS[etape] || ETAPE_LABELS.soumise;
  const dateSoumission = formatDate(candidature?.createdAt);
  const logoLetters = entrepriseNom.slice(0, 2).toUpperCase();
  const rawLogo = offre?.entreprise?.logo || offre?.logoEntreprise || offre?.logo || "";
  const logoUrl = resolveEntrepriseMediaUrl(rawLogo);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const isInteractive = typeof onOpenDetails === "function";

  useEffect(
    function () {
      setLogoLoadError(false);
    },
    [logoUrl]
  );

  const shouldShowLogo = Boolean(logoUrl) && !logoLoadError;

  function handleOpenDetails() {
    if (isInteractive) {
      onOpenDetails(candidature);
    }
  }

  return (
    <div
      className={`group card-animate rounded-[var(--rounded-lg)] border p-5 transition-all duration-200 ${
        isInteractive ? "cursor-pointer" : ""
      }`}
      style={{
        borderColor: "var(--color-hairline)",
        backgroundColor: "var(--color-canvas)",
      }}
      onClick={handleOpenDetails}
      onKeyDown={function (e) {
        if (!isInteractive) return;
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenDetails();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? "Voir les details de cette candidature" : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Logo entreprise */}
        <div
          className={
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--rounded-sm)] font-display text-sm font-semibold " +
            (shouldShowLogo
              ? "overflow-hidden"
              : "")
          }
          style={
            shouldShowLogo
              ? {
                  border: "1px solid var(--color-hairline)",
                  backgroundColor: "var(--color-canvas)",
                  boxShadow: "var(--shadow-product)",
                }
              : {
                  border: "1px solid rgba(0, 102, 204, 0.2)",
                  backgroundColor: "var(--color-canvas-parchment)",
                  color: "var(--color-primary)",
                }
          }
        >
          {shouldShowLogo ? (
            <img
              src={logoUrl}
              alt={entrepriseNom}
              className="h-full w-full object-cover"
              onError={function () {
                setLogoLoadError(true);
              }}
            />
          ) : (
            logoLetters
          )}
        </div>

        {/* Infos */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="truncate font-text text-[17px] transition-colors"
                style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.374px" }}
              >
                {poste}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--color-ink-muted-48)" }}>business</span>
                  {entrepriseNom}
                </span>
                {localisation && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--color-ink-muted-48)" }}>location_on</span>
                    {localisation}
                  </span>
                )}
              </div>
            </div>

            {/* Badge étape */}
            <span
              className={`shrink-0 ${etapeInfo.color}`}
            >
              {etapeInfo.label}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--color-divider-soft)" }}>
            <div className="flex items-center gap-4 font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>
              {dateSoumission && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Postulé le {dateSoumission}
                </span>
              )}
              {offre?.typeContrat && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">work</span>
                  {offre.typeContrat}
                </span>
              )}
            </div>

            {etape === "soumise" && onAnnuler && (
              <button
                type="button"
                onClick={function (e) {
                  e.stopPropagation();
                  onAnnuler(candidature._id);
                }}
                className="button-ghost-pill"
                style={{ fontSize: "14px", padding: "8px 14px", color: "#ff3b30", borderColor: "rgba(255,59,48,0.3)" }}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CandidatureCard.propTypes = {
  candidature: PropTypes.object.isRequired,
  onAnnuler: PropTypes.func,
  onOpenDetails: PropTypes.func,
};
