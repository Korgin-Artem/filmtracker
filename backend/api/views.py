from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from users.models import User
from users.serializers import UserSerializer, UserRegistrationSerializer
from movies.models import Movie, Series, Genre, Person
from movies.serializers import MovieSerializer, SeriesSerializer, GenreSerializer, PersonSerializer
from reviews.models import Review, Rating, WatchStatus
from reviews.serializers import ReviewSerializer, RatingSerializer, WatchStatusSerializer
from django_filters.rest_framework import DjangoFilterBackend
from movies.filters import MovieFilter, SeriesFilter
from django.db.models import Count, Avg

# ===== АУТЕНТИФИКАЦИЯ =====

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Регистрация нового пользователя
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """
    Вход пользователя
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# ===== ФИЛЬМЫ =====

class MovieListCreateView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MovieFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'release_year', 'created_at']
    ordering = ['-created_at']

class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Получить детали фильма
    PUT: Обновить фильм
    DELETE: Удалить фильм
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ===== СЕРИАЛЫ =====

class SeriesListCreateView(generics.ListCreateAPIView):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = SeriesFilter
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'release_year', 'seasons']
    ordering = ['-created_at']

class SeriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ===== ОТЗЫВЫ =====

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Автоматически привязываем отзыв к текущему пользователю
        serializer.save(user=self.request.user)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ===== ОЦЕНКИ =====

class RatingListCreateView(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Автоматически привязываем оценку к текущему пользователю
        serializer.save(user=self.request.user)

# ===== СТАТУСЫ ПРОСМОТРА =====

class WatchStatusListCreateView(generics.ListCreateAPIView):
    queryset = WatchStatus.objects.all()
    serializer_class = WatchStatusSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Автоматически привязываем статус к текущему пользователю
        serializer.save(user=self.request.user)

# ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =====

class UserProfileView(generics.RetrieveAPIView):
    """
    GET: Получить профиль текущего пользователя
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Возвращаем текущего аутентифицированного пользователя
        return self.request.user
    
# ===== Статистика для пользователей =====
    
class UserStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Статистика по фильмам
        movies_watched = WatchStatus.objects.filter(
            user=user, 
            status='watched',
            movie__isnull=False
        ).count()
        
        series_watched = WatchStatus.objects.filter(
            user=user, 
            status='watched',
            series__isnull=False
        ).count()
        
        # Средняя оценка пользователя
        avg_rating = Rating.objects.filter(user=user).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating'] or 0
        
        # Количество отзывов
        reviews_count = Review.objects.filter(user=user).count()
        
        stats = {
            'movies_watched': movies_watched,
            'series_watched': series_watched,
            'total_watched': movies_watched + series_watched,
            'average_rating': round(avg_rating, 1),
            'reviews_written': reviews_count,
            'watch_status_distribution': {
                'planned': WatchStatus.objects.filter(user=user, status='planned').count(),
                'watching': WatchStatus.objects.filter(user=user, status='watching').count(),
                'watched': WatchStatus.objects.filter(user=user, status='watched').count(),
            }
        }
        
        return Response(stats)
    
# ===== Популярные фильмы и рекомендации =====

class PopularMoviesView(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Фильмы с наибольшим количеством оценок
        return Movie.objects.annotate(
            rating_count=Count('rating'),
            avg_rating=Avg('rating__rating')
        ).filter(rating_count__gte=1).order_by('-avg_rating')[:10]

class RecommendationsView(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Простая рекомендация: фильмы того же жанра что и высоко оцененные пользователем
        user_top_rated_movies = Rating.objects.filter(
            user=user, 
            rating__gte=8
        ).values_list('movie__genres', flat=True)
        
        # Рекомендуем фильмы тех же жанров
        recommended_movies = Movie.objects.filter(
            genres__in=user_top_rated_movies
        ).exclude(
            rating__user=user  # Исключаем уже оцененные
        ).distinct()[:10]
        
        # Если рекомендаций мало, показываем популярные
        if recommended_movies.count() < 5:
            popular_movies = Movie.objects.annotate(
                avg_rating=Avg('rating__rating')
            ).filter(avg_rating__gte=7).order_by('-avg_rating')[:10]
            return popular_movies
        
        return recommended_movies