const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Auth
export const login = (email: string, password: string) =>
  api<{ access_token: string; token_type: string }>('/api/auth/login', {
    method: 'POST',
    body: new URLSearchParams({ username: email, password }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

export const register = (email: string, password: string, name: string) =>
  api<{ access_token: string; token_type: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });

export const getMe = () => api<{ id: string; email: string; name: string; role: string }>('/api/auth/me');

// Crimes
export const getCrimes = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api<any[]>(`/api/crimes${qs}`);
};
export const getCrimeSummary = () => api<any>('/api/crimes/summary');
export const getCrimeTrends = (groupBy = 'month') => api<any[]>(`/api/crimes/trends?group_by=${groupBy}`);
export const getCrimeHotspots = (limit = 500, crimeType?: string) =>
  api<any[]>(`/api/crimes/hotspots?limit=${limit}${crimeType ? `&crime_type=${encodeURIComponent(crimeType)}` : ''}`);
export const getCrimeTypes = () => api<string[]>('/api/crimes/types');

// Cases
export const getCases = () => api<any[]>('/api/cases');
export const getCase = (id: string) => api<any>(`/api/cases/${id}`);
export const createCase = (data: any) => api<any>('/api/cases', { method: 'POST', body: JSON.stringify(data) });
export const updateCase = (id: string, data: any) => api<any>(`/api/cases/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCase = (id: string) => api<any>(`/api/cases/${id}`, { method: 'DELETE' });

// Predictions
export const predict = (data: any) => api<any>('/api/predict', { method: 'POST', body: JSON.stringify(data) });
export const getPredictStats = () => api<any>('/api/predict/stats');

// Reports
export const getReportSummary = () => api<any>('/api/reports/summary');

// Health
export const getHealth = () => api<any>('/api/health');
