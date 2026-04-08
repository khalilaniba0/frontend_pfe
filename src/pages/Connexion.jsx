import React, { useContext, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import AuthHero from "components/Sections/HeroAuthentification.jsx";
import { ROUTES } from "constants/routes";
import BrandLogo from "components/commun/LogoMarque.jsx";
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#007BFF] border-t-transparent" />
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
    <AuthLayout>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#d8ecff_0,_#eef4f9_42%,_#f4f7fb_100%)] px-4 py-3 font-body md:px-6 md:py-4">
        <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg md:min-h-[640px]">
          <AuthHero />

          <section className="flex w-full flex-1 items-center justify-center overflow-hidden bg-[#f7fbff] p-4 md:p-6 lg:p-7">
            <div className="w-full max-w-md">
              <Link
                to={ROUTES.LANDING}
                aria-label="Retour a l'accueil"
                className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 no-underline transition-colors hover:border-[#007BFF]/40 hover:text-[#007BFF]"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <BrandLogo to={ROUTES.LANDING} className="mb-5" />

              <div className="mb-5">
                <h2 className="mb-1 font-display text-[1.9rem] font-bold tracking-tight text-[#0f2a47]">
                  Bon retour
                </h2>
                <p className="m-0 font-body text-sm leading-relaxed text-slate-500">
                  Entrez vos identifiants pour accéder au portail de gestion RH.
                </p>
                {registered && (
                  <p className="mt-2 font-body text-sm text-emerald-600">
                    Inscription réussie. Vous pouvez maintenant vous connecter.
                  </p>
                )}
                {error && (
                  <p className="mt-2 font-body text-sm text-red-500">{error}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-sm font-medium text-[#0f2a47]">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={function (e) {
                      setEmail(e.target.value);
                    }}
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 font-body text-sm text-slate-700 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-sm font-medium text-[#0f2a47]">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={function (e) {
                        setPassword(e.target.value);
                      }}
                      required
                      autoComplete="current-password"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-4 pr-12 font-body text-sm text-slate-700 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                    />
                    <button
                      type="button"
                      onClick={function () {
                        setShowPassword(!showPassword);
                      }}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center border-none bg-transparent p-0 text-slate-400 transition-colors hover:text-slate-600"
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
                    className="font-body text-sm font-medium text-[#007BFF] no-underline transition-colors hover:text-[#0062db]"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1.5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-[#007BFF] font-body text-sm font-semibold text-white shadow-md shadow-[#007BFF]/25 transition-all duration-150 hover:bg-[#0062db] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{loading ? "Connexion..." : "Se connecter"}</span>
                  <span className="material-symbols-outlined text-lg">login</span>
                </button>

                <div className="relative my-2 py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#f7fbff] px-3 font-body text-xs text-slate-400">
                      Nouveau sur Talentia ?
                    </span>
                  </div>
                </div>

                <Link
                  to={ROUTES.SIGNUP}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white font-body text-sm font-medium text-[#0f2a47] no-underline transition-all duration-150 hover:border-[#007BFF]/40 hover:bg-[#007BFF]/5"
                >
                  Inscrivez-vous gratuitement
                </Link>
              </form>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-slate-400">
                <span className="material-symbols-outlined text-sm">lock</span>
                <p className="m-0 font-body text-xs">
                  Authentification sécurisée chiffrée AES-256
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AuthLayout>
  );
}
