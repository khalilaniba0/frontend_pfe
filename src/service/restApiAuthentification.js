import axios from "axios";
import { API_URL } from "config/api";
import {
    AUTH_REQUEST_CONFIG,
    PUBLIC_REQUEST_CONFIG,
} from "./requestConfig";

const PUBLIC_NO_CREDENTIALS_CONFIG = Object.freeze({
    ...PUBLIC_REQUEST_CONFIG,
    withCredentials: false,
});

export async function loginUser(email, password) {
    return await axios.post(
        `${API_URL}/user/login`,
        { email, password },
        AUTH_REQUEST_CONFIG
    );
}

export async function registerEntreprise(payload) {
    return await axios.post(
        `${API_URL}/entreprise/registerEntreprise`,
        payload,
        PUBLIC_REQUEST_CONFIG
    );
}

export async function logoutUser() {
    return await axios.post(`${API_URL}/user/logout`, {}, AUTH_REQUEST_CONFIG);
}

export async function changeMyPassword(currentPassword, newPassword) {
    return await axios.put(
        `${API_URL}/user/changePassword`,
        {
            oldPassword: currentPassword,
            newPassword,
        },
        AUTH_REQUEST_CONFIG
    );
}

export async function updateUserPassword(userId, newPassword) {
    return await axios.put(
        `${API_URL}/user/updateUser/${userId}`,
        { newPassword },
        AUTH_REQUEST_CONFIG
    );
}

export async function demanderResetMotDePasse(email) {
    return await axios.post(
        `${API_URL}/user/forgot-password`,
        { email },
        PUBLIC_NO_CREDENTIALS_CONFIG
    );
}

export async function resetMotDePasse(token, password) {
    return await axios.post(
        `${API_URL}/user/reset-password/${token}`,
        { password },
        PUBLIC_NO_CREDENTIALS_CONFIG
    );
}