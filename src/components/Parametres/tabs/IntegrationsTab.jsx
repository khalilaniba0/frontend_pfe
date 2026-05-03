import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connectGoogleCalendar } from "service/restApiEntretiens";
import { getUserById } from "service/restApiUtilisateurs";
import { useAuth } from "context/ContexteAuth";

function hasGoogleTokens(googleTokens) {
  if (!googleTokens) {
    return false;
  }
  if (Array.isArray(googleTokens)) {
    return googleTokens.length > 0;
  }
  if (typeof googleTokens === "object") {
    return Object.keys(googleTokens).length > 0;
  }
  return Boolean(googleTokens);
}

export default function IntegrationsTab() {
  const location = useLocation();
  const { user } = useAuth();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  useEffect(
    function () {
      let isMounted = true;

      async function detectGoogleConnection() {
        setIsCheckingConnection(true);

        const params = new URLSearchParams(location.search);
        const connectedFromQuery = params.get("google") === "connected";
        const connectedFromStoredUser = hasGoogleTokens(user?.googleTokens);

        if (connectedFromQuery && isMounted) {
          setIsGoogleConnected(true);
        }

        if (connectedFromStoredUser && isMounted) {
          setIsGoogleConnected(true);
        }

        if (!user?._id) {
          if (isMounted) {
            setIsGoogleConnected(connectedFromQuery || connectedFromStoredUser);
            setIsCheckingConnection(false);
          }
          return;
        }

        try {
          const response = await getUserById(user._id);
          const apiUser = response?.data?.data || response?.data?.user || response?.data;
          const googleTokens =
            apiUser?.googleTokens ||
            response?.data?.utilisateur?.googleTokens ||
            response?.data?.data?.utilisateur?.googleTokens;

          if (isMounted) {
            setIsGoogleConnected(
              connectedFromQuery || connectedFromStoredUser || hasGoogleTokens(googleTokens),
            );
          }
        } catch {
          if (isMounted) {
            setIsGoogleConnected(connectedFromQuery || connectedFromStoredUser);
          }
        } finally {
          if (isMounted) {
            setIsCheckingConnection(false);
          }
        }
      }

      detectGoogleConnection();

      return function () {
        isMounted = false;
      };
    },
    [location.search, user?._id, user?.googleTokens],
  );

  const handleDisconnect = function () {
    setIsGoogleConnected(false);
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Intégrations & Connexions
        </h2>
        <p className="mt-1 font-body text-sm text-text-secondary">
          Connectez Talentia à vos outils existants pour automatiser votre flux
          de travail.
        </p>
      </header>

      <div className="mb-8 max-w-3xl">
        <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-150 hover:border-primary/30 hover:shadow-md">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-150 group-hover:scale-105">
                <span className="material-symbols-outlined text-2xl">
                  calendar_month
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Google Calendar
                </h3>
                <p className="mt-1 font-body text-sm text-text-muted">
                  Synchronisez vos entretiens avec Google Calendar et générez
                  automatiquement des liens Google Meet
                </p>
              </div>
            </div>

            {isGoogleConnected && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-body text-xs font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Connecté
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                "font-body text-xs " +
                (isGoogleConnected ? "text-emerald-600" : "text-text-muted")
              }
            >
              Statut: {isGoogleConnected ? "Connecté" : "Non connecté"}
            </span>

            {!isGoogleConnected ? (
              <button
                type="button"
                onClick={connectGoogleCalendar}
                disabled={isCheckingConnection}
                className="rounded-xl bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-150 hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                Connecter Google Calendar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDisconnect}
                className="rounded-xl border border-border bg-white px-5 py-2.5 font-body text-sm font-medium text-text-primary transition-colors hover:bg-bg-soft"
              >
                Déconnecter
              </button>
            )}

            {isCheckingConnection && (
              <span className="font-body text-xs text-text-muted">
                Vérification de la connexion Google...
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
