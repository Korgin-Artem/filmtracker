import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthViewModel } from '../../features/auth/authViewModel';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';
import Home from '../../pages/Home/Home';
import Catalog from '../../pages/Catalog/Catalog';
import MovieDetail from '../../pages/Movie/MovieDetail';
import SeriesDetail from '../../pages/Series/SeriesDetail';
import Profile from '../../pages/Profile/Profile';
import Recommendations from '../../pages/Recommendations/Recommendations';
import AdminPanel from '../../pages/Admin/AdminPanel';
import WatchList from '../../pages/WatchList/WatchList';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

// Компонент для защищенных маршрутов (требует авторизации)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthViewModel();
  
  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }
  
  // Проверяем также через localStorage для более надежной проверки
  const hasToken = !!localStorage.getItem('access_token');
  
  return (isAuthenticated || hasToken) ? children : <Navigate to="/login" replace />;
};

// Компонент для публичных маршрутов (доступны всем, включая гостей)
const PublicRoute = ({ children }) => {
  return children;
};

// Компонент для админских маршрутов
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuthViewModel();
  
  if (loading) {
    return <LoadingSpinner message="Проверка прав доступа..." />;
  }
  
  // Проверяем что пользователь авторизован и является админом
  const isAdmin = user?.is_staff || user?.is_superuser;
  
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

// Компонент для маршрутов только для неавторизованных (логин/регистрация)
const AuthOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthViewModel();
  
  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }
  
  // Проверяем также через localStorage для более надежной проверки
  const hasToken = !!localStorage.getItem('access_token');
  
  return !isAuthenticated && !hasToken ? children : <Navigate to="/" replace />;
};

// Компонент-обертка для Login с навигацией
const LoginWithNavigation = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuthViewModel();

  const handleLoginSuccess = (userData) => {
    console.log('User logged in:', userData);
    // Обновляем состояние пользователя
    if (refreshUser) {
      refreshUser();
    }
    // Небольшая задержка для обновления состояния, затем перенаправление
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 100);
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

// Компонент-обертка для Register с навигацией
const RegisterWithNavigation = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuthViewModel();

  const handleRegisterSuccess = (userData) => {
    console.log('User registered:', userData);
    // Обновляем состояние пользователя
    if (refreshUser) {
      refreshUser();
    }
    // Небольшая задержка для обновления состояния, затем перенаправление
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 100);
  };

  return <Register onRegisterSuccess={handleRegisterSuccess} />;
};

const AppRouter = () => {
  const { user, logout } = useAuthViewModel();

  return (
    <Router>
      <Routes>
        {/* Маршруты только для неавторизованных */}
        <Route 
          path="/login" 
          element={
            <AuthOnlyRoute>
              <LoginWithNavigation />
            </AuthOnlyRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <AuthOnlyRoute>
              <RegisterWithNavigation />
            </AuthOnlyRoute>
          } 
        />
        
        {/* Публичные маршруты (доступны всем) */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Home user={user} onLogout={logout} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/catalog" 
          element={
            <PublicRoute>
              <Catalog user={user} onLogout={logout} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/movie/:id" 
          element={
            <PublicRoute>
              <MovieDetail user={user} onLogout={logout} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/series/:id" 
          element={
            <PublicRoute>
              <SeriesDetail user={user} onLogout={logout} />
            </PublicRoute>
          } 
        />
        
        {/* Защищенные маршруты (только для авторизованных) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/recommendations" 
          element={
            <ProtectedRoute>
              <Recommendations user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/watchlist" 
          element={
            <ProtectedRoute>
              <WatchList user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Админские маршруты */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel user={user} onLogout={logout} />
            </AdminRoute>
          } 
        />
        
        {/* Маршрут по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;