from django.contrib import admin
from .models import Review, Rating, WatchStatus

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'text')
    
    def get_content(self, obj):
        return obj.movie.title if obj.movie else obj.series.title
    get_content.short_description = 'Контент'

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_content', 'rating')
    list_filter = ('rating',)
    
    def get_content(self, obj):
        return obj.movie.title if obj.movie else obj.series.title
    get_content.short_description = 'Контент'

@admin.register(WatchStatus)
class WatchStatusAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_content', 'status', 'added_at')
    list_filter = ('status', 'added_at')
    
    def get_content(self, obj):
        return obj.movie.title if obj.movie else obj.series.title
    get_content.short_description = 'Контент'