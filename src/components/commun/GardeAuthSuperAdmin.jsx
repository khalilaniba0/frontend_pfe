import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSuperAdmin } from "context/ContexteSuperAdmin";
import { ROUTES } from "constants/routes";

export default function GardeAuthSuperAdmin() {
  const { superadmin, isLoading } = useSuperAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-md-primary border-t-transparent" />
          <p className="font-body text-sm font-medium text-text-secondary">
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  if (!superadmin) {
    return <Navigate to={ROUTES.SUPERADMIN.LOGIN} replace />;
  }

  return <Outlet />;
}
