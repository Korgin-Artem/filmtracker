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
  Tabs,
  Tab,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import {
  Theaters,
  Tv,
  Schedule,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useWatchListViewModel } from './watchListViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import WatchStatusButton from '../../features/watch-status/WatchStatusButton';

const WatchList = ({ user, onLogout }) => {
  const [activeStatus, setActiveStatus] = useState('planned');
  const [activeType, setActiveType] = useState('all');
  
  const {
    plannedMovies,
    watchingMovies,
    watchedMovies,
    plannedSeries,
    watchingSeries,
    watchedSeries,
    loading,
    error,
    refreshData,
  } = useWatchListViewModel();

  const handleStatusChange = (newStatus) => {
    // Обновляем данные после изменения статуса с небольшой задержкой
    // чтобы дать время серверу обработать изменение
    setTimeout(() => {
      refreshData();
    }, 300);
  };

  const getCurrentItems = () => {
    let items = [];
    if (activeType === 'all' || activeType === 'movies') {
      if (activeStatus === 'planned') items = [...items, ...plannedMovies.map(m => ({ ...m, type: 'movie' }))];
      if (activeStatus === 'watching') items = [...items, ...watchingMovies.map(m => ({ ...m, type: 'movie' }))];
      if (activeStatus === 'watched') items = [...items, ...watchedMovies.map(m => ({ ...m, type: 'movie' }))];
    }
    if (activeType === 'all' || activeType === 'series') {
      if (activeStatus === 'planned') items = [...items, ...plannedSeries.map(s => ({ ...s, type: 'series' }))];
      if (activeStatus === 'watching') items = [...items, ...watchingSeries.map(s => ({ ...s, type: 'series' }))];
      if (activeStatus === 'watched') items = [...items, ...watchedSeries.map(s => ({ ...s, type: 'series' }))];
    }
    return items;
  };

  const statusLabels = {
    planned: 'Запланировано',
    watching: 'Смотрю',
    watched: 'Просмотрено',
  };

  const statusIcons = {
    planned: <Schedule />,
    watching: <Visibility />,
    watched: <CheckCircle />,
  };

  const statusCounts = {
    planned: {
      movies: plannedMovies.length,
      series: plannedSeries.length,
      total: plannedMovies.length + plannedSeries.length,
    },
    watching: {
      movies: watchingMovies.length,
      series: watchingSeries.length,
      total: watchingMovies.length + watchingSeries.length,
    },
    watched: {
      movies: watchedMovies.length,
      series: watchedSeries.length,
      total: watchedMovies.length + watchedSeries.length,
    },
  };

  const ContentCard = ({ item }) => (
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
      <Link to={`/${item.type}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {item.poster ? (
          <CardMedia
            component="img"
            height="320"
            image={item.poster}
            alt={item.title}
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
            {item.type === 'movie' ? (
              <Theaters sx={{ fontSize: 80, color: 'grey.600' }} />
            ) : (
              <Tv sx={{ fontSize: 80, color: 'grey.600' }} />
            )}
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
              {item.title}
            </Typography>
          </Box>
        )}
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h2" noWrap title={item.title} sx={{ flex: 1 }}>
              {item.title}
            </Typography>
            <Chip
              label={item.type === 'movie' ? 'Фильм' : 'Сериал'}
              size="small"
              color={item.type === 'movie' ? 'primary' : 'secondary'}
              sx={{ ml: 1 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {item.release_year}
            </Typography>
            {item.type === 'movie' && (
              <Typography variant="body2" color="text.secondary">
                • {item.duration} мин
              </Typography>
            )}
            {item.type === 'series' && (
              <Typography variant="body2" color="text.secondary">
                • {item.seasons} сезонов
              </Typography>
            )}
          </Box>

          {item.description && (
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
              {item.description}
            </Typography>
          )}
          
          <Box sx={{ mt: 'auto' }}>
            {item.genres?.slice(0, 2).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="filled"
                sx={{ 
                  mr: 0.5, 
                  mb: 0.5,
                  fontSize: '0.7rem'
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Link>
      
      {/* Кнопка изменения статуса */}
      {user && (
        <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
          <WatchStatusButton
            movieId={item.type === 'movie' ? item.id : null}
            seriesId={item.type === 'series' ? item.id : null}
            initialStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />
        </Box>
      )}
    </Card>
  );

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка ваших списков..." />
      </>
    );
  }

  const currentItems = getCurrentItems();

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          📋 Мои списки
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" onClick={refreshData}>
                Повторить
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Табы статусов */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeStatus}
            onChange={(e, newValue) => setActiveStatus(newValue)}
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
              icon={<Schedule />} 
              iconPosition="start"
              label={`Запланировано (${statusCounts.planned.total})`}
              value="planned"
            />
            <Tab 
              icon={<Visibility />} 
              iconPosition="start"
              label={`Смотрю (${statusCounts.watching.total})`}
              value="watching"
            />
            <Tab 
              icon={<CheckCircle />} 
              iconPosition="start"
              label={`Просмотрено (${statusCounts.watched.total})`}
              value="watched"
            />
          </Tabs>
        </Paper>

        {/* Табы типа контента */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeType}
            onChange={(e, newValue) => setActiveType(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
            }}
          >
            <Tab 
              icon={<Theaters />} 
              label={`Все (${currentItems.length})`}
              value="all"
            />
            <Tab 
              icon={<Theaters />} 
              label={`Фильмы (${activeStatus === 'planned' ? statusCounts.planned.movies : activeStatus === 'watching' ? statusCounts.watching.movies : statusCounts.watched.movies})`}
              value="movies"
            />
            <Tab 
              icon={<Tv />} 
              label={`Сериалы (${activeStatus === 'planned' ? statusCounts.planned.series : activeStatus === 'watching' ? statusCounts.watching.series : statusCounts.watched.series})`}
              value="series"
            />
          </Tabs>
        </Paper>

        {/* Список контента */}
        {currentItems.length === 0 ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            {activeStatus === 'planned' && 'У вас нет запланированных фильмов или сериалов'}
            {activeStatus === 'watching' && 'Вы сейчас ничего не смотрите'}
            {activeStatus === 'watched' && 'Вы еще ничего не просмотрели'}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {currentItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.type}-${item.id}`}>
                <ContentCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default WatchList;

