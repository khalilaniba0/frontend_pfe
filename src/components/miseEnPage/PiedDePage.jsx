import React from "react";
import { ROUTES } from "constants/routes";
import BrandLogo from "components/commun/LogoMarque.jsx";

const footerLinks = {
  Produit: ["Fonctionnalités", "Pipeline Kanban", "Analytics", "Tarifs"],
  Entreprise: ["À propos", "Contact", "Confidentialité", "CGU"],
};

const socialIcons = [
  { label: "LinkedIn", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Twitter", d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
  { label: "GitHub", d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
];

export default function Footer() {
  return (
    <footer
      id="a-propos"
      className="scroll-mt-28"
      style={{
        backgroundColor: "var(--color-canvas-parchment)",
        fontFamily: "var(--font-text)",
        padding: "64px 32px",
      }}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Top grid */}
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <BrandLogo to={ROUTES.LANDING} />

            <p
              className="max-w-[200px] font-text text-[17px] font-normal leading-[2.41]"
              style={{ color: "var(--color-ink-muted-80)" }}
            >
              La plateforme ATS nouvelle génération pour les équipes RH modernes.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socialIcons.map((s, i) => (
                <button
                  key={i}
                  title={s.label}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[var(--rounded-sm)] border-none transition-colors"
                  style={{
                    backgroundColor: "var(--color-canvas)",
                    border: "1px solid var(--color-hairline)",
                    color: "var(--color-ink-muted-48)",
                  }}
                  onMouseEnter={function (e) {
                    e.currentTarget.style.color = "var(--color-primary)";
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                  }}
                  onMouseLeave={function (e) {
                    e.currentTarget.style.color = "var(--color-ink-muted-48)";
                    e.currentTarget.style.borderColor = "var(--color-hairline)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={s.d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h5
                className="mb-4 font-text text-[14px] font-semibold"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.224px" }}
              >
                {category}
              </h5>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="border-none bg-transparent p-0 font-text text-[17px] font-normal transition-colors"
                      style={{
                        color: "var(--color-ink-muted-80)",
                        lineHeight: "2.41",
                        cursor: "pointer",
                      }}
                      onMouseEnter={function (e) {
                        e.currentTarget.style.color = "var(--color-primary)";
                      }}
                      onMouseLeave={function (e) {
                        e.currentTarget.style.color = "var(--color-ink-muted-80)";
                      }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal line */}
        <div
          className="pt-6"
          style={{ borderTop: "1px solid var(--color-hairline)" }}
        >
          <p
            className="font-text text-[12px] font-normal"
            style={{ color: "var(--color-ink-muted-48)", letterSpacing: "-0.12px" }}
          >
            © {new Date().getFullYear()} Talentia. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
