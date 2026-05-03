import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import { resetMotDePasse } from "service/restApiAuthentification";
import { resetMotDePasseCandidat } from "service/restApiCandidatAuth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isCandidatMode = useMemo(function() {
    return location.pathname.includes("candidat");
  }, [location.pathname]);

  const loginRoute = isCandidatMode ? ROUTES.CANDIDATE.LOGIN : ROUTES.LOGIN;
  const forgotRoute = isCandidatMode ? ROUTES.CANDIDATE.FORGOT_PASSWORD : ROUTES.FORGOT_PASSWORD;

  const handleSubmit = async function(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token invalide ou expire.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (isCandidatMode) {
        await resetMotDePasseCandidat(token, password);
      } else {
        await resetMotDePasse(token, password);
      }

      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de reinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div
            className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-[var(--rounded-lg)]"
            style={{ backgroundColor: "var(--color-canvas-parchment)", color: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 className="m-0 font-display font-semibold" style={{ fontSize: "34px", lineHeight: 1.47, letterSpacing: "-0.374px", color: "var(--color-ink)" }}>
            Nouveau mot de passe
          </h1>
          <p className="m-0 font-text text-[17px] font-normal" style={{ color: "var(--color-ink-muted-80)" }}>
            Definissez un nouveau mot de passe pour{" "}
            {isCandidatMode ? "votre espace candidat" : "votre espace RH"}.
          </p>
        </div>

        <div className="apple-card p-6 md:p-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-[var(--rounded-lg)]"
                style={{ backgroundColor: "#e8f4e8", color: "#1d6b1d" }}
              >
                <span className="material-symbols-outlined text-3xl">task_alt</span>
              </div>
              <h2 className="m-0 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>
                Mot de passe reinitialise
              </h2>
              <p className="m-0 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                Votre mot de passe a ete mis a jour avec succes.
              </p>
              <button
                type="button"
                onClick={function() {
                  navigate(loginRoute, { replace: true });
                }}
                className="button-primary w-full mt-4"
              >
                Retour a la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="apple-label" htmlFor="password">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    className="apple-input"
                    id="password"
                    placeholder="Minimum 6 caracteres"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={function(e) {
                      setPassword(e.target.value);
                    }}
                    style={{ paddingRight: "48px" }}
                  />
                  <button
                    type="button"
                    onClick={function() {
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 transition-colors"
                    style={{ color: "var(--color-ink-muted-48)" }}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="apple-label" htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    className="apple-input"
                    id="confirmPassword"
                    placeholder="Retapez votre mot de passe"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={function(e) {
                      setConfirmPassword(e.target.value);
                    }}
                    style={{ paddingRight: "48px" }}
                  />
                  <button
                    type="button"
                    onClick={function() {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 transition-colors"
                    style={{ color: "var(--color-ink-muted-48)" }}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-[var(--rounded-sm)] p-4" style={{ backgroundColor: "var(--color-canvas-parchment)", border: "1px solid var(--color-hairline)" }}>
                  <span className="material-symbols-outlined text-lg" style={{ color: "var(--color-primary)" }}>error</span>
                  <div>
                    <p className="m-0 font-text text-[14px]" style={{ color: "var(--color-ink)" }}>
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={function() {
                        navigate(forgotRoute);
                      }}
                      className="text-link cursor-pointer border-none bg-transparent p-0 font-text text-[14px] font-semibold mt-2"
                    >
                      Redemander un email de reinitialisation
                    </button>
                  </div>
                </div>
              )}

              <button
                className="button-primary w-full mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Mise a jour en cours..." : "Mettre a jour le mot de passe"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-divider-soft)" }}>
            <button
              type="button"
              onClick={function() {
                navigate(loginRoute);
              }}
              className="flex items-center justify-center gap-2 border-none bg-transparent font-text text-[14px] font-normal transition-colors"
              style={{ color: "var(--color-ink-muted-48)", cursor: "pointer" }}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Retour a la connexion</span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
