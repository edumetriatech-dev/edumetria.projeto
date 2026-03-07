'use client';

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "@/app/hooks/use-toast";

const rota = process.env.NEXT_PUBLIC_API_URL;

const ListaTurmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [turmasPorPagina, setTurmasPorPagina] = useState(10);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);

  const [modalCriaTurma, setModalCriaTurma] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState(null);
  const [turmaExcluindo, setTurmaExcluindo] = useState(null);

  const [filtros, setFiltros] = useState({
    filtroAnoLetivo: "",
    filtroSerie: "",
    filtroSecao: "",
  });

  /**
   * Busca a lista de turmas.
   * @function fetchTurmas
   * @description Função assíncrona para buscar a lista de turmas da API.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Lança um erro se a resposta da API não for bem-sucedida.
   */
  const fetchTurmas = async (page = 1, filtros, turmasPorPagina = 10) => {
    try {
      const response = await fetch(
        `${rota}/api/v1/turmas?page=${page}&page_size=${turmasPorPagina}` +
          (filtros.filtroAnoLetivo && filtros.filtroAnoLetivo != "all"
            ? `&ano_letivo=${filtros.filtroAnoLetivo}`
            : "") +
          (filtros.filtroSerie && filtros.filtroSerie != "all"
            ? `&serie=${filtros.filtroSerie}`
            : "") +
          (filtros.filtroSecao && filtros.filtroSecao != "all"
            ? `&secao=${filtros.filtroSecao}`
            : ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Erro ao buscar turmas");
      const data = await response.json();
      setTurmas(data.results || []);
      setTotalTurmas(data.count);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / turmasPorPagina));
    } catch (error) {
      console.error(error);
      setTurmas([]);
      setTotalTurmas(0);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchTurmas(currentPage, filtros, turmasPorPagina);
  }, [currentPage, filtros, turmasPorPagina]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Turmas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as turmas da instituição
          </p>
        </div>
        <Button onClick={() => {return} }>
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar turma por série"
              value={filtros.filtroSerie}
              onChange={(e) => {
                setFiltros((p) => ({ ...p, filtroSerie: e.target.value}));
                setCurrentPage(1);
              }}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-foreground">
                  Ano Letivo
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Série
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Seção
                </th>
                {/* <th className="text-left p-4 font-medium text-foreground">
                  Total de Alunos
                </th> */}
                <th className="text-left p-4 font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              { (turmas || []).map((turma) => (
                <tr
                  key={turma.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium text-foreground">
                    {turma.ano_letivo}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {turma.serie}º Ano
                  </td>
                  {/* <td className="p-4 text-muted-foreground">{turma.turno}</td> */}
                  <td className="p-4 text-muted-foreground">
                    {turma.secao}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {return}}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {return}}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              { turmas.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Nenhuma turma encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Itens por página:
            </span>
            <Select
              value={turmasPorPagina.toString()}
              onValueChange={(v) => {
                setTurmasPorPagina(Number(v));
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
              {turmas.length > 0
                ? `Mostrando ${(currentPage - 1) * turmasPorPagina + 1} - ${Math.min(currentPage * turmasPorPagina, totalTurmas)} de ${totalTurmas}`
                : "0 resultados"}
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
    </div>
  );
};

export default ListaTurmas;
