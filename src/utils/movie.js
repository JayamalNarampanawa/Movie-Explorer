export function releaseYear(date) {
  return date ? new Date(date).getFullYear() : 'TBA';
}

export function ratingValue(value) {
  return typeof value === 'number' ? value.toFixed(1) : 'NR';
}

export function filterMovies(movies, filters) {
  return movies.filter((movie) => {
    const yearMatch = filters.year ? releaseYear(movie.release_date) === Number(filters.year) : true;
    const ratingMatch = filters.rating ? Number(movie.vote_average || 0) >= Number(filters.rating) : true;
    const genreMatch = filters.genre ? movie.genre_ids?.includes(Number(filters.genre)) : true;
    return yearMatch && ratingMatch && genreMatch;
  });
}
