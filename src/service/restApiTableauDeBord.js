import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

export async function getDashboardOffres() {
  return await axios.get(`${API_URL}/offre/getOffresByEntreprise`, AUTH_REQUEST_CONFIG);
}

export async function getDashboardCandidatures() {
  return await axios.get(`${API_URL}/candidature/getAllCandidatures`, AUTH_REQUEST_CONFIG);
}

export async function getDashboardEntretiens() {
  return await axios.get(`${API_URL}/entretien/getAllEntretiens`, AUTH_REQUEST_CONFIG);
}
