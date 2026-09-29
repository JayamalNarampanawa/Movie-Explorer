import axios from 'axios';

const RAW_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_KEY = RAW_API_KEY && RAW_API_KEY !== 'your_tmdb_api_key_here' ? RAW_API_KEY : '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000
});

client.interceptors.request.use((config) => {
  if (!API_KEY) {
    return config;
  }

  return {
    ...config,
    params: {
      api_key: API_KEY,
      language: 'en-US',
      ...config.params
    }
  };
});

function requireApiKey() {
  if (!API_KEY) {
    throw new Error('Add your TMDb API key to .env as REACT_APP_TMDB_API_KEY to load movie data.');
  }
}

async function request(path, params) {
  requireApiKey();

  try {
    const response = await client.get(path, { params });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.status_message ||
      error.message ||
      'Something went wrong while connecting to TMDb.';
    throw new Error(message);
  }
}

export function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function backdropUrl(path, size = 'w1280') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export function getTrendingMovies(page = 1) {
  return request('/trending/movie/week', { page });
}

export function searchMovies(query, page = 1, filters = {}) {
  return request('/search/movie', {
    query,
    page,
    include_adult: false,
    year: filters.year || undefined
  });
}

export function discoverMovies(page = 1, filters = {}) {
  return request('/discover/movie', {
    page,
    sort_by: 'popularity.desc',
    include_adult: false,
    with_genres: filters.genre || undefined,
    primary_release_year: filters.year || undefined,
    'vote_average.gte': filters.rating || undefined,
    'vote_count.gte': filters.rating ? 50 : undefined
  });
}

export function getMovieDetails(id) {
  return request(`/movie/${id}`, {
    append_to_response: 'credits,videos'
  });
}

export function getGenres() {
  return request('/genre/movie/list');
}
