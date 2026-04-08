// Lignes : 87 | Couche : hook | Depend de : restApiEntretiens, restApiRecruitment
import { useCallback, useEffect, useState } from "react";

import {
  createEntretien,
  deleteEntretien,
  getAllEntretiens,
} from "../service/restApiEntretiens";
import { getPipelineCandidatures } from "../service/restApiRecrutement";
import { getAllUsers } from "../service/restApiUtilisateurs";

function extractArray(response) {
  if (Array.isArray(response)) return response;
  const payload = response?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export function useInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [recruteurs, setRecruteurs] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async function fetchInterviews(options = {}) {
    const silent = options?.silent === true;
    const throwOnError = options?.throwOnError === true;

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const [entretiensResult, usersResult, candidaturesResult] = await Promise.allSettled([
        getAllEntretiens(),
        getAllUsers(),
        getPipelineCandidatures(),
      ]);

      if (entretiensResult.status === "rejected") {
        throw entretiensResult.reason;
      }

      if (candidaturesResult.status === "rejected") {
        throw candidaturesResult.reason;
      }

      const entretiensList = extractArray(entretiensResult.value);
      const candidaturesList = extractArray(candidaturesResult.value);

      let users = [];
      if (usersResult.status === "fulfilled") {
        users = extractArray(usersResult.value);
      } else {
        const statusCode = usersResult.reason?.response?.status;
        if (statusCode !== 403) {
          throw usersResult.reason;
        }
      }

      const recruteursList = users.filter(function (user) {
        const role = String(user?.role || "").toLowerCase();
        return role === "rh" || role === "admin";
      });

      setInterviews(Array.isArray(entretiensList) ? entretiensList : []);
      setRecruteurs(Array.isArray(recruteursList) ? recruteursList : []);
      setCandidatures(Array.isArray(candidaturesList) ? candidaturesList : []);
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de charger les entretiens.");
      setError(message);
      if (throwOnError) {
        throw requestError;
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(function () {
    fetchInterviews();
  }, [fetchInterviews]);

  const addInterview = useCallback(async function addInterview(payload) {
    setLoading(true);
    setError(null);
    try {
      const response = await createEntretien(payload);
      await fetchInterviews({ silent: true, throwOnError: true });
      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de creer cet entretien.");
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  const removeInterview = useCallback(async function removeInterview(id) {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteEntretien(id);
      await fetchInterviews({ silent: true, throwOnError: true });
      return response;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de supprimer cet entretien.");
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [fetchInterviews]);

  return {
    interviews,
    recruteurs,
    candidatures,
    loading,
    error,
    refetch: fetchInterviews,
    addInterview,
    removeInterview,
  };
}
