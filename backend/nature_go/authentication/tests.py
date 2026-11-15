from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationAPITests(APITestCase):
    def test_register_duplicate_username_returns_400(self):
        User.objects.create_user(username='naturalist', password='StrongPassword123!')
        response = self.client.post(
            '/api/auth/register/',
            {
                'username': 'naturalist',
                'password': 'StrongPassword123!',
                'first_name': 'Charles',
                'last_name': 'Darwin',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_register_weak_password_returns_400(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'username': 'new_naturalist',
                'password': '123',
                'first_name': 'Ada',
                'last_name': 'Lovelace',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_register_and_post_logout(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'username': 'darwin_1831',
                'password': 'BeagleVoyage1831!',
                'first_name': 'Charles',
                'last_name': 'Darwin',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        logout_resp = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(key=token).exists())
