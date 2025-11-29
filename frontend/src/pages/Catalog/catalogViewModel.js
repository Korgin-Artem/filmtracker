import { useState, useEffect } from 'react';
import { movieService } from '../../shared/api/movieService';

export const useCatalogViewModel = () => {
  const [movies, setMovies] = useState([]);
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

  useEffect(() => {
    loadMovies();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadMovies(1, newFilters);
  };

  const handlePageChange = (newPage) => {
    loadMovies(newPage);
  };

  const handleSearch = (searchQuery) => {
    handleFilterChange({ ...filters, search: searchQuery });
  };

  return {
    movies,
    loading,
    error,
    filters,
    pagination,
    loadMovies: () => loadMovies(pagination.page),
    handleFilterChange,
    handlePageChange,
    handleSearch
  };
};