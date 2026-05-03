import React from "react";
import PropTypes from "prop-types";

export default function CandidateCard({
  name = "Candidat",
  role = "Poste",
  appliedDate = "N/A",
  avatar = "",
  score = null,
  scoreStatus = "ready",
  hasIaReport = false,
  onClick = null,
  draggable = false,
  onDragStart = function () {},
  onDragEnd = function () {},
  isDragging = false,
}) {
  function getScoreColor(scoreValue) {
    if (scoreValue <= 40) return "bg-red-500";
    if (scoreValue <= 69) return "bg-amber-500";
    return "bg-emerald-500";
  }

  const initials = name
    .split(" ")
    .map(function (n) {
      return n[0];
    })
    .join("")
    .toUpperCase();

  function handleCardClick(e) {
    var target = e.target;
    var isInteractive = false;
    while (target && target !== e.currentTarget) {
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "LABEL"
      ) {
        isInteractive = true;
        break;
      }
      target = target.parentElement;
    }
    if (!isInteractive && onClick) {
      onClick();
    }
  }

  function handleDragStart(e) {
    var ghost = e.currentTarget.cloneNode(true);
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    ghost.style.width = e.currentTarget.offsetWidth + "px";
    ghost.style.opacity = "0.9";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(function () {
      document.body.removeChild(ghost);
    }, 0);
    onDragStart(e);
  }

  return (
    <div
      className={
        "group card-animate cursor-pointer rounded-[var(--rounded-lg)] border p-4 transition-transform duration-150 hover:-translate-y-0.5 " +
        (isDragging ? "dragging" : "")
      }
      style={{
        borderColor: "var(--color-hairline)",
        backgroundColor: "var(--color-canvas)",
      }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
    >
      <div className="mb-2 flex items-center gap-3">
        {avatar ? (
          <img
            alt={name}
            className="avatar-image h-10 w-10 rounded-[var(--rounded-pill)] bg-white object-cover"
            src={avatar}
          />
        ) : (
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--rounded-pill)] font-text text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-canvas-parchment)",
              color: "var(--color-ink)",
            }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-text text-[17px] font-semibold" style={{ color: "var(--color-ink)" }}>
            {name}
          </p>
          <p className="truncate font-text text-[14px]" style={{ color: "var(--color-ink-muted-48)" }}>
            {role}
          </p>
        </div>
      </div>

      {scoreStatus === "pending" ? (
        <div className="mb-3 rounded-[var(--rounded-sm)] border border-dashed px-3 py-2" style={{ borderColor: "var(--color-hairline)", backgroundColor: "var(--color-canvas-parchment)" }}>
          <p className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>
            Analyse IA en cours...
          </p>
        </div>
      ) : score !== undefined && score !== null ? (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-text text-[12px]" style={{ color: "var(--color-ink-muted-48)" }}>Score IA</span>
            <span className={"font-text text-[12px] font-semibold tabular-nums " + (score <= 40 ? "text-red-600" : score <= 69 ? "text-amber-600" : "text-emerald-600")}>
              {score}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-[var(--rounded-pill)]" style={{ backgroundColor: "var(--color-divider-soft)" }}>
            <div
              className={"h-full rounded-full transition-all duration-300 " + getScoreColor(score)}
              style={{ width: score + "%" }}
            ></div>
          </div>
        </div>
      ) : null}

      {hasIaReport && (
        <div className="badge-count mb-2 inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">psychology</span>
          Rapport IA disponible
        </div>
      )}

      <div className="flex items-center border-t pt-2.5" style={{ borderColor: "var(--color-divider-soft)" }}>
        <div className="flex items-center gap-1.5" style={{ color: "var(--color-ink-muted-48)" }}>
          <span className="material-symbols-outlined text-sm">
            calendar_today
          </span>
          <span className="font-text text-[12px]">{appliedDate}</span>
        </div>
      </div>
    </div>
  );
}

CandidateCard.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  appliedDate: PropTypes.string,
  avatar: PropTypes.string,
  score: PropTypes.number,
  scoreStatus: PropTypes.oneOf(["ready", "pending"]),
  hasIaReport: PropTypes.bool,
  onClick: PropTypes.func,
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  isDragging: PropTypes.bool,
};
