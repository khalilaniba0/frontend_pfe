/**
 * Centralized route definitions grouped by role.
 * Keep legacy flat keys for backward compatibility.
 */

export const USER_ROLES = Object.freeze({
  PUBLIC: "public",
  CANDIDATE: "candidate",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
});

const PUBLIC_ROUTES = Object.freeze({
  SELECTION: "/",
  LANDING: "/landing",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  PROFILE_FORM: "/formulaire",
});

const CANDIDATE_ROUTES = Object.freeze({
  ROOT: "/candidat",
  LOGIN: "/candidat/login",
  SIGNUP: "/candidat/signup",
  FORGOT_PASSWORD: "/candidat/forgot-password",
  RESET_PASSWORD: "/candidat/reset-password/:token",
  OFFRES: "/offres",
  SPACE_OFFRES: "/candidat/offres",
  OFFRES_DETAIL: "/offres/:id",
  SPACE_OFFRES_DETAIL: "/candidat/offres/:id",
  DASHBOARD: "/candidat/dashboard",
  MES_CANDIDATURES: "/candidat/mes-candidatures",
  ENTRETIENS: "/candidat/entretiens",
  PROFILE: "/candidat/profil",
});

const ADMIN_ROUTES = Object.freeze({
  ROOT: "/dashboard",
  RECRUITMENT: "/dashboard/recruitment",
  JOBS: "/dashboard/jobs",
  INTERVIEWS: "/dashboard/interviews",
  USERS: "/dashboard/users",
  SETTINGS: "/dashboard/settings",
});

const SUPERADMIN_ROUTES = Object.freeze({
  LOGIN: "/superadmin/login",
  ROOT: "/superadmin",
  DASHBOARD: "/superadmin/dashboard",
  DEMANDES: "/superadmin/demandes",
  ENTREPRISES: "/superadmin/entreprises",
  UTILISATEURS: "/superadmin/utilisateurs",
});

export const ROUTES_BY_ROLE = Object.freeze({
  [USER_ROLES.PUBLIC]: PUBLIC_ROUTES,
  [USER_ROLES.CANDIDATE]: CANDIDATE_ROUTES,
  [USER_ROLES.ADMIN]: ADMIN_ROUTES,
  [USER_ROLES.SUPERADMIN]: SUPERADMIN_ROUTES,
});

export const ROUTES = Object.freeze({
  PUBLIC: PUBLIC_ROUTES,
  CANDIDATE: CANDIDATE_ROUTES,
  ADMIN: ADMIN_ROUTES,
  SUPERADMIN: SUPERADMIN_ROUTES,

  // Legacy flat keys (compatibility)
  SELECTION: PUBLIC_ROUTES.SELECTION,
  LANDING: PUBLIC_ROUTES.LANDING,
  PROFILE_FORM: PUBLIC_ROUTES.PROFILE_FORM,
  LOGIN: PUBLIC_ROUTES.LOGIN,
  SIGNUP: PUBLIC_ROUTES.SIGNUP,
  FORGOT_PASSWORD: PUBLIC_ROUTES.FORGOT_PASSWORD,
  RESET_PASSWORD: PUBLIC_ROUTES.RESET_PASSWORD,

  CANDIDATE_OFFRES: CANDIDATE_ROUTES.OFFRES,
  CANDIDATE_LOGIN: CANDIDATE_ROUTES.LOGIN,
  CANDIDATE_SIGNUP: CANDIDATE_ROUTES.SIGNUP,
  CANDIDAT_FORGOT_PASSWORD: CANDIDATE_ROUTES.FORGOT_PASSWORD,
  CANDIDAT_RESET_PASSWORD: CANDIDATE_ROUTES.RESET_PASSWORD,

  DASHBOARD: ADMIN_ROUTES.ROOT,
  DASHBOARD_RECRUITMENT: ADMIN_ROUTES.RECRUITMENT,
  JOBS: ADMIN_ROUTES.JOBS,
  DASHBOARD_SETTINGS: ADMIN_ROUTES.SETTINGS,

  SUPERADMIN_LOGIN: SUPERADMIN_ROUTES.LOGIN,
  SUPERADMIN_DASHBOARD: SUPERADMIN_ROUTES.DASHBOARD,
  SUPERADMIN_DEMANDES: SUPERADMIN_ROUTES.DEMANDES,
  SUPERADMIN_ENTREPRISES: SUPERADMIN_ROUTES.ENTREPRISES,
  SUPERADMIN_UTILISATEURS: SUPERADMIN_ROUTES.UTILISATEURS,
});

export function getRoutesByRole(role) {
  return ROUTES_BY_ROLE[role] || ROUTES_BY_ROLE[USER_ROLES.PUBLIC];
}

export default ROUTES;
