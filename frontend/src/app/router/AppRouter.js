import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthViewModel();
  
  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
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

// Компонент для публичных маршрутов (только для неавторизованных)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthViewModel();
  
  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppRouter = () => {
  const { user, logout } = useAuthViewModel();

  const handleLoginSuccess = (userData) => {
    console.log('User logged in:', userData);
  };

  const handleRegisterSuccess = (userData) => {
    console.log('User registered:', userData);
  };

  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login onLoginSuccess={handleLoginSuccess} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register onRegisterSuccess={handleRegisterSuccess} />
            </PublicRoute>
          } 
        />
        
        {/* Защищенные маршруты */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/catalog" 
          element={
            <ProtectedRoute>
              <Catalog user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/movie/:id" 
          element={
            <ProtectedRoute>
              <MovieDetail user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/series/:id" 
          element={
            <ProtectedRoute>
              <SeriesDetail user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        
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