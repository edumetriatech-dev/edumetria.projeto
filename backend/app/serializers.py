from rest_framework import serializers
from .models import Aluno, AlunoTurma, Turma, TurmaDisciplina, Disciplina, Desempenho

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Aluno
        fields = (
            'nome', 'matricula', 'lote_upload_id', 'probabilidade_evasao', 'created_at', 'updated_at'
        )
        #fields = '__all__'

class AlunoTurmaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = AlunoTurma
        fields = '__all__'

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Turma
        fields = '__all__'

class TurmaDisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = TurmaDisciplina
        fields = '__all__'

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Disciplina
        fields = '__all__'

class DesempenhoSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Desempenho
        fields = '__all__'