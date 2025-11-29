import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthViewModel } from '../../features/auth/authViewModel';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, loading } = useAuthViewModel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Базовая валидация
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Вход в систему..." />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            padding: 6, 
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          {/* Заголовок */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              FilmTracker
            </Typography>
            <Typography 
              component="h2" 
              variant="h5" 
              gutterBottom
            >
              Вход в систему
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Войдите в свой аккаунт
            </Typography>
          </Box>

          {/* Сообщения об ошибках */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Форма входа */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  color="primary"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;