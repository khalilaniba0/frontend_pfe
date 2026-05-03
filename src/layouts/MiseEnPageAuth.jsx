import React from "react";
import { ROUTES } from "constants/routes";
import BrandLogo from "components/commun/LogoMarque.jsx";
import AuthHero from "components/Sections/HeroAuthentification.jsx";

/**
 * Unified Auth Layout Component
 * Manages the complete auth page structure:
 * - 2-column layout (illustration left, form right on desktop)
 * - Logo Talentia at top
 * - White background throughout
 * - Responsive: illustration hidden on mobile, form full-width
 */
export default function AuthLayout({ children, showLeftPanel = true, leftTitle, leftSubtitle, customImage }) {
  return (
    <div
      className="flex h-[100dvh] flex-col"
      style={{ backgroundColor: "var(--color-canvas)", fontFamily: "var(--font-text)" }}
    >
      <main className="flex h-full w-full flex-1 overflow-hidden">
        {/* Left column: Illustration (hidden on mobile) */}
        {showLeftPanel && <AuthHero title={leftTitle} subtitle={leftSubtitle} customImage={customImage} />}

        {/* Right column: Form section */}
        <section
          className={`flex h-full w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-4 md:px-8 ${!showLeftPanel ? "md:w-full" : ""}`}
          style={{ backgroundColor: "var(--color-canvas)" }}
        >
          <div className="flex h-full w-full max-w-md flex-col justify-center">
            {/* Logo */}
            <BrandLogo to={ROUTES.LANDING} className="mb-4" />

            {/* Children: Form content */}
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
