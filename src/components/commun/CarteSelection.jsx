import React from "react";
import { Link } from "react-router-dom";

export default function SelectionCard({
  icon,
  label,
  title,
  subtitle,
  ctaLabel,
  to,
}) {
  return (
    <article
      className="card-animate flex h-full min-h-[320px] flex-col"
      style={{
        backgroundColor: "var(--color-canvas-parchment)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--rounded-lg)",
        padding: "24px",
      }}
    >
      <div className="flex h-full flex-col">
        <div
          className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[var(--rounded-lg)]"
          style={{ color: "var(--color-primary)" }}
        >
          {icon}
        </div>

        {label && (
          <p
            className="mb-2 font-text text-[14px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-ink-muted-48)" }}
          >
            {label}
          </p>
        )}

        <h2
          className="font-display text-[21px] font-semibold leading-[1.19]"
          style={{ color: "var(--color-ink)", letterSpacing: "0.231px" }}
        >
          {title}
        </h2>

        <p
          className="mt-4 font-text text-[17px] font-normal leading-[1.47]"
          style={{ color: "var(--color-ink-muted-80)", letterSpacing: "-0.374px" }}
        >
          {subtitle}
        </p>

        <div className="mt-auto pt-8">
          <Link to={to} className="button-primary no-underline">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}