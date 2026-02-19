from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Aluno, Turma, Disciplina, AlunoTurma, TurmaDisciplina, Desempenho
from .serializers import AlunoSerializer, TurmaSerializer, DisciplinaSerializer, AlunoTurmaSerializer, TurmaDisciplinaSerializer, DesempenhoSerializer
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
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'error': 'Arquivo CSV não enviado'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'O arquivo precisa ser CSV'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        file_data = csv_file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(file_data))
        rows = list(reader)

        # ------------------------------------
        # ENTIDADES PRINCIPAIS
        # ------------------------------------
        alunos_cache = {}
        turmas_cache = {}
        disciplinas_cache = {}

        alunos_para_criar = []
        turmas_para_criar = []
        disciplinas_para_criar = []

        batch_id = str(uuid.uuid4())

        for row in rows:
            matricula = row["matricula"]
            if matricula not in alunos_cache:
                aluno = Aluno(
                    matricula=matricula,
                    nome=row["nome"],
                    lote_upload_id = batch_id
                )
                alunos_para_criar.append(aluno)
                alunos_cache[matricula] = aluno

            turma_key = (
                row["ano_letivo"],
                row["serie"],
                row["secao"]
            )

            if turma_key not in turmas_cache:
                turma = Turma(
                    ano_letivo=row["ano_letivo"],
                    serie=row["serie"],
                    secao=row["secao"]
                )
                turmas_para_criar.append(turma)
                turmas_cache[turma_key] = turma


            disciplina_nome = row["disciplina"]
            if disciplina_nome not in disciplinas_cache:
                disciplina = Disciplina(
                    nome_disciplina=disciplina_nome
                )
                disciplinas_para_criar.append(disciplina)
                disciplinas_cache[disciplina_nome] = disciplina

        with transaction.atomic():
            Aluno.objects.bulk_create(alunos_para_criar, ignore_conflicts=True, batch_size=1000)
            Turma.objects.bulk_create(turmas_para_criar, ignore_conflicts=True, batch_size=1000)
            Disciplina.objects.bulk_create(disciplinas_para_criar, ignore_conflicts=True, batch_size=1000)

        # ------------------------------------
        # TABELAS INTERMEDIÁRIAS
        # Buscar já persistidos no banco
        # ------------------------------------

        aluno_turma_cache = {}
        turma_disciplina_cache = {}

        aluno_turma_para_criar = []
        turma_disciplina_para_criar = []

        alunos_db = {
            a.matricula: a
            for a in Aluno.objects.only("matricula", "nome")
        }

        turmas_db = {
            (t.ano_letivo, t.serie, t.secao): t
            for t in Turma.objects.only("id", "ano_letivo", "serie", "secao")
        }

        disciplinas_db = {
            d.nome_disciplina: d
            for d in Disciplina.objects.only("nome_disciplina")
        }

        for row in rows:

            matricula = row["matricula"]
            turma_key = (
                int(row["ano_letivo"]),
                int(row["serie"]),
                row["secao"]
            )
            disciplina_nome = row["disciplina"]

            aluno = alunos_db[matricula]
            turma = turmas_db[turma_key]
            disciplina = disciplinas_db[disciplina_nome]

            # ALUNO_TURMA
            at_key = (aluno.matricula, turma.id)

            if at_key not in aluno_turma_cache:
                at = AlunoTurma(
                    aluno=aluno,
                    turma=turma
                )
                aluno_turma_para_criar.append(at)
                aluno_turma_cache[at_key] = at

            # TURMA_DISCIPLINA
            td_key = (turma.id, disciplina.nome_disciplina)

            if td_key not in turma_disciplina_cache:
                td = TurmaDisciplina(
                    turma=turma,
                    disciplina=disciplina
                )
                turma_disciplina_para_criar.append(td)
                turma_disciplina_cache[td_key] = td


        AlunoTurma.objects.bulk_create(
            aluno_turma_para_criar,
            ignore_conflicts=True,
            batch_size=1000
        )

        TurmaDisciplina.objects.bulk_create(
            turma_disciplina_para_criar,
            ignore_conflicts=True,
            batch_size=1000
        )

        # ------------------------------------
        # CRIAR DESEMPENHO
        # ------------------------------------

        desempenhos_para_criar = []

        aluno_turma_db = {
            (at.aluno.matricula, at.turma.id): at
            for at in AlunoTurma.objects.select_related("aluno", "turma")
        }

        turma_disciplina_db = {
            (td.turma.id, td.disciplina.nome_disciplina): td
            for td in TurmaDisciplina.objects.select_related("turma", "disciplina")
        }

        for row in rows:
            matricula = row["matricula"]
            turma_key = (
                int(row["ano_letivo"]),
                int(row["serie"]),
                row["secao"]
            )
            disciplina_nome = row["disciplina"]

            at = aluno_turma_db[(matricula, turmas_db[turma_key].id)]
            td = turma_disciplina_db[(turmas_db[turma_key].id, disciplina_nome)]

            desempenho = Desempenho(
                aluno_turma=at,
                turma_disciplina=td,
                nota=float(row["nota"]),
                frequencia=float(row["frequencia"]),
                situacao=row["situacao_disciplina"]
            )

            desempenhos_para_criar.append(desempenho)

        Desempenho.objects.bulk_create(
            desempenhos_para_criar,
            ignore_conflicts=True,
            batch_size=1000
        )

        #processar_lote_ia.delay(str(batch_id))

        return Response(
            {'message': f'Registros importados com sucesso'}, 
            status=status.HTTP_201_CREATED
        )

    
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
    

""" class PassageiroAPIView(APIView): 
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
        ) """
