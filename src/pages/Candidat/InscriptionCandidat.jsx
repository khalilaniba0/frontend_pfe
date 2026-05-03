import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import AuthLayout from "layouts/MiseEnPageAuth.jsx";
import { ROUTES } from "constants/routes";
import { useCandidateAuth } from "context/ContexteAuthCandidat";
import candidateHero from "assets/candidate_hero.png";

function resolveCandidateRedirect(searchParams) {
  var redirect =
    searchParams.get("redirect") || sessionStorage.getItem("redirectAfterAuth");

  if (!redirect || typeof redirect !== "string" || !redirect.startsWith("/")) {
    return "/candidat/dashboard";
  }

  if (redirect === "/offres") {
    return ROUTES.CANDIDATE.SPACE_OFFRES;
  }

  var offerMatch = redirect.match(/^\/offres\/(.+)$/);
  if (offerMatch) {
    return "/candidat/offres/" + offerMatch[1];
  }

  return redirect;
}

export default function CandidateSignup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useCandidateAuth();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        nom: fullName,
        email,
        motDePasse: password,
      });

      const redirectTo = resolveCandidateRedirect(searchParams);

      sessionStorage.removeItem("redirectAfterAuth");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'inscription. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTitle="Démarrez votre carrière dès maintenant"
      leftSubtitle="Créez votre profil en quelques minutes, postulez aux meilleures offres d'emploi et trouvez le poste qui vous correspond. C'est simple et gratuit."
      customImage={candidateHero}
    >
      <div className="mb-4 flex items-center justify-between">
        <Link to={ROUTES.CANDIDATE_OFFRES} className="text-link text-[14px] no-underline">
          Retour aux offres
        </Link>
      </div>

      <h2
        className="mb-2 font-display"
        style={{
          color: "var(--color-ink)",
          fontSize: "34px",
          lineHeight: 1.47,
          letterSpacing: "-0.374px",
          fontWeight: 600,
        }}
      >
        Creer un compte candidat
      </h2>
      <p className="mb-6 font-text text-[17px]" style={{ color: "var(--color-ink-muted-80)" }}>
        Completez les informations ci-dessous pour commencer.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSignup}>
        {error ? <p className="apple-error m-0">{error}</p> : null}

        <div>
          <label className="apple-label" htmlFor="candidate-full-name">Nom complet</label>
          <input
            id="candidate-full-name"
            type="text"
            value={fullName}
            onChange={function (event) {
              setFullName(event.target.value);
            }}
            placeholder="Jean Dupont"
            className="apple-input"
            required
          />
        </div>

        <div>
          <label className="apple-label" htmlFor="candidate-signup-email">Adresse e-mail</label>
          <input
            id="candidate-signup-email"
            type="email"
            value={email}
            onChange={function (event) {
              setEmail(event.target.value);
            }}
            placeholder="candidat@exemple.com"
            className="apple-input"
            required
          />
        </div>

        <div>
          <label className="apple-label" htmlFor="candidate-signup-password">Mot de passe</label>
          <div className="relative">
            <input
              id="candidate-signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={function (event) {
                setPassword(event.target.value);
              }}
              placeholder="Entrez votre mot de passe"
              className="apple-input"
              style={{ paddingRight: "48px" }}
              required
            />
            <button
              type="button"
              onClick={function () {
                setShowPassword(!showPassword);
              }}
              className="absolute right-2 top-1/2 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center border-none bg-transparent"
              style={{ color: "var(--color-ink-muted-48)" }}
              aria-label="Afficher ou masquer le mot de passe"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="button-primary mt-2 w-full">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Inscription...
            </span>
          ) : (
            "Creer mon compte candidat"
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: "1px solid var(--color-divider-soft)" }} />
        </div>
        <div className="relative flex justify-center">
          <span
            className="px-3 font-text text-[12px]"
            style={{ backgroundColor: "var(--color-canvas)", color: "var(--color-ink-muted-48)" }}
          >
            Deja un compte ?
          </span>
        </div>
      </div>

      <Link
        to={
          searchParams.get("redirect")
            ? `${ROUTES.CANDIDATE_LOGIN}?redirect=${encodeURIComponent(searchParams.get("redirect"))}`
            : ROUTES.CANDIDATE_LOGIN
        }
        className="button-ghost-pill w-full justify-center no-underline"
      >
        Se connecter
      </Link>
    </AuthLayout>
  );
}