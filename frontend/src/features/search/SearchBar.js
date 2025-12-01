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
  Chip,
} from '@mui/material';
import { Search, Clear, Theaters, Tv } from '@mui/icons-material';
import { movieService } from '../../shared/api/movieService';
import { seriesService } from '../../entities/series/seriesService';

const SearchBar = ({ onMovieSelect, onSeriesSelect, placeholder = "Поиск фильмов и сериалов...", searchType = 'all' }) => {
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
      const allResults = [];
      
      // Поиск фильмов
      if (searchType === 'all' || searchType === 'movies') {
        try {
          const moviesData = await movieService.searchMovies(searchQuery);
          const movies = (moviesData.results || []).map(movie => ({ ...movie, type: 'movie' }));
          allResults.push(...movies);
        } catch (error) {
          console.error('Movies search error:', error);
        }
      }
      
      // Поиск сериалов
      if (searchType === 'all' || searchType === 'series') {
        try {
          const seriesData = await seriesService.searchSeries(searchQuery);
          const series = (seriesData.results || []).map(series => ({ ...series, type: 'series' }));
          allResults.push(...series);
        } catch (error) {
          console.error('Series search error:', error);
        }
      }
      
      setResults(allResults);
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

  const handleItemSelect = (item) => {
    setQuery(item.title);
    setShowResults(false);
    if (item.type === 'movie' && onMovieSelect) {
      onMovieSelect(item);
    } else if (item.type === 'series' && onSeriesSelect) {
      onSeriesSelect(item);
    }
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
              {results.map((item) => (
                <ListItem
                  key={`${item.type}-${item.id}`}
                  button
                  onClick={() => handleItemSelect(item)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.type === 'movie' ? <Theaters fontSize="small" /> : <Tv fontSize="small" />}
                        {item.title}
                        <Chip 
                          label={item.type === 'movie' ? 'Фильм' : 'Сериал'} 
                          size="small" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      </Box>
                    }
                    secondary={`${item.release_year} • ${item.genres?.map(g => g.name).join(', ')}`}
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