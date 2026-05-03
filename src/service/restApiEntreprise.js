import axios from "axios";
import { API_ORIGIN, API_URL } from "config/api";
import {
  AUTH_REQUEST_CONFIG,
  PUBLIC_REQUEST_CONFIG,
  buildMultipartAuthConfig,
} from "./requestConfig";

export async function getMyEntreprise() {
  return await axios.get(
    `${API_URL}/entreprise/getMyEntreprise`,
    AUTH_REQUEST_CONFIG,
  );
}

export async function updateEntreprise(payload) {
  const config =
    typeof FormData !== "undefined" && payload instanceof FormData
      ? buildMultipartAuthConfig()
      : AUTH_REQUEST_CONFIG;

  return await axios.put(
    `${API_URL}/entreprise/updateEntreprise`,
    payload,
    config,
  );
}

export function resolveEntrepriseMediaUrl(mediaPath) {
  if (!mediaPath || typeof mediaPath !== "string") return "";
  if (/^https?:\/\//i.test(mediaPath) || mediaPath.startsWith("data:")) {
    return mediaPath;
  }

  if (mediaPath.startsWith("/")) {
    return `${API_ORIGIN}${mediaPath}`;
  }

  return `${API_ORIGIN}/${mediaPath}`;
}

export async function getPublicEntreprise(id) {
  return await axios.get(
    `${API_URL}/entreprise/${id}/public`,
    PUBLIC_REQUEST_CONFIG,
  );
}

