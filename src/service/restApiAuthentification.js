import axios from "axios";
import { API_URL } from "config/api";
import {
    AUTH_REQUEST_CONFIG,
    PUBLIC_REQUEST_CONFIG,
} from "./requestConfig";

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