import React, { useEffect, useState } from "react";
import { useAuth } from "context/ContexteAuth";
import {
  getMyEntreprise,
  resolveEntrepriseMediaUrl,
} from "service/restApiEntreprise";

export default function AdminNavbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const [entrepriseLogo, setEntrepriseLogo] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map(function (n) {
          return n[0];
        })
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD";

  const companyLogoFromUser = resolveEntrepriseMediaUrl(
    user?.entreprise?.logo ||
      user?.company?.logo ||
      user?.logoEntreprise ||
      user?.entrepriseLogo ||
      user?.logo ||
      ""
  );
  const companyLogo = companyLogoFromUser || entrepriseLogo;
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(function () {
    var cancelled = false;

    async function fetchEntrepriseLogo() {
      try {
        var response = await getMyEntreprise();
        var data = response?.data?.data || response?.data;
        if (!cancelled && data?.logo) {
          setEntrepriseLogo(resolveEntrepriseMediaUrl(data.logo));
        }
      } catch {
        if (!cancelled) {
          setEntrepriseLogo("");
        }
      }
    }

    if (!companyLogoFromUser) {
      fetchEntrepriseLogo();
    }

    return function () {
      cancelled = true;
    };
  }, [companyLogoFromUser]);

  useEffect(
    function () {
      setLogoLoadError(false);
    },
    [companyLogo]
  );

  const shouldShowCompanyLogo = Boolean(companyLogo) && !logoLoadError;

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "52px",
        backgroundColor: "var(--color-canvas)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        fontFamily: "var(--font-text)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={function () {
            setSidebarOpen(!sidebarOpen);
          }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[var(--rounded-sm)] border-none bg-transparent transition-colors duration-150 lg:hidden"
          style={{ color: "var(--color-ink)" }}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <div className="hidden items-center gap-2 lg:flex">
          <span
            className="font-text text-[14px]"
            style={{ color: "var(--color-ink-muted-48)" }}
          >
            Bienvenue,
          </span>
          <span
            className="font-text text-[14px] font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {user?.name?.split(" ")[0] || "Utilisateur"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="mx-2 h-5 w-px"
          style={{ backgroundColor: "var(--color-hairline)" }}
        />

        <div className="flex items-center gap-3">
          <div
            className={
              "flex h-10 w-10 items-center justify-center rounded-[var(--rounded-pill)] " +
              (shouldShowCompanyLogo
                ? "overflow-hidden"
                : "font-display text-[12px] font-semibold")
            }
            style={
              shouldShowCompanyLogo
                ? {
                    border: "1px solid var(--color-hairline)",
                    boxShadow: "var(--shadow-product)",
                  }
                : {
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                  }
            }
          >
            {shouldShowCompanyLogo ? (
              <img
                src={companyLogo}
                alt="Logo entreprise"
                className="h-full w-full object-cover"
                onError={function () {
                  setLogoLoadError(true);
                }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="hidden flex-col sm:flex">
            <span
              className="font-text text-[14px] font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {user?.name || "Jane Doe"}
            </span>
            <span
              className="font-text text-[12px]"
              style={{
                color:
                  user?.role === "admin"
                    ? "var(--color-primary)"
                    : "var(--color-ink-muted-48)",
              }}
            >
              {user?.role === "admin" ? "Administrateur" : "Ressources Humaines"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="button-dark-utility ml-2"
          style={{
            background: "transparent",
            color: "var(--color-ink-muted-48)",
          }}
          aria-label="Déconnexion"
          title="Se déconnecter"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>
    </nav>
  );
}
