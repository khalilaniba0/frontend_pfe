import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

function extractArrayOrThrow(res, endpoint) {
  const payload = res?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  throw new Error(`Format de reponse invalide pour ${endpoint}`);
}

export async function getPipelineCandidatures() {
  const res = await axios.get(
    `${API_URL}/candidature/getAllCandidatures`,
    AUTH_REQUEST_CONFIG
  );
  return extractArrayOrThrow(res, "/candidature/getAllCandidatures");
}

export async function updateCandidatureEtape(id, etape, extra = {}) {
  return await axios.put(
    `${API_URL}/candidature/updateCandidatureEtape/${id}`,
    { etape, ...extra },
    AUTH_REQUEST_CONFIG
  );
}

export async function refuserCandidature(id) {
  return await axios.put(
    `${API_URL}/candidature/refuserCandidature/${id}`,
    {},
    AUTH_REQUEST_CONFIG
  );
}

export async function deleteCandidature(id) {
  const response = await axios.delete(
    `${API_URL}/candidature/deleteCandidatureById/${id}`,
    AUTH_REQUEST_CONFIG
  );
  return response.data;
}

export async function getOffresEntreprise() {
  const res = await axios.get(`${API_URL}/offre/getOffresByEntreprise`, AUTH_REQUEST_CONFIG);
  return extractArrayOrThrow(res, "/offre/getOffresByEntreprise");
}

export async function getCandidaturesByOffre(offreId) {
  const res = await axios.get(
    `${API_URL}/candidature/getCandidaturesByOffre/${offreId}`,
    AUTH_REQUEST_CONFIG
  );
  return extractArrayOrThrow(res, "/candidature/getCandidaturesByOffre/:offreId");
}
