import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "constants/routes";
import heroIllustration from "assets/a1.png";

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#F6F4EE", // soft parchment
        paddingTop: "120px",
        paddingBottom: "80px",
        fontFamily: "var(--font-display)",
      }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          {/* Left column: Text & CTAs */}
          <div className="flex flex-col items-start text-left">
            <h1
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 1.07,
                letterSpacing: "-0.28px",
                color: "var(--color-ink)",
              }}
            >
              Le recrutement,
              <span className="block" style={{ marginTop: "8px" }}>
                simplifié à l'essentiel.
              </span>
            </h1>

            <p
              className="mt-6 font-display font-normal max-w-[620px]"
              style={{
                fontSize: "28px",
                lineHeight: 1.14,
                letterSpacing: "0.196px",
                color: "var(--color-body-muted)",
              }}
            >
              Talentia ATS centralise vos candidatures, automatise le suivi et
              accélère vos décisions d'embauche.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link to={ROUTES.SIGNUP} className="button-store-hero no-underline">
                Démarrez gratuitement
              </Link>
              <a
                href="#fonctionnalites"
                className="button-ghost-pill no-underline"
                style={{
                  color: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                  fontSize: "18px",
                  fontWeight: 300,
                  padding: "14px 28px",
                }}
              >
                Découvrir les fonctionnalités
              </a>
            </div>
          </div>

          {/* Right column: Illustration */}
          <div className="mt-8 md:mt-0 flex items-center justify-center">
            <img
              src={heroIllustration}
              alt="Illustration - Talentia overview"
              className="w-full max-w-[680px] h-auto object-contain"
              style={{ filter: "none" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
