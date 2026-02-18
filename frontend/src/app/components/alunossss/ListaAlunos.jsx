"use client";

import React, { useState, useEffect } from "react";
import {
  FileUp,
  Menu,
  Search,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  SortAscIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ImportaCsv from "./ImportaCsv";
import FiltraAlunos from "./FiltraAlunos";

const rota = process.env.NEXT_PUBLIC_API_URL;

const ListaAlunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [temFiltros, setTemFiltros] = useState(false);
  const alunosPorPagina = 3;

  const [modalImportaCsv, setModalImportaCsv] = useState(false);
  const [modalFiltraAluno, setModalFiltraAluno] = useState(false);

  const [filtros, setFiltros] = useState({
    filtroNome: "",
    filtroMatricula: "",
    filtroNotaPortugues: 0,
    filtroNotaMatematica: 0,
    filtroFrequencia: 0,
    filtroRisco: "",
  });
  
  const [ordCol, setOrdCol] = useState({
    nome: 'asc',
    matricula: '',
    nota_portugues: '',
    nota_matematica: '',
    frequencia: '',
    risco: '',
  });

  const handleSaveCsv = () => {
    setModalImportaCsv(false);
    alert("O arquivo foi importado com sucesso!");
  };

  /**
   * Busca a lista de alunos.
   * @function fetchAlunos
   * @description Função assíncrona para buscar a lista de alunos da API.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Lança um erro se a resposta da API não for bem-sucedida.
   */
  const fetchAlunos = async (page = 1, filtros) => {
    try {

      const ordenacaoAtiva = getOrdenacaoAtiva();

      const response = await fetch(
        `${rota}/api/v1/alunos?page=${page}&page_size=${alunosPorPagina}` +
          `&ordenar_por=${ordenacaoAtiva.campo}&direcao=${ordenacaoAtiva.direcao}` +
          (filtros.filtroNome
            ? `&nome=${encodeURIComponent(filtros.filtroNome)}`
            : "") +
          (filtros.filtroMatricula
            ? `&matricula=${filtros.filtroMatricula}`
            : "") +
          (filtros.filtroNotaPortugues
            ? `&nota_portugues=${filtros.filtroNotaPortugues}`
            : "") +
          (filtros.filtroNotaMatematica
            ? `&nota_matematica=${filtros.filtroNotaMatematica}`
            : "") +
          (filtros.filtroFrequencia
            ? `&frequencia=${filtros.filtroFrequencia}`
            : "") +
          (filtros.filtroRisco ? `&risco=${filtros.filtroRisco}` : ""),
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
      console.log(data);
    } catch (error) {
      console.error(error);
      setAlunos([]);
      setTotalAlunos(0);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchAlunos(currentPage, filtros);
  }, [currentPage, filtros, ordCol]);

  useEffect(() => {
    checaFiltros();
  }, [filtros]);

  const checaFiltros = () => {
    if (
      filtros.filtroNome !== "" ||
      filtros.filtroMatricula !== "" ||
      filtros.filtroNotaPortugues !== 0 ||
      filtros.filtroNotaMatematica !== 0 ||
      filtros.filtroFrequencia !== 0 ||
      filtros.filtroRisco !== ""
    ) {
      setTemFiltros(true);
    } else {
      setTemFiltros(false);
    }
  };

  const SortIcon = ({ campo }) => {
    const isActive = ordCol[campo] !== '';
    return (
      <div className="flex flex-col ml-1 -space-y-1">
        <ChevronUp size={12} className={`${isActive && ordCol[campo] === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
        <ChevronDown size={12} className={`${isActive && ordCol[campo] === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
      </div>
    );
  };

  const handleOrdenacao = (campo) => {
    setOrdCol((prev) => {
        const novaOrdenacao = {};
        Object.keys(prev).forEach(key => {
            novaOrdenacao[key] = "";
        });
        novaOrdenacao[campo] =  prev[campo] === 'asc' ? 'desc' : 'asc';
        return novaOrdenacao;
    });
  };

  const getOrdenacaoAtiva = () => {
    const campo = Object.keys(ordCol).find(
      key => ordCol[key] === 'asc' || ordCol[key] === 'desc'
    );
    if(!campo) return null;
    return {
        campo,
        direcao: ordCol[campo],
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <button className="md:hidden text-gray-500">
            <Menu />
          </button>
          <div className="relative w-full max-w-md hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              value={filtros.filtroNome}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, filtroNome: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalImportaCsv(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95"
          >
            <FileUp size={18} />
            <span className="hidden sm:inline">Importar CSV</span>
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-lg text-gray-800">
                Monitoramento de Alunos
              </h2>
              {temFiltros && (
                <span
                  onClick={() => console.log(filtros)}
                  className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  Filtros Ativos
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalFiltraAluno(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                        ${
                          temFiltros
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
              >
                <SlidersHorizontal size={16} />
                Filtros
              </button>
              <div className="text-sm text-gray-500 hidden sm:block">
                <span className="font-bold">
                  {(currentPage - 1) * alunosPorPagina + 1}
                </span>
                -
                <span className="font-bold">
                  {Math.min(
                    (currentPage - 1) * alunosPorPagina + alunosPorPagina,
                    totalAlunos,
                  )}
                </span>{" "}
                de
                <span className="font-bold"> {totalAlunos}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("nome")}
                    >
                      <div className="flex items-center">
                        Nome
                        <SortIcon campo="nome" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("matricula")}
                    >
                      <div className="flex items-center">
                        Matrícula
                        <SortIcon campo="matricula" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("nota_portugues")}
                    >
                      <div className="flex items-center">
                        Nota Português
                        <SortIcon campo="nota_portugues" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("nota_matematica")}
                    >
                      <div className="flex items-center">
                        Nota Matemática
                        <SortIcon campo="nota_matematica" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("frequencia")}
                    >
                      <div className="flex items-center">
                        Frequência
                        <SortIcon campo="frequencia" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOrdenacao("risco")}
                    >
                      <div className="flex items-center">
                        Risco
                        <SortIcon campo="risco" />
                      </div>
                    </th>
                    <th className="px-6 py-4 border-b border-gray-100 text-right">Ação</th>
                  </tr>
                </thead>
                {alunos.length > 0 ? (
                  <tbody className="divide-y divide-gray-100">
                    {alunos.map((aluno) => (
                      <tr
                        key={aluno.matricula}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {aluno.nome}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {aluno.matricula}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {aluno.nota_matematica}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {aluno.nota_portugues}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${aluno.frequencia > 0.8 ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: `${aluno.frequencia * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {aluno.frequencia * 100}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2
                        ${
                          aluno.probabilidade_evasao >= 0.6
                            ? "bg-red-50 text-red-700 border-red-200"
                            : aluno.probabilidade_evasao >= 0.4
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                          >
                            {aluno.probabilidade_evasao >= 0.6
                              ? "Urgente"
                              : aluno.probabilidade_evasao >= 0.4
                                ? "Alerta"
                                : "Seguro"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight size={20} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-500"
                      >
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        {/** Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPreviousPage}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border
                          ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                              : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                          }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {modalImportaCsv && (
        <ImportaCsv
          onClose={() => setModalImportaCsv(false)}
          onSave={handleSaveCsv}
        />
      )}

      {modalFiltraAluno && (
        <FiltraAlunos
          filtros={filtros}
          onApply={(novosFiltros) => setFiltros(novosFiltros)}
          onClose={() => setModalFiltraAluno(false)}
        />
      )}
    </div>
  );
};

export default ListaAlunos;
