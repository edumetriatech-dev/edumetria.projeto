from django.urls import path
from .views import AlunoAPIView, TurmaAPIView, DisciplinaAPIView

urlpatterns = [
    path('alunos', AlunoAPIView.as_view(), name='alunos'),
    path('aluno/<str:pk>', AlunoAPIView.as_view()),
    path('turmas', TurmaAPIView.as_view()),
    path('disciplinas', DisciplinaAPIView.as_view()),
]