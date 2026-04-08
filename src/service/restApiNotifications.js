import axios from "axios";
import { API_URL } from "config/api";
import { AUTH_REQUEST_CONFIG } from "./requestConfig";

export async function getNotificationsByCandidat(candidatId) {
  if (!candidatId) {
    return null;
  }

  return await axios.get(
    `${API_URL}/notification/getNotificationsByCandidat/${candidatId}`,
    AUTH_REQUEST_CONFIG
  );
}

export async function markNotificationAsRead(id) {
  if (!id) {
    return null;
  }

  return await axios.put(
    `${API_URL}/notification/markAsRead/${id}`,
    {},
    AUTH_REQUEST_CONFIG
  );
}

export async function deleteNotificationById(id) {
  if (!id) {
    return null;
  }

  return await axios.delete(`${API_URL}/notification/deleteNotification/${id}`, AUTH_REQUEST_CONFIG);
}
