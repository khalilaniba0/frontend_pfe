const DEFAULT_BACKEND_PORT = "5000";
const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

function sanitizeUrl(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
}

function resolveApiUrl() {
  var envApiUrl = sanitizeUrl(process.env.REACT_APP_API_URL || "");
  if (envApiUrl) {
    return envApiUrl;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    var protocol = window.location.protocol || "http:";
    return sanitizeUrl(
      protocol + "//" + window.location.hostname + ":" + DEFAULT_BACKEND_PORT
    );
  }

  return "";
}

function resolveTimeoutMs() {
  var rawValue = Number(process.env.REACT_APP_REQUEST_TIMEOUT_MS);
  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }
  return Math.round(rawValue);
}

export const API_URL = resolveApiUrl();
export const API_ORIGIN = API_URL;
export const REQUEST_TIMEOUT_MS = resolveTimeoutMs();

if (process.env.NODE_ENV !== "production" && !process.env.REACT_APP_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[api] REACT_APP_API_URL is not set. Falling back to current host on port 5000"
  );
}
