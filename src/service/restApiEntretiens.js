import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

export async function getAllEntretiens() {
  return await axios.get(`${API_URL}/entretien/getAllEntretiens`, AUTH_REQUEST_CONFIG);
}

export async function getEntretienById(id) {
  return await axios.get(`${API_URL}/entretien/getEntretienById/${id}`, AUTH_REQUEST_CONFIG);
}

export async function createEntretien(payload) {
  return await axios.post(
    `${API_URL}/entretien/createEntretien`,
    { ...payload },
    AUTH_REQUEST_CONFIG
  );
}

export async function updateEntretien(id, payload) {
  return await axios.put(`${API_URL}/entretien/updateEntretien/${id}`, payload, AUTH_REQUEST_CONFIG);
}

export function connectGoogleCalendar(redirectPath) {
  const nextPath =
    typeof redirectPath === "string" && redirectPath.length > 0
      ? redirectPath
      : "/dashboard/settings?tab=integrations";

  const params = new URLSearchParams({ redirect: nextPath });
  window.location.href = `${API_URL}/auth/google?${params.toString()}`;
}

export async function deleteEntretien(id) {
  return await axios.delete(`${API_URL}/entretien/deleteEntretienById/${id}`, AUTH_REQUEST_CONFIG);
}
