import axios from "axios";

const BACKEND_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.REACT_APP_BACKEND_URL)
  ? import.meta.env.REACT_APP_BACKEND_URL
  : process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.error("REACT_APP_BACKEND_URL is not defined. Please set it in frontend/.env.");
}

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});