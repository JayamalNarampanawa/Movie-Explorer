# Movie Explorer

A React movie discovery app built for the Loons Lab Associate Software Engineer internship task.

## Live Demo

https://movie-explorer-blue-nu.vercel.app/

## Features

- Login screen with username and password fields
- Public landing page with clear calls to action
- Trending movies from TMDb
- Movie search with infinite scrolling and a Load More fallback button
- Movie detail page with overview, genres, cast, rating, runtime, release date, and trailer embed
- Favorites saved in local storage
- Last searched movie persisted in local storage
- Filters for genre, year, and minimum rating
- Light and dark mode using MUI theming
- Responsive mobile-first layout
- User-friendly API and empty-state messages

## Tech Stack

- React with Create React App
- React Router
- React Context API
- Axios
- Material UI
- TMDb API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Add your TMDb API key:

```bash
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the app:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.
The landing page is available at `/`, and the protected movie app is available at `/discover`.

## Build

```bash
npm run build
```

## API Usage

The app uses TMDb v3 endpoints:

- `/trending/movie/week`
- `/search/movie`
- `/movie/{movie_id}`
- `/movie/{movie_id}/credits`
- `/movie/{movie_id}/videos`
- `/genre/movie/list`

API calls are centralized in `src/services/tmdb.js`.

## Demo Login

This task does not require backend authentication, so the login form accepts any non-empty username and password and stores the session locally.
