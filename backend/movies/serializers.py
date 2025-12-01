from rest_framework import serializers
from .models import Genre, Person, Movie, Series

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genres_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        source='genres',
        write_only=True,
        required=False
    )
    directors = PersonSerializer(many=True, read_only=True)
    actors = PersonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Movie
        fields = '__all__'

class SeriesSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genres_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        source='genres',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Series
        fields = '__all__'