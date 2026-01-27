from django.contrib import admin
from .models import Aluno, Passageiro

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'matricula', 'frequencia', 'nota_matematica', 'nota_portugues', 'lote_upload_id', 'probabilidade_evasao', 'created_at', 'updated_at')

@admin.register(Passageiro)
class PassageiroAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Passageiro._meta.fields]