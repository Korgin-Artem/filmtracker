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
  Alert,
  Button,
  Paper,
  Tabs,
  Tab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import { 
  FilterList, 
  Clear, 
  Theaters, 
  Tv,
  Add,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCatalogViewModel } from './catalogViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import SearchBar from '../../features/search/SearchBar';
import AdvancedFilters from '../../shared/ui/forms/AdvancedFilters';
import EmptyState from '../../shared/ui/feedback/EmptyState';

const Catalog = ({ user, onLogout }) => {
  const {
    movies,
    series,
    genres,
    loading,
    error,
    filters,
    pagination,
    loadMovies,
    loadSeries,
    handleFilterChange,
    handlePageChange,
    handleSearch,
    clearFilters,
  } = useCatalogViewModel();

  const [activeContentType, setActiveContentType] = useState('movies');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleContentTypeChange = (event, newValue) => {
    setActiveContentType(newValue);
    const defaultFilters = {
      search: '',
      genres: '',
      release_year_min: '',
      release_year_max: '',
      ordering: '-created_at'
    };
    
    if (newValue === 'movies') {
      loadMovies(1, defaultFilters);
    } else {
      loadSeries(1, defaultFilters);
    }
  };

  const handleLocalFilterChange = (newFilters) => {
    handleFilterChange(newFilters, activeContentType);
  };

  const handleLocalPageChange = (newPage) => {
    handlePageChange(newPage, activeContentType);
  };

  const handleLocalSearch = (searchQuery) => {
    handleSearch(searchQuery, activeContentType);
  };

  const handleLocalClearFilters = () => {
    clearFilters(activeContentType);
  };

  // Компонент карточки фильма
  const MovieCard = ({ movie }) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': { 
        transform: 'translateY(-8px)',
        boxShadow: 6
      }
    }}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {movie.poster ? (
          <CardMedia
            component="img"
            height="320"
            image={movie.poster}
            alt={movie.title}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        ) : (
          <Box
            sx={{
              height: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.900',
              position: 'relative',
            }}
          >
            <Theaters sx={{ fontSize: 80, color: 'grey.600' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                position: 'absolute',
                bottom: 16,
                left: 16,
                color: 'grey.400',
                fontWeight: 'bold'
              }}
            >
              {movie.title}
            </Typography>
          </Box>
        )}
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" noWrap title={movie.title}>
            {movie.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {movie.release_year}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {movie.duration} мин
            </Typography>
          </Box>

          {movie.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {movie.description}
            </Typography>
          )}
          
          <Box sx={{ mt: 'auto' }}>
            {movie.genres?.slice(0, 2).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="filled"
                sx={{ 
                  mr: 0.5, 
                  mb: 0.5,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            ))}
            {movie.genres && movie.genres.length > 2 && (
              <Chip
                label={`+${movie.genres.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </CardContent>
      </Link>
    </Card>
  );

  // Компонент карточки сериала
  const SeriesCard = ({ series }) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': { 
        transform: 'translateY(-8px)',
        boxShadow: 6
      }
    }}>
      <Link to={`/series/${series.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {series.poster ? (
          <CardMedia
            component="img"
            height="320"
            image={series.poster}
            alt={series.title}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        ) : (
          <Box
            sx={{
              height: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.900',
              position: 'relative',
            }}
          >
            <Tv sx={{ fontSize: 80, color: 'grey.600' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                position: 'absolute',
                bottom: 16,
                left: 16,
                color: 'grey.400',
                fontWeight: 'bold'
              }}
            >
              {series.title}
            </Typography>
          </Box>
        )}
        
        {/* Бейдж статуса */}
        <Chip
          label={series.is_ongoing ? "ОНГОИНГ" : "ЗАВЕРШЕН"}
          color={series.is_ongoing ? "warning" : "success"}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 'bold',
            fontSize: '0.7rem'
          }}
        />
        
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" noWrap title={series.title}>
            {series.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {series.release_year}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {series.seasons} сезонов
            </Typography>
          </Box>

          {series.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {series.description}
            </Typography>
          )}
          
          <Box sx={{ mt: 'auto' }}>
            {series.genres?.slice(0, 2).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="filled"
                sx={{ 
                  mr: 0.5, 
                  mb: 0.5,
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            ))}
            {series.genres && series.genres.length > 2 && (
              <Chip
                label={`+${series.genres.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </CardContent>
      </Link>
    </Card>
  );

  const currentItems = activeContentType === 'movies' ? movies : series;
  const itemType = activeContentType === 'movies' ? 'фильмов' : 'сериалов';
  const isAdmin = user?.is_staff;

  const speedDialActions = [
    ...(isAdmin ? [{
      icon: <Add />, 
      name: 'Добавить', 
      action: () => window.location.href = '/admin'
    }] : []),
    {
      icon: <FilterList />, 
      name: 'Фильтры', 
      action: () => setShowAdvancedFilters(!showAdvancedFilters)
    },
  ];

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
        {/* Заголовок и табы */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            🎬 Каталог
          </Typography>
          
          {/* Табы для выбора типа контента */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeContentType}
              onChange={handleContentTypeChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { 
                  fontWeight: 600,
                  fontSize: '1rem'
                }
              }}
            >
              <Tab 
                icon={<Theaters />} 
                label={`Фильмы (${activeContentType === 'movies' ? pagination.count : '...'})`}
                value="movies"
              />
              <Tab 
                icon={<Tv />} 
                label={`Сериалы (${activeContentType === 'series' ? pagination.count : '...'})`}
                value="series"
              />
            </Tabs>
          </Paper>

          {/* Статистика и поиск */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" color="text.secondary">
              📊 Найдено {itemType}: <strong>{pagination.count || 0}</strong>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant={showAdvancedFilters ? "contained" : "outlined"}
                color={showAdvancedFilters ? "primary" : "inherit"}
              >
                {showAdvancedFilters ? 'Скрыть фильтры' : 'Фильтры'}
              </Button>
              
              {(filters.genres || filters.release_year_min || filters.release_year_max || filters.ordering !== '-created_at') && (
                <Button
                  startIcon={<Clear />}
                  onClick={handleLocalClearFilters}
                  variant="outlined"
                  color="secondary"
                >
                  Сбросить
                </Button>
              )}
            </Box>
          </Box>

          {/* Поиск */}
          <Box sx={{ mb: 3 }}>
            <SearchBar 
              onMovieSelect={() => {}}
              placeholder={`🔍 Поиск ${activeContentType === 'movies' ? 'фильмов' : 'сериалов'}...`}
            />
          </Box>

          {/* Расширенные фильтры */}
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleLocalFilterChange}
            availableGenres={genres}
            open={showAdvancedFilters}
            onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          />
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

        {/* Сетка элементов */}
        {loading ? (
          <LoadingSpinner message={`🎬 Загрузка ${itemType}...`} />
        ) : !currentItems || currentItems.length === 0 ? (
          <EmptyState
            type={activeContentType}
            actionLabel={isAdmin ? "Добавить контент" : null}
            onAction={isAdmin ? () => window.location.href = '/admin' : null}
          />
        ) : (
          <>
            <Grid container spacing={3}>
              {currentItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  {activeContentType === 'movies' ? (
                    <MovieCard movie={item} />
                  ) : (
                    <SeriesCard series={item} />
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {pagination.count > 20 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={Math.ceil(pagination.count / 20)}
                  page={pagination.page}
                  onChange={(e, page) => handleLocalPageChange(page)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Speed Dial для быстрых действий */}
        {speedDialActions.length > 0 && (
          <SpeedDial
            ariaLabel="Быстрые действия"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        )}
      </Container>
    </>
  );
};

export default Catalog;