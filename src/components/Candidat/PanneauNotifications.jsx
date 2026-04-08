import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const TABS = {
  ALL: "all",
  UNREAD: "unread",
};

const TYPE_LABELS = {
  etape_avancement: "Avancement de candidature",
  entretien_planifie: "Entretien planifie",
  refus: "Resultat de candidature",
  suppression: "Candidature retiree",
  offre_acceptee: "Offre d'emploi",
};

const TYPE_COLORS = {
  etape_avancement: "text-blue-600 bg-blue-50",
  entretien_planifie: "text-amber-600 bg-amber-50",
  refus: "text-red-600 bg-red-50",
  suppression: "text-gray-600 bg-gray-100",
  offre_acceptee: "text-emerald-600 bg-emerald-50",
};

const ICON_MAP = {
  etape_avancement: "trending_up",
  entretien_planifie: "calendar_month",
  refus: "cancel",
  suppression: "delete",
  offre_acceptee: "verified",
};

const ETAPE_LABELS = {
  soumise: "Candidature",
  preselectionne: "Preselection",
  entretien_planifie: "Entretien",
  entretien_passe: "Test technique",
  accepte: "Offre",
  refuse: "Refuse",
};

function getTypeMeta(type) {
  const normalizedType = String(type || "").toLowerCase();

  if (TYPE_LABELS[normalizedType]) {
    return {
      icon: ICON_MAP[normalizedType] || "notifications",
      iconClassName: TYPE_COLORS[normalizedType] || "bg-gray-100 text-gray-600",
      label: TYPE_LABELS[normalizedType] || "Notification",
    };
  }

  if (normalizedType.includes("entretien")) {
    return {
      icon: "calendar_month",
      iconClassName: "bg-indigo-50 text-indigo-600",
      label: "Entretien",
    };
  }

  if (normalizedType.includes("candidature")) {
    return {
      icon: "work",
      iconClassName: "bg-blue-50 text-blue-600",
      label: "Candidature",
    };
  }

  return {
    icon: "notifications",
    iconClassName: "bg-amber-50 text-amber-600",
    label: "Information",
  };
}

