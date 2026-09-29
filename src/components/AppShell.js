import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AppShell() {
  const { mode, toggleMode, logout, user } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(16px)',
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
              <MovieCreationIcon color="primary" />
              <Typography
                variant="h6"
                component={NavLink}
                to="/"
                sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}
              >
                Movie Explorer
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={1}>
              <Button component={NavLink} to="/" startIcon={<HomeIcon />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                Home
              </Button>
              <Button
                component={NavLink}
                to="/favorites"
                startIcon={<FavoriteIcon />}
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
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
        <Button fullWidth component={NavLink} to="/" startIcon={<HomeIcon />}>
          Home
        </Button>
        <Button fullWidth component={NavLink} to="/favorites" startIcon={<FavoriteIcon />}>
          Favorites
        </Button>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, pb: { xs: 10, sm: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
