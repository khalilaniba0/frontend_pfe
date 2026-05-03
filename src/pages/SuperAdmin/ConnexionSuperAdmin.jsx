import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import { useSuperAdmin } from "context/ContexteSuperAdmin";

export default function ConnexionSuperAdmin() {
  const { superadmin, isLoading, login } = useSuperAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="h-8 w-8 animate-spin rounded-full" style={{ border: "3px solid var(--color-hairline)", borderTopColor: "var(--color-primary)" }} />
      </div>
    );
  }

  if (superadmin) {
    return <Navigate to={ROUTES.SUPERADMIN.DASHBOARD} replace />;
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(ROUTES.SUPERADMIN.DASHBOARD);
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLeftPanel={false}>
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center rounded-full" style={{ backgroundColor: "var(--color-primary)/10", padding: "6px 12px" }}>
          <span className="font-text text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
            🔒 Espace Super Administrateur
          </span>
        </div>
        <h2
          className="mb-2 font-display font-semibold"
          style={{ fontSize: "34px", lineHeight: 1.47, letterSpacing: "-0.374px", color: "var(--color-ink)" }}
        >
          Espace Super Administrateur
        </h2>
        <p className="m-0 font-text text-[17px] font-normal" style={{ color: "var(--color-ink-muted-80)" }}>
          Accès réservé à l'administration de la plateforme
        </p>
        {error && (
          <p className="apple-error mt-2">{error}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Adresse e-mail</label>
          <input
            type="email"
            placeholder="superadmin@talentia.com"
            value={email}
            onChange={function (e) { setEmail(e.target.value); }}
            required
            className="apple-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={function (e) { setPassword(e.target.value); }}
              required
              autoComplete="current-password"
              className="apple-input pr-10"
            />
            <button
              type="button"
              onClick={function () { setShowPassword(!showPassword); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-0 transition-colors"
              style={{ color: "var(--color-body-muted)" }}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button-primary mt-2"
          style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.LANDING}
          className="font-text text-sm no-underline transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </AuthLayout>
  );
}
