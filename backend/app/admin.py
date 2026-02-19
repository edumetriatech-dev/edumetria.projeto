from django.contrib import admin
from .models import Aluno, AlunoTurma, Turma, TurmaDisciplina, Disciplina, Desempenho

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Aluno._meta.fields]

@admin.register(AlunoTurma)
class AlunoTurmaAdmin(admin.ModelAdmin):
    list_display = [field.name for field in AlunoTurma._meta.fields]

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Turma._meta.fields]

@admin.register(TurmaDisciplina)
class TurmaDisciplinaAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TurmaDisciplina._meta.fields]

@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Disciplina._meta.fields]

@admin.register(Desempenho)
class DesempenhoAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Desempenho._meta.fields]