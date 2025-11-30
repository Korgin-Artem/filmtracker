import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Star,
  Visibility,
  Schedule,
} from '@mui/icons-material';

const StatsWidget = ({ stats }) => {
  if (!stats) return null;

  const StatItem = ({ icon, label, value, maxValue = 100, color = 'primary' }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ color: `${color}.main`, mr: 1 }}>
          {icon}
        </Box>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        {maxValue && (
          <Typography variant="body2" color="text.secondary">
            / {maxValue}
          </Typography>
        )}
      </Box>
      {maxValue && (
        <LinearProgress 
          variant="determinate" 
          value={(value / maxValue) * 100} 
          sx={{ mt: 1, height: 6, borderRadius: 3 }}
          color={color}
        />
      )}
    </Box>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp />
        Ваша активность
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatItem
            icon={<Visibility />}
            label="Всего просмотрено"
            value={stats.total_watched || 0}
            color="primary"
          />
          <StatItem
            icon={<Star />}
            label="Средняя оценка"
            value={stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}
            maxValue={10}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatItem
            icon={<Schedule />}
            label="Отзывов написано"
            value={stats.reviews_written || 0}
            color="info"
          />
          <StatItem
            icon={<TrendingUp />}
            label="В планах"
            value={stats.watch_status_distribution?.planned || 0}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Детальная статистика по статусам */}
      {stats.watch_status_distribution && (
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Распределение по статусам:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              👁️ Просмотрено: <strong>{stats.watch_status_distribution.watched || 0}</strong>
            </Typography>
            <Typography variant="body2">
              🎬 Смотрю: <strong>{stats.watch_status_distribution.watching || 0}</strong>
            </Typography>
            <Typography variant="body2">
              📝 Запланировано: <strong>{stats.watch_status_distribution.planned || 0}</strong>
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default StatsWidget;