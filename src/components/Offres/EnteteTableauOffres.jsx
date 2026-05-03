// Lignes : 34 | Couche : composant | Depend de : react
import React from "react";
import PropTypes from "prop-types";

export default function JobsTableHeader({ search, onSearchChange, total }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-bg-soft/50 px-6 py-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={function (e) {
            onSearchChange(e.target.value);
          }}
          placeholder="Rechercher par titre, département ou localisation..."
          className="w-full rounded-xl border border-border bg-white py-2 pl-4 pr-4 font-body text-sm text-text-primary shadow-sm transition-all duration-150 placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

JobsTableHeader.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};
