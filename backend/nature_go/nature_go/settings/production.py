from .base import *
import os

STATIC_ROOT = '/var/www/nature-go/static/'
MEDIA_ROOT = '/var/www/nature-go/media/'

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = ['nature-go.edouardleurent.com', 'edouardleurent.com']
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'

X_FRAME_OPTIONS = 'DENY'

REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/minute',
        'user': '300/minute',
        'ai_generation': '30/hour',
    },
}


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/var/www/nature-go/nature-go.db',
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] %(levelname)s: '
                      '%(message)s',
        }
    },
    'handlers': {
        'file': {
            'class': 'logging.handlers.'
                     'TimedRotatingFileHandler',
            'filename': '/var/www/nature-go/log/'
                        'nature-go.log',
            'when': 'midnight',
            'backupCount': 60,
            'formatter': 'default',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}

CORS_ALLOWED_ORIGINS = [
    'https://nature-go.edouardleurent.com',
    'https://edouardleurent.com',
]