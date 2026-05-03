import React from "react";
import PropTypes from "prop-types";
import { Video } from "lucide-react";
import ModalBackdrop from "components/commun/FondModal";
import { API_URL } from "config/api";

function formatDate(dateStr) {
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatHeure(dateStr, duree) {
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  var start = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (duree) {
    var end = new Date(d.getTime() + Number(duree) * 60000);
    var endStr = end.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return start + " - " + endStr;
  }

  return start;
}

export default function InterviewDetailsModal({
  interview,
  deleting,
  onClose,
  onDelete,
}) {
  if (!interview) return null;

  var dateEntretien = interview.dateEntretien || interview.date_entretien;
  var type = interview.typeEntretien || interview.type_entretien || "-";
  var candidatName =
    interview.candidatName ||
    interview.candidatNom ||
    interview.candidat?.nom ||
    interview.candidatEmail ||
    interview.emailCandidat ||
    interview.email ||
    interview.candidature?.nom ||
    interview.candidature?.candidat?.nom ||
    "Candidat";
  var photoUrl = interview.candidature?.photo_url || interview.candidature?.candidat?.photo_url;
  var avatar = photoUrl ? `${API_URL}/profile-photos/${photoUrl}` : null;
  var email =
    interview.candidatEmail ||
    interview.emailCandidat ||
    interview.email ||
    interview.candidature?.email ||
    interview.candidature?.candidat?.email ||
    "-";
  var poste =
    interview.poste ||
    interview.titrePoste ||
    interview.candidature?.offre?.poste ||
    interview.candidature?.poste ||
    "Poste non défini";
  var lienVisio = interview.lienVisio || interview.lien_visio || interview.meetLink || "";
  var hasLienVisio = Boolean(String(lienVisio || "").trim());

  return (
    <ModalBackdrop onClose={deleting ? function () {} : onClose}>
      <div
        className="flex max-h-[95vh] w-full animate-scale-in flex-col overflow-y-auto rounded-t-2xl border border-border bg-white md:max-w-2xl md:rounded-2xl"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
              <span className="material-symbols-outlined text-xl text-primary">
                event_note
              </span>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-text-primary">
                Détails de l'entretien
              </h2>
              <p className="font-body text-xs text-text-muted">
                Consultez les informations et gérez cet entretien
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-soft hover:text-text-primary disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Candidat</p>
              <div className="flex items-center gap-2">
                {avatar ? (
                  <img src={avatar} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {candidatName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <p className="font-body text-sm font-semibold text-text-primary">
                  {candidatName}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Email</p>
              <p className="font-body text-sm font-semibold text-text-primary">
                {email}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
            <p className="mb-1 font-body text-xs text-text-muted">Poste</p>
            <p className="font-body text-sm font-semibold text-text-primary">{poste}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Date</p>
              <p className="font-body text-sm font-semibold text-text-primary">
                {formatDate(dateEntretien)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Horaire</p>
              <p className="font-body text-sm font-semibold text-text-primary">
                {formatHeure(dateEntretien, interview.duree)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Type</p>
              <p className="font-body text-sm font-semibold capitalize text-text-primary">
                {String(type).replace("_", " ")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <p className="mb-1 font-body text-xs text-text-muted">Lien visio</p>
              {hasLienVisio ? (
                <a
                  href={lienVisio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-body text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Ouvrir le lien
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              ) : (
                <p className="font-body text-sm font-semibold text-text-primary">-</p>
              )}
            </div>
          </div>

          <div className="flex justify-start">
            {hasLienVisio ? (
              <a
                href={lienVisio}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-dark"
                >
                  <Video size={16} />
                  Rejoindre l'entretien
                </button>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white opacity-50"
              >
                <Video size={16} />
                Lien Meet non disponible
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-bg-soft px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-border bg-white px-5 py-2.5 font-body text-sm font-medium text-text-primary transition-colors hover:bg-bg-soft disabled:opacity-50"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-dark disabled:opacity-60"
          >
            {deleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">
                  progress_activity
                </span>
                Suppression...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">delete</span>
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

InterviewDetailsModal.propTypes = {
  interview: PropTypes.object,
  deleting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

InterviewDetailsModal.defaultProps = {
  interview: null,
  deleting: false,
};
