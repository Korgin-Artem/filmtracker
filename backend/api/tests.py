from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User

class MovieAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123'
        )
    
    def test_get_movies(self):
        url = reverse('movie-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_movie_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('movie-list')
        data = {
            'title': 'Test Movie',
            'release_year': 2024,
            'duration': 120
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)