import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import CandidatureCard from "components/Candidat/CandidatureCard";
import CandidatureDetailsModal from "components/Candidat/ModalDetailsCandidature";
import { getMesCandidatures, annulerCandidature } from "service/restApiCandidature";

const ETAPE_OPTIONS = [
  { value: "", label: "Toutes les étapes" },
  { value: "soumise", label: "Candidature reçue" },
  { value: "preselectionne", label: "En cours d'examen" },
  { value: "entretien_planifie", label: "Entretien prévu" },
  { value: "entretien_passe", label: "Entretien passé" },
  { value: "accepte", label: "Accepté" },
  { value: "refuse", label: "Refusé" },
];

function hasLinkedOffre(candidature) {
  if (!candidature || typeof candidature !== "object") {
    return false;
  }

  if (typeof candidature.offre === "string") {
    return candidature.offre.trim().length > 0;
  }

  if (candidature.offre && typeof candidature.offre === "object") {
    return Boolean(candidature.offre._id || candidature.offre.id);
  }

  if (candidature.offreId) {
    return true;
  }

  return false;
}

export default function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterEtape, setFilterEtape] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidature, setSelectedCandidature] = useState(null);

  async function fetchCandidatures() {
    try {
      setLoading(true);
      setError("");
      const res = await getMesCandidatures();
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setCandidatures(list.filter(hasLinkedOffre));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger vos candidatures."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    fetchCandidatures();
  }, []);

  async function handleAnnuler(id) {
    if (!window.confirm("Voulez-vous vraiment annuler cette candidature ?")) {
      return;
    }
    try {
      await annulerCandidature(id);
      setCandidatures(function (prev) {
        return prev.filter(function (c) {
          return c._id !== id;
        });
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible d'annuler cette candidature."
      );
    }
  }

  function handleOpenDetails(candidature) {
    setSelectedCandidature(candidature);
  }

  function handleCloseDetails() {
    setSelectedCandidature(null);
  }

  const filtered = candidatures.filter(function (candidature) {
    const matchesEtape =
      !filterEtape || (candidature?.etape || candidature?.status) === filterEtape;

    if (!matchesEtape) {
      return false;
    }

    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return true;
    }

    const offre = candidature?.offre || {};
    const poste = String(offre?.poste || offre?.post || offre?.titre || "").toLowerCase();
    const entreprise = String(
      offre?.entreprise?.nom || offre?.nomEntreprise || ""
    ).toLowerCase();
    const typeContrat = String(offre?.typeContrat || "").toLowerCase();

    return poste.includes(q) || entreprise.includes(q) || typeContrat.includes(q);
  });

  return (
    <div
      className="mx-auto max-w-7xl animate-fade-in space-y-6 p-4 md:p-8"
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
          Mes candidatures
        </h1>
      </section>

      {/* Filter */}
      <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form
          className="w-full max-w-3xl"
          onSubmit={function (event) {
            event.preventDefault();
          }}
        >
          <div
            className="relative rounded-[var(--rounded-lg)] p-1.5"
            style={{ border: "1px solid var(--color-hairline)", backgroundColor: "var(--color-canvas)" }}
          >
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-ink-muted-48)" }}
            />
            <input
              type="search"
              value={searchTerm}
              onChange={function (event) {
                setSearchTerm(event.target.value);
              }}
              placeholder="Nom du poste ou entreprise"
              className="apple-search"
              style={{ paddingLeft: "40px", paddingRight: "150px" }}
            />

          </div>
        </form>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-text-muted text-lg">filter_list</span>
          <select
            value={filterEtape}
            onChange={function (e) {
              setFilterEtape(e.target.value);
            }}
            className="apple-select rounded-xl border border-border bg-white shadow-sm"
            style={{ width: "260px", height: "44px", appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
          >
            {ETAPE_OPTIONS.map(function (opt) {
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="apple-card px-4 py-3" style={{ borderColor: "#ff3b30", color: "#ff3b30" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(function (i) {
            return (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-border bg-white"
              />
            );
          })}
        </div>
      ) : filtered.length === 0 ? (
        <div className="apple-card px-6 py-16 text-center">
          <span className="material-symbols-outlined mx-auto mb-3 text-4xl" style={{ color: "var(--color-ink-muted-48)" }}>inbox</span>
          <p className="font-display text-[21px]" style={{ color: "var(--color-ink)", fontWeight: 600 }}>
            {filterEtape
              ? "Aucune candidature pour cette étape"
              : "Vous n'avez pas encore postulé"}
          </p>
          <p className="mt-1 font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            Explorez nos offres et commencez à postuler !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(function (candidature) {
            return (
              <CandidatureCard
                key={candidature._id}
                candidature={candidature}
                onAnnuler={handleAnnuler}
                onOpenDetails={handleOpenDetails}
              />
            );
          })}
        </div>
      )}

      {selectedCandidature && (
        <CandidatureDetailsModal
          candidature={selectedCandidature}
          onClose={handleCloseDetails}
        />
      )}

    </div>
  );
}
