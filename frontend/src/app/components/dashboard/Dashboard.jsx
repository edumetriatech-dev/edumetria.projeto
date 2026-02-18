"use client";

import React, { useState, useMemo } from "react";
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

const Dashboard = () => {
  const stats = getStatistics();

  const [riskFilter, setRiskFilter] = useState("all");
  const [serieFilter, setSerieFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [modalEnviaCsv, setModalEnviaCsv] = useState(false);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesRisk =
        riskFilter === "all" || student.riskLevel === riskFilter;
      const matchesSerie =
        serieFilter === "all" || student.serie.toString() === serieFilter;
      const matchesSearch = student.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesRisk && matchesSerie && matchesSearch;
    });
  }, [riskFilter, serieFilter, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

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
            <Select value={riskFilter} onValueChange={setRiskFilter}>
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
            <Select value={serieFilter} onValueChange={setSerieFilter}>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  ID do Aluno
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Série
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
                  Taxa de Faltas
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium text-foreground">
                    {student.id}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {student.serie}º Ano
                  </td>
                  <td className="p-4">
                    <RiskBadge level={student.riskLevel} />
                  </td>
                  <td className="p-4">
                    <ProgressBar
                      value={student.probability}
                      level={student.riskLevel}
                    />
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {student.averageGrade.toFixed(1)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {student.absenceRate.toFixed(1)}%
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(student)}
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
              value={itemsPerPage.toString()}
              onValueChange={(v) => {
                setItemsPerPage(Number(v));
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
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} de{" "}
              {filteredStudents.length}
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
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes do Aluno</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedStudent.id}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedStudent.serie}º Ano
                  </p>
                </div>
                <RiskBadge level={selectedStudent.riskLevel} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Probabilidade de Evasão
                  </p>
                  <ProgressBar
                    value={selectedStudent.probability}
                    level={selectedStudent.riskLevel}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Média de Notas
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedStudent.averageGrade.toFixed(1)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Taxa de Faltas
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedStudent.absenceRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
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
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-2">
                  Recomendações
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {selectedStudent.riskLevel === "alto" && (
                    <>
                      <li>• Agendar reunião com responsáveis imediatamente</li>
                      <li>• Avaliar necessidade de apoio psicopedagógico</li>
                      <li>• Monitorar frequência semanalmente</li>
                    </>
                  )}
                  {selectedStudent.riskLevel === "medio" && (
                    <>
                      <li>• Contatar responsáveis para acompanhamento</li>
                      <li>
                        • Oferecer reforço escolar nas disciplinas críticas
                      </li>
                      <li>• Monitorar frequência quinzenalmente</li>
                    </>
                  )}
                  {selectedStudent.riskLevel === "baixo" && (
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
