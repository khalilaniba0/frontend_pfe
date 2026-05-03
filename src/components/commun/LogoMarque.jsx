import React from "react";
import { Link } from "react-router-dom";

function BrandLogoContent({ textClassName, iconClassName }) {
  return (
    <>
      <span className={iconClassName}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2L4 7v10l8 5 8-5V7L12 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M12 8v8M8 10l4-2 4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className={textClassName}>
        Talen<span style={{ color: "var(--color-primary)" }}>tia</span>
      </span>
    </>
  );
}

export default function BrandLogo({
  to,
  className = "",
  variant = "light",
  textClassName,
  iconClassName,
}) {
  const isOnDark = variant === "dark";

  const defaultTextClass =
    textClassName ||
    `font-display text-[20px] font-semibold tracking-[-0.28px] ${
      isOnDark ? "text-white" : "text-[#1d1d1f]"
    }`;

  const defaultIconClass =
    iconClassName ||
    `flex h-8 w-8 items-center justify-center ${
      isOnDark ? "text-white" : "text-[#0066cc]"
    }`;

  const sharedClassName = `inline-flex items-center gap-2 ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={`${sharedClassName} no-underline`} aria-label="Talentia">
        <BrandLogoContent textClassName={defaultTextClass} iconClassName={defaultIconClass} />
      </Link>
    );
  }

  return (
    <div className={sharedClassName} aria-label="Talentia">
      <BrandLogoContent textClassName={defaultTextClass} iconClassName={defaultIconClass} />
    </div>
  );
}