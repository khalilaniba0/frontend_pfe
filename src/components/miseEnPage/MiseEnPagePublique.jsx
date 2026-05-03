import React from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <Outlet />
    </div>
  );
}
