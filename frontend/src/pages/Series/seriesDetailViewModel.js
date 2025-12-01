import { useState, useEffect } from 'react';
import { seriesService } from '../../entities/series/seriesService';
import { reviewService } from '../../shared/api/reviewService';

export const useSeriesDetailViewModel = (seriesId) => {
  const [series, setSeries] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userWatchStatus, setUserWatchStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (seriesId) {
      loadSeriesData();
    }
  }, [seriesId]);

  const loadSeriesData = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем данные сериала
      const seriesData = await seriesService.getSeries(seriesId);
      setSeries(seriesData);

      // Загружаем отзывы
      const reviewsData = await reviewService.getReviews(null, seriesId);
      setReviews(reviewsData.results || []);

      // Загружаем текущий рейтинг пользователя
      try {
        const userRating = await reviewService.getUserRating(null, seriesId);
        if (userRating) {
          setUserRating(userRating.rating);
        }
      } catch (error) {
        console.error('Error loading user rating:', error);
      }

      // Загружаем текущий статус просмотра
      try {
        const userStatus = await reviewService.getUserWatchStatus(null, seriesId);
        if (userStatus) {
          setUserWatchStatus(userStatus.status);
        }
      } catch (error) {
        console.error('Error loading user watch status:', error);
      }

    } catch (error) {
      console.error('Error loading series:', error);
      setError('Не удалось загрузить информацию о сериале.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
    // Здесь можно добавить вызов API для сохранения оценки
  };

  const handleStatusChange = (newStatus) => {
    setUserWatchStatus(newStatus);
    // Здесь можно добавить вызов API для сохранения статуса
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return {
    series,
    reviews,
    userRating,
    userWatchStatus,
    loading,
    error,
    refreshData: loadSeriesData,
    handleRatingChange,
    handleStatusChange,
    handleReviewSubmitted
  };
};