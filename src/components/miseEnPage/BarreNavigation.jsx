import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "constants/routes";
import BrandLogo from "components/commun/LogoMarque.jsx";
import { useAuth } from "context/ContexteAuth";
import { useCandidateAuth } from "context/ContexteAuthCandidat";

function getCandidateDisplayName(candidat) {
  if (!candidat || typeof candidat !== "object") {
    return "Mon compte";
  }

  const prenom = String(candidat?.prenom || "").trim();
  const nom = String(candidat?.nom || "").trim();
  const fullName = `${prenom} ${nom}`.trim();

  if (fullName) return fullName;
  if (nom) return nom;
  if (prenom) return prenom;
  if (candidat?.name) return String(candidat.name);
  if (candidat?.email) return String(candidat.email);

  return "Mon compte";
}

function getAdminDisplayName(user) {
  if (!user || typeof user !== "object") {
    return "Mon compte";
  }

  if (user?.name) return String(user.name);
  if (user?.nom) return String(user.nom);
  if (user?.prenom) return String(user.prenom);
  if (user?.email) return String(user.email);

  return "Mon compte";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { candidat, isAuthenticated: isCandidateAuthenticated } = useCandidateAuth();

  const isLandingPage =
    location.pathname === ROUTES.LANDING || location.pathname === "/";
  const isOffresPage = location.pathname.startsWith(ROUTES.CANDIDATE_OFFRES);
  const isCandidateMenu = isOffresPage && !isLandingPage;

  const isCandidateLoggedIn = Boolean(isCandidateAuthenticated);
  const candidateName = getCandidateDisplayName(candidat);

  const isRhLoggedIn = Boolean(user);
  const adminName = getAdminDisplayName(user);

  const isAuthenticatedForCurrentMenu = isCandidateMenu
    ? isCandidateLoggedIn
    : isRhLoggedIn;
  const displayName = isCandidateMenu ? candidateName : adminName;
  const dashboardRoute = isCandidateMenu
    ? ROUTES.CANDIDATE.SPACE_OFFRES
    : ROUTES.ADMIN.ROOT;
  const loginRoute = isCandidateMenu ? ROUTES.CANDIDATE.LOGIN : ROUTES.PUBLIC.LOGIN;
  const signupRoute = isCandidateMenu ? ROUTES.CANDIDATE.SIGNUP : ROUTES.PUBLIC.SIGNUP;

  useEffect(function () {
    const onScroll = function () {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return function () {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navLinks = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "À propos", href: "#a-propos" },
  ];

  return (
    <nav
      className={
        "fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-all duration-300 md:px-8 " +
        (scrolled
          ? "border-b border-primary/15 bg-white/95 shadow-sm backdrop-blur-xl"
          : "bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <BrandLogo to={ROUTES.LANDING} />

        <div className="hidden items-center gap-8 md:flex">
          {isCandidateMenu ? (
            <Link
              to={ROUTES.LANDING}
              className="font-body text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-primary"
            >
              Espace Entreprise
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.CANDIDATE_OFFRES}
                className="font-body text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-primary"
              >
                offres d'emploi
              </Link>
              {navLinks.map(function (item) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="font-body text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-primary"
                  >
                    {item.label}
                  </a>
                );
              })}
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticatedForCurrentMenu ? (
            <>
              <span className="max-w-[200px] truncate rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm font-medium text-text-primary">
                {displayName}
              </span>
              <Link
                to={dashboardRoute}
                className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] px-5 py-2.5 font-body text-sm font-semibold text-white no-underline shadow-md shadow-primary/30 transition-all duration-150 hover:shadow-lg"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to={loginRoute}
                className="rounded-xl border border-border bg-white px-5 py-2.5 font-body text-sm font-medium text-text-primary no-underline transition-all duration-150 hover:border-primary hover:text-primary"
              >
                Se connecter
              </Link>
              <Link
                to={signupRoute}
                className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] px-5 py-2.5 font-body text-sm font-semibold text-white no-underline shadow-md shadow-primary/30 transition-all duration-150 hover:shadow-lg"
              >
                S'inscrire gratuitement
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border-none bg-transparent text-text-primary transition-colors hover:bg-bg-soft md:hidden"
          onClick={function () {
            setMenuOpen(!menuOpen);
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-primary/10 bg-white/98 px-6 py-6 shadow-lg backdrop-blur-xl md:hidden">
          {isCandidateMenu ? (
            <Link
              to={ROUTES.LANDING}
              onClick={function () {
                setMenuOpen(false);
              }}
              className="font-body text-base text-text-secondary transition-colors hover:text-primary"
            >
              Espace Entreprise
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.CANDIDATE_OFFRES}
                onClick={function () {
                  setMenuOpen(false);
                }}
                className="font-body text-base text-text-secondary transition-colors hover:text-primary"
              >
                Trouver un job
              </Link>
              {navLinks.map(function (item) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={function () {
                      setMenuOpen(false);
                    }}
                    className="font-body text-base text-text-secondary transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                );
              })}
            </>
          )}
          {isAuthenticatedForCurrentMenu ? (
            <>
              <span className="rounded-xl border border-border bg-white px-4 py-3 text-center font-body text-sm font-medium text-text-primary">
                {displayName}
              </span>
              <Link
                to={dashboardRoute}
                onClick={function () {
                  setMenuOpen(false);
                }}
                className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] py-3 text-center font-body text-sm font-semibold text-white no-underline shadow-md"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to={loginRoute}
                onClick={function () {
                  setMenuOpen(false);
                }}
                className="rounded-xl border border-border bg-white px-5 py-3 text-center font-body text-sm font-medium text-text-primary no-underline transition-all hover:border-primary hover:text-primary"
              >
                Se connecter
              </Link>
              <Link
                to={signupRoute}
                onClick={function () {
                  setMenuOpen(false);
                }}
                className="rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5] py-3 text-center font-body text-sm font-semibold text-white no-underline shadow-md"
              >
                S'inscrire gratuitement
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
