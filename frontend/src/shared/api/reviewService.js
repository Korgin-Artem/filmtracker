import apiClient from './client';

export const reviewService = {
  /**
   * Получить список отзывов
   */
  async getReviews(movieId = null) {
    const params = movieId ? { movie: movieId } : {};
    const response = await apiClient.get('/reviews/', { params });
    return response.data;
  },

  /**
   * Создать отзыв
   */
  async createReview(reviewData) {
    const response = await apiClient.post('/reviews/', reviewData);
    return response.data;
  },

  /**
   * Создать оценку
   */
  async createRating(ratingData) {
    const response = await apiClient.post('/ratings/', ratingData);
    return response.data;
  },

  /**
   * Установить статус просмотра
   */
  async setWatchStatus(statusData) {
    const response = await apiClient.post('/watch-status/', statusData);
    return response.data;
  },

  /**
   * Обновить отзыв
   */
  async updateReview(reviewId, reviewData) {
    const response = await apiClient.put(`/reviews/${reviewId}/`, reviewData);
    return response.data;
  },

  /**
   * Удалить отзыв
   */
  async deleteReview(reviewId) {
    const response = await apiClient.delete(`/reviews/${reviewId}/`);
    return response.data;
  }
};