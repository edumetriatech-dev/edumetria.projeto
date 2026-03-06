from rest_framework import serializers
from .models import Aluno, Turma, TurmaDisciplina, Disciplina, Desempenho

class TurmaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Turma
        fields = '__all__'

class DesempenhoSerializer(serializers.ModelSerializer):
    nome_disciplina = serializers.CharField(
        source="turma_disciplina.disciplina.nome_disciplina",
        read_only=True
    )

    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Desempenho
        fields = (
            'aluno',
            'nome_disciplina',
            'frequencia',
            'id',
            'nota',
            'situacao',
            'turma_disciplina',
            'created_at',
            'updated_at',
        )

class AlunoSerializer(serializers.ModelSerializer):
    nota_media = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    frequencia_media = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    turma = TurmaSerializer(read_only=True)
    desempenhos = DesempenhoSerializer(many=True, read_only=True)

    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Aluno
        fields = (
            'nome', 'matricula', 'probabilidade_evasao', 'nota_media', 'frequencia_media', 'turma', 'desempenhos', 'lote_upload_id', 'created_at', 'updated_at'
        )
        #fields = '__all__'

class TurmaDisciplinaSerializer(serializers.ModelSerializer):
    disciplina_id = serializers.IntegerField(source="disciplina.id")
    nome_disciplina = serializers.CharField(source="disciplina.nome_disciplina")

    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = TurmaDisciplina
        fields = ["id", "disciplina_id", "nome_disciplina"]

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Disciplina
        fields = '__all__'
