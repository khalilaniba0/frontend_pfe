// Lignes : 335 | Couche : page | Depend de : useInterviews, InterviewsLayout, InterviewCalendar, EntretiensEnLigneTab, CreateInterviewModal
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import InterviewsLayout from "components/Entretiens/MiseEnPageEntretiens";
import InterviewCalendar from "components/Entretiens/CalendrierEntretiens";
import EntretiensEnLigneTab from "components/Entretiens/EntretiensEnLigneTab";
import CreateInterviewModal from "components/Entretiens/ModalCreationEntretien";
import InterviewDetailsModal from "components/Entretiens/ModalDetailsEntretien";
import { useInterviews } from "hooks/useEntretiens";
import { useAuth } from "context/ContexteAuth";
import { connectGoogleCalendar, getEntretienById } from "service/restApiEntretiens";
import { getUserById } from "service/restApiUtilisateurs";

const CALENDAR_ALLOWED_ETAPES = new Set([
  "entretien_planifie",
  "entretien",
  "entretien_passe",
  "test_technique",
  "test technique",
  "accepte",
  "accepté",
  "offre",
]);

function normalizeEtape(value) {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function getCandidatureEmail(candidature) {
  return normalizeText(
    candidature?.email ||
      candidature?.candidatEmail ||
      candidature?.emailCandidat ||
      candidature?.candidat?.email ||
      candidature?.candidat?.user?.email ||
      ""
  );
}

function getCandidaturePoste(candidature) {
  return normalizeText(
    candidature?.offre?.poste || candidature?.offre?.post || candidature?.poste || ""
  );
}

function findMatchingCandidature(candidatures, email, poste) {
  if (!Array.isArray(candidatures) || candidatures.length === 0 || !email) {
    return null;
  }

  const byEmail = candidatures.filter(function (candidature) {
    return getCandidatureEmail(candidature) === email;
  });

  if (byEmail.length === 0) return null;
  if (!poste) return byEmail[0];

  const exactPoste = byEmail.find(function (candidature) {
    const candidaturePoste = getCandidaturePoste(candidature);
    return candidaturePoste && candidaturePoste === poste;
  });

  return exactPoste || byEmail[0];
}

function getCandidatureId(entretien) {
  if (!entretien) return "";

  if (entretien.candidatureId) return entretien.candidatureId;
  if (entretien.candidature_id) return entretien.candidature_id;

  const nested = entretien.candidature;
  if (typeof nested === "string") return nested;
  if (nested && typeof nested === "object") return nested._id || nested.id || "";

  return "";
}

function isCancelledInterview(entretien) {
  const status =
    entretien?.reponse ||
    entretien?.status ||
    entretien?.statut ||
    entretien?.etat ||
    "";

  return normalizeEtape(status) === "annule";
}

function canDisplayInCalendar(entretien, candidatureEtapesById) {
  if (isCancelledInterview(entretien)) {
    return false;
  }

  const etape =
    entretien?.candidature?.etape ||
    entretien?.etapeCandidature ||
    entretien?.candidatureEtape ||
    entretien?.etape ||
    "";

  const normalized = normalizeEtape(etape);

  if (normalized) return CALENDAR_ALLOWED_ETAPES.has(normalized);

  const candidatureId = getCandidatureId(entretien);
  if (candidatureId) {
    const etapeFromMap = normalizeEtape(candidatureEtapesById[candidatureId]);
    if (!etapeFromMap) return false;
    return CALENDAR_ALLOWED_ETAPES.has(etapeFromMap);
  }

  // Entretiens créés sans candidature (appel direct par email): on les affiche.
  return true;
}

function hasGoogleTokens(googleTokens) {
  if (!googleTokens) {
    return false;
  }
  if (Array.isArray(googleTokens)) {
    return googleTokens.length > 0;
  }
  if (typeof googleTokens === "object") {
    return Object.keys(googleTokens).length > 0;
  }
  return Boolean(googleTokens);
}

function extractPayload(response) {
  return response?.data?.data || response?.data || null;
}

export default function Interviews() {
  const location = useLocation();
  const { user } = useAuth();
  const isRhUser = user?.role === "rh";
  const [activeTab, setActiveTab] = useState("calendrier");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [deletingInterview, setDeletingInterview] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isCheckingGoogleConnection, setIsCheckingGoogleConnection] = useState(true);
  const {
    interviews: entretiens,
    candidatures,
    loading,
    error,
    addInterview,
    removeInterview,
    refetch,
  } = useInterviews();

  useEffect(
    function () {
      let isMounted = true;

      if (!isRhUser) {
        setIsGoogleConnected(false);
        setIsCheckingGoogleConnection(false);
        return function () {
          isMounted = false;
        };
      }

      async function detectGoogleConnection() {
        setIsCheckingGoogleConnection(true);

        const params = new URLSearchParams(location.search);
        const connectedFromQuery = params.get("google") === "connected";
        const connectedFromStoredUser = hasGoogleTokens(user?.googleTokens);

        if (connectedFromQuery && isMounted) {
          setIsGoogleConnected(true);
        }

        if (connectedFromStoredUser && isMounted) {
          setIsGoogleConnected(true);
        }

        if (!user?._id) {
          if (isMounted) {
            setIsGoogleConnected(connectedFromQuery || connectedFromStoredUser);
            setIsCheckingGoogleConnection(false);
          }
          return;
        }

        try {
          const response = await getUserById(user._id);
          const apiUser = response?.data?.data || response?.data?.user || response?.data;
          const googleTokens =
            apiUser?.googleTokens ||
            response?.data?.utilisateur?.googleTokens ||
            response?.data?.data?.utilisateur?.googleTokens;

          if (isMounted) {
            setIsGoogleConnected(
              connectedFromQuery || connectedFromStoredUser || hasGoogleTokens(googleTokens)
            );
          }
        } catch {
          if (isMounted) {
            setIsGoogleConnected(connectedFromQuery || connectedFromStoredUser);
          }
        } finally {
          if (isMounted) {
            setIsCheckingGoogleConnection(false);
          }
        }
      }

      detectGoogleConnection();

      return function () {
        isMounted = false;
      };
    },
    [isRhUser, location.search, user?._id, user?.googleTokens],
  );

  const candidatureEtapesById = useMemo(function () {
    return candidatures.reduce(function (acc, candidature) {
      if (candidature?._id && candidature?.etape) {
        acc[candidature._id] = candidature.etape;
      }
      return acc;
    }, {});
  }, [candidatures]);

  /* ── Build calendar events from entretiens ─── */

  const now = new Date();

  const calendarEvents = entretiens
    .filter(function (entretien) {
      return canDisplayInCalendar(entretien, candidatureEtapesById);
    })
    .map(function (e) {
      const d = new Date(e.dateEntretien || e.date_entretien);
      if (isNaN(d.getTime())) return null;

      const candidatName =
        e.candidatName ||
        e.candidatNom ||
        e.candidat?.nom ||
        e.candidatEmail ||
        e.emailCandidat ||
        e.email ||
        e.candidature?.nom ||
        e.candidature?.candidat?.nom ||
        "Entretien";

      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      return {
        id: e._id || e.id || d.getTime(),
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        title: candidatName,
        time: d.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: e.typeEntretien === "visio" ? "primary" : "secondary",
        isToday: isToday,
        entretien: e,
      };
    })
    .filter(function (e) {
      return e !== null;
    });

  /* ── handle create ─────────────────────────── */

  const handleCreateInterview = async function (payload) {
    try {
      const normalizedRole = String(user?.role || "").toLowerCase();
      if (normalizedRole !== "admin" && normalizedRole !== "rh") {
        return null;
      }

      const rawInterviewDate = payload?.dateEntretien || payload?.date_entretien;
      let interviewDate = null;

      if (typeof rawInterviewDate === "string") {
        const localDateMatch = rawInterviewDate.match(
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
        );

        if (localDateMatch) {
          const year = Number(localDateMatch[1]);
          const month = Number(localDateMatch[2]);
          const day = Number(localDateMatch[3]);
          const hour = Number(localDateMatch[4]);
          const minute = Number(localDateMatch[5]);

          interviewDate = new Date(year, month - 1, day, hour, minute, 0, 0);
        }
      }

      if (!interviewDate && rawInterviewDate) {
        interviewDate = new Date(rawInterviewDate);
      }

      if (!interviewDate || isNaN(interviewDate.getTime())) {
        return null;
      }

      if (interviewDate.getTime() < Date.now()) {
        return null;
      }

      const normalizedEmail = normalizeText(
        payload?.candidatEmail || payload?.emailCandidat || payload?.email || ""
      );
      const normalizedPoste = normalizeText(payload?.poste || "");

      let matchedCandidature = findMatchingCandidature(
        candidatures,
        normalizedEmail,
        normalizedPoste
      );

      if (!matchedCandidature?._id && normalizedEmail) {
        matchedCandidature = findMatchingCandidature(
          candidatures,
          normalizedEmail,
          normalizedPoste
        );
      }

      const finalPayload = {
        ...payload,
        date_entretien: payload?.date_entretien || payload?.dateEntretien,
      };

      if (matchedCandidature?._id) {
        finalPayload.candidature = matchedCandidature._id;
        finalPayload.candidatureId = matchedCandidature._id;
      }

      const response = await addInterview(finalPayload);
      setShowModal(false);

      return response;
    } catch (err) {
      console.error("Interview creation failed:", err);
    }
  };

  const handleDeleteInterview = async function () {
    const id = selectedInterview?._id || selectedInterview?.id;

    if (!id) {
      return;
    }

    try {
      setDeletingInterview(true);
      await removeInterview(id);
      setSelectedInterview(null);
    } catch (err) {
      console.error("Interview deletion failed:", err);
    } finally {
      setDeletingInterview(false);
    }
  };

  const handleGoogleConnect = function () {
    connectGoogleCalendar("/dashboard/interviews");
  };

  /* ── tabs (pass data down) ─────────────────── */

  function CalendrierTab() {
    return (
      <div className="w-full">
        {loading ? (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-text-muted">
              Chargement du calendrier...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-red-500">{error}</p>
          </div>
        ) : calendarEvents.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-text-muted">
              Aucun entretien affichable dans le calendrier.
            </p>
          </div>
        ) : (
          <InterviewCalendar
            events={calendarEvents}
            currentMonth={now.getMonth()}
            currentYear={now.getFullYear()}
            onEventClick={async function (event) {
              const fallbackInterview = event?.entretien || null;
              setSelectedInterview(fallbackInterview);

              const interviewId =
                fallbackInterview?._id || fallbackInterview?.id || null;

              if (!interviewId) {
                return;
              }

              try {
                const response = await getEntretienById(interviewId);
                const detailedInterview = extractPayload(response);

                if (detailedInterview && typeof detailedInterview === "object") {
                  setSelectedInterview(function (previousInterview) {
                    return {
                      ...(previousInterview || {}),
                      ...detailedInterview,
                    };
                  });
                }
              } catch {
                // Keep existing event payload if details request fails.
              }
            }}
          />
        )}
      </div>
    );
  }

  const TABS = {
    calendrier: <CalendrierTab />,
    "en-ligne": (
      <EntretiensEnLigneTab
        entretiens={entretiens}
        loading={loading}
        error={error}
      />
    ),
  };

  return (
    <>
      <div className="animate-fade-in">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display font-semibold" style={{ fontSize: '34px', lineHeight: 1.47, letterSpacing: '-0.374px', color: 'var(--color-ink)' }}>
              Centre de planification
            </h1>
          </div>

          <button
            type="button"
            onClick={function () {
              setShowModal(true);
            }}
            className="button-primary"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Programmer un entretien
          </button>
        </header>

        {isRhUser && (
          <div className="mb-5 rounded-[var(--rounded-lg)] bg-white px-4 py-3 shadow-sm" style={{ border: '1px solid var(--color-hairline)' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--rounded-sm)]" style={{ backgroundColor: 'var(--color-canvas-parchment)', color: 'var(--color-primary)' }}>
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                </div>
                <div>
                  <p className="font-text text-[14px] font-semibold" style={{ color: 'var(--color-ink)' }}>
                    Synchronisation Google Calendar
                  </p>
                  <p className="font-text text-[12px]" style={{ color: 'var(--color-ink-muted-48)' }}>
                    Reliez votre compte Google pour créer et mettre à jour les liens Meet automatiquement.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-body text-xs font-medium " +
                    (isGoogleConnected
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700")
                  }
                >
                  <span
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (isGoogleConnected ? "bg-emerald-500" : "bg-amber-500")
                    }
                  ></span>
                  {isGoogleConnected ? "Connecté" : "Non connecté"}
                </span>

                <button
                  type="button"
                  onClick={handleGoogleConnect}
                  disabled={isCheckingGoogleConnection}
                  className="button-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  {isGoogleConnected ? "Reconnecter Google" : "Connecter Google"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 flex animate-slide-up items-center gap-3 rounded-[var(--rounded-sm)] px-4 py-3" style={{ backgroundColor: '#fff0f0', border: '1px solid #ffc2c2' }}>
            <span className="material-symbols-outlined flex-shrink-0 text-xl" style={{ color: '#ff3b30' }}>
              error
            </span>
            <div className="flex-1">
              <p className="font-text text-[14px] font-semibold" style={{ color: '#ff3b30' }}>
                Erreur de chargement
              </p>
              <p className="font-text text-[12px]" style={{ color: '#ff3b30' }}>{error}</p>
            </div>
            <button
              type="button"
              onClick={function () {
                refetch();
              }}
              className="button-ghost-pill"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Réessayer
            </button>
          </div>
        )}

        <InterviewsLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {TABS[activeTab]}
        </InterviewsLayout>
      </div>

      {showModal && (
        <CreateInterviewModal
          onClose={function () {
            setShowModal(false);
          }}
          onSubmit={handleCreateInterview}
        />
      )}

      {selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          deleting={deletingInterview}
          onClose={function () {
            if (!deletingInterview) {
              setSelectedInterview(null);
            }
          }}
          onDelete={handleDeleteInterview}
        />
      )}

    </>
  );
}
