from django.db import models

class Base(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Aluno(Base):
    nome = models.CharField(max_length=255)
    matricula = models.CharField(max_length=255, primary_key=True)
    frequencia = models.FloatField() # Ex: 0.85 (85%)
    nota_matematica = models.FloatField() #Ex: 7.5 (0 a 10)
    nota_portugues = models.FloatField() #Ex: 7.5 (0 a 10)
    
    # Colunas de controle
    lote_upload_id = models.CharField(max_length=500, null=True, blank=True) # Para saber qual CSV originou isso
    probabilidade_evasao = models.FloatField(null=True, blank=True) # A IA vai preencher isso depois

    class Meta:
        verbose_name_plural = 'Alunos'

    def __str__(self):
        return self.matricula

class Passageiro(Base):
    survived = models.FloatField()
    pclass = models.FloatField()
    age = models.FloatField()
    sibsp = models.FloatField()
    parch = models.FloatField()
    fare = models.FloatField()
    sex_female = models.FloatField()
    sex_male = models.FloatField()
    embarked_c = models.FloatField()
    embarked_q = models.FloatField()
    embarked_s = models.FloatField()
    survived_pred = models.FloatField(null=True)
    lote_upload_id = models.CharField(max_length=500) # Para saber qual CSV originou 
    
    class Meta:
        verbose_name_plural = 'Passageiros'