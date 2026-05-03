import React, { useMemo } from "react";
import PropTypes from "prop-types";

function getEtapeConfig(etape) {
  switch (etape) {
    case "soumise":
      return {
        text: "Candidature soumise",
        icon: "fas fa-user-plus",
        dotColor: "var(--color-primary)",
      };
    case "preselectionne":
      return {
        text: "Présélectionné(e)",
        icon: "fas fa-check-circle",
        dotColor: "#1d6b1d",
      };
    case "entretien_planifie":
      return {
        text: "Entretien planifié",
        icon: "fas fa-calendar-check",
        dotColor: "#7a5c00",
      };
    case "entretien_passe":
      return {
        text: "Entretien passé",
        icon: "fas fa-check-circle",
        dotColor: "var(--color-primary)",
      };
    case "accepte":
      return {
        text: "Candidature acceptée",
        icon: "fas fa-plus-circle",
        dotColor: "#1d6b1d",
      };
    case "refuse":
      return {
        text: "Candidature refusée",
        icon: "fas fa-times-circle",
        dotColor: "#ff3b30",
      };
    default:
      return {
        text: "Mise à jour",
        icon: "fas fa-info-circle",
        dotColor: "var(--color-ink-muted-48)",
      };
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  var now = new Date();
  var date = new Date(dateStr);
  var diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "À l'instant";
  if (diff < 3600) return Math.floor(diff / 60) + " min";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function isToday(dateStr) {
  if (!dateStr) return false;
  var today = new Date();
  var date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function RecentActivity({ candidatures, loading }) {
  const activities = useMemo(
    function () {
      return (Array.isArray(candidatures) ? candidatures : [])
        .filter(function (c) {
          // Ne conserver que les événements du jour
          return isToday(c.createdAt);
        })
        .map(function (c) {
        var config = getEtapeConfig(c.etape);
        var person = c.nom || c.candidat?.nom || c.email || "Candidat";
        var offrePoste = c.offre?.poste || "";
        return {
          text: config.text + (offrePoste ? " pour " + offrePoste : ""),
          person: person,
          time: timeAgo(c.createdAt),
          icon: config.icon,
          dotColor: config.dotColor,
        };
      });
    },
    [candidatures]
  );

  return (
    <div className="apple-card flex h-full min-h-[380px] flex-col">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h3
            className="font-text text-[17px] font-semibold"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.374px" }}
          >
            Tâches & Activités du jour
          </h3>
          <p className="mt-1 font-text text-[14px] font-normal" style={{ color: "var(--color-ink-muted-48)" }}>
            Aperçu de vos événements récents et tâches.
          </p>
        </div>
        <span className="badge-count">
          {activities.length}
        </span>
      </header>

      <div className="relative flex flex-1 flex-col overflow-y-auto pr-1">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full" style={{ border: "2px solid var(--color-hairline)", borderTopColor: "var(--color-primary)" }} />
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[var(--rounded-pill)]"
              style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-ink-muted-48)" }}
            >
              <i className="fas fa-inbox text-2xl" />
            </div>
            <p className="font-text text-[14px] font-normal" style={{ color: "var(--color-ink-muted-48)" }}>
              Aucune activité pour aujourd'hui
            </p>
          </div>
        ) : (
          <ul className="flex flex-col pb-2">
            {activities.map(function (item, index) {
              return (
                <li
                  key={index}
                  className="flex cursor-default flex-col py-3"
                  style={{
                    borderBottom: index < activities.length - 1 ? "1px solid var(--color-divider-soft)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-2 w-2 flex-shrink-0 rounded-[var(--rounded-pill)]"
                        style={{ backgroundColor: item.dotColor }}
                      />
                      <div className="min-w-0">
                        <p className="font-text text-[17px] font-semibold line-clamp-1" style={{ color: "var(--color-ink)", letterSpacing: "-0.374px" }}>
                          {item.person}
                        </p>
                        <p className="font-text text-[14px] font-normal line-clamp-1 mt-0.5" style={{ color: "var(--color-ink-muted-48)" }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <span className="badge-count shrink-0 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

RecentActivity.propTypes = {
  candidatures: PropTypes.array,
  loading: PropTypes.bool,
};

RecentActivity.defaultProps = {
  candidatures: [],
  loading: false,
};
