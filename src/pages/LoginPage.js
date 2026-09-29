import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const theme = useTheme();
  const { login, user } = useAppContext();
  const [values, setValues] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.username.trim() || !values.password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    login(values);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        alignItems: 'center',
        bgcolor: 'background.default',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 24% 18%, rgba(34, 211, 238, 0.2), transparent 34%), linear-gradient(135deg, #090d16, #141827)'
            : 'radial-gradient(circle at 24% 18%, rgba(20, 184, 166, 0.22), transparent 34%), linear-gradient(135deg, #eef7f5, #f8fafc)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: 1,
            borderColor: 'divider',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 24px 80px rgba(0, 0, 0, 0.45)'
                : '0 24px 80px rgba(15, 23, 42, 0.12)'
          }}
        >
          <Stack gap={3}>
            <Stack gap={1} alignItems="flex-start">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #0f766e, #22d3ee)'
                }}
              >
                <MovieFilterIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4">Movie Explorer</Typography>
              <Typography color="text.secondary">
                Sign in to search movies, explore trending titles, and keep a local favorites list.
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" gap={2} onSubmit={handleSubmit}>
              <TextField
                label="Username"
                value={values.username}
                onChange={(event) => setValues({ ...values, username: event.target.value })}
                autoComplete="username"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={values.password}
                onChange={(event) => setValues({ ...values, password: event.target.value })}
                autoComplete="current-password"
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />} sx={{ minHeight: 52 }}>
                Login
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
