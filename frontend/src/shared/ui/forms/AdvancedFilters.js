import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
} from '@mui/icons-material';
import GenreFilter from '../components/GenreFilter';

const AdvancedFilters = ({ 
  filters, 
  onFilterChange, 
  availableGenres = [],
  open = false,
  onToggle 
}) => {
  const currentYear = new Date().getFullYear();

  const handleSliderChange = (field) => (event, newValue) => {
    onFilterChange({ 
      ...filters, 
      [field]: newValue 
    });
  };

  const handleInputChange = (field) => (event) => {
    onFilterChange({ 
      ...filters, 
      [field]: event.target.value 
    });
  };

  return (
    <Accordion 
      expanded={open} 
      onChange={onToggle}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6">Расширенные фильтры</Typography>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Grid container spacing={3}>
          {/* Сортировка */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={filters.ordering || '-created_at'}
                label="Сортировка"
                onChange={handleInputChange('ordering')}
              >
                <MenuItem value="-created_at">Сначала новые</MenuItem>
                <MenuItem value="created_at">Сначала старые</MenuItem>
                <MenuItem value="-release_year">Сначала новые по году</MenuItem>
                <MenuItem value="release_year">Сначала старые по году</MenuItem>
                <MenuItem value="title">По названию (А-Я)</MenuItem>
                <MenuItem value="-title">По названию (Я-А)</MenuItem>
                <MenuItem value="-rating">По рейтингу (высокий)</MenuItem>
                <MenuItem value="rating">По рейтингу (низкий)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Жанры */}
          <Grid item xs={12} md={6}>
            <GenreFilter
              selectedGenres={filters.genres ? [filters.genres] : []}
              onGenreChange={(value) => onFilterChange({ 
                ...filters, 
                genres: value[0] || '' 
              })}
              availableGenres={availableGenres}
            />
          </Grid>

          {/* Год выпуска - слайдер */}
          <Grid item xs={12}>
            <Typography gutterBottom>
              Год выпуска: {filters.release_year_min || 1900} - {filters.release_year_max || currentYear}
            </Typography>
            <Slider
              value={[
                parseInt(filters.release_year_min) || 1900, 
                parseInt(filters.release_year_max) || currentYear
              ]}
              onChange={handleSliderChange('release_year')}
              min={1900}
              max={currentYear}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Grid>

          {/* Продолжительность (для фильмов) */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Продолжительность (мин)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="number"
                placeholder="От"
                value={filters.duration_min || ''}
                onChange={handleInputChange('duration_min')}
                InputProps={{ inputProps: { min: 0, max: 400 } }}
              />
              <Typography>-</Typography>
              <TextField
                type="number"
                placeholder="До"
                value={filters.duration_max || ''}
                onChange={handleInputChange('duration_max')}
                InputProps={{ inputProps: { min: 0, max: 400 } }}
              />
            </Box>
          </Grid>

          {/* Статус (для сериалов) */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Статус сериала</InputLabel>
              <Select
                value={filters.is_ongoing || ''}
                label="Статус сериала"
                onChange={handleInputChange('is_ongoing')}
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="true">Онгоинг</MenuItem>
                <MenuItem value="false">Завершен</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Активные фильтры */}
        {(filters.genres || filters.release_year_min || filters.release_year_max || filters.ordering !== '-created_at') && (
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Активные фильтры:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.genres && (
                <Chip 
                  label={`Жанр: ${filters.genres}`}
                  onDelete={() => onFilterChange({ ...filters, genres: '' })}
                  size="small"
                />
              )}
              {filters.release_year_min && (
                <Chip 
                  label={`Год от: ${filters.release_year_min}`}
                  onDelete={() => onFilterChange({ ...filters, release_year_min: '' })}
                  size="small"
                />
              )}
              {filters.release_year_max && (
                <Chip 
                  label={`Год до: ${filters.release_year_max}`}
                  onDelete={() => onFilterChange({ ...filters, release_year_max: '' })}
                  size="small"
                />
              )}
              {filters.ordering && filters.ordering !== '-created_at' && (
                <Chip 
                  label={`Сортировка: ${filters.ordering}`}
                  onDelete={() => onFilterChange({ ...filters, ordering: '-created_at' })}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedFilters;