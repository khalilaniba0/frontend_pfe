// Lignes : 241 | Couche : page | Depend de : useJobs, JobsTable, JobStatCard, CreateJobModal, useToast
import React, { useEffect, useMemo, useState } from "react";
import JobStatCard from "components/Offres/CarteStatistiqueOffre";
import JobsTable from "components/Offres/TableauOffres";
import Toast from "components/commun/NotificationToast";
import ModalBackdrop from "components/commun/FondModal";
import { useToast } from "hooks/useNotificationsToast";
import { useJobs } from "hooks/useOffresEntreprise";
import { getCandidaturesByOffre } from "service/restApiRecrutement";

import CreateJobModal from "components/Offres/ModalCreationOffre";

function getOffreStatus(offre) {
  const rawStatus = String(offre?.statut || offre?.status || "")
    .trim()
    .toLowerCase();

  if (["open", "ouverte", "ouvert", "actif", "active", "en cours"].includes(rawStatus)) {
    return "open";
  }

  if (["paused", "pause", "en pause"].includes(rawStatus)) {
    return "paused";
  }

  return "closed";
}

function getOffreTitle(offre) {
  return offre?.poste || offre?.post || "Poste sans titre";
}

function getDisplayStatus(status) {
  if (status === "open") {
    return "Ouverte";
  }
  if (status === "closed") {
    return "Fermée";
  }
  return "En pause";
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteOfferTarget, setDeleteOfferTarget] = useState(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [candidaturesByOfferId, setCandidaturesByOfferId] = useState({});
  const {
    jobs: offres,
    loading,
    error,
    refetch,
    removeJob,
    toggleStatus,
  } = useJobs();
  const { toast, showToast, hideToast } = useToast();

  useEffect(
    function () {
      var isMounted = true;

      async function loadCandidaturesStats() {
        if (!Array.isArray(offres) || offres.length === 0) {
          if (isMounted) {
            setCandidaturesByOfferId({});
          }
          return;
        }

        try {
          var counts = {};
          var offerIds = offres
            .map(function (offre) {
              return String(offre?._id || offre?.id || "").trim();
            })
            .filter(Boolean);

          var results = await Promise.allSettled(
            offerIds.map(function (offerId) {
              return getCandidaturesByOffre(offerId);
            })
          );

          results.forEach(function (result, index) {
            var offerId = offerIds[index];
            if (!offerId) {
              return;
            }

            if (result.status === "fulfilled" && Array.isArray(result.value)) {
              counts[offerId] = result.value.length;
              return;
            }

            counts[offerId] = 0;
          });

          if (isMounted) {
            setCandidaturesByOfferId(counts);
          }
        } catch {
          if (isMounted) {
            setCandidaturesByOfferId({});
          }
        }
      }

      loadCandidaturesStats();

      return function cleanup() {
        isMounted = false;
      };
    },
    [offres]
  );

  const handleCreateSuccess = function (createdOffre) {
    const title = getOffreTitle(createdOffre);
    showToast(`"${title}" a ete ajoutee a vos offres actives.`, "success");
    setShowCreateModal(false);
    refetch({ silent: true });
  };

  const handleToggleStatus = async function (id) {
    try {
      await toggleStatus(id);
    } catch (err) {
      console.error("Toggle status failed:", err);
      showToast(
        err?.response?.data?.message || "Erreur lors du changement de statut",
        "error"
      );
    }
  };

  const handleDelete = function (id) {
    const offerToDelete = offres.find(function (offre) {
      return (offre?._id || offre?.id) === id;
    });

    setDeleteOfferTarget({
      id: id,
      title: getOffreTitle(offerToDelete),
    });
  };

  const handleCloseDeleteModal = function () {
    if (isDeleteSubmitting) {
      return;
    }
    setDeleteOfferTarget(null);
  };

  const handleConfirmDelete = async function () {
    if (!deleteOfferTarget?.id) {
      return;
    }

    setIsDeleteSubmitting(true);
    try {
      await removeJob(deleteOfferTarget.id);
      showToast("Offre supprimee.", "success");
      setDeleteOfferTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast(
        err?.response?.data?.message || err?.message || "Erreur lors de la suppression",
        "error"
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const filteredOffres = useMemo(function () {
    const query = search.trim().toLowerCase();
    if (!query) {
      return offres;
    }

    return offres.filter(function (o) {
      const title = getOffreTitle(o);
      const department = o?.departement || "";
      const location = o?.localisation || "";

      return (
        title.toLowerCase().includes(query) ||
        department.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
      );
    });
  }, [offres, search]);

  const jobs = filteredOffres.map(function (offre) {
    var offreId = String(offre?._id || offre?.id || "");
    return {
      _id: offre?._id || offre?.id,
      title: getOffreTitle(offre),
      department: offre?.departement || "-",
      status: getDisplayStatus(getOffreStatus(offre)),
      createdDate: formatDate(offre?.createdAt),
      candidaturesCount: candidaturesByOfferId[offreId] || 0,
    };
  });

  const totalOffres = offres.length;
  const offresActives = offres.filter(function (o) {
    return getOffreStatus(o) === "open";
  }).length;
  const totalCandidatures = offres.reduce(function (sum, offre) {
    var offreId = String(offre?._id || offre?.id || "");
    return sum + (candidaturesByOfferId[offreId] || 0);
  }, 0);

  const stats = [
    {
      icon: "work_history",
      label: "Total d'offres",
      value: totalOffres,
      badge: null,
      badgeLabel: "",
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
      trend: "neutral",
    },
    {
      icon: "rocket_launch",
      label: "Offres actives",
      value: offresActives,
      badge: null,
      badgeLabel: "",
      iconBg: "bg-secondary-light",
      iconColor: "text-secondary",
      trend: "neutral",
    },
    {
      icon: "groups",
      label: "Total candidatures",
      value: totalCandidatures,
      badge: null,
      badgeLabel: "",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "neutral",
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-text-primary md:text-3xl lg:text-4xl">
            Gestion des Offres
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={function () {
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-150 hover:bg-primary-dark hover:shadow-lg"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Créer une offre
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map(function (stat) {
          return <JobStatCard key={stat.label} {...stat} />;
        })}
      </section>

      <div className="relative max-w-md">
        <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-text-muted">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={function (e) {
            setSearch(e.target.value);
          }}
          placeholder="Rechercher par titre, département ou localisation..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-11 pr-4 font-body text-sm text-text-primary shadow-sm transition-all duration-150 placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-body text-sm text-text-secondary">Chargement...</p>
        </section>
      ) : error ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-body text-sm text-red-500">{error}</p>
        </section>
      ) : offres.length === 0 ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-body text-sm text-text-secondary">Aucune offre disponible</p>
        </section>
      ) : (
        <JobsTable
          jobs={jobs}
          total={jobs.length}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      

      {deleteOfferTarget && (
        <ModalBackdrop onClose={handleCloseDeleteModal}>
          <div
            className="w-full rounded-t-2xl border border-border bg-white p-6 shadow-2xl md:max-w-md md:rounded-2xl"
            onClick={function (e) {
              e.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <span className="material-symbols-outlined text-xl text-red-500">
                  warning
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Confirmer la suppression
                </h3>
                <p className="mt-1 font-body text-sm text-text-secondary">
                  Cette action est irreversible.
                </p>
              </div>
            </div>

            <p className="rounded-xl bg-bg-soft px-4 py-3 font-body text-sm text-text-primary">
              Supprimer l'offre
              <span className="font-semibold"> {deleteOfferTarget.title || ""} </span>?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleteSubmitting}
                className="rounded-lg border border-border px-4 py-2 font-body text-sm text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleteSubmitting}
                className="rounded-lg bg-red-500 px-4 py-2 font-body text-sm text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleteSubmitting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {showCreateModal && (
        <CreateJobModal
          onClose={function () {
            setShowCreateModal(false);
          }}
          onSuccess={handleCreateSuccess}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
