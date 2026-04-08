import axios from "axios";
import { API_URL } from "config/api";
import {
  AUTH_REQUEST_CONFIG,
  buildMultipartAuthConfig,
} from "./requestConfig";

export async function postuler(formData) {
  return await axios.post(
    `${API_URL}/candidature/postuler`,
    formData,
    buildMultipartAuthConfig()
  );
}

export async function getMesCandidatures() {
  return await axios.get(
    `${API_URL}/candidature/mesCandidatures`,
    AUTH_REQUEST_CONFIG
  );
}

export async function annulerCandidature(id) {
  return await axios.delete(
    `${API_URL}/candidature/annuler/${id}`,
    AUTH_REQUEST_CONFIG
  );
}
