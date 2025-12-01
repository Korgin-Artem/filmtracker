import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PlaylistAdd,
  Visibility,
  Schedule,
  CheckCircle,
  Delete,
  Check,
} from '@mui/icons-material';
import { reviewService } from '../../shared/api/reviewService';
import { APP_CONFIG } from '../../shared/utils/constants/appConfig';

const WatchStatusButton = ({ movieId, seriesId, initialStatus = null, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (initialStatus !== undefined) {
      setStatus(initialStatus);
    } else {
      loadUserWatchStatus();
    }
  }, [movieId, seriesId, initialStatus]);

  const loadUserWatchStatus = async () => {
    try {
      const userStatus = await reviewService.getUserWatchStatus(movieId, seriesId);
      if (userStatus) {
        setStatus(userStatus.status);
      } else {
        setStatus(null);
      }
    } catch (error) {
      console.error('Error loading user watch status:', error);
      setStatus(null);
    }
  };

  const statusIcons = {
    planned: <Schedule />,
    watching: <Visibility />,
    watched: <CheckCircle />,
  };

  const statusColors = {
    planned: 'primary',
    watching: 'warning',
    watched: 'success',
  };

  const handleStatusClick = async (newStatus) => {
    // Если выбираем тот же статус, что уже установлен, ничего не делаем
    if (status === newStatus) {
      setAnchorEl(null);
      return;
    }

    setLoading(true);
    setAnchorEl(null); // Закрываем меню сразу
    
    try {
      const statusData = { status: newStatus };
      if (movieId) statusData.movie = movieId;
      if (seriesId) statusData.series = seriesId;
      
      // Устанавливаем новый статус
      await reviewService.setWatchStatus(statusData);
      
      // Обновляем локальное состояние
      setStatus(newStatus);
      setSnackbar({ open: true, message: 'Статус обновлен!', severity: 'success' });
      
      // Перезагружаем статус для подтверждения (с небольшой задержкой для обновления на сервере)
      setTimeout(async () => {
        await loadUserWatchStatus();
      }, 500);
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Status update error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.message ||
                          'Ошибка обновления статуса';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      // В случае ошибки перезагружаем статус
      await loadUserWatchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStatus = async () => {
    setLoading(true);
    try {
      // Удаляем статус, отправляя запрос на удаление
      const currentStatus = await reviewService.getUserWatchStatus(movieId, seriesId);
      if (currentStatus) {
        await reviewService.deleteWatchStatus(currentStatus.id);
        setStatus(null);
        setAnchorEl(null);
        setSnackbar({ open: true, message: 'Статус удален!', severity: 'success' });
        
        if (onStatusChange) {
          onStatusChange(null);
        }
      }
    } catch (error) {
      console.error('Status delete error:', error);
      setSnackbar({ open: true, message: 'Ошибка удаления статуса', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" gutterBottom>
          Статус просмотра
        </Typography>

        {status ? (
          <Button
            variant="contained"
            color={statusColors[status]}
            startIcon={statusIcons[status]}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {APP_CONFIG.WATCH_STATUS_LABELS[status]}
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<PlaylistAdd />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            Добавить в список
          </Button>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem 
            onClick={() => handleStatusClick('planned')}
            selected={status === 'planned'}
          >
            <Schedule sx={{ mr: 1 }} />
            Запланировано
            {status === 'planned' && <Check sx={{ ml: 'auto' }} />}
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusClick('watching')}
            selected={status === 'watching'}
          >
            <Visibility sx={{ mr: 1 }} />
            Смотрю
            {status === 'watching' && <Check sx={{ ml: 'auto' }} />}
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusClick('watched')}
            selected={status === 'watched'}
          >
            <CheckCircle sx={{ mr: 1 }} />
            Просмотрено
            {status === 'watched' && <Check sx={{ ml: 'auto' }} />}
          </MenuItem>
          {status && (
            <>
              <MenuItem divider />
              <MenuItem 
                onClick={handleRemoveStatus}
                sx={{ color: 'error.main' }}
              >
                <Delete sx={{ mr: 1 }} />
                Удалить статус
              </MenuItem>
            </>
          )}
        </Menu>
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
    </>
  );
};

export default WatchStatusButton;