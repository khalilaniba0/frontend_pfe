import React, { useState, useMemo } from "react";
import ManageUsersModal from "../ModalGestionUtilisateurs";
import { useAuth } from "context/ContexteAuth";
import { changeMyPassword } from "service/restApiAuthentification";

export default function SecuriteTab() {
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showManageUsers, setShowManageUsers] = useState(false);

  const passwordStrength = useMemo(
    function () {
      const pwd = passwords.new;
      if (!pwd) return 0;
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
      if (/\d/.test(pwd)) strength++;
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
      return strength;
    },
    [passwords.new]
  );

  const strengthLabels = ["", "Faible", "Moyen", "Bon", "Excellent"];
  const strengthColors = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
  ];

  const handlePasswordChange = function (field, value) {
    setPasswords(function (prev) {
      return { ...prev, [field]: value };
    });
    setSaveSuccess(false);
    setSaveError(null);
  };

  const togglePasswordVisibility = function (field) {
    setShowPasswords(function (prev) {
      return { ...prev, [field]: !prev[field] };
    });
  };

  const handlePasswordSubmit = async function (e) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (!passwords.new) {
      setSaveError("Veuillez saisir un nouveau mot de passe");
      return;
    }
    if (!passwords.current) {
      setSaveError("Veuillez saisir votre mot de passe actuel");
      return;
    }
    if (passwords.new.length < 8) {
      setSaveError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setSaveError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!user?._id) {
      setSaveError("Utilisateur non connecté");
      return;
    }

    setSaving(true);
    try {
      await changeMyPassword(passwords.current, passwords.new);
      setSaveSuccess(true);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ||
          "Erreur lors de la mise à jour du mot de passe"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 pr-10 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Sécurité du compte
        </h2>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Gérez vos accès, mots de passe et sessions actives.
        </p>
      </header>

      <div className="space-y-6">
        {/* Password change section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-text-primary">
            <span className="material-symbols-outlined text-lg text-primary">
              lock
            </span>
            Modifier le mot de passe
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <span className="material-symbols-outlined text-base text-emerald-600">
                  check_circle
                </span>
                <p className="font-body text-xs text-emerald-700">
                  Mot de passe mis à jour avec succès
                </p>
              </div>
            )}

            {saveError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <span className="material-symbols-outlined text-base text-red-500">
                  error
                </span>
                <p className="font-body text-xs text-red-600">{saveError}</p>
              </div>
            )}

            <div className="max-w-md">
              <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={function (e) {
                    handlePasswordChange("current", e.target.value);
                  }}
                  className={inputClasses}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={function () {
                    togglePasswordVisibility("current");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPasswords.current ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={function (e) {
                      handlePasswordChange("new", e.target.value);
                    }}
                    className={inputClasses}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={function () {
                      togglePasswordVisibility("new");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPasswords.new ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-text-primary">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={function (e) {
                      handlePasswordChange("confirm", e.target.value);
                    }}
                    className={inputClasses}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={function () {
                      togglePasswordVisibility("confirm");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPasswords.confirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {passwords.new && (
              <div className="max-w-md">
                <div className="mb-1.5 flex gap-1">
                  {[1, 2, 3, 4].map(function (level) {
                    return (
                      <div
                        key={level}
                        className={
                          "h-1.5 flex-1 rounded-full transition-colors " +
                          (level <= passwordStrength
                            ? strengthColors[passwordStrength]
                            : "bg-gray-200")
                        }
                      ></div>
                    );
                  })}
                </div>
                <p className="font-body text-xs text-text-muted">
                  Force du mot de passe :{" "}
                  <span
                    className={
                      "font-medium " +
                      (passwordStrength >= 3
                        ? "text-emerald-600"
                        : passwordStrength >= 2
                          ? "text-amber-600"
                          : "text-red-500")
                    }
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
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
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Manage users CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary-light p-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined flex-shrink-0 text-xl text-primary">
              info
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm font-medium text-text-primary">
                Besoin de gérer les permissions des utilisateurs ?
              </p>
              <p className="mt-0.5 font-body text-xs text-text-muted">
                Accédez à la page Utilisateurs pour attribuer des rôles et gérer
                les accès.
              </p>
            </div>
            <button
              type="button"
              onClick={function () {
                setShowManageUsers(true);
              }}
              className="flex items-center gap-1 whitespace-nowrap font-body text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Gérer les rôles
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {showManageUsers && (
        <ManageUsersModal onClose={function () { setShowManageUsers(false); }} />
      )}
    </div>
  );
}
