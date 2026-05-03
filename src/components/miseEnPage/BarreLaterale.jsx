import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "context/ContexteAuth";
import { NAV_ITEMS } from "constants/navigation";
import { ROUTES } from "constants/routes";
import BrandLogo from "components/commun/LogoMarque.jsx";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [activeNav, setActiveNav] = React.useState("Tableau de bord");
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = NAV_ITEMS.filter(function (item) {
    return item.roles.includes(user?.role);
  });

  React.useEffect(
    function () {
      const path = location.pathname;
      const found = filteredNavItems
        .filter(function (item) {
          return path === item.path || path.startsWith(item.path + "/");
        })
        .sort(function (a, b) {
          return b.path.length - a.path.length;
        })[0];
      if (found) setActiveNav(found.label);
    },
    [location.pathname, filteredNavItems]
  );

  return (
    <nav
      className={
        "fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 flex-shrink-0 flex-col overflow-y-auto " +
        (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
        " lg:relative lg:translate-x-0 lg:flex"
      }
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "var(--font-text)",
        borderRight: "1px solid var(--color-hairline)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[var(--rounded-pill)] border-none bg-transparent lg:hidden"
          style={{ color: "var(--color-body-muted)" }}
          aria-label="Fermer le menu"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <BrandLogo to={ROUTES.LANDING} variant="light" />
      </div>

      {/* Nav items */}
      <div className="mt-2 flex-1 px-3">
        <ul className="flex list-none flex-col gap-0.5">
          {filteredNavItems.map(function (item) {
            const isActive = activeNav === item.label;
            return (
              <React.Fragment key={item.label}>
                <li>
                  <Link
                    className="group relative flex items-center gap-3 rounded-[var(--rounded-sm)] px-3 py-2.5 font-text text-[14px] transition-all duration-200"
                    style={{
                      color: isActive ? "var(--color-primary)" : "var(--color-body-muted)",
                      backgroundColor: isActive
                        ? "#e8f0fb"
                        : "transparent",
                      letterSpacing: "-0.224px",
                    }}
                    to={item.path}
                    onClick={function () {
                      setActiveNav(item.label);
                      setSidebarOpen(false);
                    }}
                    onMouseEnter={function (e) {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#f5f5f7";
                        e.currentTarget.style.color = "var(--color-ink)";
                      }
                    }}
                    onMouseLeave={function (e) {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--color-body-muted)";
                      }
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      />
                    )}
                    <span className="material-symbols-outlined flex w-5 items-center justify-center text-[20px]">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>

      {/* Admin badge */}
      {user?.role === "admin" && (
        <div
          className="mx-3 mb-4 rounded-[var(--rounded-sm)] p-3"
          style={{
            backgroundColor: "#f5f5f7",
            border: "1px solid var(--color-hairline)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-base"
              style={{ color: "var(--color-primary)" }}
            >
              verified_user
            </span>
            <div>
              <p
                className="font-text text-[12px] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Mode Admin
              </p>
              <p
                className="font-text text-[10px]"
                style={{ color: "var(--color-body-muted)" }}
              >
                Accès complet activé
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
