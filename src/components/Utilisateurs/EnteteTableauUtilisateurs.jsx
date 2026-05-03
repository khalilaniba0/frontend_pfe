// Lignes : 30 | Couche : composant | Depend de : react
import React from "react";
import PropTypes from "prop-types";

export default function UserTableHeader({ searchTerm, onSearchChange }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="font-display font-semibold text-text-primary">
        Membres de l'equipe
      </h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un membre..."
          value={searchTerm}
          onChange={function (e) {
            onSearchChange(e.target.value);
          }}
          className="w-full rounded-xl border border-border bg-bg-soft px-4 py-2 font-body text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
        />
      </div>
    </div>
  );
}

UserTableHeader.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