function formatFullDate(value) {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "";
  }

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeDate(value) {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return "";
  }

  const deltaMs = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (deltaMs < minute) {
    return "A l'instant";
  }

  if (deltaMs < hour) {
    return `Il y a ${Math.max(1, Math.floor(deltaMs / minute))} min`;
  }

  if (deltaMs < day) {
    return `Il y a ${Math.max(1, Math.floor(deltaMs / hour))} h`;
  }

  if (deltaMs < day * 7) {
    return `Il y a ${Math.max(1, Math.floor(deltaMs / day))} j`;
  }

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  isLoading,
  error,
  markAsRead,
  deleteOne,
}) {
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(
    function () {
      if (!isOpen) {
        setSelectedNotif(null);
      }
    },
    [isOpen]
  );

  const sortedNotifications = useMemo(
    function () {
      return [...notifications].sort(function (a, b) {
        const first = new Date(a?.dateEnvoi || 0).getTime();
        const second = new Date(b?.dateEnvoi || 0).getTime();
        return second - first;
      });
    },
    [notifications]
  );

  const displayedNotifications = useMemo(
    function () {
      if (activeTab === TABS.UNREAD) {
        return sortedNotifications.filter(function (notification) {
          return notification?.statut !== "lue";
        });
      }

      return sortedNotifications;
    },
    [activeTab, sortedNotifications]
  );

  async function handleNotificationClick(notification) {
    setSelectedNotif(notification);

    const notificationId = notification?._id || notification?.id;
    if (!notificationId || notification?.statut === "lue") {
      return;
    }

    await markAsRead(notificationId);
  }

  async function handleDeleteOne(event, notification) {
    event.stopPropagation();

    const notificationId = notification?._id || notification?.id;
    if (!notificationId) {
      return;
    }

    setDeletingId(notificationId);
    await deleteOne(notificationId);

    setSelectedNotif(function (currentSelected) {
      const currentSelectedId = currentSelected?._id || currentSelected?.id;
      return currentSelectedId === notificationId ? null : currentSelected;
    });
    setDeletingId(null);
  }

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition-all duration-300",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <div
        className={[
          "absolute inset-0 bg-black/35 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "absolute right-0 top-0 h-full w-full border-l border-border bg-white shadow-2xl transition-transform duration-300 sm:w-96",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="relative flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary">
                Notifications
              </h2>
              <p className="font-body text-xs text-text-secondary">
                Vos mises a jour recentes
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-bg-soft hover:text-text-primary"
              aria-label="Fermer le panneau"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </header>

          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <button
              type="button"
              onClick={function () {
                setActiveTab(TABS.ALL);
              }}
              className={[
                "rounded-lg px-3 py-1.5 font-body text-xs font-semibold transition-colors",
                activeTab === TABS.ALL
                  ? "bg-primary-light text-primary"
                  : "bg-bg-soft text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              Toutes
            </button>
            <button
              type="button"
              onClick={function () {
                setActiveTab(TABS.UNREAD);
              }}
              className={[
                "rounded-lg px-3 py-1.5 font-body text-xs font-semibold transition-colors",
                activeTab === TABS.UNREAD
                  ? "bg-primary-light text-primary"
                  : "bg-bg-soft text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              Non lues
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
          {isLoading && !notifications.length && (
            <div className="rounded-xl border border-border bg-bg-soft p-4 text-center font-body text-sm text-text-secondary">
              Chargement des notifications...
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-body text-xs text-red-700">
              {error}
            </div>
          )}

          {!isLoading && displayedNotifications.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-soft p-6 text-center">
              <span className="material-symbols-outlined mb-2 text-3xl text-text-muted">
                inbox
              </span>
              <p className="font-body text-sm font-medium text-text-primary">
                Aucune notification
              </p>
              <p className="mt-1 font-body text-xs text-text-secondary">
                Vous etes a jour pour le moment.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {displayedNotifications.map(function (notification) {
              const notificationId = notification?._id || notification?.id;
              const isUnread = notification?.statut !== "lue";
              const typeMeta = getTypeMeta(notification?.type);

              return (
                <div
                  role="button"
                  tabIndex={0}
                  key={notificationId || `${notification?.message}-${notification?.dateEnvoi}`}
                  onClick={function () {
                    handleNotificationClick(notification);
                  }}
                  onKeyDown={function (event) {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleNotificationClick(notification);
                    }
                  }}
                  className={[
                    "w-full cursor-pointer rounded-xl border px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                    isUnread
                      ? "border-primary/30 bg-primary-light/40"
                      : "border-border bg-white hover:bg-bg-soft",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                        typeMeta.iconClassName,
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {typeMeta.icon}
                      </span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="truncate font-body text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          {typeMeta.label}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Supprimer la notification"
                            title="Supprimer"
                            disabled={deletingId === notificationId}
                            onClick={function (event) {
                              handleDeleteOne(event, notification);
                            }}
                            className="rounded-md p-1 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                          {isUnread && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <span className="whitespace-nowrap font-body text-[11px] text-text-muted">
                            {formatRelativeDate(notification?.dateEnvoi)}
                          </span>
                        </div>
                      </div>

                      <p className="font-body text-xs text-text-muted">
                        Cliquez pour voir le detail
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          {selectedNotif && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
              onClick={function () {
                setSelectedNotif(null);
              }}
            >
              <div
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
                onClick={function (event) {
                  event.stopPropagation();
                }}
              >
              <div
                className={[
                  "mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 font-body text-sm font-semibold",
                  TYPE_COLORS[selectedNotif?.type] || "text-gray-600 bg-gray-100",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-lg">
                  {ICON_MAP[selectedNotif?.type] || "notifications"}
                </span>
                {TYPE_LABELS[selectedNotif?.type] || "Notification"}
              </div>

              <p
                className={[
                  "mb-5 font-body text-sm leading-relaxed",
                  selectedNotif?.type === "refus"
                    ? "text-red-700"
                    : "text-text-primary",
                ].join(" ")}
              >
                {selectedNotif?.message || "Nouvelle notification"}
              </p>

              <div className="space-y-2 border-t border-border pt-4 font-body text-xs text-text-muted">
                {selectedNotif?.dateEnvoi && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    Recue le {formatFullDate(selectedNotif.dateEnvoi)}
                  </div>
                )}

                {selectedNotif?.etapeSource && selectedNotif?.etapeCible && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      trending_up
                    </span>
                    {ETAPE_LABELS[selectedNotif.etapeSource] ||
                      selectedNotif.etapeSource}{" "}
                    -&gt;{" "}
                    {ETAPE_LABELS[selectedNotif.etapeCible] ||
                      selectedNotif.etapeCible}
                  </div>
                )}

                {selectedNotif?.typeEntretien && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      video_call
                    </span>
                    Type d'entretien : {selectedNotif.typeEntretien}
                  </div>
                )}

                {selectedNotif?.dateEntretien && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      calendar_month
                    </span>
                    {formatFullDate(selectedNotif.dateEntretien)}
                  </div>
                )}
              </div>

                <button
                  type="button"
                  onClick={function () {
                    setSelectedNotif(null);
                  }}
                  className="mt-5 w-full rounded-xl bg-bg-soft py-2.5 font-body text-sm font-semibold text-text-primary transition-colors hover:bg-border"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  markAsRead: PropTypes.func,
  deleteOne: PropTypes.func,
};

NotificationPanel.defaultProps = {
  isOpen: false,
  onClose: function () {},
  notifications: [],
  isLoading: false,
  error: "",
  markAsRead: async function () {},
  deleteOne: async function () {},
};
