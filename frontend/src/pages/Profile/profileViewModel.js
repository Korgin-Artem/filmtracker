import { useState, useEffect } from 'react';
import { authService } from '../../shared/api/authService';
import { movieService } from '../../shared/api/movieService';
import { reviewService } from '../../shared/api/reviewService';

export const useProfileViewModel = () => {
  const [userStats, setUserStats] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем статистику
      const stats = await authService.getUserStats();
      setUserStats(stats);

      // Загружаем отзывы пользователя
      const reviewsData = await reviewService.getReviews();
      setUserReviews(reviewsData.results || []);

    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Не удалось загрузить данные профиля.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadUserData();
  };

  return {
    userStats,
    watchedMovies,
    userReviews,
    loading,
    error,
    refreshData
  };
};