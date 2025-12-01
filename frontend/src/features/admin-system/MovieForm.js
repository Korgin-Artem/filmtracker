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
import { Add as AddIcon } from '@mui/icons-material';

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

  const [newGenreName, setNewGenreName] = useState('');
  const [showNewGenreInput, setShowNewGenreInput] = useState(false);
  const [creatingGenre, setCreatingGenre] = useState(false);

  const loadGenres = async () => {
    try {
      // Загружаем жанры из API
      const genresData = await movieService.getGenres();
      setAvailableGenres(genresData.results || genresData || []);
    } catch (error) {
      console.error('Error loading genres:', error);
      // Fallback: загружаем из фильмов
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
      } catch (fallbackError) {
        console.error('Error loading genres from movies:', fallbackError);
      }
    }
  };

  const handleCreateGenre = async () => {
    if (!newGenreName.trim()) {
      setError('Введите название жанра');
      return;
    }

    setCreatingGenre(true);
    try {
      const newGenre = await movieService.createGenre({ name: newGenreName.trim() });
      setAvailableGenres(prev => [...prev, newGenre]);
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.id]
      }));
      setNewGenreName('');
      setShowNewGenreInput(false);
    } catch (error) {
      console.error('Error creating genre:', error);
      const errorMessage = error.response?.data?.name?.[0] || 
                          error.response?.data?.error || 
                          'Ошибка создания жанра';
      setError(errorMessage);
    } finally {
      setCreatingGenre(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      setError('Введите название фильма');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Подготавливаем данные для отправки
      const submitData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        release_year: formData.release_year,
        duration: formData.duration,
        genres: formData.genres || [], // Будет преобразовано в genres_ids в сервисе
      };

      if (movie) {
        await movieService.updateMovie(movie.id, submitData);
      } else {
        await movieService.createMovie(submitData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving movie:', error);
      let errorMessage = 'Ошибка сохранения фильма';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.title) {
          errorMessage = Array.isArray(errorData.title) ? errorData.title[0] : errorData.title;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
        }
      }
      
      setError(errorMessage);
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
                  <MenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNewGenreInput(true);
                    }}
                    sx={{ borderTop: 1, borderColor: 'divider', mt: 1 }}
                  >
                    <AddIcon sx={{ mr: 1 }} />
                    Добавить новый жанр
                  </MenuItem>
                </Select>
              </FormControl>
              
              {showNewGenreInput && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Название нового жанра"
                    value={newGenreName}
                    onChange={(e) => setNewGenreName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateGenre();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateGenre}
                    disabled={creatingGenre || !newGenreName.trim()}
                    size="small"
                  >
                    {creatingGenre ? 'Создание...' : 'Создать'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowNewGenreInput(false);
                      setNewGenreName('');
                    }}
                    size="small"
                  >
                    Отмена
                  </Button>
                </Box>
              )}
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