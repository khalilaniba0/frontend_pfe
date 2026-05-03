import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import {
  getStats,
  getDemandesEnAttente,
  accepterEntreprise,
  rejeterEntreprise,
} from "service/restApiSuperAdmin";
import {
  Building2,
  Clock,
  Users,
  UserCheck,
  Briefcase,
  FileText,
  Eye,
  Check,
  X,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, color, accent, noBorder }) {
  return (
    <div className={"flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md " + (noBorder ? "" : "border border-border")}>
      <div
        className={
          "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl " +
          (accent || "bg-md-primary/10 text-md-primary")
        }
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="font-body text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </p>
        <p
          className={
            "font-display text-2xl font-bold tracking-tight " +
            (color || "text-text-primary")
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Reject Modal ───────────────────────────────────────────────────────────
function RejectModal({ visible, onClose, onConfirm, loading }) {
  const [motif, setMotif] = useState("");

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <h3 className="mb-4 font-display text-lg font-bold text-text-primary">
          Motif du refus
        </h3>
        <textarea
          className="mb-4 h-28 w-full resize-none rounded-lg border border-border bg-bg-soft px-4 py-3 font-body text-sm text-text-primary outline-none transition-colors focus:border-md-primary focus:ring-2 focus:ring-md-primary/20"
          placeholder="Expliquez la raison du refus à l'entreprise..."
          value={motif}
          onChange={function (e) {
            setMotif(e.target.value);
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-white px-4 py-2 font-body text-sm font-medium text-text-secondary transition-colors hover:bg-bg-soft"
          >
            Annuler
          </button>
          <button
            onClick={function () {
              onConfirm(motif);
            }}
            disabled={!motif.trim() || loading}
            className="rounded-lg bg-red-500 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Confirmer le refus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────
export default function DashboardSuperAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = useCallback(async function () {
    try {
      const [statsRes, demandesRes] = await Promise.all([
        getStats(),
        getDemandesEnAttente(),
      ]);
      setStats(statsRes.data);
      setDemandes(demandesRes.data?.data || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    function () {
      fetchAll();
    },
    [fetchAll]
  );

  const handleAccept = async function (id) {
    setActionLoading(true);
    try {
      await accepterEntreprise(id);
      await fetchAll();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async function (motif) {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await rejeterEntreprise(rejectTarget, motif);
      setRejectTarget(null);
      await fetchAll();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-md-primary border-t-transparent" />
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="space-y-8">
      {/* ── Section 1: KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          icon={Building2}
          label="Entreprises actives"
          value={s.entreprisesActives ?? 0}
          accent="bg-green-50 text-success"
        />
        
        <KPICard
          icon={Users}
          label="Utilisateurs RH/Admin"
          value={s.totalUsersRH ?? 0}
          accent="bg-md-primary/10 text-md-primary"
        />
        <KPICard
          icon={UserCheck}
          label="Candidats"
          value={s.totalCandidats ?? 0}
          accent="bg-secondary-light text-secondary"
        />
        <KPICard
          icon={Briefcase}
          label="Offres actives"
          value={s.offresActives ?? 0}
          accent="bg-primary-light text-primary-dark"
        />
        <KPICard
          icon={FileText}
          label="Candidatures"
          value={s.totalCandidatures ?? 0}
          accent="bg-indigo-50 text-md-secondary"
          noBorder
        />
      </div>

      {/* ── Section 2: Pending requests ── */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-bold text-text-primary">
              Demandes d'inscription en attente
            </h2>
            {demandes.length > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 font-body text-xs font-bold text-white">
                {demandes.length}
              </span>
            )}
          </div>
          {demandes.length > 0 && (
            <button
              onClick={function () {
                navigate(ROUTES.SUPERADMIN.DEMANDES);
              }}
              className="font-body text-sm font-medium text-md-primary transition-colors hover:text-md-secondary"
            >
              Voir tout →
            </button>
          )}
        </div>

        {demandes.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-soft">
              <Check size={28} className="text-success" />
            </div>
            <p className="font-body text-sm font-medium text-text-secondary">
              Aucune demande en attente
            </p>
            <p className="mt-1 font-body text-xs text-text-muted">
              Toutes les demandes ont été traitées.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {demandes.slice(0, 5).map(function (d) {
              const ent = d.entreprise;
              const admin = d.admin;
              return (
                <div
                  key={ent._id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-bg-soft p-4 transition-colors hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-md-primary/10 font-display text-sm font-bold text-md-primary">
                      {ent.nom?.[0]?.toUpperCase() || "E"}
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-text-primary">
                        {ent.nom}
                      </p>
                      <p className="font-body text-xs text-text-muted">
                        {admin?.email || ent.email} ·{" "}
                        {timeAgo(ent.dateInscription || ent.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={function () {
                        navigate(ROUTES.SUPERADMIN.DEMANDES);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 font-body text-xs font-medium text-text-secondary transition-colors hover:bg-bg-soft"
                    >
                      <Eye size={14} />
                      Voir
                    </button>
                    <button
                      onClick={function () {
                        handleAccept(ent._id);
                      }}
                      disabled={actionLoading}
                      className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 font-body text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check size={14} />
                      Accepter
                    </button>
                    <button
                      onClick={function () {
                        setRejectTarget(ent._id);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 font-body text-xs font-medium text-white transition-colors hover:bg-red-600"
                    >
                      <X size={14} />
                      Rejeter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 3: Répartition par statut ── */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
          Répartition des entreprises par statut
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "En attente",
              value: s.entreprisesEnAttente ?? 0,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Actives",
              value: s.entreprisesActives ?? 0,
              color: "text-success",
              bg: "bg-green-50",
            },
            {
              label: "Rejetées",
              value: s.entreprisesRejetees ?? 0,
              color: "text-red-500",
              bg: "bg-red-50",
            },
            {
              label: "Suspendues",
              value: s.entreprisesSuspendues ?? 0,
              color: "text-gray-500",
              bg: "bg-gray-50",
            },
          ].map(function (item) {
            return (
              <div
                key={item.label}
                className={
                  "flex flex-col items-center rounded-lg p-4 " + item.bg
                }
              >
                <span
                  className={
                    "font-display text-2xl font-bold " + item.color
                  }
                >
                  {item.value}
                </span>
                <span className="mt-1 font-body text-xs font-medium text-text-secondary">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reject modal */}
      <RejectModal
        visible={rejectTarget !== null}
        onClose={function () {
          setRejectTarget(null);
        }}
        onConfirm={handleReject}
        loading={actionLoading}
      />
    </div>
  );
}
