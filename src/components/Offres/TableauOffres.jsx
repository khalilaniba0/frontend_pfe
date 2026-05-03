// Lignes : 89 | Couche : composant | Depend de : JobRow, JobsTableHeader, JobsTablePagination
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import JobRow from "components/Offres/LigneOffre";
 import JobsTableHeader from "components/Offres/EnteteTableauOffres";
import JobsTablePagination from "components/Offres/PaginationTableauOffres";

const JOBS_PER_PAGE = 4;

export default function JobsTable({ jobs, total, onToggleStatus, onDelete, search, onSearchChange }) {
  const [page, setPage] = useState(1);
  const safeTotal = Number.isFinite(total) ? total : jobs.length;
  const totalPages = Math.max(1, Math.ceil(safeTotal / JOBS_PER_PAGE));
  const startIndex = (page - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const visibleJobs = jobs.slice(startIndex, endIndex);
  const displayFrom = safeTotal === 0 ? 0 : startIndex + 1;
  const displayTo = safeTotal === 0 ? 0 : Math.min(page * JOBS_PER_PAGE, safeTotal);

  useEffect(
    function () {
      if (page > totalPages) {
        setPage(totalPages);
      }
    },
    [page, totalPages]
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <JobsTableHeader search={search} onSearchChange={onSearchChange} total={total} />

      <div className="overflow-x-auto">
        <table className="block w-full md:table md:border-collapse text-left">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-border bg-bg-soft/30">
              <th className="px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Titre du Poste
              </th>
              <th className="px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Statut
              </th>
              <th className="px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Date création
              </th>
              <th className="px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Candidatures
              </th>
              <th className="px-6 py-3.5 text-right font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group divide-y divide-border">
            {visibleJobs.length > 0 ? (
              visibleJobs.map(function (job, i) {
                return (
                  <JobRow
                    key={job?._id || i}
                    {...job}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <span className="material-symbols-outlined mb-2 text-4xl text-text-muted">
                    search_off
                  </span>
                  <p className="font-body text-sm text-text-secondary">
                    Aucune offre ne correspond à votre recherche
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <JobsTablePagination
        page={page}
        totalPages={totalPages}
        displayFrom={displayFrom}
        displayTo={displayTo}
        safeTotal={safeTotal}
        onPageChange={setPage}
      />
    </section>
  );
}

JobsTable.propTypes = {
  jobs: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onToggleStatus: PropTypes.func,
  onDelete: PropTypes.func,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};
