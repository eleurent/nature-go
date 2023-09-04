from .base import *

MEDIA_ROOT = BASE_DIR / 'media'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-1j-2oj3cz9z_2wyib-bc*p)gx_+k3-90@n1&)knyzy3%s^hwj0'


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# CORS
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:19006',
    'http://localhost/',
]
CORS_ALLOWED_ORIGINS = [
    'http://localhost:19006',
]
CORS_ALLOW_ALL_ORIGINS = True