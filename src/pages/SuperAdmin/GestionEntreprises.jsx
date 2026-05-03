import React, { useCallback, useEffect, useState } from "react";
import {
  getAllEntreprises,
  getEntrepriseDetail,
  suspendreEntreprise,
  reactiverEntreprise,
  deleteEntreprise,
} from "service/restApiSuperAdmin";
import {
  Eye,
  Pause,
  Play,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUT_BADGES = {
  active: "bg-green-100 text-green-700",
  en_attente: "bg-amber-100 text-amber-700",
  rejetee: "bg-red-100 text-red-700",
  suspendue: "bg-gray-100 text-gray-600",
};

const STATUT_LABELS = {
  active: "Active",
  en_attente: "En attente",
  rejetee: "Rejetée",
  suspendue: "Suspendue",
};

const PLAN_BADGES = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

// ─── Delete Confirmation Modal ──────────────────────────────────────────────
function DeleteModal({ visible, entrepriseName, onClose, onConfirm, loading }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
          Confirmer la suppression
        </h3>
        <p className="mb-1 font-body text-sm text-text-secondary">
          Êtes-vous sûr de vouloir supprimer l'entreprise{" "}
          <strong className="text-red-600">{entrepriseName}</strong> ?
        </p>
        <p className="mb-5 font-body text-xs text-red-500">
          Cette action est irréversible. Toutes les données associées (utilisateurs, offres, candidatures, entretiens) seront supprimées.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border bg-white px-4 py-2 font-body text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-500 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50">
            {loading ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Slide-over ──────────────────────────────────────────────────────
function DetailPanel({ visible, entrepriseId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(function () {
    if (!visible || !entrepriseId) return;
    setLoading(true);
    getEntrepriseDetail(entrepriseId)
      .then(function (res) { setData(res.data?.data); })
      .catch(function () { /* silent */ })
      .finally(function () { setLoading(false); });
  }, [visible, entrepriseId]);

  if (!visible) return null;

  const ent = data?.entreprise;
  const users = data?.utilisateurs || [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg font-bold text-text-primary">Détail entreprise</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-soft hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-md-primary border-t-transparent" />
            </div>
          ) : ent ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {ent.logo ? (
                  <img src={ent.logo} alt={ent.nom} className="h-14 w-14 rounded-lg border border-border object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-md-primary/10 font-display text-xl font-bold text-md-primary">
                    {ent.nom?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-base font-bold text-text-primary">{ent.nom}</h4>
                  <p className="font-body text-sm text-text-secondary">{ent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-body text-xs text-text-muted">Statut</p>
                  <span className={"mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold " + (STATUT_BADGES[ent.statut] || "")}>{STATUT_LABELS[ent.statut] || ent.statut}</span>
                </div>
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-body text-xs text-text-muted">Plan</p>
                  <span className={"mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase " + (PLAN_BADGES[ent.plan] || "")}>{ent.plan}</span>
                </div>
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-body text-xs text-text-muted">Inscription</p>
                  <p className="mt-1 font-body text-sm font-medium text-text-primary">{formatDate(ent.dateInscription || ent.createdAt)}</p>
                </div>
                <div className="rounded-lg bg-bg-soft p-3">
                  <p className="font-body text-xs text-text-muted">Secteur</p>
                  <p className="mt-1 font-body text-sm font-medium text-text-primary">{ent.secteur || "—"}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
                  <Users size={16} /> Utilisateurs ({users.length})
                </h4>
                {users.length === 0 ? (
                  <p className="font-body text-sm text-text-muted">Aucun utilisateur</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(function (u) {
                      return (
                        <div key={u._id} className="flex items-center justify-between rounded-lg border border-border bg-bg-soft p-3">
                          <div>
                            <p className="font-body text-sm font-medium text-text-primary">{u.nom || u.name}</p>
                            <p className="font-body text-xs text-text-muted">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-md-primary/10 px-2 py-0.5 text-[11px] font-semibold text-md-primary">{u.role}</span>
                            {u.bloque && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">Bloqué</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="font-body text-sm text-text-muted">Données non disponibles</p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function GestionEntreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const fetchData = useCallback(
    async function (page) {
      setLoading(true);
      try {
        const params = { page: page || 1, limit: 10 };
        if (statutFilter) params.statut = statutFilter;
        const res = await getAllEntreprises(params);
        setEntreprises(res.data?.data || []);
        setPagination(res.data?.pagination || { page: 1, totalPages: 1, total: 0 });
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    },
    [statutFilter]
  );

  useEffect(function () { fetchData(1); }, [fetchData]);

  const filteredEntreprises = search
    ? entreprises.filter(function (e) {
        return e.nom?.toLowerCase().includes(search.toLowerCase());
      })
    : entreprises;

  const handleSuspend = async function (id) {
    setActionLoading(true);
    try {
      await suspendreEntreprise(id);
      await fetchData(pagination.page);
    } catch { /* silent */ } finally { setActionLoading(false); }
  };

  const handleReactivate = async function (id) {
    setActionLoading(true);
    try {
      await reactiverEntreprise(id);
      await fetchData(pagination.page);
    } catch { /* silent */ } finally { setActionLoading(false); }
  };

  const handleDelete = async function () {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteEntreprise(deleteTarget._id);
      setDeleteTarget(null);
      await fetchData(pagination.page);
    } catch { /* silent */ } finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-xl font-bold text-text-primary md:text-2xl">
          Gestion des entreprises
        </h1>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        <select
          value={statutFilter}
          onChange={function (e) { setStatutFilter(e.target.value); }}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 font-body text-sm text-text-primary outline-none transition-all focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actives</option>
          <option value="en_attente">En attente</option>
          <option value="rejetee">Rejetées</option>
          <option value="suspendue">Suspendues</option>
        </select>

        <div className="w-full min-w-0">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            className="h-11 w-full rounded-xl border border-border bg-white px-4 py-2 font-body text-sm text-text-primary outline-none transition-all placeholder:text-text-muted/70 focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-md-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-bg-soft">
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Entreprise</th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Email</th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Plan</th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Statut</th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Inscription</th>
                  <th className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntreprises.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center font-body text-sm text-text-muted">
                      Aucune entreprise trouvée
                    </td>
                  </tr>
                ) : (
                  filteredEntreprises.map(function (ent) {
                    return (
                      <tr key={ent._id} className="border-b border-border last:border-0 transition-colors hover:bg-bg-soft/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {ent.logo ? (
                              <img src={ent.logo} alt="" className="h-8 w-8 rounded-lg border border-border object-cover" />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-md-primary/10 font-display text-xs font-bold text-md-primary">
                                {ent.nom?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <span className="font-body text-sm font-medium text-text-primary">{ent.nom}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">{ent.email}</td>
                        <td className="px-4 py-3">
                          <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase " + (PLAN_BADGES[ent.plan] || "")}>{ent.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + (STATUT_BADGES[ent.statut] || "")}>{STATUT_LABELS[ent.statut] || ent.statut}</span>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">{formatDate(ent.dateInscription || ent.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={function () { setDetailTarget(ent._id); }} title="Voir détail" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-soft hover:text-md-primary">
                              <Eye size={16} />
                            </button>
                            {ent.statut === "active" && (
                              <button onClick={function () { handleSuspend(ent._id); }} disabled={actionLoading} title="Suspendre" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-amber-50 hover:text-amber-600">
                                <Pause size={16} />
                              </button>
                            )}
                            {ent.statut === "suspendue" && (
                              <button onClick={function () { handleReactivate(ent._id); }} disabled={actionLoading} title="Réactiver" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-green-50 hover:text-success">
                                <Play size={16} />
                              </button>
                            )}
                            <button onClick={function () { setDeleteTarget(ent); }} title="Supprimer" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-red-50 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="font-body text-xs text-text-muted">
                Page {pagination.page} sur {pagination.totalPages} · {pagination.total} résultats
              </p>
              <div className="flex gap-1">
                <button
                  onClick={function () { fetchData(pagination.page - 1); }}
                  disabled={pagination.page <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={function () { fetchData(pagination.page + 1); }}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DeleteModal
        visible={deleteTarget !== null}
        entrepriseName={deleteTarget?.nom}
        onClose={function () { setDeleteTarget(null); }}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
      <DetailPanel
        visible={detailTarget !== null}
        entrepriseId={detailTarget}
        onClose={function () { setDetailTarget(null); }}
      />
    </div>
  );
}
