import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { ROUTES } from "constants/routes";
import { resolveEntrepriseMediaUrl } from "service/restApiEntreprise";

const CONTRACT_BADGES = {
  CDI: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CDD: "border-amber-200 bg-amber-50 text-amber-700",
};

function getRelativeTimeLabel(dateValue) {
  if (!dateValue) {
    return "Récente";
  }

  const postedDate = new Date(dateValue);
  if (Number.isNaN(postedDate.getTime())) {
    return "Récente";
  }

  const diffMs = Date.now() - postedDate.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `Il y a ${diffDays}j`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `Il y a ${diffMonths} mois`;
}

function buildDetailPath(detailBasePath, offreId) {
  if (offreId === null || offreId === undefined || String(offreId).trim() === "") {
    return null;
  }

  const encodedId = encodeURIComponent(String(offreId));
  let basePath = typeof detailBasePath === "string" ? detailBasePath.trim() : "";

  if (!basePath) {
    basePath = ROUTES.CANDIDATE.OFFRES;
  }

  if (basePath.includes(":id")) {
    return basePath.replace(":id", encodedId);
  }

  if (!basePath.startsWith("/")) {
    basePath = `/${basePath}`;
  }

  const normalizedBasePath = basePath.endsWith("/")
    ? basePath.slice(0, -1)
    : basePath;

  return `${normalizedBasePath}/${encodedId}`;
}

function getCompanyInitials(companyName) {
  const normalizedName = typeof companyName === "string" ? companyName.trim() : "";

  if (!normalizedName) {
    return "EN";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  return normalizedName.slice(0, 2).toUpperCase();
}

export default function JobCard({ offre, viewMode, detailBasePath }) {
  const navigate = useNavigate();
  const offreId = offre?._id || offre?.id;
  const detailPath = buildDetailPath(detailBasePath, offreId);
  const poste = offre?.poste || "Poste non renseigne";
  const entrepriseNom = offre?.entreprise?.nom || offre?.nomEntreprise || "Entreprise";
  const localisation = offre?.localisation || "Localisation non precisee";
  const typeContrat = (offre?.typeContrat || "CDI").toUpperCase();
  const badgeClass =
    CONTRACT_BADGES[typeContrat] || "border-sky-200 bg-sky-50 text-sky-700";

  const dateLabel = getRelativeTimeLabel(offre?.createdAt || offre?.datePublication);
  const logoLetters = getCompanyInitials(entrepriseNom);
  const rawLogo = offre?.entreprise?.logo || offre?.logoEntreprise || offre?.logo || "";
  const logoUrl = resolveEntrepriseMediaUrl(rawLogo);
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(
    function () {
      setLogoLoadError(false);
    },
    [logoUrl]
  );

  const shouldShowLogo = Boolean(logoUrl) && !logoLoadError;

  return (
    <article
      onClick={function () {
        if (detailPath) {
          navigate(detailPath);
        }
      }}
      className={
        "group card-animate cursor-pointer rounded-[var(--rounded-lg)] border p-5 transition-all duration-200 " +
        (viewMode === "list" ? "md:flex md:items-center md:gap-5" : "")
      }
      style={{
        borderColor: "var(--color-hairline)",
        backgroundColor: "var(--color-canvas)",
      }}
    >
      <div className="flex items-start justify-between gap-4 md:min-w-0 md:flex-1">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--rounded-sm)] text-sm font-semibold " +
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

          <div className="min-w-0">
            <p
              className="truncate font-text text-[12px] uppercase tracking-wider"
              style={{ color: "var(--color-ink-muted-48)", fontWeight: 600 }}
            >
              {entrepriseNom}
            </p>
            <h3
              className="truncate font-text text-[17px]"
              style={{ color: "var(--color-ink)", fontWeight: 600, letterSpacing: "-0.374px" }}
            >
              {poste}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} style={{ color: "var(--color-ink-muted-48)" }} />
                {localisation}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} style={{ color: "var(--color-ink-muted-48)" }} />
                {dateLabel}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div
        className="mt-4 flex items-center justify-between pt-4 md:mt-0 md:min-w-[170px] md:border-t-0 md:pt-0"
        style={{ borderTop: "1px solid var(--color-divider-soft)" }}
      >
        <span
          className={`inline-flex items-center rounded-[var(--rounded-pill)] border px-3 py-1 font-text text-[12px] ${badgeClass}`}
          style={{ fontWeight: 600 }}
        >
          {typeContrat}
        </span>
      </div>
    </article>
  );
}

JobCard.propTypes = {
  offre: PropTypes.shape({
    poste: PropTypes.string,
    localisation: PropTypes.string,
    typeContrat: PropTypes.string,
    salaire: PropTypes.string,
    salaireMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salaireMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
    datePublication: PropTypes.string,
    entreprise: PropTypes.shape({
      nom: PropTypes.string,
      logo: PropTypes.string,
    }),
    nomEntreprise: PropTypes.string,
    logoEntreprise: PropTypes.string,
    logo: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.oneOf(["grid", "list"]),
  detailBasePath: PropTypes.string,
};

JobCard.defaultProps = {
  viewMode: "grid",
  detailBasePath: ROUTES.CANDIDATE_OFFRES,
};
