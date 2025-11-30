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
} from '@mui/material';
import {
  CalendarToday,
  Theaters,
  Tv,
  Schedule,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useSeriesDetailViewModel } from './seriesDetailViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import RatingWidget from '../../features/movie-rating/RatingWidget';
import WatchStatusButton from '../../features/watch-status/WatchStatusButton';
import ReviewForm from '../../features/review-system/ReviewForm';
import SeasonSelector from '../../features/series-system/SeasonSelector';
import ReviewList from '../../shared/ui/components/ReviewList';

const SeriesDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const {
    series,
    reviews,
    loading,
    error,
    handleRatingChange,
    handleStatusChange,
    handleReviewSubmitted
  } = useSeriesDetailViewModel(id);

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка информации о сериале..." />
      </>
    );
  }

  if (error || !series) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <Container sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Сериал не найден'}
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
              {series.poster ? (
                <Box
                  component="img"
                  src={series.poster}
                  alt={series.title}
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
                  <Tv sx={{ fontSize: 60, color: 'grey.500' }} />
                </Box>
              )}

              {/* Статус сериала */}
              <Chip
                label={series.is_ongoing ? "Онгоинг" : "Завершен"}
                color={series.is_ongoing ? "warning" : "success"}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Интерактивные элементы */}
              {user && (
                <Box sx={{ mt: 3 }}>
                  <RatingWidget 
                    movieId={series.id} 
                    onRatingChange={handleRatingChange}
                  />
                  
                  <Box sx={{ mt: 4 }}>
                    <WatchStatusButton 
                      movieId={series.id}
                      onStatusChange={handleStatusChange}
                    />
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Селектор сезонов */}
            {user && (
              <Box sx={{ mt: 3 }}>
                <SeasonSelector 
                  seriesId={series.id}
                  totalSeasons={series.seasons}
                />
              </Box>
            )}
          </Grid>

          {/* Правая колонка - детальная информация */}
          <Grid item xs={12} md={8}>
            {/* Заголовок и основная информация */}
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {series.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {series.release_year}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tv fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {series.seasons} сезонов
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {series.is_ongoing ? 'Выходят новые серии' : 'Завершен'}
                  </Typography>
                </Box>
              </Box>

              {/* Жанры */}
              <Box sx={{ mb: 3 }}>
                {series.genres?.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              {/* Описание */}
              {series.description && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Описание
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    {series.description}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Форма отзыва */}
            {user && (
              <ReviewForm 
                movieId={series.id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}

            {/* Список отзывов */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Отзывы ({reviews.length})
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              <ReviewList 
                reviews={reviews}
                currentUserId={user?.id}
                showMovieTitles={false}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SeriesDetail;