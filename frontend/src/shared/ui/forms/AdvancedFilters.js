import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  Chip, // Добавлен импорт Chip
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
} from '@mui/icons-material';

const AdvancedFilters = ({ 
  filters, 
  onFilterChange, 
  open = false,
  onToggle 
}) => {
  const currentYear = new Date().getFullYear();
  const [localFilters, setLocalFilters] = useState(filters);
  const [sliderValue, setSliderValue] = useState([
    parseInt(filters.release_year_min) || 1900,
    parseInt(filters.release_year_max) || currentYear
  ]);

  // Синхронизируем локальные фильтры с внешними
  useEffect(() => {
    setLocalFilters(filters);
    setSliderValue([
      parseInt(filters.release_year_min) || 1900,
      parseInt(filters.release_year_max) || currentYear
    ]);
  }, [filters, currentYear]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      release_year_min: newValue[0] === 1900 ? '' : newValue[0],
      release_year_max: newValue[1] === currentYear ? '' : newValue[1]
    }));
  };

  const handleSelectChange = (field) => (event) => {
    const value = event.target.value;
    setLocalFilters(prev => ({
      ...prev,
      [field]: value === '-created_at' ? '' : value
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      ordering: '',
      release_year_min: '',
      release_year_max: '',
    };
    setLocalFilters(resetFilters);
    setSliderValue([1900, currentYear]);
    onFilterChange(resetFilters);
  };

  // Проверяем, есть ли отличия между текущими и начальными фильтрами
  const hasFilterChanges = () => {
    const initialFilters = {
      ordering: '',
      release_year_min: '',
      release_year_max: '',
    };
    
    return Object.keys(initialFilters).some(key => {
      const localValue = localFilters[key];
      const initialValue = initialFilters[key];
      
      if (key === 'ordering') {
        return localValue !== initialValue && localValue !== '-created_at';
      }
      return localValue !== initialValue;
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
          <Typography variant="h6">Фильтры</Typography>
          {hasFilterChanges() && (
            <Chip 
              label="Фильтры активны" 
              size="small" 
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Grid container spacing={3}>
          {/* Сортировка */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={localFilters.ordering || '-created_at'}
                label="Сортировка"
                onChange={handleSelectChange('ordering')}
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

          {/* Год выпуска - слайдер */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Год выпуска: {sliderValue[0]} - {sliderValue[1]}
            </Typography>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderChangeCommitted}
              min={1900}
              max={currentYear}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>

        {/* Кнопки действий */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            startIcon={<Clear />}
            onClick={resetFilters}
            variant="outlined"
            color="error"
            size="small"
          >
            Сбросить всё
          </Button>
          
          <Button
            onClick={applyFilters}
            variant="contained"
            color="primary"
            size="small"
            disabled={!hasFilterChanges()}
          >
            Применить фильтры
          </Button>
        </Box>

        {/* Информация о активных фильтрах */}
        {hasFilterChanges() && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Выбраны:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {localFilters.ordering && localFilters.ordering !== '-created_at' && (
                <Box component="span" sx={{ mr: 2 }}>
                  Сортировка: {
                    localFilters.ordering === 'created_at' ? 'старые → новые' :
                    localFilters.ordering === '-release_year' ? 'новые по году' :
                    localFilters.ordering === 'release_year' ? 'старые по году' :
                    localFilters.ordering === 'title' ? 'А-Я' :
                    localFilters.ordering === '-title' ? 'Я-А' :
                    localFilters.ordering === '-rating' ? 'высокий рейтинг' :
                    localFilters.ordering === 'rating' ? 'низкий рейтинг' : ''
                  }
                </Box>
              )}
              {(localFilters.release_year_min || localFilters.release_year_max) && (
                <Box component="span">
                  Год: {localFilters.release_year_min || '1900'} - {localFilters.release_year_max || currentYear}
                </Box>
              )}
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedFilters;