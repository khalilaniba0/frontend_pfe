import React, { useState } from "react";
import { useCandidateAuth } from "context/ContexteAuthCandidat";
import { mettreAJourProfil } from "service/restApiCandidat";
import { API_URL } from "config/api";

export default function CandidateProfile() {
  const { candidat, refreshProfile } = useCandidateAuth();
  const apiUrl = API_URL;

  const [form, setForm] = useState({
    nom: candidat?.nom || "",
    telephone: candidat?.telephone || "",
    portfolio_url: candidat?.portfolio_url || "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setError("");
    setSuccess(false);
  }

  function validateCvFile(file) {
    const maxCvSize = 5 * 1024 * 1024;
    const lowerName = file?.name?.toLowerCase() || "";
    const isPdf = file?.type === "application/pdf" || lowerName.endsWith(".pdf");

    if (!isPdf) {
      setError("Format non supporte. Utilisez uniquement un fichier PDF.");
      return false;
    }

    if (file.size > maxCvSize) {
      setError("Fichier trop volumineux. Maximum 5 Mo.");
      return false;
    }

    return true;
  }

  function handleCvChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccess(false);
    if (!validateCvFile(file)) {
      setCvFile(null);
      return;
    }

    setError("");
    setCvFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (cvFile && !validateCvFile(cvFile)) {
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("telephone", form.telephone);
      formData.append("portfolio_url", form.portfolio_url);
      if (cvFile) {
        formData.append("cv_url", cvFile);
      }
      await mettreAJourProfil(formData);
      await refreshProfile();
      setSuccess(true);
      setCvFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Erreur lors de la mise à jour."
      );
    } finally {
      setSaving(false);
    }
  }

  const initials = (candidat?.nom || "C")
    .split(" ")
    .map(function (w) {
      return w[0];
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2">
      <section>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Mon profil
        </h1>
      </section>

      {/* Avatar + email */}
      <div className="flex items-center gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary font-display text-xl font-bold text-white shadow-md">
          {initials}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-bold text-text-primary">
            {candidat?.nom || "Candidat"}
          </h2>
          <p className="truncate font-body text-sm text-text-secondary">
            {candidat?.email || ""}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-700">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Profil mis à jour avec succès !
          </div>
        )}

        {/* Nom */}
        <div>
          <label className="mb-1.5 block font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Nom complet
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-page px-4 py-2.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined shrink-0 text-[18px] text-text-muted">person</span>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border-none bg-transparent p-0 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="mb-1.5 block font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-page px-4 py-2.5 opacity-70">
            <span className="material-symbols-outlined shrink-0 text-[18px] text-text-muted">mail</span>
            <input
              value={candidat?.email || ""}
              readOnly
              className="w-full border-none bg-transparent p-0 font-body text-sm text-text-secondary focus:outline-none focus:ring-0"
            />
          </div>
          <p className="mt-1.5 font-body text-xs text-text-muted">
            L'email ne peut pas être modifié.
          </p>
        </div>

        {/* Téléphone */}
        <div>
          <label className="mb-1.5 block font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Téléphone
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-page px-4 py-2.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined shrink-0 text-[18px] text-text-muted">call</span>
            <input
              name="telephone"
              type="tel"
              value={form.telephone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full border-none bg-transparent p-0 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <label className="mb-1.5 block font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Portfolio / Site web
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-page px-4 py-2.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined shrink-0 text-[18px] text-text-muted">language</span>
            <input
              name="portfolio_url"
              type="url"
              value={form.portfolio_url}
              onChange={handleChange}
              placeholder="https://monportfolio.com"
              className="w-full border-none bg-transparent p-0 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* CV Upload */}
        <div>
          <label className="mb-1.5 block font-body text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Mon CV
          </label>
          {candidat?.cv_url && !cvFile && (
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
              <span className="material-symbols-outlined shrink-0 text-[18px] text-emerald-600">description</span>
              <span className="flex-1 truncate font-body text-sm text-emerald-700">CV déjà uploadé</span>
              <a
                href={`${apiUrl}/cv/${candidat.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs font-semibold text-emerald-700 hover:underline"
              >
                Voir mon CV
              </a>
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-bg-page px-4 py-4 transition-colors hover:border-primary hover:bg-primary/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
              {cvFile ? (
                <span className="material-symbols-outlined text-[20px] text-primary">task</span>
              ) : (
                <span className="material-symbols-outlined text-[20px] text-primary">upload_file</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {cvFile ? (
                <>
                  <p className="truncate font-body text-sm font-semibold text-text-primary">{cvFile.name}</p>
                  <p className="font-body text-xs text-text-muted">{(cvFile.size / 1024).toFixed(0)} Ko</p>
                </>
              ) : (
                <>
                  <p className="font-body text-sm font-semibold text-text-primary">
                    {candidat?.cv_url ? "Remplacer mon CV" : "Uploader mon CV"}
                  </p>
                  <p className="font-body text-xs text-text-muted">PDF uniquement · Max 5 Mo</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleCvChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Sauvegarde…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              Sauvegarder les modifications
            </>
          )}
        </button>
      </form>
    </div>
  );
}