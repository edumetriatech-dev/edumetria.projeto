from django.db import models

class Base(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

""" class Aluno(Base):
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
        return self.matricula """

""" class Passageiro(Base):
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
        verbose_name_plural = 'Passageiros' """


# ------------------------------------------------------------------
# Models do ELOS
# ------------------------------------------------------------------
    
class Turma(Base):
    ano_letivo = models.IntegerField() # ex: 2025
    serie = models.IntegerField() # ex: 10 (equivale ao primeiro ano do ensino médio)
    secao = models.CharField(max_length=1) # Ex: A

    disciplinas = models.ManyToManyField(
        "Disciplina",
        through="TurmaDisciplina",
        related_name="turmas"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['ano_letivo', 'serie', 'secao'],
                name='unique_turma'
            )
        ]
        verbose_name_plural = 'Turmas'

    def __str__(self):
        return f"{self.ano_letivo} - {self.serie}{self.secao}"
    

class Aluno(Base):
    nome = models.CharField(max_length=255)
    matricula = models.CharField(max_length=255, primary_key=True)
    # Colunas de controle
    lote_upload_id = models.CharField(max_length=500, null=True, blank=True) # Para saber qual CSV originou isso
    probabilidade_evasao = models.FloatField(null=True, blank=True, db_index=True) # A IA vai preencher isso depois

    turma = models.ForeignKey(
        Turma,
        on_delete=models.SET_NULL,
        null=True,
        related_name="alunos"
    )

    """ class SituacaoEvasaoChoices(models.TextChoices):
        FORMATURA = "Formatura", "Formatura"
        EVASAO = "Evasao", "Evasao" 
    situacao_evasao = models.CharField(
        null=True, 
        blank=True,
        max_length=10,
        choices=SituacaoEvasaoChoices.choices
    ) """

    class Meta:
        verbose_name_plural = 'Alunos'
        ordering = ['matricula']

    def __str__(self):
        return self.matricula

class Disciplina(Base):
    nome_disciplina = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Disciplinas'

    def __str__(self):
        return self.nome_disciplina
    

class TurmaDisciplina(Base):
    turma = models.ForeignKey(
        Turma, 
        on_delete=models.CASCADE,
    )
    disciplina = models.ForeignKey(
        Disciplina, 
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['turma', 'disciplina'],
                name='unique_turma_disciplina'
            )
        ]
        verbose_name_plural = 'TurmaDisciplina'

    def __str__(self):
        return f"{self.turma} - {self.disciplina}"
    

class Desempenho(Base):
    aluno = models.ForeignKey(
        Aluno, 
        on_delete=models.CASCADE,
        related_name="desempenhos"
    )
    turma_disciplina = models.ForeignKey(
        TurmaDisciplina, 
        on_delete=models.CASCADE,
        related_name="desempenhos"
    )

    frequencia = models.DecimalField(max_digits=5, decimal_places=2) # Ex: 0.85 (85%)
    nota = models.DecimalField(max_digits=5, decimal_places=2) #Ex: 7.5 (0 a 10)

    class SituacaoChoices(models.TextChoices):
        APROVADO = "Aprovado", "Aprovado"
        REPROVADO = "Reprovado", "Reprovado" 
    situacao = models.CharField(
        max_length=10,
        choices=SituacaoChoices.choices
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['aluno', 'turma_disciplina'],
                name='unique_aluno_turma_disciplina'
            )
        ]
        verbose_name_plural = 'Desempenhos'

    def __str__(self):
        return f"{self.aluno.nome} - {self.turma_disciplina.disciplina.nome_disciplina}"