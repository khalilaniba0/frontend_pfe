// Lignes : 135 | Couche : page | Depend de : useDashboard, StatCard, HiringChart, RecentActivity, UpcomingInterviews
import React from "react";

import StatCard from "components/TableauDeBord/CarteStatistique.jsx";
import HiringChart from "components/TableauDeBord/GraphiqueRecrutement.jsx";
import RecentActivity from "components/TableauDeBord/ActiviteRecente.jsx";
import { useDashboard } from "hooks/useTableauDeBord";

export default function Dashboard() {
  const {
    stats,
    recentCandidatures,
    upcomingInterviews,
    hiringChart,
    loading,
    error,
    refetch,
  } = useDashboard();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1
            className="font-display font-semibold"
            style={{ fontSize: "34px", lineHeight: 1.47, letterSpacing: "-0.374px", color: "var(--color-ink)" }}
          >
            Tableau de bord
          </h1>
        </div>
        <p
          className="font-text text-[14px] capitalize"
          style={{ color: "var(--color-ink-muted-48)" }}
        >
          {formattedDate}
        </p>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map(function (i) {
              return (
                <div
                  key={i}
                  className="apple-card animate-pulse"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-24 rounded" style={{ backgroundColor: "var(--color-divider-soft)" }} />
                      <div className="mb-2 h-8 w-16 rounded" style={{ backgroundColor: "var(--color-divider-soft)" }} />
                      <div className="h-3 w-32 rounded" style={{ backgroundColor: "var(--color-divider-soft)" }} />
                    </div>
                    <div className="h-11 w-11 rounded-[var(--rounded-sm)]" style={{ backgroundColor: "var(--color-divider-soft)" }} />
                  </div>
                </div>
              );
            })}
          </>
        ) : error ? (
          <div className="apple-card col-span-full" style={{ borderColor: "#ff3b30" }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: "#ff3b30" }}>error</span>
              <div>
                <p className="font-display text-[14px] font-semibold" style={{ color: "#ff3b30" }}>
                  Erreur de chargement
                </p>
                <p className="font-text text-[12px]" style={{ color: "#ff3b30" }}>{error}</p>
                <button
                  type="button"
                  onClick={function () { refetch(); }}
                  className="button-ghost-pill mt-2"
                  style={{ fontSize: "12px", padding: "6px 16px" }}
                >
                  Reessayer
                </button>
              </div>
            </div>
          </div>
        ) : stats ? (
          <>
            <StatCard
              icon="inbox"
              label="Candidatures en attente"
              value={stats.candidatures_en_attente.total}
              subLabel=""
              color="primary"
            />
            <StatCard
              icon="folder_open"
              label="Postes ouverts"
              value={stats.postes_ouverts.total}
              subLabel=""
              color="secondary"
            />
            <StatCard
              icon="videocam"
              label="Entretiens cette semaine"
              value={stats.entretiens_cette_semaine.total}
              subLabel={
                stats.entretiens_cette_semaine.aujourd_hui +
                " auj. · " +
                stats.entretiens_cette_semaine.demain +
                " demain"
              }
              color="warning"
            />
            <StatCard
              icon="description"
              label="Offres en attente"
              value={stats.offres_en_attente.total}
              subLabel=""
              color="success"
            />
          </>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="flex flex-col gap-4 xl:col-span-8">
          <HiringChart data={hiringChart} loading={loading} />
        </div>
        <aside className="xl:col-span-4">
          <RecentActivity candidatures={recentCandidatures} loading={loading} />
        </aside>
      </section>
    </div>
  );
}
