import apiClient from '../../shared/api/client';

export const seriesService = {
  /**
   * Получить список сериалов с пагинацией и фильтрацией
   */
  async getSeries(params = {}) {
    const response = await apiClient.get('/series/', { params });
    return response.data;
  },

  /**
   * Получить детальную информацию о сериале
   */
  async getSeries(id) {
    const response = await apiClient.get(`/series/${id}/`);
    return response.data;
  },

  /**
   * Создать новый сериал
   */
  async createSeries(seriesData) {
    // Преобразуем genres в genres_ids для API
    const data = { ...seriesData };
    if (data.genres) {
      data.genres_ids = data.genres;
      delete data.genres;
    }
    const response = await apiClient.post('/series/', data);
    return response.data;
  },

  /**
   * Обновить сериал
   */
  async updateSeries(id, seriesData) {
    // Преобразуем genres в genres_ids для API
    const data = { ...seriesData };
    if (data.genres) {
      data.genres_ids = data.genres;
      delete data.genres;
    }
    const response = await apiClient.put(`/series/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить сериал (для админа)
   */
  async deleteSeries(id) {
    const response = await apiClient.delete(`/series/${id}/`);
    return response.data;
  },

  /**
   * Поиск сериалов
   */
  async searchSeries(query) {
    const response = await apiClient.get('/series/', {
      params: { search: query }
    });
    return response.data;
  }
};