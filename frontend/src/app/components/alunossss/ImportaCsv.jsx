"use client";

import React, { useState, useRef } from "react";
import { FileUp, CheckCircle, Plus, X, FileText } from "lucide-react";

const ImportaCsv = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCancelar = () => {
    onClose();
  };

  const handleSubmitFile = async () => {
    /* try {
      if (!selectedFile) {
        alert("sem arquivo");
        return;
      } else {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await fetch(`${rota}/api/v1/passageiros`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data || "Erro ao enviar CSV");
          return;
        }
        onSave();
      }
    } catch (err) {
      console.error(err);
    } */
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Conteúdo do Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileUp className="text-blue-600" size={24} />
            Importar Dados
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            Selecione um arquivo .csv contendo as notas e frequência dos alunos
            para análise de risco.
          </p>

          <div className="space-y-4">
            {/* Área de Seleção */}
            <div
              onClick={handleButtonClick}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                    ${selectedFile ? "border-blue-200 bg-blue-50/30" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-600 p-3 rounded-full mb-2">
                    <FileText className="text-white" size={28} />
                  </div>
                  <span className="font-semibold text-gray-800 break-all">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <>
                  <div className="bg-gray-100 p-3 rounded-full text-gray-400">
                    <Plus size={28} />
                  </div>
                  <span className="font-medium text-gray-600 text-sm">
                    Clique para procurar arquivo
                  </span>
                  <span className="text-xs text-gray-400">
                    Somente arquivos .csv
                  </span>
                </>
              )}
            </div>

            {selectedFile && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-xs">
                <CheckCircle size={14} />
                Arquivo selecionado com sucesso!
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={handleCancelar}
            className="flex-1 px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmitFile}
            disabled={!selectedFile}
            className={`flex-1 px-4 py-2 text-white font-medium rounded-lg shadow-sm transition-all
                  ${selectedFile ? "bg-blue-600 hover:bg-blue-700 active:scale-95" : "bg-gray-300 cursor-not-allowed"}`}
          >
            Importar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportaCsv;
