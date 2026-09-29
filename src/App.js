import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import AppShell from './components/AppShell';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';

function ProtectedRoute({ children }) {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { mode } = useAppContext();

  const theme = useMemo(
    () => {
      const isDark = mode === 'dark';

      return createTheme({
        palette: {
          mode,
          primary: {
            main: isDark ? '#22d3ee' : '#0f766e',
            light: isDark ? '#67e8f9' : '#14b8a6',
            dark: isDark ? '#0891b2' : '#115e59'
          },
          secondary: {
            main: isDark ? '#fbbf24' : '#f59e0b',
            light: '#fde68a',
            dark: '#b45309'
          },
          background: {
            default: isDark ? '#090d16' : '#f4f7fb',
            paper: isDark ? '#121826' : '#ffffff'
          },
          text: {
            primary: isDark ? '#eef6ff' : '#172033',
            secondary: isDark ? '#9fb0c7' : '#64748b'
          },
          divider: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(15, 23, 42, 0.1)',
          action: {
            hover: isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(15, 118, 110, 0.08)'
          },
          success: {
            main: '#16a34a'
          },
          warning: {
            main: '#f59e0b'
          }
        },
        shape: {
          borderRadius: 8
        },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontWeight: 800, letterSpacing: 0 },
          h2: { fontWeight: 800, letterSpacing: 0 },
          h3: { fontWeight: 700, letterSpacing: 0 },
          h4: { fontWeight: 700, letterSpacing: 0 },
          h5: { fontWeight: 700, letterSpacing: 0 },
          h6: { fontWeight: 700, letterSpacing: 0 },
          button: { fontWeight: 700, letterSpacing: 0, textTransform: 'none' }
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow: 'none'
              },
              contained: {
                boxShadow: isDark
                  ? '0 12px 28px rgba(34, 211, 238, 0.18)'
                  : '0 12px 28px rgba(15, 118, 110, 0.18)'
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                backgroundImage: 'none'
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none'
              }
            }
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.86)'
              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 700
              }
            }
          }
        }
      });
    },
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="movie/:id" element={<MovieDetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
