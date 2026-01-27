from rest_framework import serializers
from .models import Aluno, Passageiro

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        read_only_fields = ('created_at', 'updated_at')
        model = Aluno
        fields = (
            'nome', 'matricula', 'frequencia', 'nota_matematica', 'nota_portugues', 'lote_upload_id', 'probabilidade_evasao', 'created_at', 'updated_at'
        )
        #fields = '__all__'

class PassageiroSerializer(serializers.ModelSerializer):
    class Meta: 
        read_only_fields = ('created_at', 'updated_at')
        model = Passageiro
        fields = '__all__'