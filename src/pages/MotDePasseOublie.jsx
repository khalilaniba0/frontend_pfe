import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import { demanderResetMotDePasse } from "service/restApiAuthentification";
import { demanderResetMotDePasseCandidat } from "service/restApiCandidatAuth";

export default function ForgotPassword({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCandidatMode = useMemo(function() {
    if (mode === "candidat") return true;
    if (mode === "rh") return false;
    return location.pathname.includes("candidat");
  }, [location.pathname, mode]);

  const loginRoute = isCandidatMode ? ROUTES.CANDIDATE.LOGIN : ROUTES.LOGIN;

  const handleSubmit = async function(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isCandidatMode) {
        await demanderResetMotDePasseCandidat(email);
      } else {
        await demanderResetMotDePasse(email);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur reseau. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = function() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(loginRoute, { replace: true });
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
            Mot de passe oublié ?
          </h1>
          <p className="m-0 font-text text-[17px] font-normal" style={{ color: "var(--color-ink-muted-80)" }}>
            Pas d'inquiétude, nous vous enverrons des instructions de
            réinitialisation pour retrouver l'accès à votre{" "}
            {isCandidatMode ? "espace candidat." : "tableau de bord RH."}
          </p>
        </div>

        <div className="apple-card p-6 md:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div
                className="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-[var(--rounded-lg)]"
                style={{ backgroundColor: "#e8f4e8", color: "#1d6b1d" }}
              >
                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              </div>
              <h2 className="m-0 font-display text-[21px] font-semibold" style={{ color: "var(--color-ink)" }}>
                Vérifiez votre boîte de réception
              </h2>
              <p className="m-0 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                Nous avons envoyé les instructions de réinitialisation à{" "}
                <strong style={{ color: "var(--color-ink)" }}>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={function() { setSubmitted(false); setError(""); }}
                className="text-link cursor-pointer border-none bg-transparent font-text text-[14px] font-semibold p-0"
              >
                Vous ne l'avez pas reçu ? Réessayez
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="apple-label" htmlFor="email">Adresse e-mail professionnelle</label>
                <input
                  className="apple-input"
                  id="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={function (e) { setEmail(e.target.value); }}
                />
              </div>
              <button className="button-primary w-full" type="submit" disabled={loading}>
                {loading ? "Envoi en cours..." : "Envoyer les instructions"}
              </button>
              {error ? <p className="apple-error m-0">{error}</p> : null}
            </form>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--color-divider-soft)" }}>
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 border-none bg-transparent font-text text-[14px] font-normal transition-colors"
              style={{ color: "var(--color-ink-muted-48)", cursor: "pointer" }}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Retour à la connexion</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="m-0 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            Besoin d'aide supplémentaire ?{" "}
            <a className="text-link font-semibold no-underline" href="mailto:support@talentia.com">
              Contacter le support
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
