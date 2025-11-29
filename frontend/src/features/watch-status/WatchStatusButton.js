import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { reviewService } from '../../shared/api/reviewService';
import { APP_CONFIG } from '../../shared/utils/constants/appConfig';

const WatchStatusButton = ({ movieId, initialStatus = null, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    setLoading(true);
    try {
      await reviewService.setWatchStatus({
        movie: movieId,
        status: newStatus
      });
      
      setStatus(newStatus);
      setAnchorEl(null);
      setSnackbar({ open: true, message: 'Статус обновлен!', severity: 'success' });
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Status update error:', error);
      setSnackbar({ open: true, message: 'Ошибка обновления статуса', severity: 'error' });
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
          <MenuItem onClick={() => handleStatusClick('planned')}>
            <Schedule sx={{ mr: 1 }} />
            Запланировано
          </MenuItem>
          <MenuItem onClick={() => handleStatusClick('watching')}>
            <Visibility sx={{ mr: 1 }} />
            Смотрю
          </MenuItem>
          <MenuItem onClick={() => handleStatusClick('watched')}>
            <CheckCircle sx={{ mr: 1 }} />
            Просмотрено
          </MenuItem>
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