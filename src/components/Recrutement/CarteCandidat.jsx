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

  const gradients = [
    "from-pink-400 to-rose-500",
    "from-violet-400 to-purple-500",
    "from-sky-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
  ];

  const gradientIndex =
    name.split("").reduce(function (acc, char) {
      return acc + char.charCodeAt(0);
    }, 0) % gradients.length;

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
        "group cursor-pointer rounded-xl border border-border bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md " +
        (isDragging ? "opacity-50" : "")
      }
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
    >
      <div className="mb-2 flex items-center gap-3">
        {avatar ? (
          <img
            alt={name}
            className="h-10 w-10 rounded-xl bg-gray-100 object-cover"
            src={avatar}
          />
        ) : (
          <div
            className={
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-body text-xs font-bold text-white shadow-sm " +
              gradients[gradientIndex]
            }
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-sm font-semibold text-text-primary">
            {name}
          </p>
          <p className="truncate font-body text-xs text-text-secondary">
            {role}
          </p>
        </div>
      </div>

      {scoreStatus === "pending" ? (
        <div className="mb-3 rounded-lg border border-dashed border-amber-200 bg-amber-50 px-2.5 py-2">
          <p className="font-body text-xs font-medium text-amber-700">
            Analyse IA en cours...
          </p>
        </div>
      ) : score !== undefined && score !== null ? (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-body text-xs text-text-muted">Score IA</span>
            <span className={"font-body text-xs font-semibold tabular-nums " + (score <= 40 ? "text-red-600" : score <= 69 ? "text-amber-600" : "text-emerald-600")}>
              {score}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={"h-full rounded-full transition-all duration-300 " + getScoreColor(score)}
              style={{ width: score + "%" }}
            ></div>
          </div>
        </div>
      ) : null}

      {hasIaReport && (
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-body text-[11px] font-medium text-primary">
          <span className="material-symbols-outlined text-sm">psychology</span>
          Rapport IA disponible
        </div>
      )}

      <div className="flex items-center border-t border-border pt-2.5">
        <div className="flex items-center gap-1.5 text-text-muted">
          <span className="material-symbols-outlined text-sm">
            calendar_today
          </span>
          <span className="font-body text-xs">{appliedDate}</span>
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
