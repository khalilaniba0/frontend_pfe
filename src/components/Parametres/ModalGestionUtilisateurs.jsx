import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { getAllUsers, deleteUser } from "service/restApiUtilisateurs";
import { updateUserPassword } from "service/restApiAuthentification";
import Toast from "components/commun/NotificationToast";
import { useToast } from "hooks/useNotificationsToast";

var AVATAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-amber-400",
  "bg-pink-400",
  "bg-sky-500",
];

function getUserId(user) {
  return user?._id || user?.id || null;
}

function getUserName(user) {
  return user?.nom || user?.name || "Utilisateur";
}

function getRoleValue(user) {
  return String(user?.role || "").trim().toLowerCase();
}

function getRoleLabel(user) {
  var role = getRoleValue(user);
  if (role === "admin") return "Admin";
  if (role === "rh") return "RH";
  if (!role) return "-";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function isAdminUser(user) {
  return getRoleValue(user) === "admin";
}

function getInitials(name) {
  return String(name || "U")
    .split(" ")
    .filter(Boolean)
    .map(function (part) {
      return part.charAt(0);
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(name) {
  var hash = String(name || "")
    .split("")
    .reduce(function (acc, char) {
      return acc + char.charCodeAt(0);
    }, 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function ManageUsersModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const loadUsers = useCallback(async function () {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers();
      const data = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setUsers(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Erreur lors du chargement des utilisateurs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function () {
    document.body.style.overflow = "hidden";
    loadUsers();
    return function () {
      document.body.style.overflow = "";
    };
  }, [loadUsers]);

  const filteredUsers = useMemo(
    function () {
      if (!searchQuery.trim()) return users;
      const query = searchQuery.toLowerCase();
      return users.filter(function (user) {
        return (
          getUserName(user).toLowerCase().includes(query) ||
          String(user.email || "").toLowerCase().includes(query) ||
          getRoleLabel(user).toLowerCase().includes(query)
        );
      });
    },
    [users, searchQuery]
  );

  const handleDelete = async function (user) {
    var userId = getUserId(user);
    if (!userId) return;

    if (isAdminUser(user)) {
      showToast(
        "Impossible de supprimer un compte admin. Pour cela, supprimez l'entreprise.",
        "error"
      );
      return;
    }

    setDeletingUserId(userId);
    try {
      await deleteUser(userId);
      setUsers(function (prev) {
        return prev.filter(function (u) {
          return getUserId(u) !== userId;
        });
      });
      showToast("Utilisateur supprimé avec succès.", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Erreur lors de la suppression",
        "error"
      );
    } finally {
      setDeletingUserId(null);
    }
    setConfirmDeleteId(null);
  };

  const handleOpenPasswordEditor = function (user) {
    var userId = getUserId(user);
    setPasswordUserId(userId);
    setPasswordForm({ password: "", confirm: "" });
    setPasswordError("");
    setConfirmDeleteId(null);
  };

  const handleSavePassword = async function (user) {
    var userId = getUserId(user);
    if (!userId) return;

    if (!passwordForm.password || passwordForm.password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (passwordForm.password !== passwordForm.confirm) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSavingPassword(true);
    setPasswordError("");
    try {
      await updateUserPassword(userId, passwordForm.password);
      setPasswordUserId(null);
      setPasswordForm({ password: "", confirm: "" });
      showToast("Mot de passe mis à jour avec succès.", "success");
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message ||
          "Erreur lors de la mise à jour du mot de passe"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelDelete = function () {
    setConfirmDeleteId(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="mx-4 flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "85vh" }}
      >
        <header className="flex flex-shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-primary">
              manage_accounts
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Gérer les utilisateurs
              </h2>
              <p className="font-body text-xs text-text-secondary">
                Gérez les accès et rôles de votre équipe.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-soft hover:text-text-secondary"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </header>

        <div className="flex-shrink-0 border-b border-border px-6 py-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">
              search
            </span>
            <input
              type="text"
              name="member-search"
              autoComplete="off"
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={function (e) {
                setSearchQuery(e.target.value);
              }}
              className="w-full rounded-lg border border-border py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <p className="mt-2 font-body text-xs text-text-muted">
            Les comptes admin ne peuvent pas être supprimés ici. Pour retirer un
            admin, il faut supprimer l'entreprise.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-body text-sm text-text-muted">Chargement...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 px-6 text-center">
              <p className="font-body text-sm text-red-500">{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="material-symbols-outlined mb-2 text-4xl text-text-muted">
                person_off
              </span>
              <p className="font-body text-sm text-text-muted">
                Aucun utilisateur trouvé
              </p>
            </div>
          ) : (
            filteredUsers.map(function (user) {
              var userId = getUserId(user);
              var userName = getUserName(user);
              var userRole = getRoleLabel(user);
              var isAdmin = isAdminUser(user);
              var isDeleting = deletingUserId === userId;

              return (
                <div key={userId}>
                  <div className="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 hover:bg-bg-soft">
                    <div
                      className={
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-white " +
                        getAvatarColor(userName)
                      }
                    >
                      {getInitials(userName)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-sm font-semibold text-text-primary">
                          {userName}
                        </p>
                        <span
                          className={
                            "rounded-full px-2 py-0.5 font-display text-xs font-medium " +
                            (isAdmin
                              ? "bg-violet-100 text-violet-600"
                              : "bg-bg-soft text-text-secondary")
                          }
                        >
                          {userRole}
                        </span>
                      </div>
                      <p className="truncate font-body text-xs text-text-secondary">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={function () {
                          handleOpenPasswordEditor(user);
                        }}
                        className="cursor-pointer text-text-muted transition-colors hover:text-primary"
                        title="Modifier le mot de passe"
                      >
                        <span className="material-symbols-outlined text-lg">
                          lock_reset
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={function () {
                          if (isAdmin) {
                            showToast(
                              "Impossible de supprimer un compte admin. Supprimez l'entreprise.",
                              "error"
                            );
                            return;
                          }
                          setConfirmDeleteId(userId);
                          setPasswordUserId(null);
                        }}
                        disabled={isAdmin || isDeleting}
                        className="cursor-pointer text-text-muted transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          isAdmin
                            ? "Admin non supprimable"
                            : "Supprimer"
                        }
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>

                  {passwordUserId === userId && (
                    <div className="border-b border-border bg-bg-soft px-6 py-4 last:border-0">
                      <p className="mb-3 font-body text-sm font-medium text-text-primary">
                        Modifier le mot de passe de <strong>{userName}</strong>
                      </p>

                      {passwordError && (
                        <p className="mb-2 font-body text-xs text-red-500">
                          {passwordError}
                        </p>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="password"
                          name="new-password"
                          autoComplete="new-password"
                          value={passwordForm.password}
                          onChange={function (e) {
                            setPasswordForm(function (prev) {
                              return { ...prev, password: e.target.value };
                            });
                          }}
                          placeholder="Nouveau mot de passe"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <input
                          type="password"
                          name="confirm-new-password"
                          autoComplete="new-password"
                          value={passwordForm.confirm}
                          onChange={function (e) {
                            setPasswordForm(function (prev) {
                              return { ...prev, confirm: e.target.value };
                            });
                          }}
                          placeholder="Confirmer le mot de passe"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>

                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={function () {
                            setPasswordUserId(null);
                            setPasswordError("");
                            setPasswordForm({ password: "", confirm: "" });
                          }}
                          className="rounded-lg border border-border px-3 py-1.5 font-body text-sm text-text-secondary transition-colors hover:bg-white"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          disabled={savingPassword}
                          onClick={function () {
                            handleSavePassword(user);
                          }}
                          className="rounded-lg bg-primary px-3 py-1.5 font-body text-sm text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                        >
                          {savingPassword ? "Mise à jour..." : "Enregistrer"}
                        </button>
                      </div>
                    </div>
                  )}

                  {confirmDeleteId === userId && (
                    <div className="flex items-center gap-3 border-b border-border bg-amber-50 px-6 py-3 last:border-0">
                      <span className="material-symbols-outlined flex-shrink-0 text-lg text-amber-500">
                        warning
                      </span>
                      <p className="flex-1 font-body text-sm text-text-primary">
                        Supprimer <strong>{userName}</strong> ? Cette action
                        est irréversible.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          className="rounded-lg border border-border px-3 py-1.5 font-body text-sm text-text-secondary transition-colors hover:bg-bg-soft"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={function () {
                            handleDelete(user);
                          }}
                          className="rounded-lg bg-red-500 px-3 py-1.5 font-body text-sm text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                          disabled={isDeleting}
                        >
                          {isDeleting
                            ? "Suppression..."
                            : "Confirmer la suppression"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>,
    document.body
  );
}

ManageUsersModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
