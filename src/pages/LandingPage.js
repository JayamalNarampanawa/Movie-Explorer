import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import LoginIcon from "@mui/icons-material/Login";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TheatersIcon from "@mui/icons-material/Theaters";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { backdropUrl, getTrendingMovies } from "../services/tmdb";

const features = [
  {
    icon: <SearchIcon />,
    title: "Search Movies",
    text: "Find films by title and keep browsing with smooth pagination.",
  },
  {
    icon: <TrendingUpIcon />,
    title: "Trending Picks",
    text: "Discover popular movies powered by live TMDb data.",
  },
  {
    icon: <FavoriteIcon />,
    title: "Save Favorites",
    text: "Build a local watchlist that stays in your browser.",
  },
];

const steps = [
  "Search by movie title or start with trending picks",
  "Filter results by genre, release year, and rating",
  "Open details to view cast, overview, genres, and trailers",
  "Save favorites locally for quick access later",
];

const highlights = [
  { label: "Live TMDb data", icon: <TrendingUpIcon /> },
  { label: "Trailer support", icon: <PlayCircleIcon /> },
  { label: "Smart filters", icon: <FilterAltIcon /> },
  { label: "Local favorites", icon: <FavoriteIcon /> },
];

const fallbackHero =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80";

function Reveal({ children, delay = 0, sx }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -70px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      className={`scroll-reveal${visible ? " is-visible" : ""}`}
      sx={{ transitionDelay: `${delay}ms`, ...sx }}
    >
      {children}
    </Box>
  );
}

