import { Paper, Stack, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { EmptyState } from '../components/StatusMessage';
import { useAppContext } from '../context/AppContext';

export default function FavoritesPage() {
  const { favorites } = useAppContext();

  return (
    <Stack gap={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          border: 1,
          borderColor: 'divider',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(251, 191, 36, 0.05))'
              : 'linear-gradient(135deg, rgba(20, 184, 166, 0.11), rgba(245, 158, 11, 0.07))',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 70px rgba(0, 0, 0, 0.24)'
              : '0 18px 60px rgba(15, 23, 42, 0.08)'
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
          Favorite Movies
        </Typography>
        <Typography color="text.secondary">Movies you saved are stored locally in this browser.</Typography>
      </Paper>

      {favorites.length ? (
        <MovieGrid movies={favorites} />
      ) : (
        <EmptyState title="No favorites yet" message="Save movies from search results or details pages to build your list." />
      )}
    </Stack>
  );
}
