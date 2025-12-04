import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Screens
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
        main: '#425c45', // Hunter Green
    },
    secondary: {
        main: '#8b5a2b', // Saddle Brown
    },
    background: {
        default: '#f5f1e8', // Parchment-like
        paper: '#fffdf5',
    },
    text: {
        primary: '#2c2c2c',
        secondary: '#5a4a42',
    }
  },
  typography: {
      fontFamily: '"Old Standard TT", serif',
      h1: {
          fontFamily: '"Dancing Script", cursive',
      },
      h2: {
          fontFamily: '"Dancing Script", cursive',
      },
      h3: {
          fontFamily: '"Dancing Script", cursive',
      },
      h4: {
          fontFamily: '"Dancing Script", cursive',
      },
      h5: {
          fontFamily: '"Special Elite", cursive', // Typewriter style for headers
      },
      h6: {
          fontFamily: '"Special Elite", cursive',
      },
      button: {
          fontFamily: '"Special Elite", cursive',
          textTransform: 'none',
      }
  },
  components: {
      MuiCssBaseline: {
          styleOverrides: {
              body: {
                  backgroundImage: 'url(/assets/images/page-background.png)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: 'cover',
                  backgroundAttachment: 'fixed',
              }
          }
      },
      MuiPaper: {
          styleOverrides: {
              root: {
                  backgroundImage: 'url(/assets/images/page-background-2.png)',
                  backgroundSize: 'cover',
                  borderRadius: '2px',
                  boxShadow: '3px 3px 5px rgba(0,0,0,0.2)',
                  border: '1px solid #d4c5b0',
              }
          }
      },
      MuiButton: {
          styleOverrides: {
              root: {
                 borderRadius: 0, // Less modern rounded corners
                 borderWidth: 2,
                 borderColor: '#5a4a42',
              },
              contained: {
                  boxShadow: 'none',
                  border: '1px solid rgba(0,0,0,0.2)',
                  '&:hover': {
                      boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  }
              }
          }
      }
  }
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
