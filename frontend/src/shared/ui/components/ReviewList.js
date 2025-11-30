import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Divider,
  IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ReviewList = ({ 
  reviews, 
  currentUserId, 
  onEdit, 
  onDelete,
  showMovieTitles = false 
}) => {
  const canEditReview = (review) => {
    return currentUserId && review.user === currentUserId;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {reviews.map((review, index) => (
        <Box key={review.id}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Аватар пользователя */}
            <Avatar sx={{ width: 50, height: 50 }}>
              {review.user_username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>

            {/* Содержимое отзыва */}
            <Box sx={{ flex: 1 }}>
              {/* Заголовок */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.user_username}
                  </Typography>
                  {showMovieTitles && review.movie_title && (
                    <Typography variant="body2" color="primary">
                      к фильму "{review.movie_title}"
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>

                {/* Кнопки действий */}
                {canEditReview(review) && (
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit && onEdit(review)}
                      title="Редактировать"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => onDelete && onDelete(review.id)}
                      title="Удалить"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/* Текст отзыва */}
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6 
                }}
              >
                {review.text}
              </Typography>

              {/* Если отзыв был обновлен */}
              {review.updated_at !== review.created_at && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  (изменен {new Date(review.updated_at).toLocaleDateString('ru-RU')})
                </Typography>
              )}
            </Box>
          </Box>

          {/* Разделитель (кроме последнего элемента) */}
          {index < reviews.length - 1 && (
            <Divider sx={{ mt: 2 }} />
          )}
        </Box>
      ))}

      {reviews.length === 0 && (
        <Typography 
          textAlign="center" 
          color="text.secondary" 
          sx={{ py: 4 }}
        >
          Пока нет отзывов
        </Typography>
      )}
    </Box>
  );
};

export default ReviewList;