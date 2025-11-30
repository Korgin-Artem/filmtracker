import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';

export const useRecommendationsViewModel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем персональные рекомендации
      const recData = await movieService.getRecommendations();
      setRecommendations(recData.results || []);

      // Загружаем популярные фильмы как fallback
      const popularData = await movieService.getPopularMovies();
      setPopularMovies(popularData.results || []);

      // Загружаем новые релизы (последние добавленные)
      const newData = await movieService.getMovies({ ordering: '-created_at', page_size: 12 });
      setNewReleases(newData.results || []);

    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Не удалось загрузить рекомендации.');
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = () => {
    loadRecommendations();
  };

  return {
    recommendations,
    popularMovies,
    newReleases,
    loading,
    error,
    refreshRecommendations
  };
};