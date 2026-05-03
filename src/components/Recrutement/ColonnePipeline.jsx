import React from "react";
import PropTypes from "prop-types";
import CandidateCard from "components/Recrutement/CarteCandidat.jsx";

export default function PipelineColumn({
  title = "Colonne",
  count = 0,
  color = "bg-slate-500",
  candidates = [],
  onDragOver = function () { },
  onDrop = function () { },
  onCandidateDragStart = function () { },
  onCandidateDragEnd = function () { },
  onCandidateClick = function () { },
  topCandidateIds = [],
  dragging = null,
  totalReceived = 0,
}) {
  var isDragOverState = React.useState(false);
  var isDragOver = isDragOverState[0];
  var setIsDragOver = isDragOverState[1];

  var emptyMessages = {
    "Candidature": "Aucune candidature reçue",
    "Présélection": "Aucun candidat en présélection",
    "Entretien": "Aucun entretien planifié",
    "Test technique": "Aucun test en cours",
    "Offre": "Aucune offre envoyée",
  };

  var message = emptyMessages[title] || "Aucun candidat";

  function handleDragOver(e) {
    e.preventDefault();
    if (onDragOver) {
      onDragOver(e);
    }
  }

  function handleDragEnter(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (onDrop) {
      onDrop(title);
    }
  }

  return (
    <div
      className="min-w-[280px] shrink-0 md:min-w-0 md:shrink md:basis-0 md:flex-1"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="font-body text-sm font-semibold text-text-primary">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-soft font-body text-xs font-semibold tabular-nums text-text-secondary">
            {count}
          </span>
          {title === "Candidature" && totalReceived > 0 && (
            <span className="rounded-full bg-bg-soft px-2 py-0.5 font-body text-xs text-text-muted">
              {totalReceived} total
            </span>
          )}
        </div>
      </div>

      <div
        className={
          "flex max-h-[calc(100vh-320px)] flex-col gap-3 overflow-y-auto rounded-xl p-2 transition-all duration-200 " +
          (isDragOver
            ? "border-2 border-dashed border-primary bg-primary/5"
            : "border-2 border-transparent bg-bg-soft/50")
        }
      >
        {candidates.length > 0 ? (
          candidates.map(function (candidate) {
            var candidateId = candidate.id;
            var isDragging = dragging && dragging.candidateId === candidateId;
            return (
              <CandidateCard
                key={candidateId}
                name={candidate.name}
                role={candidate.role}
                appliedDate={candidate.appliedDate}
                avatar={candidate.avatar}
                score={candidate.score}
                scoreStatus={candidate.scoreStatus}
                hasIaReport={candidate.hasIaReport}
                draggable={true}
                onDragStart={function (e) {
                  onCandidateDragStart(candidateId, title, e);
                }}
                onDragEnd={onCandidateDragEnd}
                onClick={function () {
                  onCandidateClick(candidate);
                }}
                isDragging={isDragging}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined mb-2 text-3xl text-text-muted">
              person_search
            </span>
            <p className="font-body text-sm text-text-muted">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

PipelineColumn.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  color: PropTypes.string,
  candidates: PropTypes.arrayOf(PropTypes.object),
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onCandidateDragStart: PropTypes.func,
  onCandidateDragEnd: PropTypes.func,
  onCandidateClick: PropTypes.func,
  topCandidateIds: PropTypes.arrayOf(PropTypes.string),
  dragging: PropTypes.object,
  totalReceived: PropTypes.number,
};
