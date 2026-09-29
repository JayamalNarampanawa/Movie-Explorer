import { Stack, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { EmptyState } from '../components/StatusMessage';
import { useAppContext } from '../context/AppContext';

export default function FavoritesPage() {
  const { favorites } = useAppContext();

  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
          Favorite Movies
        </Typography>
        <Typography color="text.secondary">Movies you saved are stored locally in this browser.</Typography>
      </Stack>

      {favorites.length ? (
        <MovieGrid movies={favorites} />
      ) : (
        <EmptyState title="No favorites yet" message="Save movies from search results or details pages to build your list." />
      )}
    </Stack>
  );
}
