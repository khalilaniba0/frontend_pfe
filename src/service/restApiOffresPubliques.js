import axios from "axios";
import { API_URL } from "config/api";
import { PUBLIC_REQUEST_CONFIG } from "./requestConfig";

export async function getAllOffres() {
  return await axios.get(`${API_URL}/offre/getOffresDisponibles`, PUBLIC_REQUEST_CONFIG);
}
