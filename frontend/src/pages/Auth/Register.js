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
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../../features/auth/authViewModel';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuthViewModel();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.username) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!formData.password2) {
      newErrors.password2 = 'Подтвердите пароль';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (result.success) {
      onRegisterSuccess(result.user);
      navigate('/');
    } else {
      if (typeof result.error === 'object') {
        // Обрабатываем ошибки валидации от Django
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <LoadingSpinner message="Регистрация..." />;
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
            maxWidth: 450,
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
              Регистрация
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Создайте новый аккаунт
            </Typography>
          </Box>

          {/* Общие ошибки */}
          {errors.general && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setErrors(prev => ({ ...prev, general: '' }))}
            >
              {errors.general}
            </Alert>
          )}

          {/* Форма регистрации */}
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
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Имя пользователя"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Подтверждение пароля"
              type={showPassword ? 'text' : 'password'}
              id="password2"
              autoComplete="new-password"
              value={formData.password2}
              onChange={handleChange}
              error={!!errors.password2}
              helperText={errors.password2}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  color="primary"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Войти
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;