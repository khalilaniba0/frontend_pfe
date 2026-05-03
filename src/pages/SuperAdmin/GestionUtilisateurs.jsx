import React, { useCallback, useEffect, useState } from "react";
import {
  getAllUtilisateurs,
  getAllEntreprises,
  getAllCandidats,
  toggleBlockUser,
  deleteUtilisateur,
} from "service/restApiSuperAdmin";
import { Lock, Unlock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ROLE_BADGES = {
  admin: "bg-primary-light text-primary-dark",
  rh: "bg-secondary-light text-secondary",
  candidat: "bg-indigo-100 text-indigo-700",
};

function normalizeUser(user, sourceRole) {
  if (!user) return null;

  if (sourceRole === "candidat") {
    return {
      _id: user._id,
      nom: user.nom,
      name: user.nom,
      email: user.email,
      role: "candidat",
      entreprise: null,
      bloque: false,
      createdAt: user.createdAt,
      avatar: user.photo_url || user.photoUrl || user.photo || "",
    };
  }

  return user;
}

function getUserInitials(user) {
  const name = (user.nom || user.name || "U").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ─── Delete Confirmation Modal ──────────────────────────────────────────────
function DeleteModal({ visible, userName, onClose, onConfirm, loading }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <h3 className="mb-2 font-display text-lg font-bold text-text-primary">
          Confirmer la suppression
        </h3>
        <p className="mb-5 font-body text-sm text-text-secondary">
          Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
          <strong className="text-red-600">{userName}</strong> ? Cette action est
          irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-white px-4 py-2 font-body text-sm font-medium text-text-secondary hover:bg-bg-soft"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500 px-4 py-2 font-body text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Admin Modal ─────────────────────────────────────────────────────
/* CreateAdminModal removed — feature deprecated */

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function GestionUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState("");
  const [entrepriseFilter, setEntrepriseFilter] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  

  // Entreprises for filter dropdown + create modal
  const [allEntreprises, setAllEntreprises] = useState([]);
  const pageSize = 10;

  const fetchData = useCallback(
    async function () {
      setLoading(true);
      try {
        const [usersRes, candidatesRes] = await Promise.all([
          getAllUtilisateurs({ limit: 1000 }),
          getAllCandidats({ limit: 1000 }),
        ]);

        const users = Array.isArray(usersRes.data?.data)
          ? usersRes.data.data
          : [];
        const candidates = Array.isArray(candidatesRes.data?.data)
          ? candidatesRes.data.data
          : [];

        const merged = users
          .map(function (user) {
            return normalizeUser(user, "utilisateur");
          })
          .concat(
            candidates.map(function (candidate) {
              return normalizeUser(candidate, "candidat");
            })
          )
          .filter(Boolean)
          .sort(function (a, b) {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });

        setUtilisateurs(merged);
        setPagination(function (prev) {
          return { ...prev, page: 1 };
        });
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(
    function () {
      fetchData();
    },
    [fetchData]
  );

  useEffect(
    function () {
      setPagination(function (prev) {
        return { ...prev, page: 1 };
      });
    },
    [roleFilter, entrepriseFilter, search]
  );

  // Load entreprises once.
  useEffect(function () {
    getAllEntreprises({ limit: 200, statut: "active" })
      .then(function (res) {
        setAllEntreprises(res.data?.data || []);
      })
      .catch(function () {
        /* silent */
      });
  }, []);

  const filteredUsers = search
    ? utilisateurs.filter(function (u) {
        const s = search.toLowerCase();
        return (
          (u.nom || u.name || "").toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)
        );
      })
    : utilisateurs;

  const roleFilteredUsers = filteredUsers.filter(function (user) {
    if (!roleFilter) return true;
    return user.role === roleFilter;
  });

  const entrepriseFilteredUsers = roleFilteredUsers.filter(function (user) {
    if (!entrepriseFilter) return true;
    return String(user.entreprise?._id || user.entreprise || "") === String(entrepriseFilter);
  });

  const totalFilteredUsers = entrepriseFilteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredUsers / pageSize));
  const currentPage = Math.min(pagination.page, totalPages);
  const pageUsers = entrepriseFilteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleToggleBlock = async function (id) {
    setActionLoading(true);
    try {
      await toggleBlockUser(id);
      await fetchData();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async function () {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteUtilisateur(deleteTarget._id);
      setDeleteTarget(null);
      await fetchData();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-xl font-bold text-text-primary md:text-2xl">
          Gestion des utilisateurs
        </h1>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[220px_220px_minmax(0,1fr)] md:items-center">
        <select
          value={roleFilter}
          onChange={function (e) {
            setRoleFilter(e.target.value);
          }}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 font-body text-sm text-text-primary outline-none transition-all focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="rh">RH</option>
          <option value="candidat">Candidat</option>
        </select>

        <select
          value={entrepriseFilter}
          onChange={function (e) {
            setEntrepriseFilter(e.target.value);
          }}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 font-body text-sm text-text-primary outline-none transition-all focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
        >
          <option value="">Toutes les entreprises</option>
          {allEntreprises.map(function (ent) {
            return (
              <option key={ent._id} value={ent._id}>
                {ent.nom}
              </option>
            );
          })}
        </select>

        <div className="w-full min-w-0">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
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
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Rôle
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Entreprise
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Créé le
                  </th>
                  <th className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center font-body text-sm text-text-muted"
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  pageUsers.map(function (u) {
                    const entName =
                      u.entreprise?.nom || u.entreprise?.name || "—";
                    return (
                      <tr
                        key={u._id}
                        className="border-b border-border last:border-0 transition-colors hover:bg-bg-soft/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-md-primary/10 font-display text-xs font-bold text-md-primary">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.nom || u.name || "Utilisateur"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getUserInitials(u)
                              )}
                            </div>
                            <span className="font-body text-sm font-medium text-text-primary">
                              {u.nom || u.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase " +
                              (ROLE_BADGES[u.role] || "bg-gray-100 text-gray-600")
                            }
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">
                          {entName}
                        </td>
                        <td className="px-4 py-3">
                          {u.bloque ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                              Bloqué
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-text-secondary">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={function () {
                                handleToggleBlock(u._id);
                              }}
                              disabled={actionLoading}
                              title={
                                u.bloque ? "Débloquer" : "Bloquer"
                              }
                              className={
                                "flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors " +
                                (u.bloque
                                  ? "hover:bg-green-50 hover:text-success"
                                  : "hover:bg-amber-50 hover:text-amber-600")
                              }
                            >
                              {u.bloque ? (
                                <Unlock size={16} />
                              ) : (
                                <Lock size={16} />
                              )}
                            </button>
                            <button
                              onClick={function () {
                                setDeleteTarget(u);
                              }}
                              title="Supprimer"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-red-50 hover:text-red-500"
                            >
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="font-body text-xs text-text-muted">
                Page {currentPage} sur {totalPages} · {totalFilteredUsers} résultats
              </p>
              <div className="flex gap-1">
                <button
                  onClick={function () {
                    setPagination(function (prev) {
                      return { ...prev, page: Math.max(1, prev.page - 1) };
                    });
                  }}
                  disabled={currentPage <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-bg-soft disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={function () {
                    setPagination(function (prev) {
                      return { ...prev, page: Math.min(totalPages, prev.page + 1) };
                    });
                  }}
                  disabled={currentPage >= totalPages}
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
        userName={deleteTarget?.nom || deleteTarget?.name}
        onClose={function () {
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
      {/* CreateAdminModal removed */}
    </div>
  );
}
