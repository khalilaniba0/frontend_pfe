import React, { useState, useRef, useEffect } from "react";
import {
  getMyEntreprise,
  updateEntreprise,
  resolveEntrepriseMediaUrl,
} from "service/restApiEntreprise";

export default function EntrepriseTab() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    address: "",
    apropos: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const fileInputRef = useRef(null);

  /* ── Load company data on mount ────────────── */

  useEffect(function () {
    var cancelled = false;

    async function fetchEntreprise() {
      try {
        var res = await getMyEntreprise();
        var data = res?.data?.data || res?.data;

        if (!cancelled && data && typeof data === "object") {
          setFormData({
            name: data.nom || data.name || "",
            website: data.siteWeb || data.website || "",
            email: data.email || "",
            address: data.adresse || data.address || "",
            apropos: data.apropos || "",
          });
          if (data.logo) {
            setLogoPreview(resolveEntrepriseMediaUrl(data.logo));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err?.response?.data?.message ||
              "Erreur de chargement des données de l'entreprise"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEntreprise();

    return function () {
      cancelled = true;
    };
  }, []);

  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData(function (prev) {
      return { ...prev, [name]: value };
    });
    setSaved(false);
    setSaveError(null);
  };

  const handleLogoChange = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoError(null);

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setLogoError("Format non supporté. Utilisez PNG, JPG, SVG ou WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Fichier trop volumineux. Maximum 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setLogoFile(file);
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      var payload = new FormData();
      payload.append("nom", formData.name);
      payload.append("email", formData.email);
      payload.append("adresse", formData.address);
      payload.append("siteWeb", formData.website);
      payload.append("apropos", formData.apropos);
      if (logoFile) {
        payload.append("logo", logoFile);
      }

      var response = await updateEntreprise(payload);
      var updatedData = response?.data?.data || response?.data;

      if (updatedData?.logo) {
        setLogoPreview(resolveEntrepriseMediaUrl(updatedData.logo));
      }

      setLogoFile(null);
      setSaved(true);
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ||
          "Erreur lors de l'enregistrement"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="font-body text-sm text-text-muted">
          Chargement des informations de l'entreprise...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-12 text-center">
        <p className="font-body text-sm text-red-500">{loadError}</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Informations de l'entreprise
        </h2>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Mettez à jour les informations de votre organisation.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              image
            </span>
            Logo de l'entreprise
          </h3>
          <div
            className="group cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-all duration-150 hover:border-primary/50 hover:bg-primary-light/30"
            onClick={function () {
              fileInputRef.current?.click();
            }}
          >
            {logoPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-xl object-contain shadow-sm"
                />
                <p className="font-body text-xs text-text-muted">
                  Cliquez pour changer
                </p>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light transition-transform duration-150 group-hover:scale-110">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    cloud_upload
                  </span>
                </div>
                <p className="font-body text-sm font-medium text-text-primary">
                  Cliquez pour choisir un logo
                </p>
                <p className="mt-1 font-body text-xs text-text-muted">
                  PNG, JPG, SVG ou WebP · Max 2MB
                </p>
              </>
            )}
            {logoError && (
              <p className="mt-3 flex items-center justify-center gap-1 font-body text-xs text-red-500">
                <span className="material-symbols-outlined text-sm">error</span>
                {logoError}
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Organization details */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              business
            </span>
            Détails de l'organisation
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block font-body text-sm font-medium text-text-primary"
              >
                Nom de l'entreprise <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              contact_mail
            </span>
            Coordonnées
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="website"
                className="mb-1.5 block font-body text-sm font-medium text-text-primary"
              >
                Site web
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  language
                </span>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.exemple.com"
                  className={inputClasses + " pl-10"}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-body text-sm font-medium text-text-primary"
              >
                Email de contact
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
                  mail
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@entreprise.com"
                  className={inputClasses + " pl-10"}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block font-body text-sm font-medium text-text-primary"
              >
                Adresse
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-3 text-lg text-text-muted">
                  location_on
                </span>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Numéro, rue, code postal, ville..."
                  className={inputClasses + " resize-none pl-10"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* À propos */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              info
            </span>
            À propos de l'entreprise
          </h3>

          <div>
            <label
              htmlFor="apropos"
              className="mb-1.5 block font-body text-sm font-medium text-text-primary"
            >
              Description
            </label>
            <textarea
              id="apropos"
              name="apropos"
              rows={5}
              value={formData.apropos}
              onChange={handleChange}
              placeholder="Décrivez votre entreprise, votre culture, vos valeurs..."
              className={inputClasses + " resize-none"}
            />
            <p className="mt-1.5 font-body text-xs text-text-muted">
              Ce texte sera visible par les candidats sur vos offres d'emploi.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveError && (
            <span className="flex items-center gap-1.5 font-body text-sm text-red-500">
              <span className="material-symbols-outlined text-base">error</span>
              {saveError}
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 font-body text-sm text-emerald-600">
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              Modifications enregistrées
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-150 hover:bg-primary-dark hover:shadow-lg disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">
                  progress_activity
                </span>
                Enregistrement...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  save
                </span>
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
