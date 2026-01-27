from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Aluno, Passageiro
from .serializers import AlunoSerializer, PassageiroSerializer
from .pagination import AlunoPagination
from django.shortcuts import get_object_or_404
import csv
import io
import uuid
from django.db import transaction
from django.db.models import Case, When, Value, IntegerField
from .tasks import processar_lote_ia

class AlunoAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            aluno = get_object_or_404(Aluno, pk=pk)
            serializer = AlunoSerializer(aluno)
            return Response(serializer.data)

        alunos = Aluno.objects.all()

        # Pegando os filtros da URL
        nome = request.query_params.get("nome")
        matricula = request.query_params.get("matricula")
        nota_portugues = request.query_params.get("nota_portugues")
        nota_matematica = request.query_params.get("nota_matematica")
        frequencia = request.query_params.get("frequencia")
        risco = request.query_params.get("risco")

        # Aplicando os filtros se existirem
        if nome:
            alunos = alunos.filter(nome__icontains=nome)

        if matricula:
            alunos = alunos.filter(matricula__icontains=matricula)

        if nota_portugues:
            alunos = alunos.filter(nota_portugues__gte=float(nota_portugues))

        if nota_matematica:
            alunos = alunos.filter(nota_matematica__gte=float(nota_matematica))

        if frequencia:
            alunos = alunos.filter(frequencia__gte=float(frequencia))

        if risco:
            if(risco == 'alto'):
                alunos = alunos.filter(probabilidade_evasao__gte=0.6)
            elif(risco == 'medio'):
                alunos = alunos.filter(probabilidade_evasao__range=(0.4, 0.5999))
            elif(risco == 'baixo'):
                alunos = alunos.filter(probabilidade_evasao__range=(0, 0.39999))


           # -------- ORDENAÇÃO --------
        ordenar_por = request.query_params.get("ordenar_por")
        direcao = request.query_params.get("direcao")

        if ordenar_por:
            campos_permitidos = ['nome', 'matricula', 'nota_portugues', 'nota_matematica', 'frequencia', 'risco']
            if ordenar_por in campos_permitidos:
                if direcao == "desc":
                    if ordenar_por == "risco":
                        alunos = alunos.order_by("-probabilidade_evasao")
                    else:
                        alunos = alunos.order_by(f"-{ordenar_por}")
                else:
                    if ordenar_por == "risco":
                        alunos = alunos.order_by("probabilidade_evasao")
                    else:
                        alunos = alunos.order_by(ordenar_por)

        paginator = AlunoPagination()
        page = paginator.paginate_queryset(alunos, request)

        serializer = AlunoSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = AlunoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def put(self, request, pk):
        aluno = get_object_or_404(Aluno, pk=pk)
        serializer = AlunoSerializer(aluno, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def delete(self, request, pk):
        aluno = get_object_or_404(Aluno, pk=pk)
        aluno.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class PassageiroAPIView(APIView): 
    def get(self, request, pk=None):
        if pk:
            passageiro = get_object_or_404(Passageiro, pk=pk)
            serializer = PassageiroSerializer(passageiro)
            return Response(serializer.data)

        passageiros = Passageiro.objects.all()
        serializer = PassageiroSerializer(passageiros, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'error': 'Arquivo CSV não enviado'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'O arquivo precisa ser CSV'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        file_data = csv_file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(file_data))
        passageiros = []

        batch_id = str(uuid.uuid4())

        for row in reader:
            passageiros.append(
                Passageiro(
                    survived = float(row['Survived']),
                    pclass = float(row['Pclass']),
                    age = float(row['Age']),
                    sibsp = float(row['SibSp']),
                    parch = float(row['Parch']),
                    fare = float(row['Fare']),
                    sex_female = float(row['Sex_female']),
                    sex_male = float(row['Sex_male']),
                    embarked_c = float(row['Embarked_C']),
                    embarked_q = float(row['Embarked_Q']),
                    embarked_s = float(row['Embarked_S']),
                    lote_upload_id = batch_id,
                )
            )

        with transaction.atomic():
            Passageiro.objects.bulk_create(passageiros, batch_size=100)

        processar_lote_ia.delay(str(batch_id))

        return Response(
            {'message': f'{len(passageiros)} registros importados com sucesso'}, 
            status=status.HTTP_201_CREATED
        )
