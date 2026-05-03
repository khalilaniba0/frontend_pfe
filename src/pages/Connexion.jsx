import React, { useContext, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import AuthContext from "context/ContexteAuth";

export default function Login() {
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registered = useMemo(function () {
    return new URLSearchParams(location.search).get("registered") === "true";
  }, [location.search]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="h-8 w-8 animate-spin rounded-full" style={{ border: "3px solid var(--color-hairline)", borderTopColor: "var(--color-primary)" }} />
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect, ou compte bloqué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTitle="Pilotez votre recrutement avec précision"
      leftSubtitle="Simplifiez votre processus de recrutement, gérez vos candidatures et trouvez les meilleurs talents pour votre organisation."
    >
      <div className="mb-6">
        <h2
          className="mb-2 font-display font-semibold"
          style={{ fontSize: "34px", lineHeight: 1.47, letterSpacing: "-0.374px", color: "var(--color-ink)" }}
        >
          Bon retour
        </h2>
        <p className="m-0 font-text text-[17px] font-normal" style={{ color: "var(--color-ink-muted-80)" }}>
          Entrez vos identifiants pour accéder au portail de gestion RH.
        </p>
        {registered && (
          <p className="mt-2 font-text text-[14px]" style={{ color: "#1d6b1d" }}>
            Inscription réussie. Vous pouvez maintenant vous connecter.
          </p>
        )}
        {error && (
          <p className="apple-error mt-2">{error}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="apple-label">Adresse e-mail</label>
          <input
            type="email"
            placeholder="name@company.com"
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
              className="apple-input"
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              onClick={function () { setShowPassword(!showPassword); }}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 transition-colors"
              style={{ color: "var(--color-ink-muted-48)" }}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-link font-text text-[14px] font-normal"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button-primary mt-2 w-full"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="relative my-2 py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: "1px solid var(--color-divider-soft)" }} />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-3 font-text text-[12px]"
              style={{ backgroundColor: "var(--color-canvas)", color: "var(--color-ink-muted-48)" }}
            >
              Nouveau sur Talentia ?
            </span>
          </div>
        </div>

        <Link
          to={ROUTES.SIGNUP}
          className="button-ghost-pill w-full text-center no-underline"
        >
          Inscrivez-vous gratuitement
        </Link>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5" style={{ color: "var(--color-ink-muted-48)" }}>
        <span className="material-symbols-outlined text-[14px]">lock</span>
        <p className="m-0 font-text text-[12px]" style={{ letterSpacing: "-0.12px" }}>
          Authentification sécurisée chiffrée AES-256
        </p>
      </div>
    </AuthLayout>
  );
}
