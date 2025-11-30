import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';
import { seriesService } from '../../entities/series/seriesService';

export const useCatalogViewModel = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    genres: '',
    release_year_min: '',
    release_year_max: '',
    ordering: '-created_at'
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1
  });

  const loadMovies = async (page = 1, newFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        ...newFilters
      };

      // Убираем пустые параметры
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const data = await movieService.getMovies(params);
      
      setMovies(data.results || []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page
      });
    } catch (error) {
      console.error('Error loading movies:', error);
      setError('Не удалось загрузить фильмы. Попробуйте обновить страницу.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSeries = async (page = 1, newFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        ...newFilters
      };

      // Убираем пустые параметры
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const data = await seriesService.getSeries(params);
      
      setSeries(data.results || []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page
      });
    } catch (error) {
      console.error('Error loading series:', error);
      setError('Не удалось загрузить сериалы. Попробуйте обновить страницу.');
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      // Загружаем жанры для фильтра из фильмов и сериалов
      const [moviesData, seriesData] = await Promise.all([
        movieService.getMovies({ page_size: 100 }),
        seriesService.getSeries({ page_size: 100 })
      ]);

      const allGenres = [];
      
      // Добавляем жанры из фильмов
      moviesData.results?.forEach(movie => {
        movie.genres?.forEach(genre => {
          if (!allGenres.find(g => g.id === genre.id)) {
            allGenres.push(genre);
          }
        });
      });

      // Добавляем жанры из сериалов
      seriesData.results?.forEach(series => {
        series.genres?.forEach(genre => {
          if (!allGenres.find(g => g.id === genre.id)) {
            allGenres.push(genre);
          }
        });
      });
      
      setGenres(allGenres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  useEffect(() => {
    loadMovies();
    loadGenres();
  }, []);

  const handleFilterChange = (newFilters, contentType = 'movies') => {
    setFilters(newFilters);
    if (contentType === 'movies') {
      loadMovies(1, newFilters);
    } else {
      loadSeries(1, newFilters);
    }
  };

  const handlePageChange = (newPage, contentType = 'movies') => {
    if (contentType === 'movies') {
      loadMovies(newPage);
    } else {
      loadSeries(newPage);
    }
  };

  const handleSearch = (searchQuery, contentType = 'movies') => {
    handleFilterChange({ ...filters, search: searchQuery }, contentType);
  };

  const clearFilters = (contentType = 'movies') => {
    const defaultFilters = {
      search: '',
      genres: '',
      release_year_min: '',
      release_year_max: '',
      ordering: '-created_at'
    };
    setFilters(defaultFilters);
    if (contentType === 'movies') {
      loadMovies(1, defaultFilters);
    } else {
      loadSeries(1, defaultFilters);
    }
  };

  return {
    movies,
    series,
    genres,
    loading,
    error,
    filters,
    pagination,
    loadMovies: () => loadMovies(pagination.page),
    loadSeries: () => loadSeries(pagination.page),
    handleFilterChange,
    handlePageChange,
    handleSearch,
    clearFilters
  };
};