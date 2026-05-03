import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalBackdrop from "../commun/FondModal";

const EMPTY_FORM = {
  candidatEmail: "",
  candidatNom: "",
  poste: "",
  date: "",
  heureDebut: "",
  type: "visio",
  lienVisio: "",
};

const TYPES_ENTRETIEN = [
  { value: "visio", label: "Visio", icon: "videocam" },
  { value: "telephone", label: "Téléphonique", icon: "phone" },
  { value: "presentiel", label: "Présentiel", icon: "location_on" },
];

export default function CreateInterviewModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const getTodayDateInputValue = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  };

  const buildSelectedDateTime = function (dateValue, timeValue) {
    if (!dateValue || !timeValue) return null;

    const [year, month, day] = dateValue.split("-").map(Number);
    const [hour, minute] = timeValue.split(":").map(Number);

    if (
      !Number.isFinite(year) ||
      !Number.isFinite(month) ||
      !Number.isFinite(day) ||
      !Number.isFinite(hour) ||
      !Number.isFinite(minute)
    ) {
      return null;
    }

    const selected = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (isNaN(selected.getTime())) return null;
    return selected;
  };

  const handleChange = function (e) {
    const { name, value } = e.target;
    setForm(function (prev) {
      return { ...prev, [name]: value };
    });
    setErrors(function (prev) {
      return { ...prev, [name]: "" };
    });
  };

  const validate = function () {
    const errs = {};
    if (!form.candidatEmail) errs.candidatEmail = "Email candidat requis";
    if (
      form.candidatEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.candidatEmail.trim())
    ) {
      errs.candidatEmail = "Format d'email invalide";
    }
    if (!form.date) errs.date = "Date requise";
    if (!form.heureDebut) errs.heureDebut = "Heure de début requise";

    if (form.date && form.heureDebut) {
      const selectedDateTime = buildSelectedDateTime(form.date, form.heureDebut);

      if (!selectedDateTime) {
        errs.date = "Date ou heure invalide";
      } else if (selectedDateTime.getTime() < Date.now()) {
        errs.date = "La date et l'heure ne peuvent pas etre dans le passe";
        errs.heureDebut = "Choisissez une heure future";
      }
    }

    return errs;
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      var duree = 60;

      // Build ISO date
      var dateEntretien = form.date + "T" + form.heureDebut + ":00.000Z";
      var lienVisio = form.lienVisio || "";

      var emailCandidat = form.candidatEmail.trim().toLowerCase();
      var candidatName = form.candidatNom.trim() || emailCandidat;

      var payload = {
        candidatEmail: emailCandidat,
        emailCandidat: emailCandidat,
        email: emailCandidat,
        candidatNom: form.candidatNom.trim(),
        candidatName: candidatName,
        poste: form.poste.trim(),
        dateEntretien: dateEntretien,
        date_entretien: dateEntretien,
        typeEntretien: form.type,
        type_entretien: form.type,
        duree: duree,
        lienVisio: lienVisio,
        lien_visio: lienVisio,
      };

      const response = await onSubmit(payload);
    } catch (err) {
      console.error("Interview submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = function () {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";

  const inputClass = function (field) {
    return inputBase + " " + (errors[field] ? "border-red-300" : "border-border");
  };

  return (
    <>
      <ModalBackdrop>
        <div className="flex max-h-[95vh] w-full animate-scale-in flex-col overflow-y-auto rounded-t-2xl border border-border bg-white md:mx-4 md:max-w-2xl md:rounded-2xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
              <span className="material-symbols-outlined text-xl text-primary">
                calendar_today
              </span>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-tight text-text-primary">
                Programmer un entretien
              </h2>
              <p className="font-body text-xs text-text-muted">
                Planifiez un nouvel entretien avec un candidat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-soft hover:text-text-primary"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-light px-4 py-3">
            <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-base text-primary">
              info
            </span>
            <p className="font-body text-xs leading-relaxed text-text-secondary">
              L'entretien sera automatiquement ajouté au calendrier et le
              candidat recevra un email.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                Candidat <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  mail
                </span>
                <input
                  type="email"
                  name="candidatEmail"
                  value={form.candidatEmail}
                  onChange={handleChange}
                  placeholder="email.candidat@exemple.com"
                  className={inputClass("candidatEmail") + " pl-10"}
                />
              </div>
              {errors.candidatEmail && (
                <p className="mt-1 flex items-center gap-1 font-body text-xs text-red-500">
                  <span className="material-symbols-outlined text-xs">
                    error
                  </span>
                  {errors.candidatEmail}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                Nom candidat
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  person
                </span>
                <input
                  type="text"
                  name="candidatNom"
                  value={form.candidatNom}
                  onChange={handleChange}
                  placeholder="Optionnel"
                  className={inputClass("candidatNom") + " pl-10"}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
              Poste
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  work
                </span>
                <input
                  type="text"
                  name="poste"
                  value={form.poste}
                  onChange={handleChange}
                  placeholder="Intitulé du poste (optionnel)"
                  className={inputClass("poste") + " pl-10"}
                />
              </div>
            </div>


          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
              Date de l'entretien <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                event
              </span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={getTodayDateInputValue()}
                className={inputClass("date") + " pl-10"}
              />
            </div>
            {errors.date && (
              <p className="mt-1 flex items-center gap-1 font-body text-xs text-red-500">
                <span className="material-symbols-outlined text-xs">error</span>
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                Heure de début <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  schedule
                </span>
                <input
                  type="time"
                  name="heureDebut"
                  value={form.heureDebut}
                  onChange={handleChange}
                  className={inputClass("heureDebut") + " pl-10"}
                />
              </div>
              {errors.heureDebut && (
                <p className="mt-1 flex items-center gap-1 font-body text-xs text-red-500">
                  <span className="material-symbols-outlined text-xs">
                    error
                  </span>
                  {errors.heureDebut}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
              Type d'entretien <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {TYPES_ENTRETIEN.map(function (t) {
                const isSelected = form.type === t.value;
                return (
                  <label
                    key={t.value}
                    className={
                      "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 transition-all duration-150 " +
                      (isSelected
                        ? "border-primary bg-primary-light"
                        : "border-border bg-white hover:bg-bg-soft")
                    }
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={
                        "material-symbols-outlined text-lg " +
                        (isSelected ? "text-primary" : "text-text-muted")
                      }
                    >
                      {t.icon}
                    </span>
                    <span
                      className={
                        "font-body text-sm font-medium " +
                        (isSelected ? "text-primary" : "text-text-secondary")
                      }
                    >
                      {t.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

        </form>

        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-border bg-bg-soft px-6 py-4">
          <p className="font-body text-xs text-text-muted">
            <span className="text-red-400">*</span> Champs obligatoires
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-xl border border-border bg-white px-5 py-2.5 font-body text-sm font-medium text-text-primary transition-colors hover:bg-bg-soft disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  Création...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    calendar_add_on
                  </span>
                  Programmer
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </ModalBackdrop>
    </>
  );
}

CreateInterviewModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
