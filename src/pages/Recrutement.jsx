import React, { useState, useEffect, useRef, useCallback } from "react";
import PipelineColumn from "components/Recrutement/ColonnePipeline.jsx";
import CandidateModal from "components/Recrutement/ModalCandidat.jsx";
import EntretienModal from "components/Recrutement/EntretienModal.jsx";
import ModalBackdrop from "components/commun/FondModal";
import {
  getPipelineCandidatures,
  updateCandidatureEtape,
  refuserCandidature,
  getOffresEntreprise,
} from "service/restApiRecrutement";

/* ── mapping étapes backend → colonnes Kanban ──── */

var ETAPE_TO_COLUMN = {
  soumise: "Candidature",
  preselectionne: "Présélection",
  entretien_planifie: "Entretien",
  entretien_passe: "Test technique",
  offre: "Offre",
  accepte: "Offre",
  refuse: "Refusé",
};

var COLUMN_TO_ETAPE = {
  Candidature: "soumise",
  "Présélection": "preselectionne",
  Entretien: "entretien_planifie",
  "Test technique": "entretien_passe",
  Offre: "offre",
};

var COLUMN_DEFS = [
  { title: "Candidature", color: "bg-slate-500" },
  { title: "Présélection", color: "bg-amber-500" },
  { title: "Entretien", color: "bg-primary" },
  { title: "Test technique", color: "bg-indigo-500" },
  { title: "Offre", color: "bg-secondary" },
];

var pipelineOrder = COLUMN_DEFS.map(function (c) {
  return c.title;
});

/* ── map backend candidature → card data ─────── */

function mapCandidateCard(c) {
  var scoreRaw = Number(c.scoreIA !== undefined ? c.scoreIA : c.score_ia);
  var normalizedScore = Number.isFinite(scoreRaw)
    ? Math.max(0, Math.min(100, Math.round(scoreRaw)))
    : null;

  var iaReport =
    (c.rapportIA && typeof c.rapportIA === "object" && c.rapportIA) ||
    (c.rapport_ia && typeof c.rapport_ia === "object" && c.rapport_ia) ||
    null;

  var iaDetails =
    iaReport && iaReport.details && typeof iaReport.details === "object"
      ? iaReport.details
      : null;

  var iaCvExtract =
    iaReport && iaReport.cv_extrait && typeof iaReport.cv_extrait === "object"
      ? iaReport.cv_extrait
      : iaReport && iaReport.cvExtrait && typeof iaReport.cvExtrait === "object"
        ? iaReport.cvExtrait
        : null;

  return {
    id: c._id,
    name: c.nom || c.candidat?.nom || c.email || "Candidat",
    role: c.offre?.poste || c.poste || "Poste",
    job: c.offre?.poste || c.poste || "Poste",
    priority: normalizedScore === null
      ? "Analyse IA en cours"
      : normalizedScore >= 70
        ? "Haute"
        : normalizedScore >= 40
          ? "Priorité moyenne"
          : "Normale",
    appliedDate: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "",
    avatar: "",
    score: normalizedScore,
    email: c.email || c.candidat?.email || "",
    phone: c.telephone || c.candidat?.telephone || "",
    location: c.offre?.localisation || "",
    salary: "",
    availability: "",
    linkedin: "",
    lettreMotivation: String(c.lettre_motivation || c.lettreMotivation || "").trim(),
    cv_url: c.cv_url || c.cvUrl || c.candidat?.cv_url || null,
    iaReport: iaReport,
    iaDetails: iaDetails,
    iaCvExtract: iaCvExtract,
    scoreStatus: normalizedScore === null ? "pending" : "ready",
    _etape: c.etape,
    _offreId: c.offre?._id || c.offre || "",
    hasIaReport: Boolean(iaReport),
  };
}

function getSortableScore(candidate) {
  return Number.isFinite(candidate?.score) ? candidate.score : -1;
}

