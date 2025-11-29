import React, { useState } from 'react';
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

const RatingWidget = ({ movieId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [tempRating, setTempRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleRatingChange = async (event, newValue) => {
    if (!newValue) return;

    setLoading(true);
    try {
      await reviewService.createRating({
        movie: movieId,
        rating: newValue
      });
      
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