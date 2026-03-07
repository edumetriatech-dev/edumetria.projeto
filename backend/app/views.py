from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Aluno, Turma, Disciplina, TurmaDisciplina, Desempenho
from .serializers import AlunoSerializer, TurmaSerializer, DisciplinaSerializer, TurmaDisciplinaSerializer, DesempenhoSerializer
from .pagination import AlunoPagination, TurmaPagination, DisciplinaPagination, TurmaDisciplinaPagination
from django.shortcuts import get_object_or_404
import csv
import io
import uuid
from django.db import transaction
from django.db.models import Avg, Case, When, Value, IntegerField
from .tasks import processar_lote_ia

class TurmaAPIView(APIView):
    def get(self, request, pk=None):
        turmas = Turma.objects.all()

        paginator = TurmaPagination()
        page = paginator.paginate_queryset(turmas, request)

        serializer = TurmaSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)

        return response
    
class DisciplinaAPIView(APIView):
    def get(self, request, pk=None):

        # filtro
        turma_id = request.query_params.get("turma_id")
        if turma_id:
            relacoes = TurmaDisciplina.objects.filter(turma_id=turma_id)

            paginator = TurmaDisciplinaPagination()
            page = paginator.paginate_queryset(relacoes, request)

            serializer = TurmaDisciplinaSerializer(page, many=True)
            response = paginator.get_paginated_response(serializer.data)

            return response
        
        disciplinas = Disciplina.objects.all()

        paginator = DisciplinaPagination()
        page = paginator.paginate_queryset(disciplinas, request)

        serializer = DisciplinaSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)

        return response

class AlunoAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            aluno = get_object_or_404(
                Aluno.objects.annotate(
                    nota_media=Avg('desempenhos__nota'),
                    frequencia_media=Avg('desempenhos__frequencia')
                ), 
                pk=pk
            )

            serializer = AlunoSerializer(aluno)
            return Response(serializer.data)

        alunos = Aluno.objects.all()

        # Pegando os filtros da URL
        matricula = request.query_params.get("matricula")
        risco = request.query_params.get("risco")
        serie = request.query_params.get("serie")

        # Aplicando os filtros se existirem

        if matricula:
            alunos = alunos.filter(matricula__icontains=matricula)
        
        if risco:
            if(risco == 'alto'):
                alunos = alunos.filter(probabilidade_evasao__gt=0.69)
            elif(risco == 'medio'):
                alunos = alunos.filter(
                    probabilidade_evasao__gt=0.39,
                    probabilidade_evasao__lte=0.69,
                )
            elif(risco == 'baixo'):
                alunos = alunos.filter(probabilidade_evasao__lte=0.39)

        if serie:
            alunos = alunos.filter(turma__serie=serie)

        alunos = alunos.annotate(
            nota_media=Avg('desempenhos__nota'),
            frequencia_media=Avg('desempenhos__frequencia'),
        ).distinct()

        paginator = AlunoPagination()
        page = paginator.paginate_queryset(alunos, request)

        serializer = AlunoSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        
        response.data["total_risco_alto"] = Aluno.objects.filter(
            probabilidade_evasao__gt=0.69
        ).count()

        response.data["total_risco_medio"] = Aluno.objects.filter(
            probabilidade_evasao__gt=0.39,
            probabilidade_evasao__lte=0.69
        ).count()

        response.data["total_risco_baixo"] = Aluno.objects.filter(
            probabilidade_evasao__lte=0.39
        ).count()

        return response
    

    def post(self, request):
        csv_file = request.FILES.get('file')
        if not csv_file:
            data = request.data
            if not data:
                return Response({'error': 'Nenhum dado ou arquivo encontrado'})
            
            matricula=data.get("matricula")
            turma_id=data.get("turma_id")
            disciplinas=data.get("disciplinas")

            turma = Turma.objects.get(id=turma_id)

            # CRIA ALUNO e relacionamento com turma
            aluno = Aluno.objects.create(
                matricula=data.get("matricula"),                          
                turma=turma
            )

            for disc in disciplinas:
                turma_disciplina = TurmaDisciplina.objects.get(id=disc["turma_disciplina_id"])

                # CRIA RELACIONAMENTO ALUNO E TURMA E DISCIPLINA
                desempenho = Desempenho.objects.create(
                    aluno=aluno,
                    turma_disciplina=turma_disciplina,
                    frequencia=disc["frequencia_media"],
                    nota=disc["nota_media"],
                    situacao=disc["situacao_disciplina"].lower(),
                )
            
            return Response({'message': 'Aluno criado com sucesso.'}, status=status.HTTP_201_CREATED)

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
        # TABELAS INTERMEDIÁRIAS E RELAÇÃO ALUNO -- TURMA
        # Buscar já persistidos no banco
        # ------------------------------------

        turma_disciplina_cache = {}
        turma_disciplina_para_criar = []

        alunos_para_atualizar = []
        alunos_processados = set()

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

            # RELAÇÃO ALUNO -- TURMA
            if matricula not in alunos_processados:
                aluno.turma = turma
                alunos_para_atualizar.append(aluno)
                alunos_processados.add(matricula)

            # TURMA_DISCIPLINA
            td_key = (turma.id, disciplina.nome_disciplina)

            if td_key not in turma_disciplina_cache:
                td = TurmaDisciplina(
                    turma=turma,
                    disciplina=disciplina
                )
                turma_disciplina_para_criar.append(td)
                turma_disciplina_cache[td_key] = td


        Aluno.objects.bulk_update(
            alunos_para_atualizar,
            ['turma'],
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

            aluno = alunos_db[matricula]
            td = turma_disciplina_db[(turmas_db[turma_key].id, disciplina_nome)]

            desempenho = Desempenho(
                aluno=aluno,
                turma_disciplina=td,
                nota=float(row["nota"]),
                frequencia=float(row["frequencia"]),
                situacao=row["situacao_disciplina"].lower()
            )

            desempenhos_para_criar.append(desempenho)

        Desempenho.objects.bulk_create(
            desempenhos_para_criar,
            ignore_conflicts=True,
            batch_size=1000
        )

        processar_lote_ia.delay(str(batch_id))

        return Response(
            {'message': f'Registros importados com sucesso'}, 
            status=status.HTTP_201_CREATED
        )

    
    def put(self, request, pk):
        aluno = Aluno.objects.get(matricula=pk)

        data = request.data
        if not data:
            return Response({'error': 'Nenhum dado encontrado'})
        
        #matricula=data.get("matricula")
        turma_id=data.get("turma_id")
        disciplinas=data.get("disciplinas")

        turma = Turma.objects.get(id=turma_id)

        # EDITA ALUNO
        aluno.turma = turma
        aluno.save()

        for disc in disciplinas:
            turma_disciplina = TurmaDisciplina.objects.get(id=disc["turma_disciplina_id"])

            # EDITA DESEMPENHO
            desempenho = Desempenho.objects.get(
                aluno=aluno,
                turma_disciplina=turma_disciplina,
            )
            desempenho.frequencia=disc["frequencia_media"]
            desempenho.nota=disc["nota_media"]
            desempenho.situacao=disc["situacao_disciplina"]
            desempenho.save()

        """ serializer = AlunoSerializer(aluno, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save() """
        return Response({'message': 'Aluno editado com sucesso.'}, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        aluno = get_object_or_404(Aluno, pk=pk)
        aluno.delete()
        return Response({'message:', 'Aluno excluído com sucesso'}, status=status.HTTP_200_OK)
    

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
