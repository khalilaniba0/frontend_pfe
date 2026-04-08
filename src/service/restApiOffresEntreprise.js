import axios from "axios";
import { API_URL } from "config/api";
import {
  AUTH_REQUEST_CONFIG,
  PUBLIC_REQUEST_CONFIG,
} from "./requestConfig";


export async function getOffreById(id) {
  return await axios.get(`${API_URL}/offre/getOffreById/${id}`, PUBLIC_REQUEST_CONFIG);
}
export async function getOffreByEntreprise(entrepriseId) {
  if (entrepriseId) {
    return await axios.get(
      `${API_URL}/offre/getOffresByEntreprise/${entrepriseId}`,
      AUTH_REQUEST_CONFIG
    );
  }

  return await axios.get(`${API_URL}/offre/getOffresByEntreprise`, AUTH_REQUEST_CONFIG);
}

export async function createOffre(payload) {
  return await axios.post(`${API_URL}/offre/createOffre`, payload, AUTH_REQUEST_CONFIG);
}

export async function updateOffre(id, payload) {
  return await axios.put(`${API_URL}/offre/updateOffre/${id}`, payload, AUTH_REQUEST_CONFIG);
}

export async function toggleOffreStatus(id) {
  return await axios.put(`${API_URL}/offre/updateOffreStatus/${id}`, {}, AUTH_REQUEST_CONFIG);
}

export async function deleteOffre(id) {
  return await axios.delete(`${API_URL}/offre/deleteOffreById/${id}`, AUTH_REQUEST_CONFIG);
}
