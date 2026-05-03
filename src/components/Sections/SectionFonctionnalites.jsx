import React from "react";
import PipelineKanbanCard from "components/Sections/CartePipelineKanban.jsx";
import GestionCandidatsCard from "components/Sections/GestionCandidatsCard.jsx";
import PlanningEntretiensCard from "components/Sections/PlanningEntretiensCard.jsx";
import AnalyticsRapportsCard from "components/Sections/CarteAnalysesRapports.jsx";
import AutomatisationCard from "components/Sections/AutomatisationCard.jsx";

const TILES = [
  {
    bg: "var(--color-canvas)",
    textColor: "var(--color-ink)",
    subtitleColor: "var(--color-ink-muted-80)",
  },
  {
    bg: "var(--color-canvas-parchment)",
    textColor: "var(--color-ink)",
    subtitleColor: "var(--color-ink-muted-80)",
  },
  {
    bg: "#fafafc",
    textColor: "var(--color-ink)",
    subtitleColor: "var(--color-ink-muted-80)",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="fonctionnalites"
      className="scroll-mt-28"
      style={{ fontFamily: "var(--font-text)" }}
    >
      {/* Section header tile — white */}
      <div
        style={{
          backgroundColor: "var(--color-canvas)",
          padding: "80px 16px 48px",
        }}
      >
        <div className="mx-auto max-w-[1440px] text-center">
          <h2
            className="mx-auto mb-4 max-w-[800px] font-display font-semibold"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: 1.1,
              color: "var(--color-ink)",
            }}
          >
            Tout ce qu'il faut pour recruter avec précision
          </h2>
          <p
            className="mx-auto max-w-[600px] font-text text-[17px] font-normal leading-[1.47]"
            style={{ color: "var(--color-ink-muted-80)", letterSpacing: "-0.374px" }}
          >
            Une plateforme unifiée pour piloter l'ensemble de vos processus de
            recrutement, de la sourcing à l'embauche.
          </p>
        </div>
      </div>

      {/* Feature cards grid */}
      <div
        style={{
          backgroundColor: "var(--color-canvas-parchment)",
          padding: "48px 16px 80px",
        }}
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <PipelineKanbanCard />
          <GestionCandidatsCard />
          <PlanningEntretiensCard />
          <AnalyticsRapportsCard />
          <AutomatisationCard />
        </div>
      </div>
    </section>
  );
}
