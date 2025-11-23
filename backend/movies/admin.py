from django.contrib import admin
from .models import Genre, Person, Movie, Series

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name')
    search_fields = ('first_name', 'last_name')

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_year', 'duration')
    list_filter = ('release_year', 'genres')
    search_fields = ('title', 'description')

@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_year', 'seasons', 'is_ongoing')
    list_filter = ('release_year', 'genres', 'is_ongoing')
    search_fields = ('title', 'description')