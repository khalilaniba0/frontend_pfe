import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

export async function inscrireCandidat(payload) {
  return await axios.post(`${API_URL}/candidat/inscrire`, payload, AUTH_REQUEST_CONFIG);
}

export async function connecterCandidat(email, motDePasse) {
  return await axios.post(
    `${API_URL}/candidat/connecter`,
    { email, motDePasse },
    AUTH_REQUEST_CONFIG
  );
}

export async function deconnecterCandidat() {
  return await axios.post(
    `${API_URL}/candidat/deconnecter`,
    {},
    AUTH_REQUEST_CONFIG
  );
}

export async function getMonProfil() {
  return await axios.get(`${API_URL}/candidat/monProfil`, AUTH_REQUEST_CONFIG);
}

export async function mettreAJourProfil(payload) {
  return await axios.put(`${API_URL}/candidat/mettreAJourProfil`, payload, AUTH_REQUEST_CONFIG);
}
