import axios from "axios";

const BACKEND_URL = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.REACT_APP_BACKEND_URL
  ? import.meta.env.REACT_APP_BACKEND_URL
  : process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.warn("REACT_APP_BACKEND_URL is not defined. API calls will fail.");
}

export const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : "/api", // rely on ingress when available
});