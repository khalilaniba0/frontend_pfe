import { useCallback, useEffect, useMemo, useState } from "react";

import { useCandidateAuth } from "context/ContexteAuthCandidat";
import {
  deleteNotificationById,
  getNotificationsByCandidat,
  markNotificationAsRead,
} from "service/restApiNotifications";

const POLLING_INTERVAL_MS = 60000;

function extractArray(response) {
  const payload = response?.data;

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.notifications)) {
    return payload.notifications;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

function getCandidateId(candidat) {
  return candidat?._id || candidat?.id || null;
}

export default function useNotifications(options = {}) {
  const enabled = options.enabled !== false;
  const polling = options.polling !== false;
  const { candidat } = useCandidateAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const candidatId = getCandidateId(candidat);

  const fetchNotifications = useCallback(async function () {
    if (!enabled || !candidatId) {
      if (!candidatId) {
        setNotifications([]);
      }
      setIsLoading(false);
      setError("");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getNotificationsByCandidat(candidatId);
      setNotifications(extractArray(response));
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Impossible de charger les notifications."
      );
    } finally {
      setIsLoading(false);
    }
  }, [candidatId, enabled]);

  useEffect(
    function () {
      if (!enabled) {
        return undefined;
      }

      fetchNotifications();

      if (!candidatId || !polling) {
        return undefined;
      }

      const intervalId = window.setInterval(function () {
        fetchNotifications();
      }, POLLING_INTERVAL_MS);

      return function () {
        window.clearInterval(intervalId);
      };
    },
    [fetchNotifications, candidatId, enabled, polling]
  );

  const markAsRead = useCallback(async function (id) {
    if (!id) {
      return;
    }

    setNotifications(function (previousNotifications) {
      return previousNotifications.map(function (notification) {
        const notificationId = notification?._id || notification?.id;
        if (notificationId !== id) {
          return notification;
        }

        return { ...notification, statut: "lue" };
      });
    });

    try {
      await markNotificationAsRead(id);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Impossible de marquer la notification comme lue."
      );
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async function () {
    const unreadIds = notifications
      .filter(function (notification) {
        return notification?.statut !== "lue";
      })
      .map(function (notification) {
        return notification?._id || notification?.id;
      })
      .filter(Boolean);

    if (!unreadIds.length) {
      return;
    }

    setNotifications(function (currentNotifications) {
      return currentNotifications.map(function (notification) {
        if (notification?.statut === "lue") {
          return notification;
        }

        return { ...notification, statut: "lue" };
      });
    });

    try {
      await Promise.all(
        unreadIds.map(function (notificationId) {
          return markNotificationAsRead(notificationId);
        })
      );
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Impossible de marquer les notifications comme lues."
      );
      fetchNotifications();
    }
  }, [fetchNotifications, notifications]);

  const unreadCount = useMemo(
    function () {
      return notifications.filter(function (notification) {
        return notification?.statut !== "lue";
      }).length;
    },
    [notifications]
  );

  const deleteOne = useCallback(async function (id) {
    if (!id) {
      return;
    }

    const previousNotifications = notifications;

    setNotifications(function (currentNotifications) {
      return currentNotifications.filter(function (notification) {
        const notificationId = notification?._id || notification?.id;
        return notificationId !== id;
      });
    });

    try {
      await deleteNotificationById(id);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Impossible de supprimer cette notification."
      );
      setNotifications(previousNotifications);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteOne,
  };
}
