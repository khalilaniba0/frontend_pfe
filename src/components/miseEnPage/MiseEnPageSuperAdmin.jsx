import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSuperAdmin } from "context/ContexteSuperAdmin";
import { ROUTES } from "constants/routes";
import MiseEnPageApp from "components/miseEnPage/MiseEnPageApp";
import { getDemandesEnAttente } from "service/restApiSuperAdmin";

const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.SUPERADMIN.DASHBOARD, icon: "dashboard" },
  { label: "Demandes", path: ROUTES.SUPERADMIN.DEMANDES, icon: "assignment" },
  { label: "Entreprises", path: ROUTES.SUPERADMIN.ENTREPRISES, icon: "business" },
  { label: "Utilisateurs", path: ROUTES.SUPERADMIN.UTILISATEURS, icon: "group" },
];

const PAGE_TITLES = {
  [ROUTES.SUPERADMIN.DASHBOARD]: "Dashboard",
  [ROUTES.SUPERADMIN.DEMANDES]: "Demandes d'inscription",
  [ROUTES.SUPERADMIN.ENTREPRISES]: "Gestion des entreprises",
  [ROUTES.SUPERADMIN.UTILISATEURS]: "Gestion des utilisateurs",
};

export default function MiseEnPageSuperAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { superadmin, logout } = useSuperAdmin();

  useEffect(
    function () {
      getDemandesEnAttente()
        .then(function (res) {
          // Badge count can be displayed here if needed
        })
        .catch(function () {
          /* silent */
        });
    },
    [location.pathname]
  );

  const currentTitle =
    PAGE_TITLES[location.pathname] || "Super Administration";

  const userInitials = superadmin?.nom
    ? superadmin.nom
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "SA";

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.SUPERADMIN.LOGIN);
  };

  return (
    <MiseEnPageApp
      navItems={NAV_ITEMS}
      userLabel={superadmin?.nom || "Super Admin"}
      userRole="Super Admin"
      userAvatar={userInitials}
      onLogout={handleLogout}
      pageTitle={currentTitle}
    >
      <Outlet />
    </MiseEnPageApp>
  );
}
