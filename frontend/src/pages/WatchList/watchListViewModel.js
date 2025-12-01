import { useState, useEffect } from 'react';
import { reviewService } from '../../shared/api/reviewService';
import { movieService } from '../../shared/api/movieService';
import { seriesService } from '../../entities/series/seriesService';

export const useWatchListViewModel = () => {
  const [plannedMovies, setPlannedMovies] = useState([]);
  const [watchingMovies, setWatchingMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [plannedSeries, setPlannedSeries] = useState([]);
  const [watchingSeries, setWatchingSeries] = useState([]);
  const [watchedSeries, setWatchedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWatchLists = async () => {
    try {
      setLoading(true);
      setError('');

      // Загружаем все статусы просмотра
      const statusesData = await reviewService.getAllWatchStatuses();
      
      // Разделяем по статусам и типам
      const plannedMoviesList = [];
      const watchingMoviesList = [];
      const watchedMoviesList = [];
      const plannedSeriesList = [];
      const watchingSeriesList = [];
      const watchedSeriesList = [];

      if (statusesData && statusesData.results) {
        // Загружаем все фильмы и сериалы параллельно
        const loadPromises = statusesData.results.map(async (status) => {
          if (status.movie) {
            try {
              const movie = await movieService.getMovie(status.movie);
              return { ...movie, status: status.status, type: 'movie' };
            } catch (err) {
              console.error('Error loading movie:', err);
              return null;
            }
          } else if (status.series) {
            try {
              const series = await seriesService.getSeries(status.series);
              return { ...series, status: status.status, type: 'series' };
            } catch (err) {
              console.error('Error loading series:', err);
              return null;
            }
          }
          return null;
        });

        const loadedItems = await Promise.all(loadPromises);
        
        // Разделяем по статусам и типам, убираем дубликаты
        const seenItems = new Set();
        loadedItems.forEach(item => {
          if (!item) return;
          
          // Создаем уникальный ключ для фильма/сериала
          const itemKey = `${item.type}-${item.id}`;
          
          // Пропускаем дубликаты
          if (seenItems.has(itemKey)) {
            return;
          }
          seenItems.add(itemKey);
          
          if (item.type === 'movie') {
            if (item.status === 'planned') plannedMoviesList.push(item);
            else if (item.status === 'watching') watchingMoviesList.push(item);
            else if (item.status === 'watched') watchedMoviesList.push(item);
          } else if (item.type === 'series') {
            if (item.status === 'planned') plannedSeriesList.push(item);
            else if (item.status === 'watching') watchingSeriesList.push(item);
            else if (item.status === 'watched') watchedSeriesList.push(item);
          }
        });
      }

      setPlannedMovies(plannedMoviesList);
      setWatchingMovies(watchingMoviesList);
      setWatchedMovies(watchedMoviesList);
      setPlannedSeries(plannedSeriesList);
      setWatchingSeries(watchingSeriesList);
      setWatchedSeries(watchedSeriesList);

    } catch (error) {
      console.error('Error loading watch lists:', error);
      setError('Не удалось загрузить ваши списки. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchLists();
  }, []);

  const refreshData = () => {
    loadWatchLists();
  };

  return {
    plannedMovies,
    watchingMovies,
    watchedMovies,
    plannedSeries,
    watchingSeries,
    watchedSeries,
    loading,
    error,
    refreshData,
  };
};

