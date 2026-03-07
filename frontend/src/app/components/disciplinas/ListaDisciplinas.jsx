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

const ListaDisciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDisciplinas, setTotalDisciplinas] = useState(0);
  const [disciplinasPorPagina, setDisciplinasPorPagina] = useState(10);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

  const [modalCriaDisciplina, setModalCriaDisciplina] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [disciplinaExcluindo, setDisciplinaExcluindo] = useState(null);

  const [filtros, setFiltros] = useState({
    filtroNomeDisciplina: "",
  });

  /**
   * Busca a lista de disciplinas.
   * @function fetchDisciplinas
   * @description Função assíncrona para buscar a lista de disciplinas da API.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Lança um erro se a resposta da API não for bem-sucedida.
   */
  const fetchDisciplinas = async (page = 1, filtros, disciplinasPorPagina = 10) => {
    try {
      const response = await fetch(
        `${rota}/api/v1/disciplinas?page=${page}&page_size=${disciplinasPorPagina}` +
          (filtros.filtroNomeDisciplina
            ? `&nome_disciplina=${filtros.filtroNomeDisciplina}`
            : ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Erro ao buscar disciplinas");
      const data = await response.json();
      setDisciplinas(data.results || []);
      setTotalDisciplinas(data.count);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / disciplinasPorPagina));
    } catch (error) {
      console.error(error);
      setDisciplinas([]);
      setTotalDisciplinas(0);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchDisciplinas(currentPage, filtros, disciplinasPorPagina);
  }, [currentPage, filtros, disciplinasPorPagina]);

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
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Disciplinas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as disciplinas da instituição
          </p>
        </div>
        <Button onClick={() => {return} }>
          <Plus className="h-4 w-4 mr-2" />
          Nova Disciplina
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar disciplina por nome"
              value={filtros.filtroNomeDisciplina}
              onChange={(e) => {
                setFiltros((p) => ({ ...p, disciplinas: e.target.value}));
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
                  Nome
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              { (disciplinas || []).map((disciplina) => (
                <tr
                  key={disciplina.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium text-foreground">
                    {formataDisciplina(disciplina.nome_disciplina)}
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
              { disciplinas.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Nenhuma disciplina encontrada.
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
              value={disciplinasPorPagina.toString()}
              onValueChange={(v) => {
                setDisciplinasPorPagina(Number(v));
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
              {disciplinas.length > 0
                ? `Mostrando ${(currentPage - 1) * disciplinasPorPagina + 1} - ${Math.min(currentPage * disciplinasPorPagina, totalDisciplinas)} de ${totalDisciplinas}`
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

export default ListaDisciplinas;
