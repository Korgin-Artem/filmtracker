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
   * Создать новый фильм
   */
  async createMovie(movieData) {
    // Преобразуем genres в genres_ids для API
    const data = { ...movieData };
    if (data.genres) {
      data.genres_ids = data.genres;
      delete data.genres;
    }
    const response = await apiClient.post('/movies/', data);
    return response.data;
  },

  /**
   * Обновить фильм
   */
  async updateMovie(movieId, movieData) {
    // Преобразуем genres в genres_ids для API
    const data = { ...movieData };
    if (data.genres) {
      data.genres_ids = data.genres;
      delete data.genres;
    }
    const response = await apiClient.put(`/movies/${movieId}/`, data);
    return response.data;
  },

  /**
   * Удалить фильм
   */
  async deleteMovie(movieId) {
    const response = await apiClient.delete(`/movies/${movieId}/`);
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
  },

  /**
   * Получить все жанры
   */
  async getGenres() {
    const response = await apiClient.get('/genres/');
    return response.data;
  },

  /**
   * Создать новый жанр
   */
  async createGenre(genreData) {
    const response = await apiClient.post('/genres/', genreData);
    return response.data;
  }
};