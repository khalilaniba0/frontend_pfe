import React from "react";

export default function FeatureCard({ icon, title, description, tag }) {
  return (
    <div
      className="apple-card card-animate flex flex-col transition-all duration-200"
      style={{ padding: "24px" }}
      onMouseEnter={function (e) {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={function (e) {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className="flex h-[46px] w-[46px] items-center justify-center rounded-[var(--rounded-sm)]"
          style={{
            backgroundColor: "var(--color-canvas-parchment)",
            color: "var(--color-primary)",
          }}
        >
          {icon}
        </div>
        {tag && (
          <span
            className="font-text text-[12px] font-semibold"
            style={{
              backgroundColor: "var(--color-canvas-parchment)",
              color: "var(--color-ink-muted-48)",
              padding: "4px 12px",
              borderRadius: "var(--rounded-pill)",
              letterSpacing: "-0.12px",
            }}
          >
            {tag}
          </span>
        )}
      </div>

      <h4
        className="mb-2.5 font-text text-[17px] font-semibold"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.374px" }}
      >
        {title}
      </h4>

      <p
        className="font-text text-[17px] font-normal leading-[1.47]"
        style={{ color: "var(--color-ink-muted-80)", letterSpacing: "-0.374px" }}
      >
        {description}
      </p>
    </div>
  );
}
