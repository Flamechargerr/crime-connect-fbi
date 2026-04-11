import axios from "axios";

const env = typeof import.meta !== "undefined" ? import.meta.env : {};
const BACKEND_URL = env.VITE_BACKEND_URL || env.REACT_APP_BACKEND_URL || "http://localhost:8002";
const AUTH_TOKEN_KEY = "crimeconnect_auth_token";
let globalRequestCounter = 0;

export const getAuthToken = () => {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token, remember = false) => {
  clearAuthToken();
  try {
    if (remember) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch {
    // ignore storage errors
  }
};

export const clearAuthToken = () => {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers = config.headers || {};
  globalRequestCounter += 1;
  const requestId = globalThis?.crypto?.randomUUID?.() || `${Date.now()}-${globalRequestCounter}`;
  config.headers["X-Request-Id"] = requestId;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export const extractApiError = (error, fallback = "Request failed") => {
  return error?.response?.data?.error || error?.message || fallback;
};
