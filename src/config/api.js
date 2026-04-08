const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

function sanitizeUrl(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
}

function resolveApiUrl() {
  var envApiUrl = sanitizeUrl(process.env.REACT_APP_API_URL || "");
  if (!envApiUrl) {
    throw new Error(
      "[api] Missing REACT_APP_API_URL. Define it in your environment variables."
    );
  }

  return envApiUrl;
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
