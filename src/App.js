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
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#7dd3fc' : '#0f766e'
          },
          secondary: {
            main: mode === 'dark' ? '#fbbf24' : '#7c3aed'
          },
          background: {
            default: mode === 'dark' ? '#10131b' : '#f5f7fb',
            paper: mode === 'dark' ? '#171b26' : '#ffffff'
          },
          success: {
            main: '#16a34a'
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
                borderRadius: 8
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8
              }
            }
          }
        }
      }),
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
