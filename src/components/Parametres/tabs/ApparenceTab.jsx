import React, { useState } from "react";

export default function ApparenceTab() {
  const [theme, setTheme] = useState("clair");
  const [language, setLanguage] = useState("fr");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = function (e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(function () {
      setSaving(false);
      setSaved(true);
    }, 600);
  };

  const themes = [
    {
      id: "clair",
      label: "Mode clair",
      icon: "light_mode",
      preview: "bg-white",
      previewBar: "bg-gray-200",
    },
    {
      id: "sombre",
      label: "Mode clair (uniquement)",
      icon: "light_mode",
      preview: "bg-gray-50",
      previewBar: "bg-gray-200",
    },
    {
      id: "systeme",
      label: "Mode clair (uniquement)",
      icon: "light_mode",
      preview: "bg-white",
      previewBar: "bg-gray-200",
    },
  ];

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇹🇳" },
  ];

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Apparence
        </h2>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Personnalisez le thème et la langue de la plateforme.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              palette
            </span>
            Thème de l'interface
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map(function (t) {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={function () {
                    setTheme(t.id);
                    setSaved(false);
                  }}
                  className={
                    "group rounded-xl border-2 p-4 text-left transition-all duration-150 " +
                    (isSelected
                      ? "border-primary bg-primary-light shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-bg-soft")
                  }
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={
                        "material-symbols-outlined text-xl transition-colors " +
                        (isSelected ? "text-primary" : "text-text-muted")
                      }
                    >
                      {t.icon}
                    </span>
                    <span
                      className={
                        "font-body text-sm font-medium " +
                        (isSelected ? "text-primary" : "text-text-primary")
                      }
                    >
                      {t.label}
                    </span>
                  </div>
                  <div
                    className={
                      "flex h-14 items-center justify-center overflow-hidden rounded-lg border transition-transform duration-150 group-hover:scale-[1.02] " +
                      t.preview +
                      (isSelected ? " border-primary/30" : " border-border")
                    }
                  >
                    <div className={"h-2 w-10 rounded-full " + t.previewBar}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              translate
            </span>
            Langue
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {languages.map(function (lang) {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={function () {
                    setLanguage(lang.code);
                    setSaved(false);
                  }}
                  className={
                    "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-150 " +
                    (isSelected
                      ? "border-primary bg-primary-light"
                      : "border-border hover:border-primary/30 hover:bg-bg-soft")
                  }
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span
                    className={
                      "font-body text-sm font-medium " +
                      (isSelected ? "text-primary" : "text-text-primary")
                    }
                  >
                    {lang.label}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined ml-auto text-base text-primary">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 font-body text-sm text-emerald-600">
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              Préférences enregistrées
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
