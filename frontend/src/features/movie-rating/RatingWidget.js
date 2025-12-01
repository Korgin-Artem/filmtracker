import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { reviewService } from '../../shared/api/reviewService';

const RatingWidget = ({ movieId, seriesId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [tempRating, setTempRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadUserRating();
  }, [movieId, seriesId]);

  const loadUserRating = async () => {
    try {
      const userRating = await reviewService.getUserRating(movieId, seriesId);
      if (userRating) {
        setRating(userRating.rating);
      }
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!newValue) return;

    setLoading(true);
    try {
      const ratingData = { rating: newValue };
      if (movieId) ratingData.movie = movieId;
      if (seriesId) ratingData.series = seriesId;
      
      await reviewService.createRating(ratingData);
      
      setRating(newValue);
      setSnackbar({ open: true, message: 'Оценка сохранена!', severity: 'success' });
      
      if (onRatingChange) {
        onRatingChange(newValue);
      }
    } catch (error) {
      console.error('Rating error:', error);
      setSnackbar({ open: true, message: 'Ошибка сохранения оценки', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Typography variant="h6" gutterBottom>
        Ваша оценка
      </Typography>
      
      <Rating
        value={rating}
        onChange={handleRatingChange}
        onChangeActive={(event, newHover) => setTempRating(newHover)}
        precision={1}
        max={10}
        size="large"
        icon={<Star sx={{ fontSize: 40 }} />}
        emptyIcon={<StarBorder sx={{ fontSize: 40 }} />}
        disabled={loading}
      />
      
      <Typography variant="body1" color="text.secondary">
        {tempRating || rating || 0}/10
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RatingWidget;