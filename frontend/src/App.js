import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import AddCase from './pages/AddCase';
import Criminals from './pages/Criminals';
import AddCriminal from './pages/AddCriminal';
import Officers from './pages/Officers';
import Evidence from './pages/Evidence';
import Witnesses from './pages/Witnesses';
import Courts from './pages/Courts';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Corkboard from './pages/Corkboard';
import MostWanted from './pages/MostWanted';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Set document title
document.title = "FBI CrimeConnect - Classified System";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/add" element={<AddCase />} />
                <Route path="/criminals" element={<Criminals />} />
                <Route path="/criminals/add" element={<AddCriminal />} />
                <Route path="/officers" element={<Officers />} />
                <Route path="/evidence" element={<Evidence />} />
                <Route path="/witnesses" element={<Witnesses />} />
                <Route path="/courts" element={<Courts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/corkboard" element={<Corkboard />} />
                <Route path="/most-wanted" element={<MostWanted />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </BrowserRouter>
      </DndProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;