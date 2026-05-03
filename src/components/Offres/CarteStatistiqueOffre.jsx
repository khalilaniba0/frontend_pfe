import React from "react";
import PropTypes from "prop-types";

export default function JobStatCard({
  icon,
  label,
  value,
  badge = null,
  badgeLabel = "",
  iconBg,
  iconColor,
  trend = "neutral",
}) {
  return (
    <div className="apple-card card-animate flex h-36 flex-col justify-between">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[var(--rounded-sm)]"
          style={{
            backgroundColor: "var(--color-canvas-parchment)",
            color: "var(--color-primary)",
          }}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {badge && (
          <div className="flex items-center gap-1.5">
            <span
              className="font-text text-[12px] font-semibold tabular-nums"
              style={{ color: "var(--color-ink-muted-48)" }}
            >
              {badge}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="font-text text-[14px] font-normal" style={{ color: "var(--color-ink-muted-48)" }}>
          {label}
        </p>
        <h3
          className="mt-0.5 font-display tabular-nums"
          style={{ fontSize: "40px", fontWeight: 600, color: "var(--color-ink)" }}
        >
          {value}
        </h3>
      </div>
    </div>
  );
}

JobStatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  badge: PropTypes.string,
  badgeLabel: PropTypes.string,
  iconBg: PropTypes.string,
  iconColor: PropTypes.string,
  trend: PropTypes.oneOf(["up", "down", "neutral"]),
};
