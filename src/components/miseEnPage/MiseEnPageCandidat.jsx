import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import { useCandidateAuth } from "context/ContexteAuthCandidat";
import MiseEnPageApp from "components/miseEnPage/MiseEnPageApp";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    path: ROUTES.CANDIDATE.DASHBOARD,
    icon: "dashboard",
  },
  {
    label: "Mes Candidatures",
    path: ROUTES.CANDIDATE.MES_CANDIDATURES,
    icon: "work",
  },
  {
    label: "Entretien",
    path: ROUTES.CANDIDATE.ENTRETIENS,
    icon: "calendar_month",
  },
  {
    label: "Parcourir les offres",
    path: ROUTES.CANDIDATE.SPACE_OFFRES,
    icon: "search",
  },
  {
    label: "Mon Profil",
    path: ROUTES.CANDIDATE.PROFILE,
    icon: "person",
  },
];

export default function MiseEnPageCandidat() {
  const { candidat, logout } = useCandidateAuth();
  const navigate = useNavigate();

  // Get user's initials for avatar
  const userInitials = candidat?.nom
    ? candidat.nom
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "C";

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.CANDIDATE.OFFRES);
  };

  return (
    <MiseEnPageApp
      navItems={NAV_ITEMS}
      userLabel={candidat?.nom || "Candidat"}
      userRole="Candidat"
      userAvatar={userInitials}
      onLogout={handleLogout}
      pageTitle="Tableau de bord"
    >
      <Outlet />
    </MiseEnPageApp>
  );
}
