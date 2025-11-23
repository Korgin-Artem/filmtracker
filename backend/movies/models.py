import uuid
from django.db import models

class Genre(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class Person(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='persons/', null=True, blank=True)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Movie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_year = models.IntegerField()
    duration = models.IntegerField(help_text="Duration in minutes")
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)
    genres = models.ManyToManyField(Genre, related_name='movies')
    directors = models.ManyToManyField(Person, related_name='directed_movies')
    actors = models.ManyToManyField(Person, related_name='acted_movies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Series(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    release_year = models.IntegerField()
    seasons = models.IntegerField(default=1)
    is_ongoing = models.BooleanField(default=False)
    poster = models.ImageField(upload_to='series_posters/', null=True, blank=True)
    genres = models.ManyToManyField(Genre, related_name='series')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title