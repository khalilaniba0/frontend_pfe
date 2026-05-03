// Lignes : 99 | Couche : hook | Depend de : restApiUser
import { useCallback, useEffect, useState } from "react";

import {
  createRh,
  inviteRh,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../service/restApiUtilisateurs";

function extractArray(payload) {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function extractItem(payload) {
  if (payload?.data?.data && !Array.isArray(payload.data.data)) return payload.data.data;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return null;
}

function getUserId(user) {
  return user?._id || user?.id;
}

function isSameUser(user, id) {
  return String(getUserId(user)) === String(id);
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async function fetchUsers(options = {}) {
    const silent = options?.silent === true;

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await getAllUsers();
      setUsers(extractArray(response));
      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de charger les utilisateurs.");
      setError(message);
      throw requestError;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(function () {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async function createUser(payload) {
    setLoading(true);
    setError(null);
    try {
      const response = await inviteRh(payload);
      const createdUser = { ...(extractItem(response) || payload), isInvited: true, _id: Date.now().toString() };

      setUsers(function (currentUsers) {
        const createdId = getUserId(createdUser);
        if (!createdId) {
          return currentUsers.concat(createdUser);
        }

        const alreadyExists = currentUsers.some(function (currentUser) {
          return isSameUser(currentUser, createdId);
        });

        if (!alreadyExists) {
          return currentUsers.concat(createdUser);
        }

        return currentUsers.map(function (currentUser) {
          if (!isSameUser(currentUser, createdId)) {
            return currentUser;
          }
          return {
            ...currentUser,
            ...createdUser,
          };
        });
      });

      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de creer cet utilisateur.");
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(async function editUser(id, payload) {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUser(id, payload);
      const updatedUser = extractItem(response);

      setUsers(function (currentUsers) {
        return currentUsers.map(function (currentUser) {
          if (!isSameUser(currentUser, id)) {
            return currentUser;
          }
          return {
            ...currentUser,
            ...payload,
            ...(updatedUser || {}),
          };
        });
      });

      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de modifier cet utilisateur.");
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeUser = useCallback(async function removeUser(id) {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUser(id);
      setUsers(function (currentUsers) {
        return currentUsers.filter(function (currentUser) {
          return !isSameUser(currentUser, id);
        });
      });

      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de supprimer cet utilisateur.");
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    editUser,
    removeUser,
  };
}
