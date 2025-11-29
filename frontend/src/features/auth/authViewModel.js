import { useState, useEffect } from 'react';
import { authService } from '../../shared/api/authService';

export const useAuthViewModel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем пользователя при монтировании
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  /**
   * Вход пользователя
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      // Сохраняем токены и данные пользователя
      authService.setTokens(response);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Ошибка входа. Проверьте email и пароль.';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Регистрация пользователя
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // Автоматически логиним после регистрации
      authService.setTokens(response);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      let errorMessage = 'Ошибка регистрации';
      
      if (error.response?.data) {
        // Обрабатываем ошибки валидации Django
        const errors = error.response.data;
        if (errors.email) {
          errorMessage = errors.email[0];
        } else if (errors.password) {
          errorMessage = errors.password[0];
        } else if (errors.username) {
          errorMessage = errors.username[0];
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выход пользователя
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};