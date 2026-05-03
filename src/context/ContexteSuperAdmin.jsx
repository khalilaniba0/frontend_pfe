import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { loginUser, logoutUser } from "service/restApiAuthentification";

const SuperAdminContext = createContext(null);
const SESSION_KEY = "talentia_superadmin";

function safeRead(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

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

export function SuperAdminProvider({ children }) {
  const [superadmin, setSuperadmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from sessionStorage on mount.
  useEffect(function () {
    try {
      const stored = safeRead(window.sessionStorage, SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === "superadmin") {
          setSuperadmin(parsed);
        }
      }
    } catch {
      safeRemove(window.sessionStorage, SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async function (email, password) {
    const res = await loginUser(email, password);
    const user = res?.data?.data || res?.data?.user || res?.data;

    if (!user || user.role !== "superadmin") {
      // Immediately logout the non-superadmin cookie that was just set.
      try {
        await logoutUser();
      } catch {
        /* ignore */
      }
      throw new Error("Accès non autorisé. Ce portail est réservé au super administrateur.");
    }

    setSuperadmin(user);
    safeWrite(window.sessionStorage, SESSION_KEY, JSON.stringify(user));
    return res;
  };

  const logout = async function () {
    try {
      await logoutUser();
    } finally {
      setSuperadmin(null);
      safeRemove(window.sessionStorage, SESSION_KEY);
    }
  };

  return (
    <SuperAdminContext.Provider value={{ superadmin, isLoading, login, logout }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

SuperAdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error("useSuperAdmin must be used within a SuperAdminProvider");
  }
  return context;
}

export default SuperAdminContext;
