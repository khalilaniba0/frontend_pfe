// Lignes : 246 | Couche : page | Depend de : useOffres, JobCard, Navbar
import React, { useMemo, useState } from "react";
import { Grid, List as ListIcon } from "lucide-react";

import JobCard from "components/Candidat/CarteOffre.jsx";
import Navbar from "components/miseEnPage/BarreNavigation.jsx";
import { useOffres } from "hooks/useOffresPubliques";

export default function JobList() {
  const { offres, loading, error, refetch } = useOffres();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOffres = useMemo(
    function () {
      return offres.filter(function (offre) {
        const poste = (offre?.poste || "").toLowerCase();
        const entrepriseNom = (offre?.entreprise?.nom || "").toLowerCase();

        const matchesSearch =
          !searchTerm ||
          poste.includes(searchTerm.toLowerCase()) ||
          entrepriseNom.includes(searchTerm.toLowerCase());

        return matchesSearch;
      });
    },
    [offres, searchTerm]
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-canvas-parchment)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-text)",
      }}
    >
      <Navbar />

      <main className="px-4 pb-16 pt-24 md:px-8">
        <section className="mx-auto w-full max-w-6xl">
          <div
            className="apple-panel p-8 md:p-10"
            style={{ backgroundColor: "var(--color-canvas)" }}
          >
            <h1
              className="max-w-2xl font-display"
              style={{
                fontSize: "clamp(34px, 4.2vw, 40px)",
                fontWeight: 600,
                lineHeight: 1.1,
                color: "var(--color-ink)",
              }}
            >
              Trouvez votre prochain défi professionnel.
            </h1>
            <p
              className="mt-4 max-w-xl font-text text-[17px]"
              style={{ color: "var(--color-ink-muted-80)", lineHeight: 1.47 }}
            >
              Explorez des opportunités exclusives parmi les meilleures entreprises
              technologiques et créatives.
            </p>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <label className="flex-1">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={function (event) {
                    setSearchTerm(event.target.value);
                  }}
                  placeholder="Poste, mot-clé..."
                  className="apple-search"
                />
              </label>
            </div>
          </div>
        </section>

        <section id="offres" className="mx-auto mt-10 w-full max-w-6xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2
                className="font-display"
                style={{
                  fontSize: "34px",
                  fontWeight: 600,
                  lineHeight: 1.47,
                  letterSpacing: "-0.374px",
                  color: "var(--color-ink)",
                }}
              >
                Dernières offres
              </h2>
              <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                {loading
                  ? "Chargement des postes..."
                  : `${filteredOffres.length} poste(s) disponible(s) actuellement`}
              </p>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div
                className="inline-flex rounded-[var(--rounded-pill)] p-1"
                style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-hairline)" }}
              >
                <button
                  type="button"
                  onClick={function () {
                    setViewMode("grid");
                  }}
                  className={
                    "chip-option rounded-[var(--rounded-pill)] p-2 " +
                    (viewMode === "grid"
                      ? "active"
                      : "")
                  }
                  aria-label="Affichage grille"
                >
                  <Grid size={18} />
                </button>
                <button
                  type="button"
                  onClick={function () {
                    setViewMode("list");
                  }}
                  className={"chip-option rounded-[var(--rounded-pill)] p-2 " + (viewMode === "list" ? "active" : "")}
                  aria-label="Affichage liste"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="apple-card px-4 py-3" style={{ borderColor: "#ff3b30", color: "#ff3b30" }}>
              <div className="flex items-center justify-between gap-3">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={function () {
                    refetch();
                  }}
                  className="button-ghost-pill"
                  style={{ fontSize: "14px", padding: "8px 14px" }}
                >
                  Reessayer
                </button>
              </div>
            </div>
          ) : null}

          {!loading && !error && filteredOffres.length === 0 ? (
            <div className="apple-card px-5 py-10 text-center">
              <p className="font-text text-[17px]" style={{ color: "var(--color-ink)" }}>
                Aucune offre ne correspond à votre recherche.
              </p>
              <p className="mt-1 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
                Essayez d'enlever un filtre ou de changer vos mots-clés.
              </p>
            </div>
          ) : null}

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                : "flex flex-col gap-4"
            }
          >
            {loading
              ? Array.from({ length: 4 }).map(function (_, index) {
                  return (
                    <div
                      key={`skeleton-${index}`}
                      className="h-44 animate-pulse rounded-[var(--rounded-lg)]"
                      style={{ border: "1px solid var(--color-hairline)", backgroundColor: "var(--color-canvas)" }}
                    />
                  );
                })
              : filteredOffres.map(function (offre, index) {
                  return (
                    <JobCard
                      key={offre?._id || `${offre?.poste || "offre"}-${index}`}
                      offre={offre}
                      viewMode={viewMode}
                    />
                  );
                })}
          </div>
        </section>
      </main>
    </div>
  );
}
