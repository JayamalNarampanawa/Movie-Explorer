import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  const [mode, setMode] = useState(() => readStorage('movieExplorerTheme', 'light'));
  const [user, setUser] = useState(() => readStorage('movieExplorerUser', null));
  const [favorites, setFavorites] = useState(() => readStorage('movieExplorerFavorites', []));
  const [lastSearch, setLastSearchState] = useState(() => readStorage('movieExplorerLastSearch', ''));

  const login = useCallback((credentials) => {
    const nextUser = { username: credentials.username.trim() };
    setUser(nextUser);
    writeStorage('movieExplorerUser', nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('movieExplorerUser');
  }, []);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      writeStorage('movieExplorerTheme', next);
      return next;
    });
  }, []);

  const setLastSearch = useCallback((query) => {
    setLastSearchState(query);
    writeStorage('movieExplorerLastSearch', query);
  }, []);

  const isFavorite = useCallback(
    (movieId) => favorites.some((movie) => movie.id === Number(movieId)),
    [favorites]
  );

  const toggleFavorite = useCallback((movie) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === movie.id);
      const next = exists
        ? current.filter((item) => item.id !== movie.id)
        : [
            ...current,
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              overview: movie.overview
            }
          ];
      writeStorage('movieExplorerFavorites', next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      user,
      favorites,
      lastSearch,
      login,
      logout,
      toggleMode,
      setLastSearch,
      isFavorite,
      toggleFavorite
    }),
    [favorites, isFavorite, lastSearch, login, logout, mode, setLastSearch, toggleFavorite, toggleMode, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
