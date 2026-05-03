// Lignes : 226 | Couche : page | Depend de : useOffres, getMesCandidatures, StatCard, OffreRecommendationCard
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidateAuth } from "context/ContexteAuthCandidat";
import { getMesCandidatures } from "service/restApiCandidature";
import { useOffres } from "hooks/useOffresPubliques";
import StatCard from "components/TableauDeBord/CarteStatistique";
import OffreRecommendationCard from "components/Candidat/CarteRecommandationOffre";

const ETAPE_CONFIG = {
  soumise: { label: "Candidature reçue", cls: "bg-gray-50 text-gray-600" },
  preselectionne: { label: "En cours d'examen", cls: "bg-gray-50 text-gray-600" },
  entretien_planifie: { label: "Entretien prévu", cls: "bg-gray-50 text-gray-600" },
  entretien_passe: { label: "Entretien passé", cls: "bg-gray-50 text-gray-600" },
  accepte: { label: "Accepté", cls: "bg-gray-50 text-gray-600" },
  refuse: { label: "Refusé", cls: "bg-gray-50 text-gray-600" },
};

const TYPE_ENTRETIEN_LABELS = {
  visio: "Visio",
  presentiel: "Présentiel",
  telephone: "Téléphone",
};

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

function formatInterviewDateTime(dateValue) {
  if (!dateValue) {
    return {
      dateLabel: "Date à confirmer",
      timeLabel: "Heure à confirmer",
      sortValue: Number.MAX_SAFE_INTEGER,
    };
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return {
      dateLabel: "Date à confirmer",
      timeLabel: "Heure à confirmer",
      sortValue: Number.MAX_SAFE_INTEGER,
    };
  }

  return {
    dateLabel: parsedDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    timeLabel: parsedDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sortValue: parsedDate.getTime(),
  };
}

