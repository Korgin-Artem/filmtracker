import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';
import { reviewService } from '../../shared/api/reviewService';

export const useMovieDetailViewModel = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userWatchStatus, setUserWatchStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем данные фильма
      const movieData = await movieService.getMovie(movieId);
      setMovie(movieData);

      // Загружаем отзывы
      const reviewsData = await reviewService.getReviews(movieId);
      setReviews(reviewsData.results || []);

      // Загружаем текущий рейтинг пользователя
      try {
        const userRating = await reviewService.getUserRating(movieId);
        if (userRating) {
          setUserRating(userRating.rating);
        }
      } catch (error) {
        console.error('Error loading user rating:', error);
      }

      // Загружаем текущий статус просмотра
      try {
        const userStatus = await reviewService.getUserWatchStatus(movieId);
        if (userStatus) {
          setUserWatchStatus(userStatus.status);
        }
      } catch (error) {
        console.error('Error loading user watch status:', error);
      }

    } catch (error) {
      console.error('Error loading movie:', error);
      setError('Не удалось загрузить информацию о фильме.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleStatusChange = (newStatus) => {
    setUserWatchStatus(newStatus);
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return {
    movie,
    reviews,
    userRating,
    userWatchStatus,
    loading,
    error,
    refreshData: loadMovieData,
    handleRatingChange,
    handleStatusChange,
    handleReviewSubmitted
  };
};