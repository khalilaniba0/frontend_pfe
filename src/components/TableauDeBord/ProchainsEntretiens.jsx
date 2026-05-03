import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "config/api";
import { ROUTES } from "constants/routes";

function getInitials(name) {
  if (!name) return "??";
  var parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getTypeLabel(type) {
  switch (type) {
    case "visio":
      return "Visio";
    case "telephone":
      return "Téléphone";
    case "presentiel":
      return "Présentiel";
    default:
      return type || "Entretien";
  }
}

var getTypeStyle = function (type) {
  switch (type) {
    case "visio":
      return "badge-pending";
    case "telephone":
      return "badge-inactive";
    case "presentiel":
      return "badge-active";
    default:
      return "badge-inactive";
  }
};

export default function UpcomingInterviews({ interviews, loading }) {
  const navigate = useNavigate();

  const goToInterviewsCalendar = function () {
    navigate(ROUTES.ADMIN.INTERVIEWS);
  };

  const uiInterviews = useMemo(
    function () {
      return (Array.isArray(interviews) ? interviews : []).map(function (e, index) {
        var candidatName =
          e.candidature?.nom ||
          e.candidature?.candidat?.nom ||
          e.candidature?.email ||
          "Candidat";
        var role =
          e.candidature?.offre?.poste ||
          e.candidature?.poste ||
          "Poste non défini";
        var dateObj = new Date(e.dateEntretien || e.date_entretien);
        var timeStr = dateObj.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        var photoUrl = e.candidature?.photo_url || e.candidature?.candidat?.photo_url;
        var avatar = photoUrl ? `${API_URL}/profile-photos/${photoUrl}` : null;

        return {
          name: candidatName,
          role: role,
          time: timeStr,
          type: getTypeLabel(e.typeEntretien || e.type_entretien),
          rawType: e.typeEntretien || e.type_entretien,
          initials: getInitials(candidatName),
          avatar: avatar,
        };
      });
    },
    [interviews]
  );

  return (
    <div className="rounded-[var(--rounded-lg)] border bg-white p-6" style={{ borderColor: "var(--color-hairline)" }}>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "0.231px" }}>
            Entretiens à venir
          </h3>
        </div>
        <button
          type="button"
          onClick={goToInterviewsCalendar}
          className="chip-option"
        >
          <i className="fas fa-calendar-alt text-[10px]"></i>
          Calendrier
        </button>
      </header>

      {loading ? (
        <div className="py-8 text-center">
          <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>Chargement...</p>
        </div>
      ) : uiInterviews.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            Aucun entretien à venir
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {uiInterviews.map(function (interview, index) {
            return (
              <li
                key={index}
                className={
                  "group flex items-center gap-4 py-3.5 transition-colors duration-150 " +
                  (index < uiInterviews.length - 1
                    ? "border-b"
                    : "")
                }
                style={index < uiInterviews.length - 1 ? { borderColor: "var(--color-divider-soft)" } : undefined}
              >
                {interview.avatar ? (
                  <img
                    alt={interview.name}
                    className="avatar-image h-10 w-10 rounded-[var(--rounded-pill)] bg-white object-cover"
                    src={interview.avatar}
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)] font-text text-xs font-semibold"
                    style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-ink)" }}
                  >
                    {interview.initials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>
                    {interview.name}
                  </p>
                  <p className="truncate font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                    {interview.role}
                  </p>
                </div>

                <span
                  className={"hidden sm:inline-flex " + getTypeStyle(interview.rawType)}
                >
                  {interview.type}
                </span>

                <div className="flex items-center gap-1.5" style={{ color: "var(--color-ink)" }}>
                  <i className="fas fa-clock text-xs" style={{ color: "var(--color-ink-muted-48)" }}></i>
                  <span className="font-text text-[14px] font-semibold tabular-nums">
                    {interview.time}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={goToInterviewsCalendar}
                  className="button-icon-circular opacity-0 group-hover:opacity-100"
                  style={{ color: "var(--color-ink-muted-48)", width: "32px", height: "32px" }}
                  title="Voir les détails"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

UpcomingInterviews.propTypes = {
  interviews: PropTypes.array,
  loading: PropTypes.bool,
};

UpcomingInterviews.defaultProps = {
  interviews: [],
  loading: false,
};
