from django.urls import path
from .views import MultipleChoiceQuestionListCreate, QuizRetrieveUpdateView, QuizGetOrCreateView, MultipleChoiceQuestionRetrieveUpdateDestroy, MultipleChoiceQuestionGeneration

urlpatterns = [
    path('quiz/questions/', MultipleChoiceQuestionListCreate.as_view(), name='multiple-choice-question-list-create'),
    path('quiz/questions/generate/<int:pk>/', MultipleChoiceQuestionGeneration.as_view(), name='multiple-choice-question-generation'),
    path('quiz/questions/<int:pk>/', MultipleChoiceQuestionRetrieveUpdateDestroy.as_view(), name='multiple-choice-question-retrieve-update-destroy'),
    path('quiz/get_or_create/', QuizGetOrCreateView.as_view(), name='quiz-get-or-create'),
    path('quiz/<int:pk>/', QuizRetrieveUpdateView.as_view(), name='quiz-retrieve-update'),
]