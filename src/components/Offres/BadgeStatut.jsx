import React from "react";
import PropTypes from "prop-types";

export default function StatusBadge({ status }) {
  let badgeClass = "badge-inactive";

  if (status === "Ouverte") {
    badgeClass = "badge-active";
  } else if (status === "En pause") {
    badgeClass = "badge-pending";
  }

  return (
    <span className={badgeClass}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(["Ouverte", "En pause", "Fermée"]).isRequired,
};
