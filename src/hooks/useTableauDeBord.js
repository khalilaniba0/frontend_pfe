// Lignes : 58 | Couche : hook | Depend de : restApiDashboard
import { useCallback, useEffect, useState } from "react";

import {
  getDashboardCandidatures,
  getDashboardEntretiens,
  getDashboardOffres,
} from "../service/restApiTableauDeBord";

function extractArray(response) {
  if (Array.isArray(response)) return response;
  const payload = response?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfWeek() {
  const start = startOfWeek();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function buildDashboardStats(offres, candidatures, entretiens) {
  const now = new Date();
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const tomorrowStart = new Date(todayEnd.getTime() + 1);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const candidaturesEnAttente = candidatures.filter(function (c) {
    return c.etape === "soumise";
  });

  const nouvellesToday = candidatures.filter(function (c) {
    const d = new Date(c.createdAt);
    return d >= todayStart && d <= todayEnd;
  });

  const postesOuverts = offres.filter(function (offre) {
    const status = String(offre.statut || offre.status || "").toLowerCase();
    return ["open", "ouverte", "ouvert", "actif", "active", "en cours"].includes(status);
  });

  const enClotureSemaine = offres.filter(function (offre) {
    const dl = new Date(offre.dateLimite);
    return dl >= weekStart && dl <= weekEnd;
  });

  const entretiensSemaine = entretiens.filter(function (entretien) {
    const d = new Date(entretien.dateEntretien || entretien.date_entretien);
    return d >= weekStart && d <= weekEnd;
  });

  const entretiensAujourdhui = entretiens.filter(function (entretien) {
    const d = new Date(entretien.dateEntretien || entretien.date_entretien);
    return d >= todayStart && d <= todayEnd;
  });

  const entretiensDemain = entretiens.filter(function (entretien) {
    const d = new Date(entretien.dateEntretien || entretien.date_entretien);
    return d >= tomorrowStart && d <= tomorrowEnd;
  });

  const offresEnAttente = offres.filter(function (offre) {
    const status = String(offre.statut || offre.status || "").toLowerCase();
    return !["open", "ouverte", "ouvert", "actif", "active", "en cours"].includes(status);
  });

  return {
    candidatures_en_attente: {
      total: candidaturesEnAttente.length,
      nouvelles_aujourd_hui: nouvellesToday.length,
    },
    postes_ouverts: {
      total: postesOuverts.length,
      en_cloture_cette_semaine: enClotureSemaine.length,
    },
    entretiens_cette_semaine: {
      total: entretiensSemaine.length,
      aujourd_hui: entretiensAujourdhui.length,
      demain: entretiensDemain.length,
    },
    offres_en_attente: {
      total: offresEnAttente.length,
      delai_moyen_reponse_jours: 3,
    },
  };
}

function buildRecentCandidatures(candidatures) {
  return candidatures
    .slice()
    .sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 5);
}

function buildUpcomingInterviews(entretiens) {
  const now = new Date();

  return entretiens
    .filter(function (e) {
      return new Date(e.dateEntretien || e.date_entretien) >= now;
    })
    .sort(function (a, b) {
      return (
        new Date(a.dateEntretien || a.date_entretien) -
        new Date(b.dateEntretien || b.date_entretien)
      );
    })
    .slice(0, 5);
}

function buildHiringChartData(candidatures) {
  const MONTH_NAMES = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aout",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const now = new Date();
  const labels = [];
  const dataCandidatures = [];
  const pourvus = [];
  const tauxConversion = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth();
    const year = d.getFullYear();
    labels.push(MONTH_NAMES[month]);

    const monthItems = candidatures.filter(function (candidature) {
      const createdAt = new Date(candidature.createdAt);
      return createdAt.getMonth() === month && createdAt.getFullYear() === year;
    });

    const accepted = monthItems.filter(function (candidature) {
      return candidature.etape === "accepte";
    });

    dataCandidatures.push(monthItems.length);
    pourvus.push(accepted.length);
    tauxConversion.push(
      monthItems.length > 0
        ? Math.round((accepted.length / monthItems.length) * 100)
        : 0
    );
  }

  return {
    labels,
    candidatures: dataCandidatures,
    pourvus,
    tauxConversion,
  };
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCandidatures, setRecentCandidatures] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [hiringChart, setHiringChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async function fetchDashboard(options = {}) {
    const silent = options?.silent === true;

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const [offresResponse, candidaturesResponse, entretiensResponse] = await Promise.all([
        getDashboardOffres(),
        getDashboardCandidatures(),
        getDashboardEntretiens(),
      ]);

      const offres = extractArray(offresResponse);
      const candidatures = extractArray(candidaturesResponse);
      const entretiens = extractArray(entretiensResponse);

      setStats(buildDashboardStats(offres, candidatures, entretiens));
      setRecentCandidatures(buildRecentCandidatures(candidatures));
      setUpcomingInterviews(buildUpcomingInterviews(entretiens));
      setHiringChart(buildHiringChartData(candidatures));
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Impossible de charger les donnees du dashboard.");
      setError(message);
      throw requestError;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(function () {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    recentCandidatures,
    upcomingInterviews,
    hiringChart,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
