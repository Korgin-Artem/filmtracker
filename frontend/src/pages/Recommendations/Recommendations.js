import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Alert,
  Button,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  NewReleases,
  Refresh,
  Theaters,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useRecommendationsViewModel } from './recommendationsViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

// Импортируем компонент карточки фильма из Home
const MovieCard = ({ movie }) => (
  <Paper 
    sx={{ 
      height: '100%', 
      transition: 'transform 0.2s', 
      '&:hover': { transform: 'translateY(-4px)' },
      overflow: 'hidden'
    }}
    elevation={3}
  >
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ position: 'relative' }}>
        {movie.poster ? (
          <Box
            component="img"
            src={movie.poster}
            alt={movie.title}
            sx={{
              width: '100%',
              height: 250,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.800',
            }}
          >
            <Theaters sx={{ fontSize: 60, color: 'grey.500' }} />
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {movie.release_year} • {movie.duration} мин
        </Typography>
        
        {movie.genres && movie.genres.length > 0 && (
          <Box sx={{ mt: 1, mb: 2 }}>
            {movie.genres.slice(0, 2).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}
        
        {movie.description && (
          <Typography 
            variant="body2" 
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {movie.description}
          </Typography>
        )}
      </Box>
    </Link>
  </Paper>
);

const Recommendations = ({ user, onLogout }) => {
  const {
    recommendations,
    popularMovies,
    newReleases,
    loading,
    error,
    refreshRecommendations,
  } = useRecommendationsViewModel();

  const [activeTab, setActiveTab] = React.useState(0);

  const MovieSection = ({ title, description, movies, emptyMessage, icon }) => (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {icon}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      
      {movies.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
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
        <LoadingSpinner message="Анализируем ваши предпочтения..." />
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Заголовок и действия */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Рекомендации
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Персональные подборки на основе ваших оценок
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refreshRecommendations}
            disabled={loading}
          >
            Обновить
          </Button>
        </Box>

        {/* Ошибки */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              <Button color="inherit" size="small" onClick={refreshRecommendations}>
                Повторить
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Табы */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<Psychology />} 
              label={`Персональные (${recommendations.length})`} 
            />
            <Tab 
              icon={<TrendingUp />} 
              label={`Популярные (${popularMovies.length})`} 
            />
            <Tab 
              icon={<NewReleases />} 
              label={`Новинки (${newReleases.length})`} 
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Персональные рекомендации */}
            {activeTab === 0 && (
              <Box>
                <MovieSection
                  title="Рекомендуем именно вам"
                  description="Подобрано на основе ваших оценок и предпочтений"
                  movies={recommendations}
                  emptyMessage="Пока недостаточно данных для рекомендаций. Оцените несколько фильмов!"
                  icon={<Psychology sx={{ fontSize: 40, color: 'primary.main' }} />}
                />
                
                {recommendations.length === 0 && popularMovies.length > 0 && (
                  <MovieSection
                    title="Популярные фильмы"
                    description="Пока мы изучаем ваши предпочтения, вот что нравится другим"
                    movies={popularMovies.slice(0, 8)}
                    emptyMessage=""
                    icon={<TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />}
                  />
                )}
              </Box>
            )}

            {/* Популярные фильмы */}
            {activeTab === 1 && (
              <MovieSection
                title="Популярные у всех пользователей"
                description="Фильмы с самыми высокими оценками сообщества"
                movies={popularMovies}
                emptyMessage="Пока нет популярных фильмов"
                icon={<TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />}
              />
            )}

            {/* Новинки */}
            {activeTab === 2 && (
              <MovieSection
                title="Новые поступления"
                description="Самые свежие добавления в нашу коллекцию"
                movies={newReleases}
                emptyMessage="Новых фильмов пока нет"
                icon={<NewReleases sx={{ fontSize: 40, color: 'primary.main' }} />}
              />
            )}
          </Box>
        </Paper>

        {/* Призыв к действию */}
        {recommendations.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Psychology sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Помогите нам узнать вас лучше!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Оценивайте фильмы и добавляйте их в свой список, чтобы получать более точные рекомендации
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/catalog"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Перейти в каталог
            </Button>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default Recommendations;