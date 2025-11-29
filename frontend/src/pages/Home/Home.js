import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import { 
  PlayArrow, 
  Add, 
  Check, 
  Star,
  Theaters 
} from '@mui/icons-material';
import { useHomeViewModel } from './homeViewModel';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import Header from '../../shared/ui/Header';

const Home = ({ user, onLogout }) => {
  const {
    popularMovies,
    recommendations,
    userStats,
    loading,
    error,
    refreshData,
  } = useHomeViewModel();

  // Компонент карточки фильма
  const MovieCard = ({ movie }) => (
    <Card sx={{ height: '100%', position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      {movie.poster && (
        <CardMedia
          component="img"
          height="300"
          image={movie.poster}
          alt={movie.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {movie.release_year} • {movie.duration} мин
        </Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            startIcon={<PlayArrow />}
            variant="contained"
            fullWidth
          >
            Смотреть
          </Button>
          <Button 
            size="small" 
            startIcon={<Add />}
            variant="outlined"
          >
            В список
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка фильмов..." />
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Приветствие */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Добро пожаловать{user ? `, ${user.username}` : ''}!
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Ваш персональный трекер фильмов и сериалов
          </Typography>
        </Box>

        {/* Ошибки */}
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

        {/* Статистика пользователя */}
        {userStats && (
          <Box sx={{ mb: 6, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star color="primary" />
              Ваша статистика
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {userStats.total_watched}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего просмотрено
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {userStats.average_rating}/10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Средняя оценка
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {userStats.reviews_written}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Написано отзывов
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {userStats.watch_status_distribution?.planned || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  В планах
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Рекомендации */}
        {recommendations.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Theaters color="primary" />
              Рекомендуем вам
            </Typography>
            <Grid container spacing={3}>
              {recommendations.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Популярные фильмы */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Star color="primary" />
            Популярные фильмы
          </Typography>
          
          {popularMovies.length === 0 ? (
            <Alert severity="info">
              Пока нет фильмов в базе. Добавьте фильмы через админ-панель Django.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {popularMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;