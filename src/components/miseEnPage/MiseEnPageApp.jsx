import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "components/commun/LogoMarque.jsx";
import { ROUTES } from "constants/routes";

/**
 * Universal App Layout Component
 * Manages the complete dashboard structure:
 * - Sidebar navigation (fixed left, responsive hamburger on mobile)
 * - Topbar with title, date, user info
 * - Content area (scrollable)
 * - White/light background throughout (no dark mode)
 */
export default function MiseEnPageApp({
  navItems = [],
  userLabel = "User",
  userRole = "User",
  userAvatar,
  onLogout = () => {},
  pageTitle = "Dashboard",
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("");

  // Determine active nav item based on current path
  useMemo(() => {
    const path = location.pathname;
    const found = navItems
      .filter((item) => path === item.path || path.startsWith(item.path + "/"))
      .sort((a, b) => b.path.length - a.path.length)[0];
    if (found) setActiveNav(found.label);
  }, [location.pathname, navItems]);

  // Get current date
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="flex h-[100dvh] overflow-hidden"
      style={{ backgroundColor: "var(--color-canvas-parchment)" }}
    >
      {/* ── Mobile overlay ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────── */}
      <nav
        className={
          "fixed inset-y-0 left-0 z-40 w-[240px] transform transition-transform duration-300 flex-shrink-0 flex-col overflow-y-auto " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " lg:relative lg:translate-x-0 lg:flex"
        }
        style={{
          backgroundColor: "var(--color-canvas)",
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
            {navItems.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <li key={item.label}>
                  <Link
                    className="group relative flex items-center gap-3 rounded-[var(--rounded-sm)] px-3 py-2.5 font-text text-[14px] transition-all duration-200 no-underline"
                    style={{
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-body-muted)",
                      backgroundColor: isActive ? "#e8f0fb" : "transparent",
                      letterSpacing: "-0.224px",
                    }}
                    to={item.path}
                    onClick={() => {
                      setActiveNav(item.label);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.icon && (
                      <span
                        className="material-symbols-outlined text-[20px] transition-colors duration-200"
                        style={{
                          color: isActive
                            ? "var(--color-primary)"
                            : "var(--color-body-muted)",
                        }}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User info + Logout */}
        <div
          className="border-t p-4"
          style={{ borderColor: "var(--color-hairline)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <div
                className="font-text text-[14px] font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {userLabel}
              </div>
              <div
                className="font-text text-[12px]"
                style={{ color: "var(--color-body-muted)" }}
              >
                {userRole}
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[var(--rounded-sm)] border-none bg-transparent transition-colors hover:bg-white"
              style={{ color: "var(--color-body-muted)" }}
              aria-label="Déconnexion"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main area ──────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex h-[60px] items-center justify-between border-b px-4 md:px-6 lg:px-8"
          style={{
            backgroundColor: "var(--color-canvas)",
            borderColor: "var(--color-hairline)",
            fontFamily: "var(--font-text)",
          }}
        >
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-[var(--rounded-pill)] border-none bg-transparent lg:hidden"
              style={{ color: "var(--color-body-muted)" }}
              aria-label="Ouvrir le menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1
              className="font-display text-[20px] font-semibold hidden sm:block"
              style={{ color: "var(--color-ink)" }}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Center: Date */}
          <div
            className="font-text text-[14px] hidden md:block"
            style={{ color: "var(--color-body-muted)" }}
          >
            {currentDate}
          </div>

          {/* Right: User avatar */}
          {userAvatar && (
            <div
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[var(--rounded-pill)] font-text text-[12px] font-semibold"
              style={{
                backgroundColor: "#e8f0fb",
                color: "var(--color-primary)",
              }}
            >
              {userAvatar}
            </div>
          )}
        </header>

        {/* Content area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "var(--color-canvas-parchment)" }}
        >
          <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
