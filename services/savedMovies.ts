import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_MOVIES_KEY = 'saved_movies';

export interface SavedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview?: string;
  genre_ids?: number[];
}

// Get all saved movies
export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const savedMoviesJson = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    return savedMoviesJson ? JSON.parse(savedMoviesJson) : [];
  } catch (error) {
    console.error('Error getting saved movies:', error);
    return [];
  }
};

// Save a movie
export const saveMovie = async (movie: SavedMovie): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    
    // Check if movie is already saved
    const isAlreadySaved = savedMovies.some(savedMovie => savedMovie.id === movie.id);
    if (isAlreadySaved) {
      return true; // Already saved, return success
    }
    
    const updatedMovies = [...savedMovies, movie];
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    return true;
  } catch (error) {
    console.error('Error saving movie:', error);
    return false;
  }
};

// Remove a movie
export const removeMovie = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
    return true;
  } catch (error) {
    console.error('Error removing movie:', error);
    return false;
  }
};

// Check if a movie is saved
export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.some(movie => movie.id === movieId);
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return false;
  }
};

// Clear all saved movies
export const clearAllSavedMovies = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(SAVED_MOVIES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saved movies:', error);
    return false;
  }
}; 