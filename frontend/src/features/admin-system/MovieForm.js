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
} from '@mui/material';
import { movieService } from '../../shared/api/movieService';

const MovieForm = ({ open, onClose, movie = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    duration: 120,
    genres: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);

  useEffect(() => {
    if (open) {
      loadGenres();
      if (movie) {
        setFormData({
          title: movie.title || '',
          description: movie.description || '',
          release_year: movie.release_year || new Date().getFullYear(),
          duration: movie.duration || 120,
          genres: movie.genres?.map(g => g.id) || [],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          release_year: new Date().getFullYear(),
          duration: 120,
          genres: [],
        });
      }
      setError('');
    }
  }, [open, movie]);

  const loadGenres = async () => {
    try {
      const moviesData = await movieService.getMovies({ page_size: 100 });
      const genres = [];
      moviesData.results?.forEach(movie => {
        movie.genres?.forEach(genre => {
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
      if (movie) {
        await movieService.updateMovie(movie.id, formData);
      } else {
        await movieService.createMovie(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving movie:', error);
      setError('Ошибка сохранения фильма');
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
        {movie ? 'Редактировать фильм' : 'Добавить новый фильм'}
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
                label="Название фильма"
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
                label="Продолжительность (мин)"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                required
                margin="normal"
                inputProps={{ min: 1 }}
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
            {loading ? 'Сохранение...' : (movie ? 'Обновить' : 'Создать')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MovieForm;