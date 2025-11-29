import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';
import { authService } from '../../shared/api/authService';

export const useHomeViewModel = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем популярные фильмы
      const popularData = await movieService.getPopularMovies();
      setPopularMovies(popularData.results || []);

      // Загружаем рекомендации если пользователь авторизован
      if (authService.isAuthenticated()) {
        try {
          const recData = await movieService.getRecommendations();
          setRecommendations(recData.results || []);
        } catch (recError) {
          console.warn('Не удалось загрузить рекомендации:', recError);
        }

        // Загружаем статистику пользователя
        try {
          const stats = await authService.getUserStats();
          setUserStats(stats);
        } catch (statsError) {
          console.warn('Не удалось загрузить статистику:', statsError);
        }
      }

    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  return {
    popularMovies,
    recommendations,
    userStats,
    loading,
    error,
    refreshData: loadHomeData,
  };
};