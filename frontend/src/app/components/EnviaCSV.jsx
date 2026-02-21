"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { toast } from '@/app/hooks/use-toast';

const rota = process.env.NEXT_PUBLIC_API_URL;

const EnviaCSV = ({ isUploadOpen, setIsUploadOpen, onUpload }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmitFile = async () => {
    try {
      if (!selectedFile) {
        alert("Sem arquivo.");
        return;
      } else {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await fetch(`${rota}/api/v1/alunos`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          toast({ title: 'Erro', description: data || 'Erro ao enviar CSV'});
          return;
        }
        onUpload();
      }
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao enviar CSV'});
      //console.error(err);
    }
  };

  return (
    <Dialog
      open={isUploadOpen}
      onOpenChange={(open) => {
        setIsUploadOpen(open);
        if (!open) setSelectedFile(null);
      }}
    >
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl">Enviar CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.name.endsWith(".csv")) {
                setSelectedFile(file);
              }
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Procurar arquivo
          </Button>
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitFile} disabled={!selectedFile}>Enviar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnviaCSV;
