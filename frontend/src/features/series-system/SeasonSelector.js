import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add,
  Remove,
  PlaylistAddCheck,
} from '@mui/icons-material';
import { reviewService } from '../../shared/api/reviewService';

const SeasonSelector = ({ seriesId, totalSeasons, currentSeason = 1, onSeasonChange }) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [watchedEpisodes, setWatchedEpisodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Предполагаем 10 серий в сезоне для демонстрации
  const episodesPerSeason = 10;

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    if (onSeasonChange) {
      onSeasonChange(season);
    }
  };

  const handleEpisodeToggle = async (season, episode) => {
    const key = `${season}-${episode}`;
    const isWatched = watchedEpisodes[key];
    
    setLoading(true);
    try {
      // Здесь можно интегрировать с API для отслеживания эпизодов
      // Пока используем локальное состояние для демонстрации
      setWatchedEpisodes(prev => ({
        ...prev,
        [key]: !isWatched
      }));

      setSnackbar({ 
        open: true, 
        message: isWatched ? 'Эпизод удален из просмотренных' : 'Эпизод отмечен как просмотренный', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error updating episode:', error);
      setSnackbar({ open: true, message: 'Ошибка обновления эпизода', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const markAllEpisodesWatched = (season) => {
    const newWatched = {};
    for (let i = 1; i <= episodesPerSeason; i++) {
      newWatched[`${season}-${i}`] = true;
    }
    setWatchedEpisodes(prev => ({ ...prev, ...newWatched }));
    setSnackbar({ open: true, message: `Все эпизоды ${season} сезона отмечены как просмотренные`, severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getWatchedCount = (season) => {
    let count = 0;
    for (let i = 1; i <= episodesPerSeason; i++) {
      if (watchedEpisodes[`${season}-${i}`]) {
        count++;
      }
    }
    return count;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Прогресс просмотра
      </Typography>

      {/* Выбор сезона */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Выберите сезон:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
            <Chip
              key={season}
              label={`Сезон ${season}`}
              onClick={() => handleSeasonSelect(season)}
              color={selectedSeason === season ? 'primary' : 'default'}
              variant={selectedSeason === season ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Эпизоды выбранного сезона */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Сезон {selectedSeason} ({getWatchedCount(selectedSeason)}/{episodesPerSeason} просмотрено)
          </Typography>
          <Button
            size="small"
            startIcon={<PlaylistAddCheck />}
            onClick={() => markAllEpisodesWatched(selectedSeason)}
            disabled={loading}
          >
            Отметить все
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 1 }}>
          {Array.from({ length: episodesPerSeason }, (_, i) => i + 1).map((episode) => {
            const isWatched = watchedEpisodes[`${selectedSeason}-${episode}`];
            return (
              <Button
                key={episode}
                variant={isWatched ? "contained" : "outlined"}
                color={isWatched ? "success" : "primary"}
                size="small"
                onClick={() => handleEpisodeToggle(selectedSeason, episode)}
                disabled={loading}
                sx={{ minWidth: 'auto', aspectRatio: '1' }}
              >
                {episode}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Прогресс-бар */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Прогресс
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round((getWatchedCount(selectedSeason) / episodesPerSeason) * 100)}%
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 8,
            backgroundColor: 'grey.800',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${(getWatchedCount(selectedSeason) / episodesPerSeason) * 100}%`,
              height: '100%',
              backgroundColor: 'success.main',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>

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
    </Paper>
  );
};

export default SeasonSelector;