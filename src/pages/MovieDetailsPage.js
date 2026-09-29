import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/StatusMessage';
import { useAppContext } from '../context/AppContext';
import { backdropUrl, getMovieDetails, posterUrl } from '../services/tmdb';
import { ratingValue, releaseYear } from '../utils/movie';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getMovieDetails(id)
      .then((data) => setMovie(data))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [id]);

  const trailer = useMemo(
    () =>
      movie?.videos?.results?.find(
        (video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
      ),
    [movie]
  );

  if (loading) {
    return <LoadingState label="Loading movie details..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!movie) {
    return null;
  }

  const favorite = isFavorite(movie.id);
  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path);
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <Stack gap={3}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start' }}>
        Back
      </Button>

      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 24px 70px rgba(0, 0, 0, 0.36)'
              : '0 24px 70px rgba(15, 23, 42, 0.14)'
        }}
      >
        <Box
          sx={{
            minHeight: { xs: 260, md: 420 },
            display: 'flex',
            alignItems: 'flex-end',
            p: { xs: 2, md: 4 },
            color: '#fff',
            backgroundImage: backdrop
              ? `linear-gradient(90deg, rgba(3, 7, 18, 0.9), rgba(15, 118, 110, 0.5), rgba(3, 7, 18, 0.28)), url(${backdrop})`
              : 'linear-gradient(135deg, #0f766e, #172033)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ md: 'flex-end' }}>
            <Box
              sx={{
                width: { xs: 140, md: 220 },
                aspectRatio: '2 / 3',
                bgcolor: 'rgba(255,255,255,0.15)',
                border: 1,
                borderColor: 'rgba(255,255,255,0.35)',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.42)'
              }}
            >
              {poster && (
                <Box
                  component="img"
                  src={poster}
                  alt={`${movie.title} poster`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
            <Stack gap={2} sx={{ maxWidth: 820 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 56 } }}>
                {movie.title}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Chip color="secondary" icon={<StarIcon />} label={`${ratingValue(movie.vote_average)} rating`} />
                <Chip label={releaseYear(movie.release_date)} />
                {movie.runtime ? <Chip label={`${movie.runtime} min`} /> : null}
              </Stack>
              <Typography sx={{ fontSize: { md: 18 }, lineHeight: 1.7 }}>{movie.overview}</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => toggleFavorite(movie)}
                >
                  {favorite ? 'Saved' : 'Save Favorite'}
                </Button>
                {trailer && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<PlayCircleIcon />}
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Trailer
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              height: '100%',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 16px 42px rgba(0, 0, 0, 0.22)'
                  : '0 14px 34px rgba(15, 23, 42, 0.07)'
            }}
          >
            <Stack gap={2}>
              <Typography variant="h5">Movie Info</Typography>
              <Divider />
              <Stack direction="row" gap={1} flexWrap="wrap">
                {movie.genres?.map((genre) => (
                  <Chip key={genre.id} label={genre.name} color="primary" variant="outlined" />
                ))}
              </Stack>
              <Typography color="text.secondary">
                Released {movie.release_date || 'date unavailable'} by{' '}
                {movie.production_companies?.[0]?.name || 'production company unavailable'}.
              </Typography>
              <Typography color="text.secondary">
                Original language: {movie.original_language?.toUpperCase()}.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              height: '100%',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 16px 42px rgba(0, 0, 0, 0.22)'
                  : '0 14px 34px rgba(15, 23, 42, 0.07)'
            }}
          >
            <Stack gap={2}>
              <Typography variant="h5">Top Cast</Typography>
              <Divider />
              {cast.length ? (
                cast.map((person) => (
                  <Stack key={person.cast_id || person.id} direction="row" justifyContent="space-between" gap={2}>
                    <Typography fontWeight={700}>{person.name}</Typography>
                    <Typography color="text.secondary" textAlign="right">
                      {person.character}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary">Cast details unavailable.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {trailer && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: 1,
            borderColor: 'divider',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 16px 42px rgba(0, 0, 0, 0.22)'
                : '0 14px 34px rgba(15, 23, 42, 0.07)'
          }}
        >
          <Stack gap={2}>
            <Typography variant="h5">Trailer</Typography>
            <Box
              component="iframe"
              title={`${movie.title} trailer`}
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                border: 0,
                borderRadius: 1,
                bgcolor: 'action.hover'
              }}
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
