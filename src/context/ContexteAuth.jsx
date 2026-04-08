import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ROUTES } from "constants/routes";
import { loginUser, logoutUser } from "service/restApiAuthentification";
import { getUserById } from "service/restApiUtilisateurs";

const AuthContext = createContext(null);
const SESSION_KEY = "talentia_user";
const LOCAL_USER_KEY = "user";
const LOCAL_TOKEN_KEY = "token";
const CANDIDAT_LOCAL_KEY = "candidat";
const EVENT_CANDIDAT_LOGIN = "session:candidat-login";
const EVENT_ADMIN_LOGIN = "session:admin-login";

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

function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  return {
    ...user,
    role:
      typeof user.role === "string" ? user.role.toLowerCase() : user.role,
  };
}

function clearStoredSession() {
  safeRemove(window.sessionStorage, SESSION_KEY);
  safeRemove(window.localStorage, LOCAL_USER_KEY);
  safeRemove(window.localStorage, LOCAL_TOKEN_KEY);
}

function persistUserSession(nextUser) {
  safeWrite(window.sessionStorage, SESSION_KEY, JSON.stringify(nextUser));
  safeWrite(window.localStorage, LOCAL_USER_KEY, JSON.stringify(nextUser));
}

function extractTokenFromResponse(response) {
  return (
    response?.data?.token ||
    response?.data?.data?.token ||
    response?.data?.accessToken ||
    response?.data?.data?.accessToken ||
    null
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    function handleCandidateLogin() {
      clearStoredSession();
      setUser(null);
    }

    window.addEventListener(EVENT_CANDIDAT_LOGIN, handleCandidateLogin);
    return function () {
      window.removeEventListener(EVENT_CANDIDAT_LOGIN, handleCandidateLogin);
    };
  }, []);

  useEffect(function () {
    async function checkSession() {
      try {
        const stored =
          safeRead(window.sessionStorage, SESSION_KEY) ||
          safeRead(window.localStorage, LOCAL_USER_KEY);

        if (!stored) {
          setUser(null);
          return;
        }

        let parsedUser = null;
        try {
          parsedUser = JSON.parse(stored);
        } catch {
          clearStoredSession();
          setUser(null);
          return;
        }

        if (!parsedUser || typeof parsedUser !== "object" || !parsedUser._id) {
          clearStoredSession();
          setUser(null);
          return;
        }

        const storedToken = safeRead(window.localStorage, LOCAL_TOKEN_KEY);
        if (!storedToken) {
          clearStoredSession();
          setUser(null);
          return;
        }

        const normalizedUser = normalizeUser(parsedUser);
        setUser(normalizedUser);
        persistUserSession(normalizedUser);

        // Validate session using a role-compatible protected endpoint.
        await getUserById(normalizedUser._id);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          clearStoredSession();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async function (email, password) {
    const res = await loginUser(email, password);
    const nextUserRaw = res?.data?.data || res?.data?.user || res?.data;
    const nextUser = normalizeUser(nextUserRaw);
    const nextToken = extractTokenFromResponse(res);
    if (nextUser && typeof nextUser === "object" && nextUser._id) {
      setUser(nextUser);
      persistUserSession(nextUser);
    }
    if (nextToken) {
      safeWrite(window.localStorage, LOCAL_TOKEN_KEY, nextToken);
    }

    safeRemove(window.localStorage, CANDIDAT_LOCAL_KEY);
    window.dispatchEvent(new Event(EVENT_ADMIN_LOGIN));

    return res;
  };

  const logout = async function () {
    try {
      await logoutUser();
    } finally {
      clearStoredSession();
      setUser(null);
      window.location.assign(ROUTES.LOGIN);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
