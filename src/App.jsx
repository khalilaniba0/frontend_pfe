import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "constants/routes";
import ProtectedRoute from "components/commun/RouteProtegee";
import CandidateAuthGuard from "components/commun/GardeAuthCandidat";
import GardeAuthSuperAdmin from "components/commun/GardeAuthSuperAdmin";

import PublicLayout from "components/miseEnPage/MiseEnPagePublique";
import AdminLayout from "components/miseEnPage/MiseEnPageAdmin";
import CandidateLayout from "components/miseEnPage/MiseEnPageCandidat";
import MiseEnPageSuperAdmin from "components/miseEnPage/MiseEnPageSuperAdmin";

import SelectionPage from "pages/PageSelection";
import LandingPage from "pages/PageAccueil";
import Login from "pages/Connexion";
import SignUp from "pages/Inscription";
import ForgotPassword from "pages/MotDePasseOublie";
import ResetPassword from "pages/ResetPassword";
import ProfileForm from "pages/FormulaireProfil";

import Dashboard from "pages/TableauDeBord";
import Recruitment from "pages/Recrutement";
import Jobs from "pages/Offres";
import Interviews from "pages/Entretiens";
import Users from "pages/Utilisateurs";
import Settings from "pages/Parametres";

import CandidateLogin from "pages/Candidat/ConnexionCandidat";
import CandidateSignup from "pages/Candidat/InscriptionCandidat";
import CandidateDashboard from "pages/Candidat/TableauDeBordCandidat";
import MesCandidatures from "pages/Candidat/MesCandidatures";
import CandidateInterviews from "pages/Candidat/EntretiensCandidat";
import CandidateProfile from "pages/Candidat/ProfilCandidat";
import CandidateOffresList from "pages/Candidat/ListeOffresCandidat";
import JobList from "pages/Candidat/ListeOffresPubliques";
import JobDetail from "pages/Candidat/DetailOffrePublique";
import CandidateJobDetail from "pages/Candidat/DetailOffreCandidat";

import AcceptInvitation from "pages/AccepterInvitation";
import InitialSetup from "pages/ConfigurationInitiale";

// SuperAdmin pages
import ConnexionSuperAdmin from "pages/SuperAdmin/ConnexionSuperAdmin";
import DashboardSuperAdmin from "pages/SuperAdmin/DashboardSuperAdmin";
import DemandesInscription from "pages/SuperAdmin/DemandesInscription";
import GestionEntreprises from "pages/SuperAdmin/GestionEntreprises";
import GestionUtilisateurs from "pages/SuperAdmin/GestionUtilisateurs";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>          <Route path="/invitation/:token" element={<AcceptInvitation />} />        <Route path={ROUTES.PUBLIC.SELECTION} element={<SelectionPage />} />
        <Route path={ROUTES.PUBLIC.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.PUBLIC.LOGIN} element={<Login />} />
        <Route path={ROUTES.PUBLIC.SIGNUP} element={<SignUp />} />
        <Route
          path={ROUTES.PUBLIC.FORGOT_PASSWORD}
          element={<ForgotPassword mode="rh" />}
        />
        <Route
          path={ROUTES.CANDIDATE.FORGOT_PASSWORD}
          element={<ForgotPassword mode="candidat" />}
        />
        <Route path={ROUTES.PUBLIC.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.CANDIDATE.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.PUBLIC.PROFILE_FORM} element={<ProfileForm />} />

        <Route path={ROUTES.CANDIDATE.OFFRES} element={<JobList />} />
        <Route path={ROUTES.CANDIDATE.OFFRES_DETAIL} element={<JobDetail />} />
        <Route path={ROUTES.CANDIDATE.LOGIN} element={<CandidateLogin />} />
        <Route path={ROUTES.CANDIDATE.SIGNUP} element={<CandidateSignup />} />
      </Route>

      <Route
        path={ROUTES.ADMIN.ROOT}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />          <Route path="setup" element={<InitialSetup />} />        <Route path="recruitment" element={<Recruitment />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="interviews" element={<Interviews />} />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.ADMIN.ROOT} replace />} />
      </Route>

      <Route element={<CandidateAuthGuard />}>
        <Route path={ROUTES.CANDIDATE.ROOT} element={<CandidateLayout />}>
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="mes-candidatures" element={<MesCandidatures />} />
          <Route path="entretiens" element={<CandidateInterviews />} />
          <Route path="offres" element={<CandidateOffresList />} />
          <Route path="offres/:id" element={<CandidateJobDetail />} />
          <Route path="profil" element={<CandidateProfile />} />
        </Route>
      </Route>

      {/* ─── SuperAdmin routes ─── */}
      <Route
        path={ROUTES.SUPERADMIN.LOGIN}
        element={<ConnexionSuperAdmin />}
      />
      <Route element={<GardeAuthSuperAdmin />}>
        <Route path={ROUTES.SUPERADMIN.ROOT} element={<MiseEnPageSuperAdmin />}>
          <Route path="dashboard" element={<DashboardSuperAdmin />} />
          <Route path="demandes" element={<DemandesInscription />} />
          <Route path="entreprises" element={<GestionEntreprises />} />
          <Route path="utilisateurs" element={<GestionUtilisateurs />} />
          <Route index element={<Navigate to={ROUTES.SUPERADMIN.DASHBOARD} replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.PUBLIC.SELECTION} replace />} />
    </Routes>
  );
}
