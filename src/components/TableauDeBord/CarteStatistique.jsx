import React from "react";
import PropTypes from "prop-types";

export default function StatCard({
  icon = "analytics",
  label = "Statistique",
  value = 0,
  subLabel = "",
  color = "primary",
}) {
  return (
    <div className="apple-card card-animate flex items-start justify-between">
      <div className="relative z-10 flex flex-col gap-1">
        <p
          className="font-text text-[14px] font-normal"
          style={{ color: "var(--color-ink-muted-48)", lineHeight: 1.43, letterSpacing: "-0.224px" }}
        >
          {label}
        </p>
        <p
          className="font-display tabular-nums"
          style={{ fontSize: "40px", fontWeight: 600, lineHeight: 1.1, color: "var(--color-ink)" }}
        >
          {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
        </p>
        {subLabel && (
          <p
            className="mt-1 font-text text-[12px] font-normal"
            style={{ color: "var(--color-ink-muted-48)" }}
          >
            {subLabel}
          </p>
        )}
      </div>
      <div
        className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--rounded-sm)]"
        style={{
          backgroundColor: "var(--color-canvas-parchment)",
          color: "var(--color-primary)",
        }}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  subLabel: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["primary", "secondary", "warning", "success"]),
};
