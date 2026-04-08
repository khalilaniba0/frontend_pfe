import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { createOffre } from "service/restApiOffresEntreprise";

const CONTRACT_TYPES = ["CDI", "CDD", "Stage", "Freelance"];

const WORK_MODES = [
  { label: "Présentiel", value: "presentiel" },
  { label: "Remote", value: "remote" },
  { label: "Hybride", value: "hybride" },
];

const EXPERIENCE_LEVELS = [
  { label: "Débutant (0 an)", value: "0" },
  { label: "Junior (1-2 ans)", value: "1" },
  { label: "Confirmé (3-4 ans)", value: "3" },
  { label: "Senior (5-7 ans)", value: "5" },
  { label: "Expert (8+ ans)", value: "8" },
];

const EDUCATION_LEVELS = [
  "Bac",
  "Bac+2",
  "Bac+3",
  "Bac+5",
  "Doctorat",
  "Non spécifié",
];

const EMPTY_FORM = {
  poste: "",
  typeContrat: "",
  modeContrat: "hybride",
  niveauExperience: "",
  niveauEducation: "Non spécifié",
  langues: [],
  description: "",
  exigences: [],
};

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function extractId(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value._id || value.id || null;
  }

  return null;
}

export default function CreateJobModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    document.body.style.overflow = "hidden";
    return function () {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = function (e) {
    const { name, value } = e.target;
    setForm(function (prev) {
      return { ...prev, [name]: value };
    });
    setError(null);
    setErrors(function (prev) {
      return { ...prev, [name]: "" };
    });
  };

  const handleAddSkill = function () {
    const trimmed = skillInput.trim();
    if (trimmed && !form.exigences.includes(trimmed)) {
      setForm(function (prev) {
        return { ...prev, exigences: [...prev.exigences, trimmed] };
      });
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = function (skill) {
    setForm(function (prev) {
      return {
        ...prev,
        exigences: prev.exigences.filter(function (s) {
          return s !== skill;
        }),
      };
    });
  };

  const handleAddLanguage = function () {
    const trimmed = languageInput.trim();
    if (!trimmed) {
      return;
    }

    const normalized = trimmed.toLowerCase();
    const alreadyExists = form.langues.some(function (lang) {
      return String(lang).toLowerCase() === normalized;
    });

    if (!alreadyExists) {
      setForm(function (prev) {
        return { ...prev, langues: [...prev.langues, trimmed] };
      });
    }

    setLanguageInput("");
  };

  const handleLanguageKeyDown = function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  const handleRemoveLanguage = function (langToRemove) {
    setForm(function (prev) {
      return {
        ...prev,
        langues: prev.langues.filter(function (lang) {
          return lang !== langToRemove;
        }),
      };
    });
  };

  const validate = function () {
    const errs = {};
    if (!form.poste.trim() || form.poste.trim().length < 3) {
      errs.poste = "Le titre doit contenir au moins 3 caractères";
    }
    if (!form.typeContrat) {
      errs.typeContrat = "Veuillez sélectionner un type de contrat";
    }
    if (!form.description.trim() || form.description.trim().length < 20) {
      errs.description = "La description doit contenir au moins 20 caractères";
    }
    return errs;
  };

  const handleSubmit = async function (e) {
    e?.preventDefault?.();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedUser = readStoredUser();
      const entrepriseId =
        extractId(storedUser?.entreprise) ||
        extractId(storedUser?.entrepriseId) ||
        extractId(storedUser?.company) ||
        extractId(storedUser?.companyId);
      const responsableId = extractId(storedUser?._id || storedUser?.id);
      const modeTravail =
        WORK_MODES.find(function (mode) {
          return mode.value === form.modeContrat;
        })?.label || form.modeContrat;

      const payload = {
        poste: form.poste.trim(),
        titre: form.poste.trim(),
        description: form.description.trim(),
        exigences: form.exigences,
        typeContrat: form.typeContrat,
        modeContrat: form.modeContrat,
        modeTravail,
        niveauExperience: form.niveauExperience,
        niveauEducation: form.niveauEducation,
        langues: form.langues,
        langue: form.langues.join(", "),
      };

      if (entrepriseId) {
        payload.entreprise = entrepriseId;
      }

      if (responsableId) {
        payload.responsable = responsableId;
      }

      const res = await createOffre(payload);
      const createdOffre = res?.data?.data || res?.data;
      if (typeof onSuccess === "function") onSuccess(createdOffre);
      if (typeof onClose === "function") onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de la publication de l'offre"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = function () {
    setForm(EMPTY_FORM);
    setSkillInput("");
    setLanguageInput("");
    setErrors({});
    setError(null);
    onClose();
  };

  const inputClass = function (field) {
    const base =
      "w-full rounded-lg border px-3 py-2 text-sm font-body outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 focus:border-primary";
    return base + " " + (errors[field] ? "border-red-300" : "border-border");
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center">
      <div
        className="flex w-full max-h-[95vh] animate-scale-in flex-col rounded-t-2xl bg-white shadow-2xl md:mx-4 md:max-w-2xl md:rounded-2xl"
        style={{ maxHeight: "95vh" }}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
              <span className="material-symbols-outlined text-xl text-primary">
                work
              </span>
            </div>
            <div>
              <h2 className="font-display text-base font-semibold leading-tight text-text-primary">
                Créer une offre d'emploi
              </h2>
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

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {/* Row 1: Titre du poste */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-text-primary">
                Titre du poste <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="poste"
                value={form.poste}
                onChange={handleChange}
                placeholder="Ex : Développeur Full-Stack"
                className={inputClass("poste")}
              />
              {errors.poste && (
                <p className="mt-1 text-xs text-red-500">{errors.poste}</p>
              )}
            </div>
          </div>

          {/* Row 2: Type de contrat */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-text-primary">
                Type de contrat <span className="text-red-400">*</span>
              </label>
              <select
                name="typeContrat"
                value={form.typeContrat}
                onChange={handleChange}
                className={inputClass("typeContrat")}
              >
                <option value="">Sélectionner...</option>
                {CONTRACT_TYPES.map(function (ct) {
                  return (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  );
                })}
              </select>
              {errors.typeContrat && (
                <p className="mt-1 text-xs text-red-500">{errors.typeContrat}</p>
              )}
            </div>
          </div>

          {/* Row 3: Mode de travail */}
          <div>
            <label className="mb-1 block font-display text-sm font-medium text-text-primary">
              Mode de travail <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {WORK_MODES.map(function (mode) {
                return (
                  <label
                    key={mode.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="modeContrat"
                      value={mode.value}
                      checked={form.modeContrat === mode.value}
                      onChange={handleChange}
                      className="accent-primary"
                    />
                    <span className="font-body text-sm text-text-primary">
                      {mode.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Row 4: Experience */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-text-primary">
                Niveau d'expérience
              </label>
              <select
                name="niveauExperience"
                value={form.niveauExperience}
                onChange={handleChange}
                className={inputClass("niveauExperience")}
              >
                <option value="">Sélectionner...</option>
                {EXPERIENCE_LEVELS.map(function (level) {
                  return (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Row 5: Education + Langues */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-text-primary">
                Niveau d'éducation
              </label>
              <select
                name="niveauEducation"
                value={form.niveauEducation}
                onChange={handleChange}
                className={inputClass("niveauEducation")}
              >
                {EDUCATION_LEVELS.map(function (level) {
                  return (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-text-primary">
                Langues
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={function (e) {
                    setLanguageInput(e.target.value);
                  }}
                  onKeyDown={handleLanguageKeyDown}
                  placeholder="Ex : Français"
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-body outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 font-display text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Ajouter
                </button>
              </div>
              {form.langues.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.langues.map(function (lang) {
                    return (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-2.5 py-1 font-display text-xs font-medium text-secondary"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={function () {
                            handleRemoveLanguage(lang);
                          }}
                          className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-secondary/20"
                        >
                          <span className="material-symbols-outlined text-xs">
                            close
                          </span>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="mb-1 block font-display text-sm font-medium text-text-primary">
              Description du poste <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez le poste, les responsabilités..."
              className={inputClass("description") + " resize-none"}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Row 7: Compétences */}
          <div>
            <label className="mb-1 block font-display text-sm font-medium text-text-primary">
              Compétences requises
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={function (e) {
                  setSkillInput(e.target.value);
                }}
                onKeyDown={handleSkillKeyDown}
                placeholder="Ex : React, Node.js..."
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-body outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 font-display text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Ajouter
              </button>
            </div>
            {form.exigences.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.exigences.map(function (skill) {
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 font-display text-xs font-medium text-primary"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={function () {
                          handleRemoveSkill(skill);
                        }}
                        className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-primary/20"
                      >
                        <span className="material-symbols-outlined text-xs">
                          close
                        </span>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-border px-6 py-4">
          <p className="font-body text-xs text-text-muted">
            <span className="text-red-400">*</span> Champs obligatoires
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2 font-display font-medium text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-display font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">
                    progress_activity
                  </span>
                  Création...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    work
                  </span>
                  Publier l'offre
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

CreateJobModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};
