import axios from "axios";

const env = typeof import.meta !== "undefined" ? import.meta.env : {};
const BACKEND_URL = env.VITE_BACKEND_URL || env.REACT_APP_BACKEND_URL || "http://localhost:8002";

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 8000,
});
