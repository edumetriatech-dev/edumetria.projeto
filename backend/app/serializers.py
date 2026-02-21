from rest_framework import serializers
from .models import Aluno, Turma, TurmaDisciplina, Disciplina, Desempenho

class AlunoSerializer(serializers.ModelSerializer):
    nota_media = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    frequencia_media = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    turma_info = serializers.SerializerMethodField()

    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Aluno
        fields = (
            'nome', 'matricula', 'probabilidade_evasao', 'nota_media', 'frequencia_media', 'turma_info', 'lote_upload_id', 'created_at', 'updated_at'
        )
        #fields = '__all__'

    def get_turma_info(self, obj):
        return f"{obj.turma.ano_letivo} - {obj.turma.serie}º {obj.turma.secao}" if obj.turma else None


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