export default function LandingPage() {
  const { mode, toggleMode, user } = useAppContext();
  const appTarget = user ? "/discover" : "/login";
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  useEffect(() => {
    getTrendingMovies()
      .then((data) => {
        const heroMovies = data.results
          .filter((movie) => movie.backdrop_path)
          .slice(0, 6);
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
  const heroImage = activeMovie
    ? backdropUrl(activeMovie.backdrop_path, "w1280")
    : fallbackHero;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 640, md: 720 },
          display: "flex",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <Box
          key={heroImage}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(90deg, rgba(3, 7, 18, 0.94), rgba(15, 118, 110, 0.58), rgba(3, 7, 18, 0.42)), url("${heroImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "heroFade 700ms ease, heroPan 4500ms ease-out forwards",
            "@keyframes heroFade": {
              from: { opacity: 0.72 },
              to: { opacity: 1 },
            },
            "@keyframes heroPan": {
              from: { transform: "scale(1.02)" },
              to: { transform: "scale(1.08)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(3, 7, 18, 0.16), rgba(3, 7, 18, 0.18) 54%, rgba(3, 7, 18, 0.66))",
          }}
        />

        <Container maxWidth="xl">
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            sx={{ position: "relative", py: 2.5, zIndex: 1 }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  flex: "0 0 auto",
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #0f766e, #22d3ee)",
                }}
              >
                <MovieCreationIcon fontSize="small" />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  display: { xs: "none", sm: "block" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Movie Explorer
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={{ xs: 0.75, sm: 1 }}>
              <IconButton
                onClick={toggleMode}
                aria-label="toggle theme"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Button
                component={RouterLink}
                to={appTarget}
                variant="contained"
                startIcon={<LoginIcon />}
              >
                {user ? "Open App" : "Login"}
              </Button>
            </Stack>
          </Stack>
        </Container>

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            alignItems: "center",
            py: { xs: 5, md: 8 },
          }}
        >
          <Stack gap={3} sx={{ maxWidth: 720 }}>
            <Chip
              icon={<StarIcon />}
              label="TMDb powered movie discovery"
              sx={{
                alignSelf: "flex-start",
                color: "#fff",
                bgcolor: "rgba(255, 255, 255, 0.14)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 40, sm: 54, md: 78 },
                lineHeight: 0.95,
                overflowWrap: "anywhere",
              }}
            >
              Movie Explorer
            </Typography>
            <Typography
              sx={{
                maxWidth: 620,
                color: "rgba(255, 255, 255, 0.82)",
                fontSize: { xs: 18, md: 21 },
              }}
            >
              Search films, browse trending titles, inspect details, watch
              trailers, and save favorites in one focused React app.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
              <Button
                component={RouterLink}
                to={appTarget}
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
              >
                Start Exploring
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255, 255, 255, 0.55)",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>

            {trendingMovies.length > 1 && (
              <Stack
                direction="row"
                gap={1}
                sx={{ pt: 1 }}
                aria-label="Trending movie carousel"
              >
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
                      cursor: "pointer",
                      bgcolor:
                        index === activeMovieIndex
                          ? "#22d3ee"
                          : "rgba(255, 255, 255, 0.42)",
                      transition:
                        "width 180ms ease, background-color 180ms ease",
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
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Reveal delay={index * 90} sx={{ height: "100%" }}>
                <Stack
                  gap={1.5}
                  sx={(theme) => ({
                    height: "100%",
                    p: 3,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 16px 42px rgba(0, 0, 0, 0.22)"
                        : "0 14px 34px rgba(15, 23, 42, 0.07)",
                  })}
                >
                  <Box
                    sx={(theme) => ({
                      width: 42,
                      height: 42,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2,
                      color: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    })}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography color="text.secondary">{feature.text}</Typography>
                </Stack>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <Reveal>
                <Stack gap={1.5}>
                  <Chip
                    label="How it works"
                    color="primary"
                    sx={{ alignSelf: "flex-start" }}
                  />
                  <Typography
                    variant="h3"
                    sx={{ fontSize: { xs: 30, md: 42 } }}
                  >
                    Simple movie discovery from search to saved favorites.
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 17, lineHeight: 1.7 }}
                  >
                    Movie Explorer keeps the workflow focused: search, compare,
                    inspect details, and save the movies you want to remember.
                  </Typography>
                </Stack>
              </Reveal>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {steps.map((step, index) => (
                  <Grid item xs={12} sm={6} key={step}>
                    <Reveal delay={index * 90} sx={{ height: "100%" }}>
                      <Stack
                        direction="row"
                        gap={2}
                        sx={{
                          height: "100%",
                          p: 2.5,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Box
                          sx={{
                            flex: "0 0 auto",
                            width: 34,
                            height: 34,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "50%",
                            color: "#fff",
                            bgcolor: "primary.main",
                            fontWeight: 800,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography fontWeight={700}>{step}</Typography>
                      </Stack>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Reveal>
              <Stack
                sx={(theme) => ({
                  p: { xs: 2.5, md: 3 },
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 20px 70px rgba(0, 0, 0, 0.28)"
                      : "0 18px 60px rgba(15, 23, 42, 0.1)",
                })}
                gap={2.5}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <TheatersIcon color="primary" />
                    <Typography variant="h6">Inside the App</Typography>
                  </Stack>
                  <Chip size="small" label="Responsive UI" color="secondary" />
                </Stack>

                <Box
                  sx={{
                    minHeight: 240,
                    borderRadius: 2,
                    p: 2,
                    color: "#fff",
                    background:
                      'linear-gradient(135deg, rgba(15, 118, 110, 0.95), rgba(15, 23, 42, 0.92)), url("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <Stack gap={1}>
                    <Typography variant="h4">
                      Search. Discover. Save.
                    </Typography>
                    <Typography
                      sx={{ color: "rgba(255,255,255,0.82)", maxWidth: 420 }}
                    >
                      Built with reusable React components, MUI styling, TMDb
                      requests, and local storage.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Reveal>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack gap={2}>
              <Reveal delay={120}>
                <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                  Built for a practical movie browsing experience.
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 17, lineHeight: 1.7 }}
                >
                  The interface is designed to be quick to scan on mobile and
                  desktop, with clear states for loading, empty results, API
                  errors, and saved movies.
                </Typography>
              </Reveal>
              <Grid container spacing={1.5}>
                {highlights.map((item, index) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Reveal delay={index * 80 + 180}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.5}
                        sx={{
                          p: 1.5,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.paper",
                        }}
                      >
                        <Box
                          sx={(theme) => ({
                            width: 36,
                            height: 36,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            color: "primary.main",
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                          })}
                        >
                          {item.icon}
                        </Box>
                        <Typography fontWeight={800}>{item.label}</Typography>
                      </Stack>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.mode === "dark" ? "#070a12" : "#0f172a",
          color: "#fff",
        })}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 6 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={3}
            alignItems={{ md: "center" }}
          >
            <Reveal>
              <Stack gap={1} sx={{ maxWidth: 640 }}>
                <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 40 } }}>
                  Ready to find your next favorite film?
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.74)" }}>
                  Open Movie Explorer, search a title, or begin with today’s
                  trending films.
                </Typography>
              </Stack>
            </Reveal>
            <Reveal delay={120} sx={{ width: { xs: "100%", md: "auto" } }}>
              <Button
                component={RouterLink}
                to={appTarget}
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Explore Movies
              </Button>
            </Reveal>
          </Stack>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={2}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <MovieCreationIcon color="primary" />
              <Typography fontWeight={800}>Movie Explorer</Typography>
            </Stack>
            <Typography color="text.secondary">
              Loons Lab assessment project using React, MUI, and The Movie
              Database API.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
