import apiClient from './client';

export const movieService = {
  /**
   * Получить список фильмов с пагинацией и фильтрацией
   */
  async getMovies(params = {}) {
    const response = await apiClient.get('/movies/', { params });
    return response.data;
  },

  /**
   * Получить детальную информацию о фильме
   */
  async getMovie(id) {
    const response = await apiClient.get(`/movies/${id}/`);
    return response.data;
  },

  /**
   * Получить популярные фильмы
   */
  async getPopularMovies() {
    const response = await apiClient.get('/movies/popular/');
    return response.data;
  },

  /**
   * Получить рекомендации для пользователя
   */
  async getRecommendations() {
    const response = await apiClient.get('/recommendations/');
    return response.data;
  },

  /**
   * Создать новый фильм (для админа)
   */
  async createMovie(movieData) {
    const response = await apiClient.post('/movies/', movieData);
    return response.data;
  },

  /**
   * Поиск фильмов
   */
  async searchMovies(query) {
    const response = await apiClient.get('/movies/', {
      params: { search: query }
    });
    return response.data;
  }
};