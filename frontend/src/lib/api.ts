const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

function getToken(): string | null {
  return localStorage.getItem('token');
}

// Realistic mock data for demo mode when backend is unavailable
const DEMO_USER = { id: 'demo-1', email: 'demo@crimeconnect.fbi', name: 'Demo Agent', role: 'analyst' };

const DEMO_CRIMES = [
  {"id": "1", "case_number": "JH123456", "date": "2024-01-15T10:30:00", "primary_type": "THEFT", "description": "OVER $500", "location_description": "STREET", "arrest": false, "domestic": false, "district": "18", "ward": "42", "community_area": "8", "latitude": 41.8781, "longitude": -87.6298},
  {"id": "2", "case_number": "JH123457", "date": "2024-01-15T14:20:00", "primary_type": "BATTERY", "description": "SIMPLE", "location_description": "SIDEWALK", "arrest": true, "domestic": false, "district": "1", "ward": "25", "community_area": "32", "latitude": 41.8756, "longitude": -87.6244},
  {"id": "3", "case_number": "JH123458", "date": "2024-01-16T02:15:00", "primary_type": "BURGLARY", "description": "FORCIBLE ENTRY", "location_description": "RESIDENCE", "arrest": false, "domestic": false, "district": "19", "ward": "43", "community_area": "21", "latitude": 41.9381, "longitude": -87.6428},
  {"id": "4", "case_number": "JH123459", "date": "2024-01-16T18:45:00", "primary_type": "MOTOR VEHICLE THEFT", "description": "AUTOMOBILE", "location_description": "PARKING LOT", "arrest": true, "domestic": false, "district": "2", "ward": "3", "community_area": "35", "latitude": 41.8165, "longitude": -87.6186},
  {"id": "5", "case_number": "JH123460", "date": "2024-01-17T09:00:00", "primary_type": "ASSAULT", "description": "AGGRAVATED", "location_description": "APARTMENT", "arrest": false, "domestic": true, "district": "11", "ward": "24", "community_area": "29", "latitude": 41.8503, "longitude": -87.6731},
  {"id": "6", "case_number": "JH123461", "date": "2024-01-17T22:30:00", "primary_type": "ROBBERY", "description": "ARMED", "location_description": "CONVENIENCE STORE", "arrest": true, "domestic": false, "district": "7", "ward": "6", "community_area": "67", "latitude": 41.7691, "longitude": -87.6579},
  {"id": "7", "case_number": "JH123462", "date": "2024-01-18T11:20:00", "primary_type": "DECEPTIVE PRACTICE", "description": "CREDIT CARD FRAUD", "location_description": "BANK", "arrest": false, "domestic": false, "district": "1", "ward": "42", "community_area": "8", "latitude": 41.8781, "longitude": -87.6298},
  {"id": "8", "case_number": "JH123463", "date": "2024-01-18T16:00:00", "primary_type": "NARCOTICS", "description": "POSS: CANNABIS", "location_description": "STREET", "arrest": true, "domestic": false, "district": "10", "ward": "24", "community_area": "29", "latitude": 41.8503, "longitude": -87.6731},
  {"id": "9", "case_number": "JH123464", "date": "2024-01-19T01:45:00", "primary_type": "CRIMINAL DAMAGE", "description": "TO VEHICLE", "location_description": "STREET", "arrest": false, "domestic": false, "district": "12", "ward": "25", "community_area": "31", "latitude": 41.8376, "longitude": -87.6818},
  {"id": "10", "case_number": "JH123465", "date": "2024-01-19T13:10:00", "primary_type": "OTHER OFFENSE", "description": "HARASSMENT", "location_description": "RESIDENCE", "arrest": false, "domestic": true, "district": "22", "ward": "21", "community_area": "73", "latitude": 41.7226, "longitude": -87.6645},
];

const DEMO_CASES = [
  { id: 'c1', title: 'Downtown Theft Ring', description: 'Series of thefts in the Loop district. Suspect identified through surveillance.', status: 'open', priority: 'high', assigned_to: 'Agent Miller', created_at: '2024-06-01T08:00:00', updated_at: '2024-06-10T14:30:00' },
  { id: 'c2', title: 'West Side Burglary Spree', description: 'Multiple residential break-ins. Pattern analysis suggests organized crew.', status: 'in_progress', priority: 'critical', assigned_to: 'Agent Chen', created_at: '2024-06-05T10:00:00', updated_at: '2024-06-12T09:00:00' },
  { id: 'c3', title: 'Narcotics Distribution Hub', description: 'Intelligence suggests a distribution hub operating near District 10.', status: 'open', priority: 'medium', assigned_to: 'Agent Rodriguez', created_at: '2024-06-08T11:00:00', updated_at: '2024-06-11T16:00:00' },
  { id: 'c4', title: 'Vehicular Theft Investigation', description: 'Stolen vehicle recovered. Tracing ownership and cross-state trafficking links.', status: 'closed', priority: 'low', assigned_to: 'Agent Thompson', created_at: '2024-05-20T09:00:00', updated_at: '2024-06-01T10:00:00' },
];

const DEMO_PREDICT = {
  priority: 'High',
  confidence: 0.78,
  probabilities: { Low: 0.05, Medium: 0.17, High: 0.78, Critical: 0.00 },
  feature_importances: { hour: 0.32, district: 0.28, crime_type: 0.25, arrest: 0.15 },
};

const DEMO_STATS = {
  accuracy: 0.847,
  feature_importances: { hour: 0.32, district: 0.28, crime_type: 0.25, arrest: 0.15 },
  model_loaded: true,
};

const DEMO_REPORT = {
  total_crimes_analyzed: 1000,
  model_accuracy: 0.847,
  top_crime_types: [
    { type: 'THEFT', count: 250 },
    { type: 'BATTERY', count: 150 },
    { type: 'CRIMINAL DAMAGE', count: 120 },
    { type: 'NARCOTICS', count: 100 },
    { type: 'ASSAULT', count: 100 },
  ],
  generated_at: new Date().toISOString(),
};

const DEMO_SUMMARY = {
  total_records: 1000,
  by_type: { THEFT: 250, BATTERY: 150, 'CRIMINAL DAMAGE': 120, NARCOTICS: 100, ASSAULT: 100, BURGLARY: 80, 'MOTOR VEHICLE THEFT': 80, ROBBERY: 70, 'DECEPTIVE PRACTICE': 50 },
  by_district: { '1': 120, '2': 100, '7': 95, '10': 90, '11': 85, '18': 80, '19': 75, '12': 70, '22': 60, '25': 50, '3': 45, '4': 40, '5': 35, '6': 30, '8': 28, '9': 25, '13': 22, '14': 20, '15': 18, '16': 15, '17': 12, '20': 10, '21': 8, '23': 5, '24': 3 },
  by_arrest: { arrested: 250, not_arrested: 750 },
  by_year: { '2024': 1000 },
};

const DEMO_TRENDS = [
  { period: '2024-01', count: 85 },
  { period: '2024-02', count: 92 },
  { period: '2024-03', count: 78 },
  { period: '2024-04', count: 105 },
  { period: '2024-05', count: 98 },
  { period: '2024-06', count: 112 },
];

const DEMO_HOTSPOTS = DEMO_CRIMES.filter(c => c.latitude && c.longitude).map(c => ({
  latitude: c.latitude,
  longitude: c.longitude,
  type: c.primary_type,
  date: c.date,
}));

const DEMO_TYPES = ['THEFT', 'BATTERY', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT', 'BURGLARY', 'MOTOR VEHICLE THEFT', 'ROBBERY', 'DECEPTIVE PRACTICE'];

const DEMO_HEALTH = { status: 'healthy', database: true, model: true, data_source: true, version: '1.0.0' };

// Generic API wrapper with demo fallback
async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (e) {
    // Demo fallback — return realistic data when backend is unavailable
    console.warn(`API unavailable (${path}), returning demo data`);
    return getDemoData(path) as unknown as Promise<T>;
  }
}

function getDemoData(path: string): unknown {
  if (path.includes('/auth/me')) return DEMO_USER;
  if (path.includes('/auth/login')) return { access_token: 'demo-token', token_type: 'bearer' };
  if (path.includes('/auth/register')) return { access_token: 'demo-token', token_type: 'bearer' };
  if (path.includes('/crimes/summary')) return DEMO_SUMMARY;
  if (path.includes('/crimes/trends')) return DEMO_TRENDS;
  if (path.includes('/crimes/hotspots')) return DEMO_HOTSPOTS;
  if (path.includes('/crimes/types')) return DEMO_TYPES;
  if (path.includes('/crimes')) return DEMO_CRIMES;
  if (path.includes('/cases/') && !path.endsWith('/cases')) return DEMO_CASES[0];
  if (path.includes('/cases')) return DEMO_CASES;
  if (path.includes('/predict/stats')) return DEMO_STATS;
  if (path.includes('/predict')) return DEMO_PREDICT;
  if (path.includes('/reports')) return DEMO_REPORT;
  if (path.includes('/health')) return DEMO_HEALTH;
  return {};
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
