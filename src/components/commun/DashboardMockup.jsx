import React from "react";

export default function DashboardMockup() {
  const kanbanCols = [
    { stage: "Nouveau", count: 8 },
    { stage: "Présélection", count: 5 },
    { stage: "Entretien", count: 4 },
    { stage: "Offre", count: 2 },
  ];

  const activities = [
    { text: "Marie D. a passé l'entretien RH", time: "il y a 5 min" },
    { text: "Offre envoyée à Paul R.", time: "il y a 1h" },
    { text: "3 nouveaux candidats aujourd'hui", time: "il y a 2h" },
  ];

  return (
    <div className="th-hero-visual relative hidden lg:block w-full">
      <div className="rounded-2xl border border-border bg-white p-6">
        {/* Window bar */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2.5 h-2.5 rounded-full bg-text-muted" />
          <div className="w-2.5 h-2.5 rounded-full bg-text-muted" />
          <div className="w-2.5 h-2.5 rounded-full bg-text-muted" />
          <div className="flex-1 h-[22px] bg-bg-page rounded-md ml-2" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Candidats actifs", val: "247", up: "+12%" },
            { label: "Entretiens prévus", val: "18", up: "+5%" },
            { label: "Offres envoyées", val: "6", up: "+2%" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-bg-soft border border-border rounded-xl p-3.5"
            >
              <div className="text-[0.65rem] text-text-muted mb-1 font-body">
                {card.label}
              </div>
              <div className="text-xl font-extrabold text-text-primary font-body leading-none">
                {card.val}
              </div>
              <div className="text-[0.65rem] text-primary-dark mt-1 font-semibold font-body">
                ↑ {card.up}
              </div>
            </div>
          ))}
        </div>

        {/* Kanban preview */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {kanbanCols.map((col, i) => (
            <div
              key={i}
              className="bg-bg-soft border border-border rounded-lg p-3"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-dark" />
                <span className="text-[0.6rem] text-text-secondary font-body font-semibold">
                  {col.stage}
                </span>
              </div>
              {Array.from({ length: Math.min(col.count, 2) }).map((_, j) => (
                <div
                  key={j}
                  className="h-7 bg-white border border-border rounded-md mb-1.5 flex items-center px-1.5 gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-bg-page" />
                  <div className="flex-1 h-1.5 rounded bg-bg-page" />
                </div>
              ))}
              <div className="text-[0.6rem] text-text-muted mt-1 font-body">
                {col.count} candidats
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="bg-bg-soft border border-border rounded-lg p-3.5 flex flex-col gap-2">
          <div className="text-[0.65rem] text-text-muted font-body font-semibold mb-1">
            Activité récente
          </div>
          {activities.map((act, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-dark shrink-0" />
              <span className="text-[0.7rem] text-text-secondary font-body flex-1">
                {act.text}
              </span>
              <span className="text-[0.65rem] text-text-muted font-body">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -left-4 bg-primary rounded-xl px-4 py-3 flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-white text-xs font-bold font-body">
          Offre acceptée !
        </span>
      </div>
    </div>
  );
}
