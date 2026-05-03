import React, { useMemo, useState } from "react";
import { Grid, List as ListIcon } from "lucide-react";

import { ROUTES } from "constants/routes";
import JobCard from "components/Candidat/CarteOffre.jsx";
import { useOffres } from "hooks/useOffresPubliques";

/**
 * Version embarquée de la liste d'offres, sans Navbar ni footer,
 * destinée à être rendue dans le CandidateLayout (sidebar).
 */
export default function CandidateOffresList() {
  const { offres, loading, error, refetch } = useOffres();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  function toSearchableSkills(value) {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value
        .map(function (item) {
          if (typeof item === "string") return item;
          return item?.nom || item?.name || item?.texte || item?.text || "";
        })
        .join(" ")
        .toLowerCase();
    }

    return String(value).toLowerCase();
  }

  const filteredOffres = useMemo(
    function () {
      return offres.filter(function (offre) {
        const poste = (offre?.poste || "").toLowerCase();
        const entrepriseNom = (offre?.entreprise?.nom || "").toLowerCase();
        const skillsText = toSearchableSkills(
          offre?.competences || offre?.skills || offre?.technologies || offre?.requirements
        );
        const q = searchTerm.toLowerCase();

        const matchesSearch =
          !searchTerm ||
          poste.includes(q) ||
          entrepriseNom.includes(q) ||
          skillsText.includes(q);

        return matchesSearch;
      });
    },
    [offres, searchTerm]
  );

  return (
    <div
      className="mx-auto max-w-7xl animate-fade-in space-y-8 p-4 md:p-8"
      style={{ backgroundColor: "var(--color-canvas-parchment)" }}
    >
      <section>
        <h1
          className="font-display"
          style={{
            fontSize: "34px",
            fontWeight: 600,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "var(--color-ink)",
          }}
        >
          Offres
        </h1>
      </section>

      {/* Hero / Search */}
      <section>
        <div className="max-w-3xl">
          <div className="rounded-[var(--rounded-lg)] p-1.5" style={{ border: "1px solid var(--color-hairline)", backgroundColor: "var(--color-canvas)" }}>
            <input
              type="search"
              value={searchTerm}
              onChange={function (event) {
                setSearchTerm(event.target.value);
              }}
              placeholder="Nom du poste ou compétence (Python, Node.js...)"
              className="apple-search"
            />
          </div>
        </div>

      </section>

      {/* Results */}
      <section>
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            {loading
              ? "Chargement des postes..."
              : `${filteredOffres.length} poste(s) disponible(s)`}
          </p>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex rounded-[var(--rounded-pill)] p-1"
              style={{ border: "1px solid var(--color-hairline)", backgroundColor: "var(--color-canvas)" }}
            >
              <button
                type="button"
                onClick={function () {
                  setViewMode("grid");
                }}
                className={"chip-option rounded-[var(--rounded-pill)] p-2 " + (viewMode === "grid" ? "active" : "")}
              >
                <Grid size={18} />
              </button>
              <button
                type="button"
                onClick={function () {
                  setViewMode("list");
                }}
                className={"chip-option rounded-[var(--rounded-pill)] p-2 " + (viewMode === "list" ? "active" : "")}
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
              Essayez de changer vos mots-clés.
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
                    detailBasePath={ROUTES.CANDIDATE.SPACE_OFFRES}
                  />
                );
              })}
        </div>
      </section>
    </div>
  );
}
