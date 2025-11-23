from django.urls import path
from . import views

urlpatterns = [
    # ===== АУТЕНТИФИКАЦИЯ =====
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    
    # ===== ФИЛЬМЫ =====
    path('movies/', views.MovieListCreateView.as_view(), name='movie-list'),
    path('movies/<uuid:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),
    
    # ===== СЕРИАЛЫ =====
    path('series/', views.SeriesListCreateView.as_view(), name='series-list'),
    path('series/<uuid:pk>/', views.SeriesDetailView.as_view(), name='series-detail'),
    
    # ===== ОТЗЫВЫ =====
    path('reviews/', views.ReviewListCreateView.as_view(), name='review-list'),
    path('reviews/<uuid:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),
    
    # ===== ОЦЕНКИ =====
    path('ratings/', views.RatingListCreateView.as_view(), name='rating-list'),
    
    # ===== СТАТУСЫ ПРОСМОТРА =====
    path('watch-status/', views.WatchStatusListCreateView.as_view(), name='watch-status-list'),
    
    # ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =====
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
]