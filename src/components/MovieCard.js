import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { posterUrl } from '../services/tmdb';
import { ratingValue, releaseYear } from '../utils/movie';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAppContext();
  const favorite = isFavorite(movie.id);
  const poster = posterUrl(movie.poster_path);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 18px 42px rgba(0, 0, 0, 0.26)'
            : '0 14px 34px rgba(15, 23, 42, 0.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 24px 56px rgba(0, 0, 0, 0.38)'
              : '0 22px 52px rgba(15, 23, 42, 0.14)'
        },
        '&:hover .movie-poster': {
          transform: 'scale(1.04)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardActionArea onClick={() => navigate(`/discover/movie/${movie.id}`)} aria-label={`View ${movie.title}`}>
          <Box
            sx={{
              aspectRatio: '2 / 3',
              bgcolor: 'action.hover',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.45))',
                opacity: poster ? 1 : 0
              }
            }}
          >
            {poster ? (
              <Box
                className="movie-poster"
                component="img"
                src={poster}
                alt={`${movie.title} poster`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 220ms ease'
                }}
              />
            ) : (
              <Typography color="text.secondary" sx={{ px: 2, textAlign: 'center' }}>
                Poster unavailable
              </Typography>
            )}
          </Box>
        </CardActionArea>
        <Tooltip title={favorite ? 'Remove from favorites' : 'Save to favorites'}>
          <IconButton
            onClick={() => toggleFavorite(movie)}
            aria-label={favorite ? 'remove favorite' : 'add favorite'}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.22)',
              '&:hover': { bgcolor: '#fff' }
            }}
          >
            {favorite ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 1.75 }}>
        <Stack gap={1}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.25,
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {movie.title}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {releaseYear(movie.release_date)}
            </Typography>
            <Chip
              size="small"
              color="secondary"
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label={ratingValue(movie.vote_average)}
              sx={{ color: 'secondary.contrastText' }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
