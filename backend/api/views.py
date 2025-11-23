from rest_framework import generics, permissions, status
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
    """
    GET: Получить список всех фильмов
    POST: Создать новый фильм
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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