import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AppShell() {
  const { mode, toggleMode, logout, user } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchFocus = () => {
    navigate('/discover');
    window.setTimeout(() => {
      document.getElementById('movie-search-input')?.focus();
    }, 100);
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 20% 0%, rgba(34, 211, 238, 0.13), transparent 32%), linear-gradient(180deg, rgba(15, 23, 42, 0.8), transparent 360px)'
            : 'radial-gradient(circle at 18% 0%, rgba(20, 184, 166, 0.13), transparent 34%), linear-gradient(180deg, rgba(226, 232, 240, 0.9), transparent 340px)'
      })}
    >
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(16px)',
          bgcolor: (theme) => alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.84 : 0.9)
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  color: 'primary.contrastText',
                  background: 'linear-gradient(135deg, #0f766e, #22d3ee)'
                }}
              >
                <MovieCreationIcon fontSize="small" />
              </Box>
              <Typography
                variant="h6"
                component={NavLink}
                to="/discover"
                sx={{ fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: 0 }}
              >
                Movie Explorer
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={1}>
              <Tooltip title="Search movies">
                <IconButton color="primary" onClick={handleSearchFocus} aria-label="search movies">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Button
                component={NavLink}
                to="/discover"
                startIcon={<HomeIcon />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: 'text.secondary',
                  '&.active': { color: 'primary.main', bgcolor: 'action.hover' }
                }}
              >
                Home
              </Button>
              <Button
                component={NavLink}
                to="/discover/favorites"
                startIcon={<FavoriteIcon />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: 'text.secondary',
                  '&.active': { color: 'secondary.main', bgcolor: 'action.hover' }
                }}
              >
                Favorites
              </Button>
              <Tooltip title={mode === 'dark' ? 'Use light mode' : 'Use dark mode'}>
                <IconButton color="primary" onClick={toggleMode} aria-label="toggle theme">
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={`Logout ${user?.username || ''}`.trim()}>
                <IconButton onClick={handleLogout} aria-label="logout">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Button fullWidth component={NavLink} to="/discover" startIcon={<HomeIcon />}>
          Home
        </Button>
        <Button fullWidth component={NavLink} to="/discover/favorites" startIcon={<FavoriteIcon />}>
          Favorites
        </Button>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, pb: { xs: 10, sm: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
