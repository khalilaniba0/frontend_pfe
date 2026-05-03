import React, { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import { registerEntreprise } from "service/restApiAuthentification";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    terms: false,
  });

  const handleChange = function (e) {
    const { name, value, type, checked } = e.target;
    setFormData(function (prev) {
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerEntreprise({
        nom: formData.nom,
        email: formData.email,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  // ── Success confirmation view ──
  if (submitted) {
    return (
      <AuthLayout>
        <div className="apple-card p-8 text-center md:p-10">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[var(--rounded-pill)]"
            style={{ backgroundColor: "#e8f4e8" }}
          >
            <svg className="h-10 w-10" style={{ color: "#1d6b1d" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="mb-3 font-display text-[28px] font-semibold" style={{ color: "var(--color-ink)" }}>
            Demande envoyée avec succès !
          </h2>

          <p className="mb-6 font-text text-[17px] font-normal leading-[1.47]" style={{ color: "var(--color-ink-muted-80)" }}>
            Votre demande d'inscription a bien été reçue. Notre équipe va
            l'examiner dans les plus brefs délais. Vous recevrez une
            confirmation dès que votre compte sera activé.
          </p>

          <div className="mx-auto mb-6 rounded-[var(--rounded-sm)] p-4" style={{ backgroundColor: "var(--color-canvas-parchment)", border: "1px solid var(--color-hairline)" }}>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 text-lg" style={{ color: "var(--color-primary)" }}>info</span>
              <p className="font-text text-[14px] leading-relaxed" style={{ color: "var(--color-ink-muted-80)" }}>
                Le processus de validation prend généralement entre 24 et 48
                heures ouvrées. Vous serez notifié par email une fois votre
                compte activé.
              </p>
            </div>
          </div>

          <Link to={ROUTES.LANDING} className="button-primary w-full no-underline">
            Retour à l'accueil
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // ── Registration form view ──
  return (
    <AuthLayout
      leftTitle="Transformez votre gestion des talents"
      leftSubtitle="Rejoignez des milliers de recruteurs qui ont automatisé leur processus de recrutement et amélioré la qualité de leurs embauches."
    >
      <div className="mb-2">
        <h2 className="m-0 font-display font-semibold" style={{ fontSize: "26px", lineHeight: 1.3, letterSpacing: "-0.374px", color: "var(--color-ink)" }}>
          Créer un compte entreprise
        </h2>
        <p className="mt-0.5 font-text text-[14px]" style={{ color: "var(--color-ink-muted-80)" }}>
          Commencez à gérer vos effectifs dès aujourd'hui.
        </p>
        {error && <p className="apple-error mt-1">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label className="apple-label">Nom de l'entreprise</label>
          <input className="apple-input" placeholder="Ex: Acme Corp" required type="text" name="nom" value={formData.nom} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="apple-label">E-mail entreprise</label>
          <input className="apple-input" placeholder="contact@entreprise.com" required type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="apple-label">Nom admin</label>
          <input className="apple-input" placeholder="Prénom Nom" required type="text" name="adminName" value={formData.adminName} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="apple-label">E-mail admin</label>
          <input className="apple-input" placeholder="admin@exemple.com" required type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="apple-label">Mot de passe admin</label>
          <div className="relative">
            <input
              className="apple-input"
              style={{ paddingRight: "48px" }}
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-0"
              style={{ color: "var(--color-ink-muted-48)" }}
              onClick={function () { setShowPassword(!showPassword); }}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-0.5 flex items-start gap-2">
          <input
            className="mt-1 h-4 w-4"
            style={{ accentColor: "var(--color-primary)" }}
            id="terms"
            required
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <label className="font-text text-[12px] leading-4" style={{ color: "var(--color-ink-muted-48)" }} htmlFor="terms">
            En créant un compte, vous acceptez nos{" "}
            <Link to={ROUTES.LANDING} className="text-link font-semibold no-underline">Conditions d'utilisation</Link>{" "}
            et notre{" "}
            <Link to={ROUTES.LANDING} className="text-link font-semibold no-underline">Politique de confidentialité</Link>.
          </label>
        </div>

        <button className="button-primary mt-1 w-full" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer un compte entreprise"}
        </button>
      </form>

      <p className="mt-3 text-center font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
        Vous avez déjà un compte ?{" "}
        <Link to={ROUTES.LOGIN} className="text-link font-semibold no-underline">Connexion</Link>
      </p>
    </AuthLayout>
  );
}
