import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Movie as MovieIcon, AccountCircle, ExitToApp } from '@mui/icons-material';

const Header = ({ user, onLogout }) => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Логотип */}
        <MovieIcon sx={{ mr: 2, color: '#E50914' }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            color: '#E50914'
          }}
        >
          FilmTracker
        </Typography>

        {/* Навигация */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" href="/">
            Главная
          </Button>
          <Button color="inherit" href="/catalog">
            Каталог
          </Button>
          
          {/* Информация пользователя */}
          {user && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountCircle />
                <Typography variant="body2">
                  {user.username}
                </Typography>
              </Box>
              <IconButton 
                color="inherit" 
                onClick={onLogout}
                title="Выйти"
              >
                <ExitToApp />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;