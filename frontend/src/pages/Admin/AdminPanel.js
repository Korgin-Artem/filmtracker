import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Theaters,
  Tv,
} from '@mui/icons-material';
import { useAdminViewModel } from './adminViewModel';
import Header from '../../shared/ui/Header';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import MovieForm from '../../features/admin-system/MovieForm';
import SeriesForm from '../../features/admin-system/SeriesForm';

const AdminPanel = ({ user, onLogout }) => {
  const {
    movies,
    series,
    loading,
    error,
    activeTab,
    setActiveTab,
    refreshData,
    deleteMovie,
    deleteSeries,
    handleMovieSaved,
    handleSeriesSaved,
  } = useAdminViewModel();

  const [movieFormOpen, setMovieFormOpen] = useState(false);
  const [seriesFormOpen, setSeriesFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', title: '' });

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieFormOpen(true);
  };

  const handleEditSeries = (series) => {
    setEditingSeries(series);
    setSeriesFormOpen(true);
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setMovieFormOpen(true);
  };

  const handleAddSeries = () => {
    setEditingSeries(null);
    setSeriesFormOpen(true);
  };

  const handleCloseMovieForm = () => {
    setMovieFormOpen(false);
    setEditingMovie(null);
  };

  const handleCloseSeriesForm = () => {
    setSeriesFormOpen(false);
    setEditingSeries(null);
  };

  const handleDeleteClick = (type, id, title) => {
    setDeleteDialog({ open: true, type, id, title });
  };

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteDialog;
    
    if (type === 'movie') {
      await deleteMovie(id);
    } else if (type === 'series') {
      await deleteSeries(id);
    }
    
    setDeleteDialog({ open: false, type: '', id: '', title: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, type: '', id: '', title: '' });
  };

  const MoviesTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Постер</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Год</TableCell>
            <TableCell>Продолжительность</TableCell>
            <TableCell>Жанры</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>
                {movie.poster ? (
                  <Box
                    component="img"
                    src={movie.poster}
                    alt={movie.title}
                    sx={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Theaters sx={{ width: 50, height: 75, color: 'grey.500' }} />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{movie.title}</Typography>
                {movie.description && (
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {movie.description}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{movie.release_year}</TableCell>
              <TableCell>{movie.duration} мин</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                  {movie.genres?.map((genre) => (
                    <Chip key={genre.id} label={genre.name} size="small" />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditMovie(movie)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick('movie', movie.id, movie.title)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const SeriesTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Постер</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Год</TableCell>
            <TableCell>Сезоны</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Жанры</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {series.map((seriesItem) => (
            <TableRow key={seriesItem.id}>
              <TableCell>
                {seriesItem.poster ? (
                  <Box
                    component="img"
                    src={seriesItem.poster}
                    alt={seriesItem.title}
                    sx={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Tv sx={{ width: 50, height: 75, color: 'grey.500' }} />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{seriesItem.title}</Typography>
                {seriesItem.description && (
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {seriesItem.description}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{seriesItem.release_year}</TableCell>
              <TableCell>{seriesItem.seasons}</TableCell>
              <TableCell>
                <Chip
                  label={seriesItem.is_ongoing ? "Онгоинг" : "Завершен"}
                  color={seriesItem.is_ongoing ? "warning" : "success"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                  {seriesItem.genres?.map((genre) => (
                    <Chip key={genre.id} label={genre.name} size="small" />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditSeries(seriesItem)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick('series', seriesItem.id, seriesItem.title)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={onLogout} />
        <LoadingSpinner message="Загрузка админ-панели..." />
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Панель администратора
        </Typography>

        {/* Ошибки */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab 
                icon={<Theaters />} 
                label={`Фильмы (${movies.length})`} 
              />
              <Tab 
                icon={<Tv />} 
                label={`Сериалы (${series.length})`} 
              />
            </Tabs>
            
            <Box sx={{ pr: 2 }}>
              {activeTab === 0 ? (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddMovie}
                >
                  Добавить фильм
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddSeries}
                >
                  Добавить сериал
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <MoviesTable />}
            {activeTab === 1 && <SeriesTable />}
          </Box>
        </Paper>

        {/* Формы */}
        <MovieForm
          open={movieFormOpen}
          onClose={handleCloseMovieForm}
          movie={editingMovie}
          onSave={handleMovieSaved}
        />

        <SeriesForm
          open={seriesFormOpen}
          onClose={handleCloseSeriesForm}
          series={editingSeries}
          onSave={handleSeriesSaved}
        />

        {/* Диалог подтверждения удаления */}
        <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить {deleteDialog.type === 'movie' ? 'фильм' : 'сериал'} "{deleteDialog.title}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Отмена</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminPanel;