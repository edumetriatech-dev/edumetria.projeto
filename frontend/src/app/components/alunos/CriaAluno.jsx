import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

const rota = process.env.NEXT_PUBLIC_API_URL;

const CriaAluno = ({ open, onOpenChange, onCreate }) => {
  //aluno => matricula, turma{ano_letivo, serie, secao}, Disciplina e suas médias de notas e frequencias e situacao_disciplina

  const [formData, setFormData] = useState({
    matricula: "",
    turma_id: "",
    disciplinas: [],
  });

  const [turmas, setTurmas] = useState([]);

  const fetchTurmas = async () => {
    try {
      const response = await fetch(`${rota}/api/v1/turmas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar turmas");

      const data = await response.json();
      setTurmas(data.results);
      setFormData(p => ({ ...p, turma_id: data.results[0].id}));
      fetchDisciplinas(data.results[0].id);
    } catch {
      throw new Error("Erro ao buscar turmas");
    }
  };

  const fetchDisciplinas = async (turmaId) => {
    try {
      const response = await fetch(
        `${rota}/api/v1/disciplinas?turma_id=${turmaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Erro ao buscar disciplinas");

      const data = await response.json();
      
      setFormData((p) => ({
        ...p,
        disciplinas: data.results.map(({ id, nome_disciplina }) => ({
          nome_disciplina,
          turma_disciplina_id: id,
          nota_media: 0,
          frequencia_media: 0,
          situacao_disciplina: "aprovado",
        })),
      }));
    } catch {
      throw new Error("Erro ao buscar disciplinas");
    }
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  const handleTurmaChange = async (novaTurmaId) => {
    setFormData((p) => ({ ...p, turma_id: novaTurmaId }));

    try {
      const response = await fetch(
        `${rota}/api/v1/disciplinas?turma_id=${formData.turma_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Erro ao buscar disciplinas");

      const data = await response.json();

      setFormData((p) => ({
        ...p,
        disciplinas: data.map(({ id, nome_disciplina }) => ({
          nome_disciplina,
          turma_disciplina_id: id,
          nota_media: 0,
          frequencia_media: 0,
          situacao_disciplina: "aprovado",
        })),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateDisciplina = (index, campo, valor) => {
    setFormData((p) => {
      const updated = [...(p.disciplinas || [])];
      updated[index] = { ...updated[index], [campo]: valor };
      return { ...p, disciplinas: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${rota}/api/v1/alunos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao criar aluno.");

      const data = await response.json();
      onCreate();
    } catch {
      throw new Error("Erro ao criar aluno.");
    }
  };

  const formataDisciplina = (nomeDisciplina) => {
    switch(nomeDisciplina){
      case 'portugues':
        return 'Português';
      case 'matematica':
        return 'Matemática';
      case 'historia':
        return 'História';
      case 'geografia':
        return 'Geografia';
      case 'fisica':
        return 'Física';
      case 'quimica':
        return 'Química';
      case 'biologia':
        return 'Biologia';
      case 'ingles':
        return 'Inglês';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
      <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Aluno</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Matrícula</Label>
            <Input
              type="text"
              value={formData.matricula}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  matricula: e.target.value,
                }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Turma</Label>
            <Select value={formData.turma_id} onValueChange={handleTurmaChange}>
              <SelectTrigger className="mt-1 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {turmas.length > 0 ? (
                  <>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.ano_letivo} - {turma.serie}º {turma.secao}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <SelectItem value="none" disabled>
                    Nenhuma turma encontrada.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Disciplinas Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Disciplinas</Label>
            </div>

            {(formData.disciplinas || []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma disciplina encontrada.
              </p>
            )}

            <div className="space-y-3">
              {(formData.disciplinas || []).map((disc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/50 rounded-lg border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Label>{formataDisciplina(disc.nome_disciplina)}</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Nota Média</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={10}
                        value={disc.nota}
                        onChange={(e) =>
                          updateDisciplina(idx, "nota", Number(e.target.value))
                        }
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Frequência Média(%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        value={disc.frequencia}
                        onChange={(e) =>
                          updateDisciplina(
                            idx,
                            "frequencia",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Situação</Label>
                      <Select
                        value={disc.situacao_disciplina}
                        onValueChange={(v) =>
                          updateDisciplina(idx, "situacao_disciplina", v)
                        }
                      >
                        <SelectTrigger className="mt-1 h-8 text-sm bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="aprovado">Aprovado</SelectItem>
                          <SelectItem value="reprovado">Reprovado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Criar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CriaAluno;
