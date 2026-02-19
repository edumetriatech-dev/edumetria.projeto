from celery import shared_task
from .models import Aluno
from .serializers import AlunoSerializer
import pandas as pd
import joblib
from sklearn.metrics import accuracy_score
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

@shared_task(bind=True)
def processar_lote_ia(self, lote_id):
    # 1. Buscar no banco APENAS os dados desse lote novo
    passageiros = Aluno.objects.filter(lote_upload_id=lote_id)

    if not passageiros.exists():
        return "Nenhum dado encontrado."

    # 2. Transformar em Dataframe
    df_passageiros = pd.DataFrame.from_records(passageiros.values())

    df_passageiros.rename(columns={
        'survived': 'Survived',
        'pclass': 'Pclass',
        'age': 'Age',
        'sibsp': 'SibSp',
        'parch': 'Parch',
        'fare': 'Fare',
        'sex_female': 'Sex_female', 
        'sex_male': 'Sex_male',
        'embarked_c': 'Embarked_C',
        'embarked_q': 'Embarked_Q',
        'embarked_s': 'Embarked_S'
    }, inplace=True)

    # 3. Preparar dados (remover colunas que a IA não usa, como ID ou Nome)
    features = df_passageiros[['Pclass', 'Age', 'SibSp', 'Parch', 'Fare', 'Sex_female', 'Sex_male', 'Embarked_C', 'Embarked_Q', 'Embarked_S']]

    # 4. Carregar modelo IA e Prever
    modelo_path = os.path.join(settings.BASE_DIR, '..', 'modelos', 'modelo_titanic_k5.pkl')
    modelo = joblib.load(modelo_path)
    #survived_preds = modelo.predict(features) #acho que é .series
    survived_preds = modelo.predict_proba(features)[:,1] #acho que é .series

    # 6. Atualizar o Banco de Dados com as previsões
    for i, survived_pred in enumerate(survived_preds):
        passageiro = get_object_or_404(Passageiro, pk=df_passageiros.iloc[i]['id'])
        # 6.1 UPDATE Passageiro SET survived_pred = survived_pred WHERE id = passageiro_id
        serializer = PassageiroSerializer(
            passageiro, 
            data={"survived_pred": survived_pred},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()

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