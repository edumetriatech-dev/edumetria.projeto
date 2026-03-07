"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Search,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
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
import RiskBadge from "@/app/components/RiskBadge";
import ProgressBar from "@/app/components/ProgressBar";
import EnviaCSV from "@/app/components/EnviaCSV";
import { toast } from "@/app/hooks/use-toast";
import CriaAluno from "@/app/components/alunos/CriaAluno";
import EditaAluno from "@/app/components/alunos/EditaAluno";
import ExcluiAluno from "@/app/components/alunos/ExcluiAluno";

const rota = process.env.NEXT_PUBLIC_API_URL;

const TrendIcon = (trend) => {
  if (trend === "down")
    return <TrendingDown className="h-4 w-4 text-risk-high" />;
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-risk-low" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [alunosPorPagina, setAlunosPorPagina] = useState(10);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  const [modalCriaAluno, setModalCriaAluno] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoExcluindo, setAlunoExcluindo] = useState(null);
  const [modalEnviaCsv, setModalEnviaCsv] = useState(false);

  const [filtros, setFiltros] = useState({
    filtroNome: "",
    filtroMatricula: "",
    filtroNota: 0,
    filtroFrequencia: 0,
    filtroRisco: "",
    filtroSerie: "",
  });

  /**
   * Busca a lista de alunos.
   * @function fetchAlunos
   * @description Função assíncrona para buscar a lista de alunos da API.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Lança um erro se a resposta da API não for bem-sucedida.
   */
  const fetchAlunos = async (page = 1, filtros, alunosPorPagina = 10) => {
    try {
      const response = await fetch(
        `${rota}/api/v1/alunos?page=${page}&page_size=${alunosPorPagina}` +
          (filtros.filtroMatricula
            ? `&matricula=${filtros.filtroMatricula}`
            : "") +
          (filtros.filtroRisco && filtros.filtroRisco != "all"
            ? `&risco=${filtros.filtroRisco}`
            : "") +
          (filtros.filtroSerie && filtros.filtroSerie != "all"
            ? `&serie=${filtros.filtroSerie}`
            : ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Erro ao buscar alunos");
      const data = await response.json();
      setAlunos(data.results);
      setHasPreviousPage(!!data.previous);
      setHasNextPage(!!data.next);
      setTotalAlunos(data.count);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / alunosPorPagina));
    } catch {
      setAlunos([]);
      setTotalAlunos(0);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchAlunos(currentPage, filtros, alunosPorPagina);
  }, [currentPage, filtros, alunosPorPagina]);

  //const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Alunos
          </h1>
          <p className="text-muted-foreground">
            Lista completa de alunos analisados
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setModalCriaAluno(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalEnviaCsv(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Enviar CSV
          </Button>
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={filtros.filtroRisco}
              onValueChange={(v) => {
                setFiltros((prev) => ({ ...prev, filtroRisco: v }));
              }}
            >
              <SelectTrigger className="w-full md:w-48 bg-background">
                <SelectValue placeholder="Filtrar por Risco" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os Riscos</SelectItem>
                <SelectItem value="alto">Risco Alto</SelectItem>
                <SelectItem value="medio">Risco Médio</SelectItem>
                <SelectItem value="baixo">Risco Baixo</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filtros.filtroSerie}
              onValueChange={(v) => {
                setFiltros((prev) => ({ ...prev, filtroSerie: v }));
              }}
            >
              <SelectTrigger className="w-full md:w-48 bg-background">
                <SelectValue placeholder="Filtrar por Série" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas as Séries</SelectItem>
                <SelectItem value="10">1º EM</SelectItem>
                <SelectItem value="11">2º EM</SelectItem>
                <SelectItem value="12">3º EM</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por matrícula do aluno"
                value={filtros.filtroMatricula}
                onChange={(e) => {
                  setFiltros((prev) => ({
                    ...prev,
                    filtroMatricula: e.target.value,
                  }));
                }}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {/* <th className="text-left p-4 font-medium text-foreground">
                  Nome
                </th> */}
                <th className="text-left p-4 font-medium text-foreground">
                  Matrícula
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Turma
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Nível de Risco
                </th>
                <th className="text-left p-4 font-medium text-foreground min-w-[200px]">
                  Probabilidade
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Média de Notas
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Frequência Média
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr
                  key={aluno.matricula}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {/* <td className="p-4 font-medium text-foreground">
                    {aluno.nome}
                  </td> */}
                  <td className="p-4 text-muted-foreground">
                    {aluno.matricula}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {aluno.turma.ano_letivo} - {aluno.turma.serie}º {aluno.turma.secao}
                  </td>
                  <td className="p-4">
                    <RiskBadge
                      level={
                        aluno.probabilidade_evasao > 0.69
                          ? "alto"
                          : aluno.probabilidade_evasao > 0.39
                            ? "medio"
                            : "baixo"
                      }
                    />
                  </td>
                  <td className="p-4">
                    <ProgressBar
                      value={(aluno.probabilidade_evasao * 100).toFixed(0)}
                      level={
                        aluno.probabilidade_evasao > 0.69
                          ? "alto"
                          : aluno.probabilidade_evasao > 0.39
                            ? "medio"
                            : "baixo"
                      }
                    />
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {aluno.nota_media}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {(aluno.frequencia_media * 100).toFixed(0)}%
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAlunoSelecionado(aluno)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAlunoEditando(aluno)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAlunoExcluindo(aluno)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Itens por página:
            </span>
            <Select
              value={alunosPorPagina.toString()}
              onValueChange={(v) => {
                setAlunosPorPagina(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * alunosPorPagina + 1} -{" "}
              {Math.min(currentPage * alunosPorPagina, totalAlunos)} de{" "}
              {totalAlunos}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Dialog
        open={!!alunoSelecionado}
        onOpenChange={() => setAlunoSelecionado(null)}
      >
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes do Aluno</DialogTitle>
          </DialogHeader>
          {alunoSelecionado && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {alunoSelecionado.matricula}
                  </p>
                  <p className="text-muted-foreground">
                    {alunoSelecionado.turma.ano_letivo} - {alunoSelecionado.turma.serie}º{alunoSelecionado.turma.secao}
                  </p>
                </div>
                <RiskBadge
                  level={
                    alunoSelecionado.probabilidade_evasao > 0.69
                      ? "alto"
                      : alunoSelecionado.probabilidade_evasao > 0.39
                        ? "medio"
                        : "baixo"
                  }
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Probabilidade de Evasão
                  </p>
                  <ProgressBar
                    value={(
                      alunoSelecionado.probabilidade_evasao * 100
                    ).toFixed(0)}
                    level={
                      alunoSelecionado.probabilidade_evasao > 0.69
                        ? "alto"
                        : alunoSelecionado.probabilidade_evasao > 0.39
                          ? "medio"
                          : "baixo"
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Média de Notas
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {alunoSelecionado.nota_media}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Frequência Média
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {(alunoSelecionado.frequencia_media * 100).toFixed(0)}%
                    </p>
                  </div>
                  {/* <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total de Faltas
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedStudent.totalAbsences}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tendência</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendIcon trend={selectedStudent.trend} />
                      <span className="text-lg font-medium text-foreground capitalize">
                        {selectedStudent.trend === "down"
                          ? "Piora"
                          : selectedStudent.trend === "up"
                            ? "Melhora"
                            : "Estável"}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-2">
                  Recomendações
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {alunoSelecionado.probabilidade_evasao > 0.69 && (
                    <>
                      <li>• Agendar reunião com responsáveis imediatamente</li>
                      <li>• Avaliar necessidade de apoio psicopedagógico</li>
                      <li>• Monitorar frequência semanalmente</li>
                    </>
                  )}
                  {alunoSelecionado.probabilidade_evasao > 0.39 && (
                    <>
                      <li>• Contatar responsáveis para acompanhamento</li>
                      <li>
                        • Oferecer reforço escolar nas disciplinas críticas
                      </li>
                      <li>• Monitorar frequência quinzenalmente</li>
                    </>
                  )}
                  {alunoSelecionado.probabilidade_evasao <= 0.39 && (
                    <>
                      <li>• Manter acompanhamento regular</li>
                      <li>
                        • Incentivar participação em atividades
                        extracurriculares
                      </li>
                      <li>• Monitorar frequência mensalmente</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {modalEnviaCsv && (
        <EnviaCSV
          open={modalEnviaCsv}
          onOpenChange={(isOpen) => setModalEnviaCsv(isOpen)}
          onUpload={() => {
            setModalEnviaCsv(false);
            toast({
              title: "Sucesso",
              description: "Arquivo enviado com sucesso!",
            });
            fetchAlunos(1, filtros, alunosPorPagina);
          }}
        />
      )}

      {modalCriaAluno && (
        <CriaAluno 
          open={modalCriaAluno}
          onOpenChange={(isOpen) => setModalCriaAluno(isOpen)}
          onCreate={() => {
            setModalCriaAluno(false);
            toast({
              title: "Sucesso",
              description: "Aluno cadastrado com sucesso!",
            });
            fetchAlunos(currentPage, filtros, alunosPorPagina);
          }}
        />
      )}

      {alunoEditando && (
        <EditaAluno
          setAluno={(open) => setAlunoEditando(open)}
          aluno={alunoEditando}
          onSave={() => {
            setAlunoEditando(null);
            toast({
              title: "Sucesso",
              description: "Aluno editado com sucesso!",
            });
            fetchAlunos(currentPage, filtros, alunosPorPagina);
          }}
          onClose={() => setAlunoEditando(null)}
        />
      )}

      {alunoExcluindo && (
        <ExcluiAluno
          setAluno={(open) => setAlunoExcluindo(open)}
          aluno={alunoExcluindo}
          onDelete={() => {
            setAlunoExcluindo(null);
            toast({
              title: "Sucesso",
              description: "Aluno excluído com sucesso!",
            });
            fetchAlunos(currentPage, filtros, alunosPorPagina);
          }}
        />
      )}

    </div>
  );
};

export default Alunos;
