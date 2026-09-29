import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MovieFilters from '../components/MovieFilters';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusMessage';
import { useAppContext } from '../context/AppContext';
import { discoverMovies, getGenres, getTrendingMovies, searchMovies } from '../services/tmdb';
import { filterMovies } from '../utils/movie';

const initialFilters = {
  genre: '',
  year: '',
  rating: 0
};

export default function HomePage() {
  const { lastSearch, setLastSearch } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState(lastSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);

  const hasActiveFilters = Boolean(filters.genre || filters.year || Number(filters.rating));
  const heading = query ? `Results for "${query}"` : hasActiveFilters ? 'Filtered Discoveries' : 'Trending Movies';

  const visibleMovies = useMemo(
    () => (query ? filterMovies(movies, filters) : movies),
    [filters, movies, query]
  );

  const loadMovies = useCallback(
    async ({ nextPage = 1, append = false, nextQuery = query, nextFilters = filters } = {}) => {
      const isLoadMore = append;
      setError('');
      isLoadMore ? setLoadingMore(true) : setLoading(true);

      try {
        let data;
        if (nextQuery) {
          data = await searchMovies(nextQuery, nextPage, nextFilters);
        } else if (nextFilters.genre || nextFilters.year || Number(nextFilters.rating)) {
          data = await discoverMovies(nextPage, nextFilters);
        } else {
          data = await getTrendingMovies(nextPage);
        }

        setMovies((current) => (append ? [...current, ...data.results] : data.results));
        setPage(data.page);
        setTotalPages(data.total_pages);
      } catch (loadError) {
        setError(loadError.message);
        if (!append) {
          setMovies([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, query]
  );

  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    loadMovies({ nextPage: 1, append: false, nextQuery: query, nextFilters: filters });
  }, [filters, loadMovies, query]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || page >= totalPages || loading || loadingMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMovies({ nextPage: page + 1, append: true });
        }
      },
      { rootMargin: '500px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMovies, loading, loadingMore, page, totalPages]);

  const handleSearch = (nextQuery) => {
    setQuery(nextQuery);
    setLastSearch(nextQuery);
    setPage(1);
  };

  const handleFilters = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      loadMovies({ nextPage: page + 1, append: true });
    }
  };

  return (
    <Stack gap={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Stack gap={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
            <Box>
              <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 } }}>
                Discover Your Favorite Films
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
                Search titles, browse trending movies, filter by taste, and save favorites locally.
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" gap={1} color="primary.main">
              <TrendingUpIcon />
              <Typography variant="subtitle1" fontWeight={800}>
                TMDb powered
              </Typography>
            </Stack>
          </Stack>
          <SearchBar initialValue={lastSearch} onSearch={handleSearch} />
          <MovieFilters genres={genres} filters={filters} onChange={handleFilters} />
        </Stack>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
        <Typography variant="h5">{heading}</Typography>
        {query && (
          <Button onClick={() => handleSearch('')} variant="outlined">
            Clear Search
          </Button>
        )}
      </Stack>

      {error && <ErrorState message={error} />}
      {loading && <LoadingState />}
      {!loading && !error && visibleMovies.length === 0 && (
        <EmptyState title="No movies found" message="Try another title or loosen the filters." />
      )}
      {!loading && !error && visibleMovies.length > 0 && <MovieGrid movies={visibleMovies} />}

      <Box ref={loadMoreRef} sx={{ minHeight: 24 }} />

      {!loading && !error && page < totalPages && (
        <Stack alignItems="center" sx={{ pb: 2 }}>
          <Button
            variant="contained"
            startIcon={<ExpandMoreIcon />}
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
