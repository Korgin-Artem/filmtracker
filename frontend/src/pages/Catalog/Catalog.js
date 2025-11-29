import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCatalogViewModel } from './catalogViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import SearchBar from '../../features/search/SearchBar';

const Catalog = ({ user, onLogout }) => {
  const {
    movies,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleSearch,
  } = useCatalogViewModel();

  const [showFilters, setShowFilters] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  const handleMovieSelect = (movie) => {
    // Можно добавить быстрый просмотр или сразу переходить к фильму
    console.log('Selected movie:', movie);
  };

  const clearFilters = () => {
    handleFilterChange({
      search: '',
      genres: '',
      release_year_min: '',
      release_year_max: '',
      ordering: '-created_at'
    });
  };

  const MovieCard = ({ movie }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {movie.poster ? (
          <CardMedia
            component="img"
            height="300"
            image={movie.poster}
            alt={movie.title}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.800',
            }}
          >
            <Typography color="text.secondary">Нет постера</Typography>
          </Box>
        )}
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {movie.release_year} • {movie.duration} мин
          </Typography>
          {movie.description && (
            <Typography variant="body2" sx={{ mb: 2 }} noWrap>
              {movie.description}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            {movie.genres?.slice(0, 3).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Заголовок и поиск */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Каталог фильмов
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Найдено фильмов: {pagination.count}
          </Typography>

          {/* Поиск */}
          <Box sx={{ mb: 3 }}>
            <SearchBar 
              onMovieSelect={handleMovieSelect}
              placeholder="Поиск по названию или описанию..."
            />
          </Box>

          {/* Фильтры */}
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Фильтры
            </Button>
            
            {(filters.genres || filters.release_year_min || filters.release_year_max || filters.ordering !== '-created_at') && (
              <Button
                startIcon={<Clear />}
                onClick={clearFilters}
                variant="outlined"
                color="secondary"
              >
                Сбросить фильтры
              </Button>
            )}
          </Box>

          {showFilters && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Сортировка</InputLabel>
                    <Select
                      value={filters.ordering}
                      label="Сортировка"
                      onChange={(e) => handleFilterChange({ ...filters, ordering: e.target.value })}
                    >
                      <MenuItem value="-created_at">Сначала новые</MenuItem>
                      <MenuItem value="created_at">Сначала старые</MenuItem>
                      <MenuItem value="-release_year">Сначала новые по году</MenuItem>
                      <MenuItem value="release_year">Сначала старые по году</MenuItem>
                      <MenuItem value="title">По названию (А-Я)</MenuItem>
                      <MenuItem value="-title">По названию (Я-А)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Год от"
                    value={filters.release_year_min}
                    onChange={(e) => handleFilterChange({ ...filters, release_year_min: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Год до"
                    value={filters.release_year_max}
                    onChange={(e) => handleFilterChange({ ...filters, release_year_max: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>

        {/* Ошибки */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                Обновить
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Сетка фильмов */}
        {loading ? (
          <LoadingSpinner message="Загрузка фильмов..." />
        ) : movies.length === 0 ? (
          <Alert severity="info">
            Фильмы не найдены. Попробуйте изменить параметры поиска.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {pagination.count > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(pagination.count / 20)}
                  page={pagination.page}
                  onChange={(e, page) => handlePageChange(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Catalog;