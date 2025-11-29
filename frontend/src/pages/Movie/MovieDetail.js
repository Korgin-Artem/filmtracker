import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Paper,
  Alert,
  Divider,
  Avatar,
  Rating,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Theaters,
  Person,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useMovieDetailViewModel } from './movieDetailViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import RatingWidget from '../../features/movie-rating/RatingWidget';
import WatchStatusButton from '../../features/watch-status/WatchStatusButton';
import ReviewForm from '../../features/review-system/ReviewForm';

const MovieDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const {
    movie,
    reviews,
    loading,
    error,
    handleRatingChange,
    handleStatusChange,
    handleReviewSubmitted
  } = useMovieDetailViewModel(id);

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка информации о фильме..." />
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <Container sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Фильм не найден'}
          </Alert>
          <Link to="/catalog" style={{ textDecoration: 'none' }}>
            <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              ← Вернуться в каталог
            </Typography>
          </Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Кнопка назад */}
        <Box sx={{ mb: 3 }}>
          <Link to="/catalog" style={{ textDecoration: 'none' }}>
            <Typography 
              color="primary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              ← Назад к каталогу
            </Typography>
          </Link>
        </Box>

        <Grid container spacing={4}>
          {/* Левая колонка - постер и информация */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              {movie.poster ? (
                <Box
                  component="img"
                  src={movie.poster}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    borderRadius: 2,
                    mb: 2
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.800',
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  <Theaters sx={{ fontSize: 60, color: 'grey.500' }} />
                </Box>
              )}

              {/* Интерактивные элементы */}
              {user && (
                <Box sx={{ mt: 3 }}>
                  <RatingWidget 
                    movieId={movie.id} 
                    onRatingChange={handleRatingChange}
                  />
                  
                  <Box sx={{ mt: 4 }}>
                    <WatchStatusButton 
                      movieId={movie.id}
                      onStatusChange={handleStatusChange}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Правая колонка - детальная информация */}
          <Grid item xs={12} md={8}>
            {/* Заголовок и основная информация */}
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {movie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {movie.release_year}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {movie.duration} мин
                  </Typography>
                </Box>
              </Box>

              {/* Жанры */}
              <Box sx={{ mb: 3 }}>
                {movie.genres?.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              {/* Описание */}
              {movie.description && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Описание
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {movie.description}
                  </Typography>
                </>
              )}

              {/* Режиссеры */}
              {movie.directors && movie.directors.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Режиссеры
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.directors.map((director) => (
                      <Chip
                        key={director.id}
                        icon={<Person />}
                        label={`${director.first_name} ${director.last_name}`}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Актеры */}
              {movie.actors && movie.actors.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    В ролях
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.actors.slice(0, 10).map((actor) => (
                      <Chip
                        key={actor.id}
                        label={`${actor.first_name} ${actor.last_name}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {movie.actors.length > 10 && (
                      <Chip
                        label={`+${movie.actors.length - 10} еще`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Форма отзыва */}
            {user && (
              <ReviewForm 
                movieId={movie.id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}

            {/* Список отзывов */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Отзывы ({reviews.length})
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              {reviews.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  Пока нет отзывов. Будьте первым!
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {reviews.map((review) => (
                    <Box key={review.id} sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {review.user_username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.user_username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.created_at).toLocaleDateString('ru-RU')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                        {review.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MovieDetail;