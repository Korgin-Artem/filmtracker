import django_filters
from .models import Movie, Series

class MovieFilter(django_filters.FilterSet):
    genres = django_filters.CharFilter(field_name='genres__name', lookup_expr='icontains')
    release_year_min = django_filters.NumberFilter(field_name='release_year', lookup_expr='gte')
    release_year_max = django_filters.NumberFilter(field_name='release_year', lookup_expr='lte')
    
    class Meta:
        model = Movie
        fields = {
            'title': ['icontains'],
            'genres': ['exact'],
        }

class SeriesFilter(django_filters.FilterSet):
    genres = django_filters.CharFilter(field_name='genres__name', lookup_expr='icontains')
    is_ongoing = django_filters.BooleanFilter()
    
    class Meta:
        model = Series
        fields = {
            'title': ['icontains'],
            'release_year': ['exact', 'gte', 'lte'],
        }