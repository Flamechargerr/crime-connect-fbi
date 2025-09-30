import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/layout/ErrorBoundary';
import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
