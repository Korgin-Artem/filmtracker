from rest_framework import serializers
from .models import Review, Rating, WatchStatus

class ReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'
        read_only_fields = ('user',)

class WatchStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchStatus
        fields = '__all__'
        read_only_fields = ('user', 'added_at')