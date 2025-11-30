import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Theaters,
  Search,
  MovieFilter,
  TrendingUp,
} from '@mui/icons-material';

const EmptyState = ({ 
  type = 'default',
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Theaters 
}) => {
  const getDefaultContent = () => {
    const defaults = {
      search: {
        title: 'Ничего не найдено',
        description: 'Попробуйте изменить параметры поиска или фильтры',
        icon: Search,
      },
      movies: {
        title: 'Фильмы не найдены',
        description: 'В каталоге пока нет фильмов. Попробуйте позже или измените фильтры',
        icon: Theaters,
      },
      series: {
        title: 'Сериалы не найдены',
        description: 'В каталоге пока нет сериалов. Попробуйте позже или измените фильтры',
        icon: MovieFilter,
      },
      recommendations: {
        title: 'Недостаточно данных',
        description: 'Оцените несколько фильмов, чтобы получить персональные рекомендации',
        icon: TrendingUp,
      },
      default: {
        title: 'Здесь пока пусто',
        description: 'Начните добавлять контент, чтобы что-то появилось',
        icon: Theaters,
      }
    };

    return defaults[type] || defaults.default;
  };

  const content = getDefaultContent();
  const FinalIcon = Icon === Theaters ? content.icon : Icon;

  return (
    <Paper 
      sx={{ 
        p: 6, 
        textAlign: 'center',
        backgroundColor: 'background.default',
        border: '2px dashed',
        borderColor: 'divider',
      }}
    >
      <FinalIcon 
        sx={{ 
          fontSize: 80, 
          color: 'text.secondary',
          mb: 2 
        }} 
      />
      
      <Typography variant="h5" gutterBottom>
        {title || content.title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
      >
        {description || content.description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="large"
          onClick={onAction}
          startIcon={<FinalIcon />}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;