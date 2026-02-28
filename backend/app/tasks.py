from celery import shared_task
from .models import Aluno, Desempenho
from .serializers import AlunoSerializer
import pandas as pd
import joblib
from sklearn.metrics import accuracy_score
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db.models import F
import os

@shared_task(bind=True)
def processar_lote_ia(self, lote_id):
    # 1. Buscar no banco APENAS os dados desse lote novo
    queryset = (
        Desempenho.objects
        .filter(aluno__lote_upload_id=lote_id)
        .select_related(
            "aluno",
            "turma_disciplina__turma",
            "turma_disciplina__disciplina",
        )
        .values(
            "nota",
            "frequencia",
            nome=F("aluno__nome"),
            matricula=F("aluno__matricula"),
            ano_letivo=F("aluno__turma__ano_letivo"),
            serie=F("aluno__turma__serie"),
            secao=F("aluno__turma__secao"),
            disciplina=F("turma_disciplina__disciplina__nome_disciplina"),
            situacao_disciplina=F("situacao"),
        )
    )

    if not queryset.exists():
        return "Nenhum dado encontrado."

    # -------------------------------------------------------------
    # Transformar em Dataframe
    # -------------------------------------------------------------
    df = pd.DataFrame(list(queryset))

    # -------------------------------------------------------------
    # TRATAR DADOS
    # -------------------------------------------------------------

    # Transforma situacao_disciplina para binario
    df["situacao_disciplina"] = df["situacao_disciplina"].map({
        "Aprovado": 1,
        "Reprovado": 0
    })

    # transformar dados ligados a disciplina para formato wide (agregado por aluno)
    df = df.pivot_table(
        index=["matricula"],
        columns="disciplina",
        values=["nota","frequencia", "situacao_disciplina"],
        aggfunc="first"
    )

    df.columns = [f"{col[0].replace('situacao_disciplina','situacao')}_{str(col[1]).lower()}" for col in df.columns]
    df = df.reset_index()


    # retira colunas que não são necessárias
    matriculas = df['matricula'].copy() # faz uma cópia para manter matrícula
    df.drop(columns=['matricula'], inplace=True)

    # One-hot encoding
    #df = pd.get_dummies(df, columns=['serie', 'secao'])

    # -------------------------------------------------------------
    # Carregar modelo IA e Prever
    # -------------------------------------------------------------
    modelo_path = os.path.join(settings.BASE_DIR, '..', 'modelos', 'modelo_aluno_escola_2025.pkl')
    artefato = joblib.load(modelo_path)
    modelo = artefato['model']
    features_treino = artefato['features']

    # adiciona colunas que existiam no treino mas não existem agora
    for col in features_treino:
        if col not in df.columns:
            df[col] = 0

    # mantém apenas colunas usadas no treino e na ordem correta
    df = df[features_treino]

    """ pd.set_option("display.max_rows", None)
    pd.set_option("display.max_columns", None)
    pd.set_option("display.width", None)
    pd.set_option("display.max_colwidth", None)
    print(df) """
    #evasao_preds = modelo.predict(features) #acho que é .series
    evasao_preds = modelo.predict_proba(df)[:,1] #acho que é .series

    resultado = pd.DataFrame({
        "matricula": matriculas,
        "probabilidade_evasao": evasao_preds
    })  

    # -------------------------------------------------------------
    # Atualizar o Banco de Dados com as previsões
    # -------------------------------------------------------------
    alunos_dict = {
        aluno.matricula: aluno
        for aluno in Aluno.objects.filter(
            matricula__in=resultado["matricula"]
        )
    }

    for _, row in resultado.iterrows():
        aluno = alunos_dict.get(row["matricula"])
        if aluno:
            aluno.probabilidade_evasao = row["probabilidade_evasao"]

    Aluno.objects.bulk_update(alunos_dict.values(), ["probabilidade_evasao"])

    return f"Lote {lote_id} processado com sucesso."





""" passageiro = get_object_or_404(Passageiro, pk=df_passageiros.iloc[i]['id'])
        # 6.1 UPDATE Passageiro SET survived_pred = survived_pred WHERE id = passageiro_id
        serializer = PassageiroSerializer(
            passageiro, 
            data={"survived_pred": survived_pred},
            partial=True
        )
        if serializer.is_valid():
            serializer.save() """


""" # 5. Targets de validação
    survived_val = df_passageiros['Survived'] #acho que é series """

"""  # 7. Calcula acurácia
    acc = sklearn.metrics.accuracy_score(survived_val, survived_preds)
    print(f'Acurácia: {acc}')    """