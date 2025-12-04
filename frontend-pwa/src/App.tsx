import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Screens (to be implemented)
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import CameraCapture from './screens/CameraCapture';
import SpeciesList from './screens/SpeciesList';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
        main: '#2E7D32', // Green for Nature GO
    },
    secondary: {
        main: '#ff9800',
    }
  },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/camera" element={
                <ProtectedRoute>
                    <CameraCapture />
                </ProtectedRoute>
              } />
              <Route path="/species" element={
                <ProtectedRoute>
                    <SpeciesList />
                </ProtectedRoute>
              } />
               <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
