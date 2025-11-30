import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Grid,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { seriesService } from '../../entities/series/seriesService';

const SeriesForm = ({ open, onClose, series = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    seasons: 1,
    is_ongoing: false,
    genres: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);

  useEffect(() => {
    if (open) {
      loadGenres();
      if (series) {
        setFormData({
          title: series.title || '',
          description: series.description || '',
          release_year: series.release_year || new Date().getFullYear(),
          seasons: series.seasons || 1,
          is_ongoing: series.is_ongoing || false,
          genres: series.genres?.map(g => g.id) || [],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          release_year: new Date().getFullYear(),
          seasons: 1,
          is_ongoing: false,
          genres: [],
        });
      }
      setError('');
    }
  }, [open, series]);

  const loadGenres = async () => {
    try {
      const seriesData = await seriesService.getSeries({ page_size: 100 });
      const genres = [];
      seriesData.results?.forEach(series => {
        series.genres?.forEach(genre => {
          if (!genres.find(g => g.id === genre.id)) {
            genres.push(genre);
          }
        });
      });
      setAvailableGenres(genres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (series) {
        await seriesService.updateSeries(series.id, formData);
      } else {
        await seriesService.createSeries(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving series:', error);
      setError('Ошибка сохранения сериала');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {series ? 'Редактировать сериал' : 'Добавить новый сериал'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название сериала"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Год выпуска"
                value={formData.release_year}
                onChange={(e) => handleChange('release_year', parseInt(e.target.value))}
                required
                margin="normal"
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Количество сезонов"
                value={formData.seasons}
                onChange={(e) => handleChange('seasons', parseInt(e.target.value))}
                required
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_ongoing}
                    onChange={(e) => handleChange('is_ongoing', e.target.checked)}
                  />
                }
                label="Сериал продолжается (онгоинг)"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Жанры</InputLabel>
                <Select
                  multiple
                  value={formData.genres}
                  onChange={(e) => handleChange('genres', e.target.value)}
                  label="Жанры"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((genreId) => {
                        const genre = availableGenres.find(g => g.id === genreId);
                        return genre ? (
                          <Chip key={genreId} label={genre.name} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {availableGenres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Сохранение...' : (series ? 'Обновить' : 'Создать')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SeriesForm;