import { Grid } from '@mui/material';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  return (
    <Grid container spacing={2.5}>
      {movies.map((movie) => (
        <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
          <MovieCard movie={movie} />
        </Grid>
      ))}
    </Grid>
  );
}