export default function Recruitment() {
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [allCandidatures, setAllCandidatures] = useState([]);
  var [jobOpenings, setJobOpenings] = useState(["Tous les postes"]);
  var [selectedJob, setSelectedJob] = useState("Tous les postes");

  var [dragging, setDragging] = useState(null);
  var [modalCandidate, setModalCandidate] = useState(null);
  var [entretienModal, setEntretienModal] = useState(null);
  var [lastMove, setLastMove] = useState(null);
  var [errorToast, setErrorToast] = useState(null);
  var [successToast, setSuccessToast] = useState(null);
  var [warningToast, setWarningToast] = useState(null);
  var [trashHover, setTrashHover] = useState(false);
  var [rejectConfirm, setRejectConfirm] = useState(null);

  var toastTimerRef = useRef(null);
  var errorTimerRef = useRef(null);
  var successTimerRef = useRef(null);
  var warningTimerRef = useRef(null);

  /* ── load data ─────────────────────────────── */

  var loadData = useCallback(async function () {
    setLoading(true);
    setError(null);
    try {
      var [candidatures, offres] = await Promise.all([
        getPipelineCandidatures(),
        getOffresEntreprise(),
      ]);

      setAllCandidatures(candidatures.map(mapCandidateCard));

      var postes = offres
        .map(function (o) {
          return o.poste || o.post || "";
        })
        .filter(function (p) {
          return p.length > 0;
        });
      var uniquePostes = Array.from(new Set(postes));
      setJobOpenings(["Tous les postes"].concat(uniquePostes));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Erreur de chargement du pipeline"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    function () {
      loadData();
    },
    [loadData]
  );

  /* ── build pipeline from candidatures ──────── */

  function buildPipeline(candidatures) {
    return COLUMN_DEFS.map(function (col) {
      var etape = COLUMN_TO_ETAPE[col.title];
      var candidates = candidatures.filter(function (c) {
        if (col.title === "Offre") {
          return c._etape === "offre" || c._etape === "accepte";
        }
        return c._etape === etape;
      });
      return {
        title: col.title,
        color: col.color,
        candidates: candidates.slice().sort(function (a, b) {
          return getSortableScore(b) - getSortableScore(a);
        }),
      };
    });
  }

  /* ── filtering ─────────────────────────────── */

  var filteredCandidatures = allCandidatures;
  if (selectedJob !== "Tous les postes") {
    filteredCandidatures = allCandidatures.filter(function (c) {
      return c.job === selectedJob;
    });
  }

  var filteredPipeline = buildPipeline(filteredCandidatures);

  /* ── top candidates per job ────────────────── */

  function getTopCandidateIds() {
    var candidatureColumn = filteredPipeline.find(function (col) {
      return col.title === "Candidature";
    });
    if (!candidatureColumn) return [];

    var jobGroups = {};
    candidatureColumn.candidates.forEach(function (candidate) {
      var job = candidate.job;
      if (!jobGroups[job]) {
        jobGroups[job] = [];
      }
      jobGroups[job].push(candidate);
    });

    var topIds = [];
    Object.keys(jobGroups).forEach(function (job) {
      var candidates = jobGroups[job];
      var sorted = candidates.slice().sort(function (a, b) {
        return getSortableScore(b) - getSortableScore(a);
      });
      if (sorted.length > 0) {
        topIds.push(sorted[0].id);
      }
    });

    return topIds;
  }

  var topCandidateIds = getTopCandidateIds();

  /* ── drag & drop ───────────────────────────── */

  function handleCandidateDragStart(candidateId, fromColumn, e) {
    setDragging({ candidateId: candidateId, fromColumn: fromColumn });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", candidateId);
  }

  function handleCandidateDragEnd() {
    setTrashHover(false);
    setDragging(null);
  }

  function handleTrashDrop(e) {
    e.preventDefault();
    setTrashHover(false);
    if (!dragging) return;
    var found = allCandidatures.find(function (c) {
      return c.id === dragging.candidateId;
    });
    if (found) {
      if (lastMove && lastMove.candidate?.id === found.id) {
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
          toastTimerRef.current = null;
        }
        setLastMove(null);
      }
      setRejectConfirm({ id: found.id, name: found.name });
    }
    setDragging(null);
  }

  function confirmReject() {
    if (!rejectConfirm) return;
    var candidateId = rejectConfirm.id;
    var candidateName = rejectConfirm.name;
    setRejectConfirm(null);

    var previousCandidate = allCandidatures.find(function (c) {
      return c.id === candidateId;
    });
    var previousEtape = previousCandidate ? previousCandidate._etape : null;

    // Optimistic move to rejected stage (same behavior as modal Refuser)
    setAllCandidatures(function (prev) {
      return prev.map(function (c) {
        if (c.id === candidateId) {
          return { ...c, _etape: "refuse" };
        }
        return c;
      });
    });

    refuserCandidature(candidateId)
      .then(function () {
        setSuccessToast(candidateName + " a ete refuse.");
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(function () {
          setSuccessToast(null);
        }, 3000);
      })
      .catch(function (err) {
        // Revert on error
        if (previousEtape) {
          setAllCandidatures(function (prev) {
            return prev.map(function (c) {
              if (c.id === candidateId) {
                return { ...c, _etape: previousEtape };
              }
              return c;
            });
          });
        }
        setErrorToast(
          err?.response?.data?.message || "Erreur lors du refus de la candidature"
        );
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
        }
        errorTimerRef.current = setTimeout(function () {
          setErrorToast(null);
        }, 3000);
      });
  }

  async function handleDrop(toColumn) {
    setTrashHover(false);
    if (!dragging) return;
    if (dragging.fromColumn === toColumn) {
      setDragging(null);
      return;
    }

    var fromIndex = pipelineOrder.indexOf(dragging.fromColumn);
    var toIndex = pipelineOrder.indexOf(toColumn);

    if (toIndex < fromIndex) {
      setErrorToast("⚠ Impossible de reculer une étape dans le pipeline");
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(function () {
        setErrorToast(null);
      }, 3000);
      setDragging(null);
      return;
    }

    var candidateId = dragging.candidateId;
    var newEtape = COLUMN_TO_ETAPE[toColumn];

    if (!newEtape) {
      setDragging(null);
      return;
    }

    // Find the candidate
    var foundCandidate = allCandidatures.find(function (c) {
      return c.id === candidateId;
    });
    if (!foundCandidate) {
      setDragging(null);
      return;
    }

    if (toColumn === "Entretien") {
      setEntretienModal({
        candidate: foundCandidate,
        fromColumn: dragging.fromColumn,
      });
      setDragging(null);
      return;
    }

    // Optimistic update
    var previousEtape = foundCandidate._etape;
    setAllCandidatures(function (prev) {
      return prev.map(function (c) {
        if (c.id === candidateId) {
          return { ...c, _etape: newEtape };
        }
        return c;
      });
    });

    setLastMove({
      candidate: foundCandidate,
      fromColumn: dragging.fromColumn,
      toColumn: toColumn,
    });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(function () {
      setLastMove(null);
    }, 5000);

    setDragging(null);

    // API call
    try {
      await updateCandidatureEtape(candidateId, newEtape);
    } catch (err) {
      // Revert on error
      setAllCandidatures(function (prev) {
        return prev.map(function (c) {
          if (c.id === candidateId) {
            return { ...c, _etape: previousEtape };
          }
          return c;
        });
      });
      setErrorToast(
        err?.response?.data?.message ||
        "Erreur lors du déplacement du candidat"
      );
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(function () {
        setErrorToast(null);
      }, 3000);
    }
  }

  function handleEntretienCancel() {
    setEntretienModal(null);
    setDragging(null);
  }

  async function handleEntretienConfirm(dateEntretien, typeEntretien) {
    if (!entretienModal) return;

    var parsedInterviewDate = new Date(dateEntretien);
    if (!dateEntretien || Number.isNaN(parsedInterviewDate.getTime())) {
      setErrorToast("Date d'entretien invalide.");
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(function () {
        setErrorToast(null);
      }, 3000);
      return;
    }

    if (parsedInterviewDate.getTime() < Date.now()) {
      setErrorToast("Impossible de planifier un entretien dans le passé.");
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(function () {
        setErrorToast(null);
      }, 3000);
      return;
    }

    var candidate = entretienModal.candidate;
    var fromColumn = entretienModal.fromColumn;
    var candidateId = candidate.id;
    var previousEtape = COLUMN_TO_ETAPE[fromColumn];
    var newEtape = COLUMN_TO_ETAPE.Entretien;

    if (!previousEtape || !newEtape) {
      setEntretienModal(null);
      setDragging(null);
      return;
    }

    setAllCandidatures(function (prev) {
      return prev.map(function (c) {
        if (c.id === candidateId) {
          return { ...c, _etape: newEtape };
        }
        return c;
      });
    });

    setLastMove({
      candidate: candidate,
      fromColumn: fromColumn,
      toColumn: "Entretien",
    });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(function () {
      setLastMove(null);
    }, 5000);

    setEntretienModal(null);
    setDragging(null);

    try {
      var response = await updateCandidatureEtape(candidateId, newEtape, {
        dateEntretien: dateEntretien,
        typeEntretien: typeEntretien,
      });

      if (response?.data?.googleWarning) {
        setWarningToast(
          "Entretien planifié mais non synchronisé Google Calendar. Connectez Google dans Paramètres > Intégrations."
        );
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
        warningTimerRef.current = setTimeout(function () {
          setWarningToast(null);
        }, 5000);
      } else {
        setSuccessToast(candidate.name + " passe en Entretien et Google Meet est synchronisé.");
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(function () {
          setSuccessToast(null);
        }, 3000);
      }
    } catch (err) {
      setAllCandidatures(function (prev) {
        return prev.map(function (c) {
          if (c.id === candidateId) {
            return { ...c, _etape: previousEtape };
          }
          return c;
        });
      });
      setErrorToast(
        err?.response?.data?.message ||
          "Erreur lors de la planification de l'entretien"
      );
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      errorTimerRef.current = setTimeout(function () {
        setErrorToast(null);
      }, 3000);
    }
  }

  function cancelLastMove() {
    if (!lastMove) return;

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    var move = lastMove;
    var previousEtape = COLUMN_TO_ETAPE[move.fromColumn];

    setAllCandidatures(function (prev) {
      return prev.map(function (c) {
        if (c.id === move.candidate.id) {
          return { ...c, _etape: previousEtape };
        }
        return c;
      });
    });

    // Revert on backend too
    updateCandidatureEtape(move.candidate.id, previousEtape).catch(function (err) {
      console.error("Erreur annulation:", err);
    });

    setLastMove(null);
  }

  /* ── modal ─────────────────────────────────── */

  function handleCandidateClick(candidate) {
    setModalCandidate(candidate);
  }

  function closeModal() {
    setModalCandidate(null);
  }

  function findCandidateColumn(candidateId) {
    var candidate = allCandidatures.find(function (c) {
      return c.id === candidateId;
    });
    if (!candidate) return null;
    return ETAPE_TO_COLUMN[candidate._etape] || null;
  }

  function moveToNextStage() {
    if (!modalCandidate) return;

    var currentColumn = findCandidateColumn(modalCandidate.id);
    if (!currentColumn) return;

    var currentIndex = pipelineOrder.indexOf(currentColumn);
    if (currentIndex === -1 || currentIndex >= pipelineOrder.length - 1) {
      return;
    }

    var nextColumn = pipelineOrder[currentIndex + 1];

    if (nextColumn === "Entretien") {
      var foundCandidate = allCandidatures.find(function (c) {
        return c.id === modalCandidate.id;
      });

      setEntretienModal({
        candidate: foundCandidate || modalCandidate,
        fromColumn: currentColumn,
      });
      closeModal();
      return;
    }

    // Simulate drop
    var tempDragging = {
      candidateId: modalCandidate.id,
      fromColumn: currentColumn,
    };
    setDragging(tempDragging);

    // Close modal first, then handle drop
    closeModal();

    var newEtape = COLUMN_TO_ETAPE[nextColumn];
    var previousEtape = COLUMN_TO_ETAPE[currentColumn];

    setAllCandidatures(function (prev) {
      return prev.map(function (c) {
        if (c.id === modalCandidate.id) {
          return { ...c, _etape: newEtape };
        }
        return c;
      });
    });

    setDragging(null);

    updateCandidatureEtape(modalCandidate.id, newEtape).catch(function () {
      setAllCandidatures(function (prev) {
        return prev.map(function (c) {
          if (c.id === modalCandidate.id) {
            return { ...c, _etape: previousEtape };
          }
          return c;
        });
      });
    });
  }

  function handleRefuseFromModal() {
    if (!modalCandidate) return;

    var candidateId = modalCandidate.id;
    var candidateName = modalCandidate.name;

    refuserCandidature(candidateId)
      .then(function () {
        setAllCandidatures(function (prev) {
          return prev.map(function (c) {
            if (c.id === candidateId) {
              return { ...c, _etape: "refuse" };
            }
            return c;
          });
        });
        closeModal();
        setSuccessToast(candidateName + " a ete refuse.");
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(function () {
          setSuccessToast(null);
        }, 3000);
      })
      .catch(function (err) {
        setErrorToast(
          err?.response?.data?.message ||
            "Erreur lors du refus de la candidature"
        );
        if (errorTimerRef.current) {
          clearTimeout(errorTimerRef.current);
        }
        errorTimerRef.current = setTimeout(function () {
          setErrorToast(null);
        }, 3000);
      });
  }

  /* ── render ─────────────────────────────────── */

  if (loading) {
    return (
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Pipeline de recrutement
          </h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Chargement...
          </p>
        </header>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map(function (i) {
            return (
              <div
                key={i}
                className="w-72 flex-shrink-0 animate-pulse rounded-2xl border border-border bg-white p-4"
              >
                <div className="mb-4 h-4 w-24 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="h-20 rounded-xl bg-gray-100"></div>
                  <div className="h-20 rounded-xl bg-gray-100"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Pipeline de recrutement
          </h1>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <span className="material-symbols-outlined mb-2 text-3xl text-red-400">
            error
          </span>
          <p className="font-body text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-3 rounded-lg bg-red-100 px-4 py-2 font-body text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Pipeline de recrutement
          </h1>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
              filter_list
            </span>
            <select
              className="min-w-[180px] appearance-none rounded-xl border border-border bg-white py-2.5 pl-10 pr-10 font-body text-sm text-text-primary shadow-sm transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedJob}
              onChange={function (e) {
                setSelectedJob(e.target.value);
              }}
            >
              {jobOpenings.map(function (job) {
                return (
                  <option key={job} value={job}>
                    {job}
                  </option>
                );
              })}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
              expand_more
            </span>
          </div>
        </div>
      </header>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:-mx-0 md:px-0">
        {filteredPipeline.map(function (column) {
          var isCandidatureColumn = column.title === "Candidature";
          return (
            <PipelineColumn
              key={column.title}
              title={column.title}
              count={column.candidates.length}
              color={column.color}
              candidates={column.candidates}
              onDrop={handleDrop}
              onCandidateDragStart={handleCandidateDragStart}
              onCandidateDragEnd={handleCandidateDragEnd}
              onCandidateClick={handleCandidateClick}
              topCandidateIds={isCandidatureColumn ? topCandidateIds : []}
              dragging={dragging}
              waitingCount={0}
              totalReceived={
                isCandidatureColumn ? column.candidates.length : 0
              }
            />
          );
        })}
      </div>

      <CandidateModal
        candidate={modalCandidate}
        pipelineOrder={pipelineOrder}
        onClose={closeModal}
        onNextStage={moveToNextStage}
        onRefuse={handleRefuseFromModal}
        findCandidateColumn={findCandidateColumn}
      />

      <EntretienModal
        candidate={entretienModal ? entretienModal.candidate : null}
        onConfirm={handleEntretienConfirm}
        onCancel={handleEntretienCancel}
      />

      {lastMove && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-text-primary px-4 py-3 text-white shadow-lg animate-fade-in sm:right-auto sm:max-w-md">
          <span className="material-symbols-outlined text-lg text-secondary">
            check_circle
          </span>
          <span className="min-w-0 flex-1 truncate font-body text-sm font-medium">
            {lastMove.candidate.name} → {lastMove.toColumn}
          </span>
          <button
            type="button"
            onClick={cancelLastMove}
            className="ml-2 font-body text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Annuler
          </button>
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-white shadow-lg animate-fade-in sm:right-auto sm:max-w-md">
          <span className="break-words font-body text-sm font-medium">
            {errorToast}
          </span>
        </div>
      )}

      {successToast && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 text-white shadow-lg animate-fade-in sm:right-auto sm:max-w-md">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="break-words font-body text-sm font-medium">
            {successToast}
          </span>
        </div>
      )}

      {warningToast && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-amber-500 px-4 py-3 text-white shadow-lg animate-fade-in sm:right-auto sm:max-w-md">
          <span className="material-symbols-outlined text-lg">warning</span>
          <span className="break-words font-body text-sm font-medium">
            {warningToast}
          </span>
        </div>
      )}

      {dragging && (
        <div
          className={
            "fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-8 py-5 transition-all duration-200 shadow-xl " +
            (trashHover
              ? "border-red-500 bg-red-50 scale-110"
              : "border-red-300 bg-white/90")
          }
          onDragOver={function (e) {
            e.preventDefault();
            setTrashHover(true);
          }}
          onDragEnter={function (e) {
            e.preventDefault();
            setTrashHover(true);
          }}
          onDragLeave={function (e) {
            if (!e.currentTarget.contains(e.relatedTarget)) setTrashHover(false);
          }}
          onDrop={handleTrashDrop}
        >
          <span
            className={
              "material-symbols-outlined text-4xl transition-colors duration-200 " +
              (trashHover ? "text-red-600" : "text-red-400")
            }
          >
            delete
          </span>
          <span
            className={
              "font-body text-sm font-semibold transition-colors duration-200 " +
              (trashHover ? "text-red-600" : "text-red-400")
            }
          >
            {trashHover ? "Relâcher pour rejeter" : "Glisser ici pour rejeter"}
          </span>
        </div>
      )}

      {rejectConfirm && (
        <ModalBackdrop
          onClose={function () {
            setRejectConfirm(null);
          }}
        >
          <div
            className="relative w-full rounded-t-2xl border border-border bg-white p-6 shadow-2xl md:max-w-md md:rounded-2xl"
            onClick={function (e) {
              e.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
                <span className="material-symbols-outlined text-2xl text-red-600">
                  person_remove
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-text-primary">
                  Rejeter le candidat
                </h3>
                <p className="font-body text-sm text-text-secondary">
                  Cette action place le candidat dans l'etape Refuse.
                </p>
              </div>
            </div>
            <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700">
              Etes-vous sur de vouloir rejeter{" "}
              <span className="font-semibold">{rejectConfirm.name}</span> ?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={function () {
                  setRejectConfirm(null);
                }}
                className="rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-all hover:bg-bg-soft"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 font-body text-sm font-medium text-white shadow-md transition-all hover:bg-red-600"
              >
                <span className="material-symbols-outlined text-lg">
                  person_remove
                </span>
                Rejeter
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}
    </div>
  );
}
