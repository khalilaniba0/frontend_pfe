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
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
      style={{
        height: "44px",
        backgroundColor: "#ffffff",
        fontFamily: "var(--font-text)",
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-8">
        <BrandLogo to={ROUTES.LANDING} variant="light" />

        <div className="hidden items-center gap-8 md:flex">
          {isCandidateMenu ? (
            <Link
              to={ROUTES.LANDING}
              className="font-text text-[14px] font-normal no-underline transition-colors duration-150"
              style={{ color: "var(--color-body-muted)", letterSpacing: "-0.224px" }}
              onMouseEnter={function (e) { e.target.style.color = "var(--color-primary)"; }}
              onMouseLeave={function (e) { e.target.style.color = "var(--color-body-muted)"; }}
            >
              Espace Entreprise
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.CANDIDATE_OFFRES}
                className="font-text text-[14px] font-normal no-underline transition-colors duration-150"
                style={{ color: "var(--color-body-muted)", letterSpacing: "-0.224px" }}
                onMouseEnter={function (e) { e.target.style.color = "var(--color-primary)"; }}
                onMouseLeave={function (e) { e.target.style.color = "var(--color-body-muted)"; }}
              >
                Offres d'emploi
              </Link>
              {navLinks.map(function (item) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="font-text text-[14px] font-normal no-underline transition-colors duration-150"
                    style={{ color: "var(--color-body-muted)", letterSpacing: "-0.224px" }}
                    onMouseEnter={function (e) { e.target.style.color = "var(--color-primary)"; }}
                    onMouseLeave={function (e) { e.target.style.color = "var(--color-body-muted)"; }}
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
              <span
                className="max-w-[200px] truncate font-text text-[14px] font-normal"
                style={{ color: "var(--color-body-muted)" }}
              >
                {displayName}
              </span>
              <Link to={dashboardRoute} className="button-dark-utility no-underline">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link 
                to={loginRoute} 
                className="button-secondary-navbar no-underline"
              >
                Se connecter
              </Link>
              <Link 
                to={signupRoute} 
                className="button-primary no-underline"
                style={{
                  padding: "8px 18px",
                  fontSize: "14px",
                  fontWeight: 400,
                  borderRadius: "9999px",
                }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-[44px] w-[44px] items-center justify-center border-none bg-transparent transition-colors md:hidden"
          style={{ color: "var(--color-body-muted)" }}
          onClick={function () {
            setMenuOpen(!menuOpen);
          }}
        >
          <svg
            width="20"
            height="20"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="flex flex-col gap-4 px-6 py-6 md:hidden"
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid var(--color-hairline)",
          }}
        >
          {isCandidateMenu ? (
            <Link
              to={ROUTES.LANDING}
              onClick={function () { setMenuOpen(false); }}
              className="font-text text-[14px] no-underline"
              style={{ color: "var(--color-body-muted)" }}
            >
              Espace Entreprise
            </Link>
          ) : (
            <>
              <Link
                to={ROUTES.CANDIDATE_OFFRES}
                onClick={function () { setMenuOpen(false); }}
                className="font-text text-[14px] no-underline"
                style={{ color: "var(--color-body-muted)" }}
              >
                Offres d'emploi
              </Link>
              {navLinks.map(function (item) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={function () { setMenuOpen(false); }}
                    className="font-text text-[14px] no-underline"
                    style={{ color: "var(--color-body-muted)" }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </>
          )}
          {isAuthenticatedForCurrentMenu ? (
            <>
              <span
                className="font-text text-[14px]"
                style={{ color: "var(--color-body-muted)" }}
              >
                {displayName}
              </span>
              <Link
                to={dashboardRoute}
                onClick={function () { setMenuOpen(false); }}
                className="button-dark-utility no-underline text-center"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to={loginRoute}
                onClick={function () { setMenuOpen(false); }}
                className="rounded-xl border border-border bg-white px-5 py-3 text-center font-body text-sm font-medium text-text-primary no-underline transition-all hover:border-primary hover:text-primary"
              >
                Se connecter
              </Link>
              <Link
                to={signupRoute}
                onClick={function () { setMenuOpen(false); }}
                className="button-dark-utility no-underline text-center"
                style={{ background: "var(--color-primary)", color: "#ffffff" }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
