import React from "react";
import PropTypes from "prop-types";
import ModalBackdrop from "../commun/FondModal";
import { API_URL } from "config/api";

var ENTRETIEN_TYPES = ["Présentiel", "Visio", "Téléphone"];

function getNowDateTimeLocalValue() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");
  var hour = String(now.getHours()).padStart(2, "0");
  var minute = String(now.getMinutes()).padStart(2, "0");

  return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
}

function parseDateTimeLocalValue(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  var parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export default function EntretienModal({ candidate, onConfirm, onCancel }) {
  var dateState = React.useState("");
  var dateEntretien = dateState[0];
  var setDateEntretien = dateState[1];

  var typeState = React.useState(ENTRETIEN_TYPES[0]);
  var typeEntretien = typeState[0];
  var setTypeEntretien = typeState[1];

  var errorState = React.useState("");
  var formError = errorState[0];
  var setFormError = errorState[1];

  function handleConfirm() {
    if (!dateEntretien) {
      setFormError("Veuillez sélectionner la date et l'heure de l'entretien.");
      return;
    }

    var parsedDate = parseDateTimeLocalValue(dateEntretien);
    if (!parsedDate) {
      setFormError("Date et heure invalides.");
      return;
    }

    if (parsedDate.getTime() < Date.now()) {
      setFormError("Impossible de planifier un entretien dans le passé.");
      return;
    }

    if (!typeEntretien) {
      setFormError("Veuillez sélectionner le type d'entretien.");
      return;
    }

    setFormError("");
    onConfirm(dateEntretien, typeEntretien);
  }

  if (!candidate) return null;

  var candidateName = candidate.name || candidate.nom || "Candidat";
  var photoUrl = candidate.photo_url || candidate.candidat?.photo_url;
  var avatar = photoUrl ? `${API_URL}/profile-photos/${photoUrl}` : null;

  return (
    <ModalBackdrop onClose={onCancel}>
      <div
        className="relative w-full rounded-t-2xl border border-border bg-white shadow-2xl md:max-w-[520px] md:rounded-2xl"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Planifier un entretien
          </h2>
          <div className="mt-1 flex items-center gap-2">
            {avatar ? (
              <img src={avatar} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {candidateName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <p className="font-body text-sm text-text-secondary">
              {candidateName}
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label
              htmlFor="entretien-date"
              className="mb-2 block font-body text-sm font-medium text-text-primary"
            >
              Date et heure de l'entretien
            </label>
            <input
              id="entretien-date"
              type="datetime-local"
              value={dateEntretien}
              onChange={function (e) {
                setDateEntretien(e.target.value);
                setFormError("");
              }}
              min={getNowDateTimeLocalValue()}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="entretien-type"
              className="mb-2 block font-body text-sm font-medium text-text-primary"
            >
              Type d'entretien
            </label>
            <select
              id="entretien-type"
              value={typeEntretien}
              onChange={function (e) {
                setTypeEntretien(e.target.value);
                setFormError("");
              }}
              className="w-full appearance-none rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm text-text-primary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ENTRETIEN_TYPES.map(function (option) {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-600">
              {formError}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-all hover:bg-bg-soft"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-body text-sm font-medium text-white shadow-md transition-all hover:bg-primary-dark"
          >
            <span className="material-symbols-outlined text-lg">check</span>
            Confirmer
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

EntretienModal.propTypes = {
  candidate: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
