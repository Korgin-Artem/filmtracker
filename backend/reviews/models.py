import uuid
from django.db import models
from django.conf import settings

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey('movies.Series', on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(movie__isnull=False) | models.Q(series__isnull=False),
                name='review_has_content'
            )
        ]
    
    def __str__(self):
        content = self.movie.title if self.movie else self.series.title
        return f"Review by {self.user.username} for {content}"

class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey('movies.Series', on_delete=models.CASCADE, null=True, blank=True)
    rating = models.IntegerField()  # 1-10
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(rating__gte=1) & models.Q(rating__lte=10),
                name='rating_range'
            ),
            models.CheckConstraint(
                check=models.Q(movie__isnull=False) | models.Q(series__isnull=False),
                name='rating_has_content'
            )
        ]
    
    def __str__(self):
        content = self.movie.title if self.movie else self.series.title
        return f"Rating {self.rating}/10 by {self.user.username} for {content}"

class WatchStatus(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Запланировано'),
        ('watching', 'Смотрю'),
        ('watched', 'Просмотрено'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey('movies.Movie', on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey('movies.Series', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(movie__isnull=False) | models.Q(series__isnull=False),
                name='watch_status_has_content'
            )
        ]
    
    def __str__(self):
        content = self.movie.title if self.movie else self.series.title
        return f"{self.user.username} - {content} ({self.status})"