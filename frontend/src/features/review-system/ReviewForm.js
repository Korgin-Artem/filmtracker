import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Send, Clear } from '@mui/icons-material';
import { reviewService } from '../../shared/api/reviewService';

const ReviewForm = ({ movieId, onReviewSubmitted }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setSnackbar({ open: true, message: 'Введите текст отзыва', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const newReview = await reviewService.createReview({
        movie: movieId,
        text: text.trim()
      });
      
      setText('');
      setSnackbar({ open: true, message: 'Отзыв опубликован!', severity: 'success' });
      
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      setSnackbar({ open: true, message: 'Ошибка публикации отзыва', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Написать отзыв
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Поделитесь своими впечатлениями о фильме..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              startIcon={<Clear />}
              onClick={handleClear}
              disabled={!text || loading}
            >
              Очистить
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={!text.trim() || loading}
            >
              {loading ? 'Публикация...' : 'Опубликовать'}
            </Button>
          </Box>
        </Box>
      </Paper>

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
    </>
  );
};

export default ReviewForm;