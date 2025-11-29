import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { APP_CONFIG } from '../../utils/constants/appConfig';

const GenreFilter = ({ selectedGenres = [], onGenreChange, availableGenres = [] }) => {
  const handleChange = (event) => {
    onGenreChange(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>Жанры</InputLabel>
      <Select
        multiple
        value={selectedGenres}
        onChange={handleChange}
        label="Жанры"
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip 
                key={value} 
                label={value} 
                size="small"
                sx={{
                  backgroundColor: APP_CONFIG.GENRE_COLORS[value] || 'primary.main',
                  color: 'white'
                }}
              />
            ))}
          </Box>
        )}
      >
        {availableGenres.map((genre) => (
          <MenuItem key={genre.id} value={genre.name}>
            {genre.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreFilter;