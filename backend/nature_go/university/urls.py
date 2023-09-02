from django.urls import path
from .views import MultipleChoiceQuestionListCreate, QuizRetrieveUpdateView, QuizGetOrCreateView

urlpatterns = [
    path('quiz/questions/', MultipleChoiceQuestionListCreate.as_view(), name='multiple-choice-question-list-create'),
    path('quiz/get_or_create/', QuizGetOrCreateView.as_view(), name='quiz-get-or-create'),
    path('quiz/<int:pk>/', QuizRetrieveUpdateView.as_view(), name='quiz-retrieve-update'),
]