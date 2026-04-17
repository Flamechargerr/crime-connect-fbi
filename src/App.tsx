import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

import Dashboard from '@/pages/Dashboard';
import Cases from '@/pages/Cases';
import CaseDetail from '@/pages/CaseDetail';
import AddCase from '@/pages/AddCase';
import Criminals from '@/pages/Criminals';
import AddCriminal from '@/pages/AddCriminal';
import Officers from '@/pages/Officers';
import Evidence from '@/pages/Evidence';
import Reports from '@/pages/Reports';
import Corkboard from '@/pages/Corkboard';
import GlobePage from '@/pages/Globe';
import MostWanted from '@/pages/MostWanted';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 } },
});

document.title = 'CrimeConnect — Investigation Console';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/add" element={<AddCase />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/criminals" element={<Criminals />} />
              <Route path="/criminals/add" element={<AddCriminal />} />
              <Route path="/officers" element={<Officers />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/most-wanted" element={<MostWanted />} />
              <Route path="/corkboard" element={<Corkboard />} />
              <Route path="/globe" element={<GlobePage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
