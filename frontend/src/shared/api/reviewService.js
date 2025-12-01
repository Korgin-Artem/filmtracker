import apiClient from './client';

export const reviewService = {
  /**
   * Получить список отзывов
   */
  async getReviews(movieId = null, seriesId = null, userId = null) {
    const params = {};
    if (movieId) params.movie = movieId;
    if (seriesId) params.series = seriesId;
    if (userId) params.user = userId;
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
   * Получить оценку пользователя для фильма/сериала
   */
  async getUserRating(movieId = null, seriesId = null) {
    const params = {};
    if (movieId) params.movie = movieId;
    if (seriesId) params.series = seriesId;
    const response = await apiClient.get('/ratings/', { params });
    const ratings = response.data.results || [];
    return ratings.length > 0 ? ratings[0] : null;
  },

  /**
   * Создать оценку
   */
  async createRating(ratingData) {
    const response = await apiClient.post('/ratings/', ratingData);
    return response.data;
  },

  /**
   * Получить статус просмотра пользователя для фильма/сериала
   */
  async getUserWatchStatus(movieId = null, seriesId = null) {
    const params = {};
    if (movieId) params.movie = movieId;
    if (seriesId) params.series = seriesId;
    const response = await apiClient.get('/watch-status/', { params });
    const statuses = response.data.results || [];
    return statuses.length > 0 ? statuses[0] : null;
  },

  /**
   * Получить все статусы просмотра пользователя
   */
  async getAllWatchStatuses() {
    const response = await apiClient.get('/watch-status/');
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
   * Удалить статус просмотра
   */
  async deleteWatchStatus(statusId) {
    const response = await apiClient.delete(`/watch-status/${statusId}/`);
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