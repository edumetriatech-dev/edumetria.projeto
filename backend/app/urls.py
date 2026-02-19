from django.urls import path
from .views import AlunoAPIView

urlpatterns = [
    path('alunos', AlunoAPIView.as_view(), name='alunos'),
    path('aluno/<str:pk>', AlunoAPIView.as_view()),
]