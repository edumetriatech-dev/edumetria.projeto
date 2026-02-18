"use client";

import React, { useState, useRef } from "react";
import { FileUp, CheckCircle, Plus, X, FileText, SlidersHorizontal, Search } from "lucide-react";

const FiltraAlunos = ({ onClose, filtros, onApply }) => {

  const [filtrosLocal, setFiltrosLocal] = useState(filtros);

  const handleFiltroChange = (event) => {
    console.log(event)
    const { name, value, type } = event.target;
    setFiltrosLocal((prev) => ({
      ...prev,
      [name]: name.includes('filtroFrequencia') ? Number(value)/100 
                : type === 'number' ? Number(value) : value,
    }));
  };

  const handleLimparTudo = () => {
    setFiltrosLocal({
      filtroNome: "",
      filtroMatricula: "",
      filtroNotaPortugues: 0,
      filtroNotaMatematica: 0,
      filtroFrequencia: 0,
      filtroRisco: "",
    });
  };

  const handleApply = () => {
    onApply(filtrosLocal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="text-blue-600" size={20} />
            Filtrar Alunos
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nível de Risco
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["", "alto", "medio", "baixo"].map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    setFiltrosLocal((prev) => ({ ...prev, filtroRisco: r }))
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize
                        ${
                          filtrosLocal.filtroRisco === r
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                >
                  {r === "" ? "Todos" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nome
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                name="filtroNome"
                placeholder="Ex: Ana Silva..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={filtrosLocal.filtroNome}
                onChange={handleFiltroChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Matrícula
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                name="filtroMatricula"
                placeholder="Ex: 98238789312"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={filtrosLocal.filtroMatricula}
                onChange={handleFiltroChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
              Frequência Mínima (0-100%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0-100"
              name="filtroFrequencia"
              value={filtrosLocal.filtroFrequencia*100}
              onChange={handleFiltroChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nota Português (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
              name="filtroNotaPortugues"
              value={filtrosLocal.filtroNotaPortugues}
              onChange={handleFiltroChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nota Matemática (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0-100"
              name="filtroNotaMatematica"
              value={filtrosLocal.filtroNotaMatematica}
              onChange={handleFiltroChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={handleLimparTudo}
            className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors underline decoration-dotted"
          >
            Limpar Tudo
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltraAlunos;
