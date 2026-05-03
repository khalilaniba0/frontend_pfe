import React from "react";
import PropTypes from "prop-types";

function formatDerniereConnexion(dateStr) {
  if (!dateStr) return "Jamais connecté";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserRow({ user }) {
  const userName = user.nom || user.name || "Utilisateur";

  const getInitials = function (name) {
    return name
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeClasses = function (role) {
    if (role === "Admin") {
      return "badge-active";
    }
    return "badge-inactive";
  };

  return (
    <tr className="group block border-b p-4 transition-colors duration-150 md:table-row md:p-0" style={{ borderColor: "var(--color-divider-soft)" }}>
      <td className="block px-0 py-2 md:table-cell md:px-4 md:py-4">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={userName}
              className="avatar-image h-10 w-10 rounded-[var(--rounded-pill)] object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)] font-text text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-canvas-parchment)",
                color: "var(--color-ink)",
              }}
            >
              {getInitials(userName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>
              {userName}
            </p>
            <p className="truncate font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="block px-0 py-2 md:table-cell md:px-4 md:py-4">
        <div className="flex items-center justify-between md:justify-start">
          <span className="font-text text-[12px] md:hidden" style={{ color: "var(--color-ink-muted-48)" }}>Rôle</span>
          <span
            className={getRoleBadgeClasses(user.role)}
          >
            {user.role}
          </span>
        </div>
      </td>

      <td className="block px-0 py-2 md:table-cell md:px-4 md:py-4">
        <div className="flex items-center justify-between md:justify-start">
          <span className="font-text text-[12px] md:hidden" style={{ color: "var(--color-ink-muted-48)" }}>Dernière connexion</span>
          <p className="font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            {formatDerniereConnexion(user.derniereConnexion)}
          </p>
        </div>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nom: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    derniereConnexion: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};
