import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Movie as MovieIcon,
  AccountCircle,
  ExitToApp,
  Home,
  Theaters,
  Person,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Логотип */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <MovieIcon sx={{ mr: 1, color: '#E50914' }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              fontWeight: 'bold',
              color: '#E50914',
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 }
            }}
          >
            FilmTracker
          </Typography>
        </Box>

        {/* Навигация для десктопа */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
          <Button 
            color="inherit" 
            component={Link}
            to="/"
            startIcon={<Home />}
          >
            Главная
          </Button>
          <Button 
            color="inherit" 
            component={Link}
            to="/catalog"
            startIcon={<Theaters />}
          >
            Каталог
          </Button>
        </Box>

        {/* Правая часть */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* Уведомления и профиль */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Привет, {user.username}!
                </Typography>
                
                <IconButton 
                  color="inherit" 
                  component={Link}
                  to="/profile"
                  title="Профиль"
                >
                  <AccountCircle />
                </IconButton>
                
                <IconButton 
                  color="inherit" 
                  onClick={handleLogout}
                  title="Выйти"
                >
                  <ExitToApp />
                </IconButton>
              </Box>

              {/* Мобильное меню */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Профиль
                  </MenuItem>
                  <MenuItem component={Link} to="/" onClick={handleClose}>
                    <Home sx={{ mr: 1 }} />
                    Главная
                  </MenuItem>
                  <MenuItem component={Link} to="/catalog" onClick={handleClose}>
                    <Theaters sx={{ mr: 1 }} />
                    Каталог
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Выйти
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            /* Кнопки входа/регистрации */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
              >
                Войти
              </Button>
              <Button 
                color="primary" 
                variant="contained"
                component={Link}
                to="/register"
                size="small"
                sx={{ 
                  backgroundColor: '#E50914',
                  '&:hover': { backgroundColor: '#ff5252' }
                }}
              >
                Регистрация
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;