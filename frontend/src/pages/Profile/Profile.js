import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person,
  Movie,
  Star,
  Reviews,
  Visibility,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useProfileViewModel } from './profileViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

const Profile = ({ user, onLogout }) => {
  const { userStats, userReviews, loading, error, refreshData } = useProfileViewModel();
  const [activeTab, setActiveTab] = useState(0);

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка профиля..." />
      </>
    );
  }

  const StatCard = ({ icon, title, value, color = 'primary' }) => (
    <Card>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ color: `${color}.main`, mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const ReviewCard = ({ review }) => {
    const contentLink = review.movie 
      ? `/movie/${review.movie}` 
      : review.series 
        ? `/series/${review.series}` 
        : null;
    const contentTitle = review.movie_title || review.series_title || (review.movie ? `Фильм #${review.movie}` : review.series ? `Сериал #${review.series}` : 'Контент');

    return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            {contentLink ? (
              <Typography 
                variant="h6" 
                component={Link} 
                to={contentLink} 
                sx={{ textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
              >
                {contentTitle}
              </Typography>
            ) : (
              <Typography variant="h6">
                {contentTitle}
          </Typography>
            )}
          <Typography variant="body2" color="text.secondary">
            {new Date(review.created_at).toLocaleDateString('ru-RU')}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {review.text}
        </Typography>
      </CardContent>
    </Card>
  );
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
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

        {/* Заголовок профиля */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {user?.username}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Статистика */}
          {userStats && (
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<Movie sx={{ fontSize: 40 }} />}
                  title="Всего просмотрено"
                  value={userStats.total_watched}
                  color="primary"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<Star sx={{ fontSize: 40 }} />}
                  title="Средняя оценка"
                  value={`${userStats.average_rating}/10`}
                  color="warning"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<Reviews sx={{ fontSize: 40 }} />}
                  title="Написано отзывов"
                  value={userStats.reviews_written}
                  color="info"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<Schedule sx={{ fontSize: 40 }} />}
                  title="В планах"
                  value={userStats.watch_status_distribution?.planned || 0}
                  color="secondary"
                />
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* Табы с контентом */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Reviews />} label="Мои отзывы" />
            <Tab icon={<Visibility />} label="Статистика" />
          </Tabs>

          {/* Содержимое табов */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Мои отзывы ({userReviews.length})
                </Typography>
                
                {userReviews.length === 0 ? (
                  <Alert severity="info">
                    Вы еще не написали ни одного отзыва.
                  </Alert>
                ) : (
                  <Box>
                    {userReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && userStats && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Детальная статистика
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle color="success" />
                        Статусы просмотра
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography>Просмотрено</Typography>
                          <Typography fontWeight="bold">
                            {userStats.watch_status_distribution?.watched || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography>Смотрю</Typography>
                          <Typography fontWeight="bold">
                            {userStats.watch_status_distribution?.watching || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Запланировано</Typography>
                          <Typography fontWeight="bold">
                            {userStats.watch_status_distribution?.planned || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Movie color="primary" />
                        По типам контента
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography>Фильмы</Typography>
                          <Typography fontWeight="bold">
                            {userStats.movies_watched}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Сериалы</Typography>
                          <Typography fontWeight="bold">
                            {userStats.series_watched}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;