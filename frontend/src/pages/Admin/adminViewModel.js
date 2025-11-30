import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';
import { seriesService } from '../../entities/series/seriesService';

export const useAdminViewModel = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [moviesData, seriesData] = await Promise.all([
        movieService.getMovies({ page_size: 100 }),
        seriesService.getSeries({ page_size: 100 })
      ]);

      setMovies(moviesData.results || []);
      setSeries(seriesData.results || []);

    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Не удалось загрузить данные.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      await movieService.deleteMovie(movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting movie:', error);
      return { success: false, error: 'Ошибка удаления фильма' };
    }
  };

  const deleteSeries = async (seriesId) => {
    try {
      await seriesService.deleteSeries(seriesId);
      setSeries(prev => prev.filter(series => series.id !== seriesId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting series:', error);
      return { success: false, error: 'Ошибка удаления сериала' };
    }
  };

  const handleMovieSaved = () => {
    loadData();
  };

  const handleSeriesSaved = () => {
    loadData();
  };

  return {
    movies,
    series,
    loading,
    error,
    activeTab,
    setActiveTab,
    refreshData: loadData,
    deleteMovie,
    deleteSeries,
    handleMovieSaved,
    handleSeriesSaved
  };
};