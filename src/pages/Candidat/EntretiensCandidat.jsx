import React, { useEffect, useMemo, useState } from "react";
import { getMesCandidatures } from "service/restApiCandidature";

const TYPE_ENTRETIEN_LABELS = {
  visio: "Visio",
  presentiel: "Presentiel",
  telephone: "Telephone",
};

const ETAPE_LABELS = {
  entretien_planifie: { label: "Planifie", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  entretien_passe: { label: "Passe", cls: "bg-blue-50 text-blue-700 border-blue-200" },
};

function formatInterviewDateTime(dateValue) {
  if (!dateValue) {
    return {
      dateLabel: "Date a confirmer",
      timeLabel: "Heure a confirmer",
      sortValue: Number.MAX_SAFE_INTEGER,
    };
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return {
      dateLabel: "Date a confirmer",
      timeLabel: "Heure a confirmer",
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

function toInterviewItem(candidature) {
  const entretien = candidature?.entretien || {};
  const interviewDateValue =
    entretien?.dateEntretien ||
    entretien?.date_entretien ||
    candidature?.dateEntretien ||
    candidature?.date_entretien;

  const { dateLabel, timeLabel, sortValue } = formatInterviewDateTime(interviewDateValue);
  const typeRaw = String(
    entretien?.typeEntretien ||
      entretien?.type_entretien ||
      candidature?.typeEntretien ||
      candidature?.type_entretien ||
      ""
  ).toLowerCase();

  const etapeRaw = String(candidature?.etape || "").toLowerCase();
  const etapeInfo = ETAPE_LABELS[etapeRaw] || {
    label: "Entretien",
    cls: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return {
    id: candidature?._id || candidature?.id || `${candidature?.offre?._id || "offre"}-${sortValue}`,
    poste: candidature?.offre?.poste || candidature?.offre?.post || "Poste",
    entreprise: candidature?.offre?.entreprise?.nom || "Entreprise",
    dateLabel,
    timeLabel,
    sortValue,
    typeLabel: TYPE_ENTRETIEN_LABELS[typeRaw] || "Entretien",
    meetLink: String(entretien?.lienVisio || entretien?.lien_visio || "").trim(),
    etapeLabel: etapeInfo.label,
    etapeClassName: etapeInfo.cls,
  };
}

function shouldIncludeInterview(candidature) {
  if (!candidature || typeof candidature !== "object") {
    return false;
  }

  const etape = String(candidature?.etape || "").toLowerCase();
  const hasInterviewEtape = etape === "entretien_planifie" || etape === "entretien_passe";
  return hasInterviewEtape || Boolean(candidature?.entretien);
}

export default function CandidateInterviews() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await getMesCandidatures();
        const payload = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        if (isMounted) {
          setCandidatures(payload);
        }
      } catch {
        if (isMounted) {
          setCandidatures([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return function cleanup() {
      isMounted = false;
    };
  }, []);

  const interviews = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return candidatures
      .filter(shouldIncludeInterview)
      .map(toInterviewItem)
      .filter(function (item) {
        if (!searchTerm) {
          return true;
        }

        return [item.poste, item.entreprise, item.typeLabel]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      })
      .sort(function (a, b) {
        return a.sortValue - b.sortValue;
      });
  }, [candidatures, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse p-6 md:p-8">
        <div className="mb-5 h-8 w-64 rounded bg-gray-200" />
        <div className="mb-8 h-10 w-full max-w-md rounded-2xl bg-gray-200" />
        <div className="space-y-3">
          {[1, 2, 3].map(function (item) {
            return <div key={item} className="h-28 rounded-2xl bg-gray-200" />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Mes entretiens
        </h1>
        <div className="relative w-full md:w-[420px]">
          <input
            type="text"
            value={search}
            onChange={function (event) {
              setSearch(event.target.value);
            }}
            placeholder="Rechercher par poste, entreprise ou type"
            className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 font-body text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white py-12 text-center">
          <span className="material-symbols-outlined mx-auto mb-3 block text-4xl text-text-muted">
            event_busy
          </span>
          <p className="font-body text-sm text-text-secondary">
            Aucun entretien trouve pour le moment.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="divide-y divide-border">
            {interviews.map(function (interview) {
              return (
                <div
                  key={interview.id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
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

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${interview.etapeClassName}`}
                    >
                      {interview.etapeLabel}
                    </span>
                    {interview.meetLink ? (
                      <a
                        href={interview.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 font-body text-xs font-semibold text-white transition-all hover:bg-primary-dark"
                      >
                        <span className="material-symbols-outlined text-[16px]">videocam</span>
                        Rejoindre Meet
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        Lien a venir
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
