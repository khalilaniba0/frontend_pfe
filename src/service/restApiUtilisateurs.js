import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

export async function getAllUsers() {
  return await axios.get(`${API_URL}/user/getAllUsers`, AUTH_REQUEST_CONFIG);
}

export async function getUserById(id) {
  return await axios.get(`${API_URL}/user/getUserById/${id}`, AUTH_REQUEST_CONFIG);
}

export async function createRh(payload) {
  return await axios.post(`${API_URL}/user/createRh`, payload, AUTH_REQUEST_CONFIG);
}

export async function updateUser(id, payload) {
  return await axios.put(
    `${API_URL}/user/updateUser/${id}`,
    payload,
    AUTH_REQUEST_CONFIG,
  );
}

export async function deleteUser(id) {
  return await axios.delete(`${API_URL}/user/deleteUser/${id}`, AUTH_REQUEST_CONFIG);
}

// Nouveaux flux Invitation & Setup

export async function inviteRh(payload) {
  return await axios.post(`${API_URL}/user/inviteRh`, payload, AUTH_REQUEST_CONFIG);
}

export async function checkInvitation(token) {
  return await axios.get(`${API_URL}/user/checkInvitation/${token}`);
}

export async function acceptInvitation(token, payload) {
  return await axios.post(`${API_URL}/user/acceptInvitation/${token}`, payload);
}

export async function completeSetup(payload) {
  return await axios.put(`${API_URL}/user/completeSetup`, payload, AUTH_REQUEST_CONFIG);
}