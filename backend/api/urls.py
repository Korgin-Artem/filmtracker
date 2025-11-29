from django.urls import path
from . import views

urlpatterns = [
    # Аутентификация
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    
    # Фильмы
    path('movies/', views.MovieListCreateView.as_view(), name='movie-list'),
    path('movies/<uuid:pk>/', views.MovieDetailView.as_view(), name='movie-detail'),
    path('movies/popular/', views.PopularMoviesView.as_view(), name='popular-movies'),
    
    # Сериалы
    path('series/', views.SeriesListCreateView.as_view(), name='series-list'),
    path('series/<uuid:pk>/', views.SeriesDetailView.as_view(), name='series-detail'),
    
    # Отзывы
    path('reviews/', views.ReviewListCreateView.as_view(), name='review-list'),
    path('reviews/<uuid:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),
    
    # Оценки
    path('ratings/', views.RatingListCreateView.as_view(), name='rating-list'),
    
    # Статусы просмотра
    path('watch-status/', views.WatchStatusListCreateView.as_view(), name='watch-status-list'),
    
    # Пользователь
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/stats/', views.UserStatsView.as_view(), name='user-stats'),
    
    # Рекомендации
    path('recommendations/', views.RecommendationsView.as_view(), name='recommendations'),
]