export default function CandidateDashboard() {
  const { candidat } = useCandidateAuth();
  const navigate = useNavigate();
  const { offres: allOffres, loading: offresLoading } = useOffres();

  const [candidatures, setCandidatures] = useState([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(true);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const cRes = await getMesCandidatures();
        const cList = Array.isArray(cRes?.data?.data) ? cRes.data.data
          : Array.isArray(cRes?.data) ? cRes.data : [];
        setCandidatures(cList.filter(hasLinkedOffre));
      } catch {
        // silently handle
      } finally {
        setLoadingCandidatures(false);
      }
    };
    load();
  }, []);

  const offres = Array.isArray(allOffres) ? allOffres.slice(0, 3) : [];
  const loading = loadingCandidatures || offresLoading;

  const entretiensPreus = candidatures.filter(
    (c) => c.etape === "entretien_planifie"
  ).length;

  const upcomingInterviews = candidatures
    .filter(function (candidature) {
      return candidature?.etape === "entretien_planifie";
    })
    .map(function (candidature) {
      const entretien = candidature?.entretien || {};
      const interviewDateValue =
        entretien?.dateEntretien || entretien?.date_entretien || candidature?.dateEntretien || candidature?.date_entretien;
      const { dateLabel, timeLabel, sortValue } = formatInterviewDateTime(interviewDateValue);
      const typeRaw = String(entretien?.typeEntretien || entretien?.type_entretien || candidature?.typeEntretien || candidature?.type_entretien || "").toLowerCase();
      const typeLabel = TYPE_ENTRETIEN_LABELS[typeRaw] || "Entretien";
      const meetLink = String(entretien?.lienVisio || entretien?.lien_visio || "").trim();

      return {
        id: candidature?._id,
        poste: candidature?.offre?.poste || candidature?.offre?.post || "Poste",
        entreprise: candidature?.offre?.entreprise?.nom || "Entreprise",
        dateLabel,
        timeLabel,
        typeLabel,
        meetLink,
        sortValue,
      };
    })
    .sort(function (a, b) {
      return a.sortValue - b.sortValue;
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="animate-fade-in p-4 md:p-8 max-w-6xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Bonjour, {candidat?.nom || "Candidat"} !
          </h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Suivez l'état de vos candidatures en un clin d'œil.
          </p>
        </div>
        <p className="font-body text-sm capitalize text-text-muted">
          {formattedDate}
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div onClick={() => navigate("/candidat/mes-candidatures")} className="cursor-pointer transition-transform hover:-translate-y-1">
          <StatCard
            label="Candidatures"
            value={candidatures.length}
            icon="work"
            subLabel="Envoyées au total"
            color="neutral"
          />
        </div>
        <div onClick={() => navigate("/candidat/entretiens")} className="cursor-pointer transition-transform hover:-translate-y-1">
          <StatCard
            label="Entretiens"
            value={entretiensPreus}
            icon="event"
            subLabel="Prévus prochainement"
            color="neutral"
          />
        </div>
        <div onClick={() => navigate("/candidat/mes-candidatures")} className="cursor-pointer transition-transform hover:-translate-y-1">
          <StatCard
            label="Acceptées"
            value={candidatures.filter((c) => c.etape === "accepte").length}
            icon="check_circle"
            subLabel="Candidatures acceptées"
            color="neutral"
          />
        </div>
      </div>

      {/* Mes entretiens */}
      <section className="mb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Mes entretiens
          </h2>
          <button
            onClick={() => navigate("/candidat/entretiens")}
            className="font-body text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Voir tous les entretiens →
          </button>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-3 mx-auto">event_available</span>
            <p className="font-body text-sm text-text-secondary">
              Aucun entretien planifié pour le moment.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="divide-y divide-border">
              {upcomingInterviews.map(function (interview) {
                return (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 border border-gray-100">
                        <span className="material-symbols-outlined text-xl">event</span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-text-primary">
                          {interview.poste}
                        </p>
                        <p className="mt-0.5 font-body text-xs text-text-secondary">
                          {interview.entreprise}
                        </p>
                        <p className="mt-1.5 font-body text-sm text-text-primary">
                          <span className="font-semibold">{interview.dateLabel}</span>
                          {" • "}
                          <span>{interview.timeLabel}</span>
                          {" • "}
                          <span className="text-text-secondary">{interview.typeLabel}</span>
                        </p>
                      </div>
                    </div>

                    {interview.meetLink ? (
                      <a
                        href={interview.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-opacity-90"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        Rejoindre Meet
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600" style={{ borderColor: "var(--color-hairline)", backgroundColor: "#fafafc", color: "var(--color-body-muted)" }}>
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        Lien Meet à venir
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Candidatures en cours */}
      <section className="mb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Mes candidatures récentes
          </h2>
          <button
            onClick={() => navigate("/candidat/mes-candidatures")}
            className="font-body text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Voir tout →
          </button>
        </div>

        {candidatures.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-3 mx-auto">inbox</span>
            <p className="font-body text-sm text-text-secondary">
              Vous n'avez pas encore postulé à une offre.
            </p>
            <button
              onClick={() => navigate("/candidat/offres")}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-primary-dark"
            >
              Parcourir les offres
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="divide-y divide-border">
              {candidatures.slice(0, 3).map((c) => {
                const etape = ETAPE_CONFIG[c.etape] || ETAPE_CONFIG.soumise;
                const poste = c.offre?.poste || c.nom || "Poste inconnu";
                const entreprise = c.offre?.entreprise?.nom || "Entreprise confidentielle";
                const date = c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })
                  : "";
                return (
                  <div
                    key={c._id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-bg-soft sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 border border-gray-100">
                        <span className="material-symbols-outlined text-xl">work</span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-text-primary">
                          {poste}
                        </p>
                        <p className="font-body text-xs text-text-secondary mt-0.5">
                          {[entreprise, date].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-body text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 ${etape.cls}`}
                    >
                      {etape.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Recommandations */}
      {offres.length > 0 && (
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-text-primary">
              Offres recommandées
            </h2>
            <button
              onClick={() => navigate("/candidat/offres")}
              className="font-body text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Plus d'offres →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offres.map((offre) => {
              const offreId = offre?._id || offre?.id;

              return (
                <OffreRecommendationCard
                  key={offreId || `${offre?.poste || "offre"}`}
                  offre={offre}
                  onClick={() => {
                    if (offreId) {
                      navigate(`/candidat/offres/${encodeURIComponent(String(offreId))}`);
                    }
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}