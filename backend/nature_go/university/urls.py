from django.urls import path
from .views import QuizCreateView, QuizRetrieveView, QuizGetOrCreateView

urlpatterns = [
    path('quiz/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quiz/get_or_create/', QuizGetOrCreateView.as_view(), name='quiz-get-or-create'),
    path('quiz/<int:pk>/', QuizRetrieveView.as_view(), name='quiz-retrieve'),
]