import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  connecterCandidat,
  deconnecterCandidat,
  inscrireCandidat,
  getMonProfil,
} from "service/restApiCandidat";

const CandidateAuthContext = createContext(null);
const CANDIDAT_LOCAL_KEY = "candidat";
const ADMIN_SESSION_KEY = "talentia_user";
const ADMIN_LOCAL_USER_KEY = "user";
const ADMIN_LOCAL_TOKEN_KEY = "token";
const EVENT_CANDIDAT_LOGIN = "session:candidat-login";
const EVENT_ADMIN_LOGIN = "session:admin-login";

function safeWrite(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    /* no-op */
  }
}

function safeRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    /* no-op */
  }
}

function setCandidatFromResponse(res, setCandidat) {
  const data = res?.data?.data || res?.data?.candidat || res?.data;
  if (data && typeof data === "object") {
    setCandidat(data);
    safeWrite(window.localStorage, CANDIDAT_LOCAL_KEY, JSON.stringify(data));
  }
}

function clearAdminStoredSession() {
  safeRemove(window.sessionStorage, ADMIN_SESSION_KEY);
  safeRemove(window.localStorage, ADMIN_LOCAL_USER_KEY);
  safeRemove(window.localStorage, ADMIN_LOCAL_TOKEN_KEY);
}

export function CandidateAuthProvider({ children }) {
  const location = useLocation();
  const [candidat, setCandidat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(candidat);
  const isCandidateSpaceRoute = location.pathname.startsWith("/candidat");

  useEffect(function () {
    function handleAdminLogin() {
      safeRemove(window.localStorage, CANDIDAT_LOCAL_KEY);
      setCandidat(null);
      setIsLoading(false);
    }

    window.addEventListener(EVENT_ADMIN_LOGIN, handleAdminLogin);
    return function () {
      window.removeEventListener(EVENT_ADMIN_LOGIN, handleAdminLogin);
    };
  }, []);

  useEffect(function () {
    if (!isCandidateSpaceRoute) {
      setIsLoading(false);
      return;
    }

    async function hydrate() {
      setIsLoading(true);
      try {
        const res = await getMonProfil();
        setCandidatFromResponse(res, setCandidat);
      } catch {
        safeRemove(window.localStorage, CANDIDAT_LOCAL_KEY);
        setCandidat(null);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, [isCandidateSpaceRoute]);

  const login = async function (email, motDePasse) {
    const res = await connecterCandidat(email, motDePasse);
    clearAdminStoredSession();
    window.dispatchEvent(new Event(EVENT_CANDIDAT_LOGIN));
    setCandidatFromResponse(res, setCandidat);
    return res;
  };

  const logout = async function () {
    try {
      await deconnecterCandidat();
    } finally {
      setCandidat(null);
      safeRemove(window.localStorage, CANDIDAT_LOCAL_KEY);
    }
  };

  const register = async function (payload) {
    const res = await inscrireCandidat(payload);
    clearAdminStoredSession();
    window.dispatchEvent(new Event(EVENT_CANDIDAT_LOGIN));
    setCandidatFromResponse(res, setCandidat);
    return res;
  };

  const refreshProfile = async function () {
    try {
      const res = await getMonProfil();
      setCandidatFromResponse(res, setCandidat);
    } catch {
      safeRemove(window.localStorage, CANDIDAT_LOCAL_KEY);
      setCandidat(null);
    }
  };

  return (
    <CandidateAuthContext.Provider
      value={{
        candidat,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        refreshProfile,
      }}
    >
      {children}
    </CandidateAuthContext.Provider>
  );
}

CandidateAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCandidateAuth() {
  const context = useContext(CandidateAuthContext);
  if (!context) {
    throw new Error(
      "useCandidateAuth must be used within a CandidateAuthProvider"
    );
  }
  return context;
}

export default CandidateAuthContext;
