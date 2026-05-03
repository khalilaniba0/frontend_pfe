import axios from "axios";
import { API_URL } from "../config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

const BASE = `${API_URL}/superadmin`;

// ──────────────────── Statistics ────────────────────
export async function getStats() {
  return axios.get(`${BASE}/stats`, AUTH_REQUEST_CONFIG);
}

// ──────────────────── Pending registrations ────────────────────
export async function getDemandesEnAttente() {
  return axios.get(`${BASE}/demandes`, AUTH_REQUEST_CONFIG);
}

export async function accepterEntreprise(id) {
  return axios.patch(`${BASE}/demandes/${id}/accepter`, {}, AUTH_REQUEST_CONFIG);
}

export async function rejeterEntreprise(id, motif) {
  return axios.patch(`${BASE}/demandes/${id}/rejeter`, { motif }, AUTH_REQUEST_CONFIG);
}

// ──────────────────── Enterprise management ────────────────────
export async function getAllEntreprises(params = {}) {
  return axios.get(`${BASE}/entreprises`, { ...AUTH_REQUEST_CONFIG, params });
}

export async function getEntrepriseDetail(id) {
  return axios.get(`${BASE}/entreprises/${id}`, AUTH_REQUEST_CONFIG);
}

export async function suspendreEntreprise(id) {
  return axios.patch(`${BASE}/entreprises/${id}/suspendre`, {}, AUTH_REQUEST_CONFIG);
}

export async function reactiverEntreprise(id) {
  return axios.patch(`${BASE}/entreprises/${id}/reactiver`, {}, AUTH_REQUEST_CONFIG);
}

export async function updateEntreprisePlan(id, plan) {
  return axios.patch(`${BASE}/entreprises/${id}/plan`, { plan }, AUTH_REQUEST_CONFIG);
}

export async function deleteEntreprise(id) {
  return axios.delete(`${BASE}/entreprises/${id}`, AUTH_REQUEST_CONFIG);
}

// ──────────────────── User management ────────────────────
export async function getAllUtilisateurs(params = {}) {
  return axios.get(`${BASE}/utilisateurs`, { ...AUTH_REQUEST_CONFIG, params });
}

export async function getAllCandidats(params = {}) {
  return axios.get(`${BASE}/candidats`, { ...AUTH_REQUEST_CONFIG, params });
}

export async function toggleBlockUser(id) {
  return axios.patch(`${BASE}/utilisateurs/${id}/block`, {}, AUTH_REQUEST_CONFIG);
}

export async function deleteUtilisateur(id) {
  return axios.delete(`${BASE}/utilisateurs/${id}`, AUTH_REQUEST_CONFIG);
}

export async function createAdminForEntreprise(data) {
  return axios.post(`${BASE}/utilisateurs`, data, AUTH_REQUEST_CONFIG);
}
