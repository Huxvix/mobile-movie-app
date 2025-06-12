import { useState, useEffect, useCallback } from 'react';
import { 
  getSavedMovies, 
  saveMovie as saveMovieService, 
  removeMovie as removeMovieService, 
  isMovieSaved as isMovieSavedService,
  clearAllSavedMovies as clearAllSavedMoviesService,
  SavedMovie 
} from './savedMovies';

export const useSavedMovies = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved movies
  const loadSavedMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const movies = await getSavedMovies();
      setSavedMovies(movies);
    } catch (err) {
      setError('Failed to load saved movies');
      console.error('Error loading saved movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a movie
  const saveMovie = useCallback(async (movie: SavedMovie): Promise<boolean> => {
    try {
      const success = await saveMovieService(movie);
      if (success) {
        await loadSavedMovies(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error saving movie:', err);
      return false;
    }
  }, [loadSavedMovies]);

  // Remove a movie
  const removeMovie = useCallback(async (movieId: number): Promise<boolean> => {
    try {
      const success = await removeMovieService(movieId);
      if (success) {
        await loadSavedMovies(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error removing movie:', err);
      return false;
    }
  }, [loadSavedMovies]);

  // Check if a movie is saved (synchronous check from current state)
  const isMovieSaved = useCallback((movieId: number): boolean => {
    return savedMovies.some(movie => movie.id === movieId);
  }, [savedMovies]);

  // Clear all saved movies
  const clearAllSavedMovies = useCallback(async (): Promise<boolean> => {
    try {
      const success = await clearAllSavedMoviesService();
      if (success) {
        setSavedMovies([]);
      }
      return success;
    } catch (err) {
      console.error('Error clearing saved movies:', err);
      return false;
    }
  }, []);

  // Refresh saved movies (for manual refresh)
  const refreshSavedMovies = useCallback(() => {
    loadSavedMovies();
  }, [loadSavedMovies]);

  // Load saved movies on mount
  useEffect(() => {
    loadSavedMovies();
  }, [loadSavedMovies]);

  return {
    savedMovies,
    loading,
    error,
    saveMovie,
    removeMovie,
    isMovieSaved,
    clearAllSavedMovies,
    refreshSavedMovies,
  };
}; 