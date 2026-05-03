import React, { useCallback, useEffect, useState } from "react";
import {
  getDemandesEnAttente,
  getAllEntreprises,
  accepterEntreprise,
  rejeterEntreprise,
} from "service/restApiSuperAdmin";
import { Check, X, Building2 } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TABS = [
  { key: "en_attente", label: "En attente" },
  { key: "active", label: "Acceptées" },
  { key: "rejetee", label: "Rejetées" },
];

// ─── Reject Modal ───────────────────────────────────────────────────────────
function RejectModal({ visible, onClose, onConfirm, loading }) {
  const [motif, setMotif] = useState("");

  useEffect(
    function () {
      if (visible) setMotif("");
    },
    [visible]
  );

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

// ─── Enterprise Card ────────────────────────────────────────────────────────
function DemandeCard({ item, tab, onAccept, onReject, actionLoading }) {
  const ent = item.entreprise || item;
  const admin = item.admin;

  const initials = ent.nom
    ? ent.nom
        .split(" ")
        .map(function (w) {
          return w[0];
        })
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Logo / Initials */}
        {ent.logo ? (
          <img
            src={ent.logo}
            alt={ent.nom}
            className="h-12 w-12 flex-shrink-0 rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-md-primary/10 font-display text-base font-bold text-md-primary">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-bold text-text-primary">
              {ent.nom}
            </h3>
            {ent.plan && (
              <span className="rounded-full bg-md-primary/10 px-2 py-0.5 font-body text-[11px] font-semibold uppercase text-md-primary">
                {ent.plan}
              </span>
            )}
          </div>
          <p className="mt-0.5 font-body text-sm text-text-secondary">
            {ent.email}
          </p>

          {admin && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              <span>
                <span className="font-medium text-text-secondary">Admin :</span>{" "}
                {admin.nom || admin.name}
              </span>
              <span>{admin.email}</span>
            </div>
          )}

          <p className="mt-2 font-body text-xs text-text-muted">
            Inscrit le {formatDate(ent.dateInscription || ent.createdAt)}
          </p>

          {tab === "rejetee" && ent.motifRejet && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="font-body text-xs font-medium text-red-600">
                Motif du refus :
              </p>
              <p className="mt-1 font-body text-xs text-red-500">
                {ent.motifRejet}
              </p>
            </div>
          )}
        </div>
      </div>

      {tab === "en_attente" && (
        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
          <button
            onClick={function () {
              onAccept(ent._id);
            }}
            disabled={actionLoading}
            className="flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            <Check size={16} />
            Accepter
          </button>
          <button
            onClick={function () {
              onReject(ent._id);
            }}
            disabled={actionLoading}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            <X size={16} />
            Rejeter
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function DemandesInscription() {
  const [activeTab, setActiveTab] = useState("en_attente");
  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);

  const fetchData = useCallback(async function () {
    setLoading(true);
    try {
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
        getDemandesEnAttente(),
        getAllEntreprises({ statut: "active", limit: 50 }),
        getAllEntreprises({ statut: "rejetee", limit: 50 }),
      ]);
      setPendingData(pendingRes.data?.data || []);
      setAcceptedData(acceptedRes.data?.data || []);
      setRejectedData(rejectedRes.data?.data || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    function () {
      fetchData();
    },
    [fetchData]
  );

  const handleAccept = async function (id) {
    setActionLoading(true);
    try {
      await accepterEntreprise(id);
      await fetchData();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async function (motif) {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await rejeterEntreprise(rejectTarget, motif);
      setRejectTarget(null);
      await fetchData();
    } catch {
      /* silent */
    } finally {
      setActionLoading(false);
    }
  };

  const dataByTab = {
    en_attente: pendingData,
    active: acceptedData,
    rejetee: rejectedData,
  };

  const currentData = dataByTab[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl font-bold text-text-primary md:text-2xl">
          Demandes d'inscription entreprises
        </h1>
        {pendingData.length > 0 && (
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 font-body text-xs font-bold text-white">
            {pendingData.length}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-bg-soft p-1">
        {TABS.map(function (tab) {
          const count =
            tab.key === "en_attente"
              ? pendingData.length
              : tab.key === "active"
                ? acceptedData.length
                : rejectedData.length;

          return (
            <button
              key={tab.key}
              onClick={function () {
                setActiveTab(tab.key);
              }}
              className={
                "flex items-center gap-1.5 rounded-md px-4 py-2 font-body text-sm font-medium transition-all " +
                (activeTab === tab.key
                  ? "bg-white text-md-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary")
              }
            >
              {tab.label}
              <span
                className={
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold " +
                  (activeTab === tab.key
                    ? "bg-md-primary/10 text-md-primary"
                    : "bg-border text-text-muted")
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-md-primary border-t-transparent" />
        </div>
      ) : currentData.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-white py-16 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-soft">
            <Building2 size={28} className="text-text-muted" />
          </div>
          <p className="font-body text-sm font-medium text-text-secondary">
            Aucune entreprise dans cette catégorie
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {currentData.map(function (item) {
            const ent = item.entreprise || item;
            return (
              <DemandeCard
                key={ent._id}
                item={item}
                tab={activeTab}
                onAccept={handleAccept}
                onReject={function (id) {
                  setRejectTarget(id);
                }}
                actionLoading={actionLoading}
              />
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      <RejectModal
        visible={rejectTarget !== null}
        onClose={function () {
          setRejectTarget(null);
        }}
        onConfirm={handleRejectConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
