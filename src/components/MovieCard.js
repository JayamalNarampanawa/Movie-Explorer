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
        borderColor: 'divider'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)} aria-label={`View ${movie.title}`}>
          <Box
            sx={{
              aspectRatio: '2 / 3',
              bgcolor: 'action.hover',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {poster ? (
              <Box
                component="img"
                src={poster}
                alt={`${movie.title} poster`}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.paper' }
            }}
          >
            {favorite ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack gap={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.25 }}>
            {movie.title}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {releaseYear(movie.release_date)}
            </Typography>
            <Chip
              size="small"
              color="primary"
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label={ratingValue(movie.vote_average)}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
