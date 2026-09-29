import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightModeIcon from '@mui/icons-material/LightMode';
import LoginIcon from '@mui/icons-material/Login';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { backdropUrl, getTrendingMovies } from '../services/tmdb';

const features = [
  {
    icon: <SearchIcon />,
    title: 'Search Movies',
    text: 'Find films by title and keep browsing with smooth pagination.'
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Trending Picks',
    text: 'Discover popular movies powered by live TMDb data.'
  },
  {
    icon: <FavoriteIcon />,
    title: 'Save Favorites',
    text: 'Build a local watchlist that stays in your browser.'
  }
];

const fallbackHero =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80';

export default function LandingPage() {
  const { mode, toggleMode, user } = useAppContext();
  const appTarget = user ? '/discover' : '/login';
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  useEffect(() => {
    getTrendingMovies()
      .then((data) => {
        const heroMovies = data.results.filter((movie) => movie.backdrop_path).slice(0, 6);
        setTrendingMovies(heroMovies);
      })
      .catch(() => setTrendingMovies([]));
  }, []);

  useEffect(() => {
    if (trendingMovies.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveMovieIndex((current) => (current + 1) % trendingMovies.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [trendingMovies.length]);

  const activeMovie = trendingMovies[activeMovieIndex];
  const heroImage = activeMovie ? backdropUrl(activeMovie.backdrop_path, 'w1280') : fallbackHero;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 640, md: 720 },
          display: 'flex',
          flexDirection: 'column',
          color: '#fff'
        }}
      >
        <Box
          key={heroImage}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(90deg, rgba(3, 7, 18, 0.94), rgba(15, 118, 110, 0.58), rgba(3, 7, 18, 0.42)), url("${heroImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'heroFade 700ms ease, heroPan 4500ms ease-out forwards',
            '@keyframes heroFade': {
              from: { opacity: 0.72 },
              to: { opacity: 1 }
            },
            '@keyframes heroPan': {
              from: { transform: 'scale(1.02)' },
              to: { transform: 'scale(1.08)' }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3, 7, 18, 0.16), rgba(3, 7, 18, 0.18) 54%, rgba(3, 7, 18, 0.66))'
          }}
        />

        <Container maxWidth="xl">
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ position: 'relative', py: 2.5, zIndex: 1 }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #0f766e, #22d3ee)'
                }}
              >
                <MovieCreationIcon fontSize="small" />
              </Box>
              <Typography variant="h6">Movie Explorer</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton
                onClick={toggleMode}
                aria-label="toggle theme"
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Button component={RouterLink} to={appTarget} variant="contained" startIcon={<LoginIcon />}>
                {user ? 'Open App' : 'Login'}
              </Button>
            </Stack>
          </Stack>
        </Container>

        <Container
          maxWidth="xl"
          sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', py: { xs: 5, md: 8 } }}
        >
          <Stack gap={3} sx={{ maxWidth: 720 }}>
            <Chip
              icon={<StarIcon />}
              label="TMDb powered movie discovery"
              sx={{
                alignSelf: 'flex-start',
                color: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)'
              }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 44, md: 78 }, lineHeight: 0.95 }}>
              Movie Explorer
            </Typography>
            <Typography sx={{ maxWidth: 620, color: 'rgba(255, 255, 255, 0.82)', fontSize: { xs: 18, md: 21 } }}>
              Search films, browse trending titles, inspect details, watch trailers, and save favorites in one focused
              React app.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
              <Button component={RouterLink} to={appTarget} variant="contained" size="large" startIcon={<SearchIcon />}>
                Start Exploring
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.55)',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>

            {trendingMovies.length > 1 && (
              <Stack direction="row" gap={1} sx={{ pt: 1 }} aria-label="Trending movie carousel">
                {trendingMovies.map((movie, index) => (
                  <Box
                    key={movie.id}
                    component="button"
                    onClick={() => setActiveMovieIndex(index)}
                    aria-label={`Show ${movie.title}`}
                    sx={{
                      width: index === activeMovieIndex ? 34 : 10,
                      height: 10,
                      border: 0,
                      borderRadius: 999,
                      cursor: 'pointer',
                      bgcolor: index === activeMovieIndex ? '#22d3ee' : 'rgba(255, 255, 255, 0.42)',
                      transition: 'width 180ms ease, background-color 180ms ease'
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={2.5}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Stack
                gap={1.5}
                sx={(theme) => ({
                  height: '100%',
                  p: 3,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 16px 42px rgba(0, 0, 0, 0.22)'
                      : '0 14px 34px rgba(15, 23, 42, 0.07)'
                })}
              >
                <Box
                  sx={(theme) => ({
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.12)
                  })}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography color="text.secondary">{feature.text}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
