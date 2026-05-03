import axios from "axios";
import { API_URL } from "config/api";
import { PUBLIC_REQUEST_CONFIG } from "./requestConfig";

const PUBLIC_NO_CREDENTIALS_CONFIG = Object.freeze({
  ...PUBLIC_REQUEST_CONFIG,
  withCredentials: false,
});

export async function demanderResetMotDePasseCandidat(email) {
  return await axios.post(
    `${API_URL}/candidat/forgot-password`,
    { email },
    PUBLIC_NO_CREDENTIALS_CONFIG
  );
}

export async function resetMotDePasseCandidat(token, password) {
  return await axios.post(
    `${API_URL}/candidat/reset-password/${token}`,
    { password },
    PUBLIC_NO_CREDENTIALS_CONFIG
  );
}
