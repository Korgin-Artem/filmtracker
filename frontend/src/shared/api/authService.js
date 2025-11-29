import apiClient from './client';

export const authService = {
  /**
   * Регистрация нового пользователя
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  /**
   * Вход пользователя
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Выход пользователя
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Сохранение токенов в localStorage
   */
  setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  /**
   * Получение данных текущего пользователя
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Проверка авторизации пользователя
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Получение статистики пользователя
   */
  async getUserStats() {
    const response = await apiClient.get('/user/stats/');
    return response.data;
  }
};