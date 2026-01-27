from django.urls import path
from .views import AlunoAPIView, PassageiroAPIView

urlpatterns = [
    path('alunos', AlunoAPIView.as_view(), name='alunos'),
    path('aluno/<str:pk>', AlunoAPIView.as_view()),
    path('passageiros', PassageiroAPIView.as_view(), name='passageiros'),
    path('passageiro/<str:pk>', PassageiroAPIView.as_view()),
]