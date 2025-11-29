import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { movieService } from '../../shared/api/movieService';

const SearchBar = ({ onMovieSelect, placeholder = "Поиск фильмов..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const data = await movieService.searchMovies(searchQuery);
      setResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Дебаунс поиска
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleMovieSelect = (movie) => {
    setQuery(movie.title);
    setShowResults(false);
    onMovieSelect(movie);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showResults && (
        <Paper 
          sx={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 1
          }}
        >
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">Поиск...</Typography>
            </Box>
          ) : results.length > 0 ? (
            <List dense>
              {results.map((movie) => (
                <ListItem
                  key={movie.id}
                  button
                  onClick={() => handleMovieSelect(movie)}
                >
                  <ListItemText
                    primary={movie.title}
                    secondary={`${movie.release_year} • ${movie.genres?.map(g => g.name).join(', ')}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : query && (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">Ничего не найдено</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;