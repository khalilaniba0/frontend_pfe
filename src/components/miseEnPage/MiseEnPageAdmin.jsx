import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "context/ContexteAuth";
import { NAV_ITEMS } from "constants/navigation";
import MiseEnPageApp from "components/miseEnPage/MiseEnPageApp";

export default function MiseEnPageAdmin() {
  const { user, logout } = useAuth();

  // Filter nav items for this user's roles
  const filteredNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  // Get user's initials for avatar
  const userInitials = user?.nom
    ? user.nom
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <MiseEnPageApp
      navItems={filteredNavItems}
      userLabel={user?.nom || "Admin"}
      userRole={user?.role === "admin" ? "Administrateur" : "Responsable RH"}
      userAvatar={userInitials}
      onLogout={handleLogout}
      pageTitle="Tableau de bord"
    >
      <Outlet />
    </MiseEnPageApp>
  );
}
