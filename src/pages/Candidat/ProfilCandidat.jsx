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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
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

  function validatePhotoFile(file) {
    const maxPhotoSize = 2 * 1024 * 1024;
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    const lowerName = file?.name?.toLowerCase() || "";
    const isValidFormat = allowedFormats.includes(file?.type) || 
                          lowerName.endsWith('.png') || 
                          lowerName.endsWith('.jpg') || 
                          lowerName.endsWith('.jpeg');

    if (!isValidFormat) {
      setError("Format non supporté. Utilisez uniquement PNG, JPG ou JPEG.");
      return false;
    }

    if (file.size > maxPhotoSize) {
      setError("Fichier trop volumineux. Maximum 2 Mo.");
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

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccess(false);
    if (!validatePhotoFile(file)) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }

    setError("");
    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (cvFile && !validateCvFile(cvFile)) {
      return;
    }

    if (photoFile && !validatePhotoFile(photoFile)) {
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
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      await mettreAJourProfil(formData);
      await refreshProfile();
      setSuccess(true);
      setCvFile(null);
      setPhotoFile(null);
      setPhotoPreview(null);
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

  const photoUrl = photoPreview || (candidat?.photo_url ? `${apiUrl}/profile-photos/${candidat.photo_url}` : null);

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2">
      <section>
        <h1 className="font-display text-[34px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "-0.374px" }}>
          Mon profil
        </h1>
      </section>

      {/* Avatar + email */}
      <div className="apple-card flex items-center gap-5">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={candidat?.nom || "Profil"}
            className="h-16 w-16 shrink-0 rounded-[var(--rounded-pill)] object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--rounded-pill)] font-display text-xl font-semibold" style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-ink)" }}>
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)", letterSpacing: "0.231px" }}>
            {candidat?.nom || "Candidat"}
          </h2>
          <p className="truncate font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            {candidat?.email || ""}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="apple-card space-y-5"
      >
        {error && (
          <div className="rounded-[var(--rounded-sm)] border px-4 py-3 font-text text-[14px] text-red-700" style={{ borderColor: "#ffc8c4", backgroundColor: "#fff3f2" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-3 font-text text-[14px]" style={{ borderColor: "#bde8bd", backgroundColor: "#e8f4e8", color: "#1d6b1d" }}>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Profil mis à jour avec succès !
          </div>
        )}

        {/* Nom */}
        <div>
          <label className="apple-label">
            Nom complet
          </label>
          <div className="flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--color-canvas)" }}>
            <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "var(--color-ink-muted-48)" }}>person</span>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full border-none bg-transparent p-0 font-text text-[17px] focus:outline-none focus:ring-0"
              style={{ color: "var(--color-ink)" }}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="apple-label">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5 opacity-80" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--color-canvas-parchment)" }}>
            <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "var(--color-ink-muted-48)" }}>mail</span>
            <input
              value={candidat?.email || ""}
              readOnly
              className="w-full border-none bg-transparent p-0 font-text text-[17px] focus:outline-none focus:ring-0"
              style={{ color: "var(--color-ink-muted-48)" }}
            />
          </div>
          <p className="mt-1.5 font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>
            L'email ne peut pas être modifié.
          </p>
        </div>

        {/* Téléphone */}
        <div>
          <label className="apple-label">
            Téléphone
          </label>
          <div className="flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--color-canvas)" }}>
            <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "var(--color-ink-muted-48)" }}>call</span>
            <input
              name="telephone"
              type="tel"
              value={form.telephone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full border-none bg-transparent p-0 font-text text-[17px] placeholder:text-[var(--color-ink-muted-48)] focus:outline-none focus:ring-0"
              style={{ color: "var(--color-ink)" }}
            />
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <label className="apple-label">
            Portfolio / Site web
          </label>
          <div className="flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "var(--color-canvas)" }}>
            <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "var(--color-ink-muted-48)" }}>language</span>
            <input
              name="portfolio_url"
              type="url"
              value={form.portfolio_url}
              onChange={handleChange}
              placeholder="https://monportfolio.com"
              className="w-full border-none bg-transparent p-0 font-text text-[17px] placeholder:text-[var(--color-ink-muted-48)] focus:outline-none focus:ring-0"
              style={{ color: "var(--color-ink)" }}
            />
          </div>
        </div>

        {/* Photo de profil */}
        <div>
          <label className="apple-label">
            Photo de profil
          </label>
          {photoPreview ? (
            <div className="mb-2 flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "#bde8bd", backgroundColor: "#e8f4e8" }}>
              <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "#1d6b1d" }}>image</span>
              <span className="flex-1 truncate font-text text-[14px]" style={{ color: "#1d6b1d" }}>{photoFile?.name}</span>
            </div>
          ) : candidat?.photo_url ? (
            <div className="mb-2 flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "#bde8bd", backgroundColor: "#e8f4e8" }}>
              <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "#1d6b1d" }}>image</span>
              <span className="flex-1 truncate font-text text-[14px]" style={{ color: "#1d6b1d" }}>Photo déjà uploadée</span>
            </div>
          ) : null}
          <label className="upload-zone flex cursor-pointer items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--rounded-sm)]" style={{ backgroundColor: "var(--color-canvas)" }}>
              {photoPreview ? (
                <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--color-primary)" }}>image</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--color-primary)" }}>upload_file</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {photoPreview ? (
                <>
                  <p className="truncate font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>{photoFile?.name}</p>
                  <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>{(photoFile?.size / 1024).toFixed(0)} Ko</p>
                </>
              ) : (
                <>
                  <p className="font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>
                    {candidat?.photo_url ? "Remplacer ma photo" : "Uploader une photo"}
                  </p>
                  <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>PNG, JPG ou JPEG · Max 2 Mo</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* CV Upload */}
        <div>
          <label className="apple-label">
            Mon CV
          </label>
          {candidat?.cv_url && !cvFile && (
            <div className="mb-2 flex items-center gap-2 rounded-[var(--rounded-sm)] border px-4 py-2.5" style={{ borderColor: "#bde8bd", backgroundColor: "#e8f4e8" }}>
              <span className="material-symbols-outlined shrink-0 text-[18px]" style={{ color: "#1d6b1d" }}>description</span>
              <span className="flex-1 truncate font-text text-[14px]" style={{ color: "#1d6b1d" }}>CV déjà uploadé</span>
              <a
                href={`${apiUrl}/cv/${candidat.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link font-text text-[12px] font-semibold"
              >
                Voir mon CV
              </a>
            </div>
          )}
          <label className="upload-zone flex cursor-pointer items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--rounded-sm)]" style={{ backgroundColor: "var(--color-canvas)" }}>
              {cvFile ? (
                <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--color-primary)" }}>task</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--color-primary)" }}>upload_file</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {cvFile ? (
                <>
                  <p className="truncate font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>{cvFile.name}</p>
                  <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>{(cvFile.size / 1024).toFixed(0)} Ko</p>
                </>
              ) : (
                <>
                  <p className="font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>
                    {candidat?.cv_url ? "Remplacer mon CV" : "Uploader mon CV"}
                  </p>
                  <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>PDF uniquement · Max 5 Mo</p>
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
          className="button-primary flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-60"
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