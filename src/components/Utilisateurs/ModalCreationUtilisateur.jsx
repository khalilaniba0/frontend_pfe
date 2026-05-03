import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalBackdrop from "../commun/FondModal";

const EMPTY_FORM = { email: "" };

export default function CreateUserModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Adresse email invalide";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({ email: form.email });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setApiError(null);
    onClose();
  };

  const inputClass = (field) => `w-full rounded-xl border bg-white px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors[field] ? "border-red-300" : "border-border"}`;

  return (
    <ModalBackdrop>
      <div className="flex max-h-[95vh] w-full animate-scale-in flex-col overflow-y-auto rounded-t-2xl border border-border bg-white shadow-2xl md:mx-4 md:max-w-lg md:rounded-2xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
              <span className="material-symbols-outlined text-xl text-primary">mail</span>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-tight text-text-primary">Inviter un membre RH</h2>
              <p className="font-body text-xs text-text-muted">Un email d'invitation sera envoyé</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center text-text-muted transition-colors hover:bg-bg-soft"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 px-6 py-5">
          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-light px-4 py-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="font-body text-xs text-text-secondary">Le membre devra cliquer le lien pour activer son compte.</p>
          </div>
          {apiError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="font-body text-xs text-red-600">{apiError}</p>
            </div>
          )}
          <div>
            <label className="mb-1.5 block font-body text-sm font-medium">Adresse email <span className="text-red-400">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="rh@entreprise.com" className={inputClass("email")} />
            {errors.email && <p className="mt-1 flex items-center gap-1 font-body text-xs text-red-500">{errors.email}</p>}
          </div>
        </form>
        <div className="flex justify-end gap-3 border-t border-border bg-bg-soft px-6 py-4">
          <button type="button" onClick={handleCancel} disabled={submitting} className="rounded-xl border bg-white px-5 py-2">Annuler</button>
          <button type="submit" disabled={submitting} onClick={handleSubmit} className="rounded-xl bg-primary px-5 py-2 text-white">
            {submitting ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
CreateUserModal.propTypes = { onClose: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired };