import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

import Dashboard from '@/pages/Dashboard';
import DataBrowser from '@/pages/DataBrowser';
import MapPage from '@/pages/Map';
import Cases from '@/pages/Cases';
import CaseDetail from '@/pages/CaseDetail';
import NewCase from '@/pages/NewCase';
import Predictions from '@/pages/Predictions';
import Reports from '@/pages/Reports';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 } },
});

document.title = 'Crime Connect FBI';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data" element={<DataBrowser />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/new" element={<NewCase />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
