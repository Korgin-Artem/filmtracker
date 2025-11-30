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
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  PlayArrow, 
  Add, 
  Check, 
  Star,
  Theaters,
  TrendingUp,
  NewReleases,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useHomeViewModel } from './homeViewModel';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import Header from '../../shared/ui/Header';
import StatsWidget from '../../shared/ui/components/StatsWidget';
import ReviewList from '../../shared/ui/components/ReviewList';

const Home = ({ user, onLogout }) => {
  const {
    popularMovies,
    recommendations,
    userStats,
    loading,
    error,
    refreshData,
  } = useHomeViewModel();

  const [activeTab, setActiveTab] = React.useState(0);

  // Компонент карточки фильма
  const MovieCard = ({ movie, showDescription = true }) => (
    <Card sx={{ height: '100%', position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
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
            <Theaters sx={{ fontSize: 60, color: 'grey.500' }} />
          </Box>
        )}
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {movie.release_year} • {movie.duration} мин
          </Typography>
          
          {showDescription && movie.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {movie.description}
            </Typography>
          )}
          
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
              Подробнее
            </Button>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );

  const MovieSection = ({ title, icon, movies, emptyMessage }) => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        {icon}
        {title}
      </Typography>
      
      {movies.length === 0 ? (
        <Alert severity="info">
          {emptyMessage}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка..." />
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

        {/* Табы для разных разделов */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<TrendingUp />} label="Обзор" />
            <Tab icon={<Theaters />} label="Фильмы" />
            <Tab icon={<Star />} label="Статистика" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Вкладка Обзор */}
            {activeTab === 0 && (
              <Box>
                {/* Статистика */}
                {userStats && (
                  <Box sx={{ mb: 6 }}>
                    <StatsWidget stats={userStats} />
                  </Box>
                )}

                {/* Рекомендации */}
                {recommendations.length > 0 && (
                  <MovieSection
                    title="Рекомендуем вам"
                    icon={<Theaters color="primary" />}
                    movies={recommendations}
                    emptyMessage="Пока нет рекомендаций. Оцените больше фильмов!"
                  />
                )}

                {/* Популярные фильмы */}
                <MovieSection
                  title="Популярные фильмы"
                  icon={<Star color="primary" />}
                  movies={popularMovies}
                  emptyMessage="Пока нет фильмов в базе."
                />
              </Box>
            )}

            {/* Вкладка Фильмы */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/catalog"
                    startIcon={<Theaters />}
                  >
                    Весь каталог
                  </Button>
                  <Button 
                    variant="outlined"
                    component={Link}
                    to="/recommendations"
                    startIcon={<TrendingUp />}
                  >
                    Рекомендации
                  </Button>
                </Box>

                {/* Новинки */}
                <MovieSection
                  title="Новые поступления"
                  icon={<NewReleases color="primary" />}
                  movies={popularMovies.slice(0, 8)}
                  emptyMessage="Новых фильмов пока нет"
                />

                {/* Популярные */}
                <MovieSection
                  title="Популярные сейчас"
                  icon={<TrendingUp color="primary" />}
                  movies={popularMovies.slice(0, 8)}
                  emptyMessage="Пока нет популярных фильмов"
                />
              </Box>
            )}

            {/* Вкладка Статистика */}
            {activeTab === 2 && (
              <Box>
                {userStats ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StatsWidget stats={userStats} />
                    </Grid>
                    
                    {/* Дополнительная статистика */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Активность по месяцам
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Графики активности будут здесь
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Любимые жанры
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Статистика по жанрам будет здесь
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Alert severity="info">
                    Статистика недоступна. Начните добавлять фильмы!
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Home;