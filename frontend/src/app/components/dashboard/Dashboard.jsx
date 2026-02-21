"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus,
  Upload,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
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
import KPICard from "@/app/components/KPICard";
import RiskBadge from "@/app/components/RiskBadge";
import ProgressBar from "@/app/components/ProgressBar";
import { mockStudents, getStatistics } from "@/app/(public)/data/mockStudents";
import EnviaCSV from "@/app/components/EnviaCSV";
import { toast } from "@/app/hooks/use-toast";

const rota = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const [alunos, setAlunos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [alunosPorPagina, setAlunosPorPagina] = useState(10);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

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
      console.log(data);
      setAlunos(data.results);
      setTotalAlunos(data.count);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / alunosPorPagina));
    } catch (error) {
      console.error(error);
      setAlunos([]);
      setTotalAlunos(0);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchAlunos(currentPage, filtros, alunosPorPagina);
  }, [currentPage, filtros, alunosPorPagina]);

  const stats = getStatistics();

  const [modalEnviaCsv, setModalEnviaCsv] = useState(false);

  const chartData = [
    { name: "Alto Risco", value: stats.highRisk, color: "hsl(0, 84%, 60%)" },
    {
      name: "Médio Risco",
      value: stats.mediumRisk,
      color: "hsl(38, 92%, 50%)",
    },
    { name: "Baixo Risco", value: stats.lowRisk, color: "hsl(160, 84%, 39%)" },
  ];

  const topRiskStudents = mockStudents.slice(0, 5);

  // Componente auxiliar para ícones de tendência
  const TrendIcon = ({ trend }) => {
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-risk-high" />;
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-risk-low" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard de Resultados
          </h1>
          <p className="text-muted-foreground">
            Análise de risco de evasão • Última atualização:{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-3">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={Users}
          title="Total de Alunos"
          value={stats.total}
          subtitle="analisados"
          variant="default"
        />
        <KPICard
          icon={AlertTriangle}
          title="Risco Alto"
          value={stats.highRisk}
          subtitle={`alunos (${stats.highRiskPercent}%)`}
          variant="high"
        />
        <KPICard
          icon={AlertCircle}
          title="Risco Médio"
          value={stats.mediumRisk}
          subtitle={`alunos (${stats.mediumRiskPercent}%)`}
          variant="medium"
        />
        <KPICard
          icon={CheckCircle}
          title="Risco Baixo"
          value={stats.lowRisk}
          subtitle={`alunos (${stats.lowRiskPercent}%)`}
          variant="low"
        />
      </div>

      {/* Charts and Priority Section */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Distribuição de Risco
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Prioridades de Intervenção
          </h2>
          <div className="space-y-4">
            {topRiskStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-foreground">
                      {student.id}
                    </span>
                    <RiskBadge level={student.riskLevel} />
                    <TrendIcon trend={student.trend} />
                  </div>
                  <ProgressBar
                    value={student.probability}
                    level={student.riskLevel}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(student)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Detalhes
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full List */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Lista Completa de Alunos
          </h2>
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
                <SelectItem value="6">6º Ano</SelectItem>
                <SelectItem value="7">7º Ano</SelectItem>
                <SelectItem value="8">8º Ano</SelectItem>
                <SelectItem value="9">9º Ano</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID do aluno"
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
                  <td className="p-4 text-muted-foreground">
                    {aluno.matricula}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {aluno.turma_info}
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
                      value={aluno.probabilidade_evasao}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                disabled={currentPage === totalPages}
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
                    {alunoSelecionado.turma_info}
                  </p>
                </div>
                <RiskBadge level={alunoSelecionado.probabilidade_evasao > 0.69
                          ? "alto"
                          : alunoSelecionado.probabilidade_evasao > 0.39
                            ? "medio"
                            : "baixo"} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Probabilidade de Evasão
                  </p>
                  <ProgressBar
                    value={alunoSelecionado.probabilidade_evasao}
                    level={alunoSelecionado.probabilidade_evasao > 0.69
                          ? "alto"
                          : alunoSelecionado.probabilidade_evasao > 0.39
                            ? "medio"
                            : "baixo"}
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

      <EnviaCSV
        isUploadOpen={modalEnviaCsv}
        setIsUploadOpen={(open) => setModalEnviaCsv(open)}
        onUpload={() => {
          setModalEnviaCsv(false);
          toast({
            title: "Sucesso",
            description: "Arquivo enviado com sucesso!",
          });
        }}
      />
    </div>
  );
};

export default Dashboard;
