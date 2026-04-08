import { REQUEST_TIMEOUT_MS } from "config/api";

export const AUTH_REQUEST_CONFIG = Object.freeze({
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

export const PUBLIC_REQUEST_CONFIG = Object.freeze({
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

export function buildMultipartAuthConfig() {
  return {
    ...AUTH_REQUEST_CONFIG,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
}
