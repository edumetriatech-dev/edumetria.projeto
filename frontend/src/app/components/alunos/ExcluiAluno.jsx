"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

const rota = process.env.NEXT_PUBLIC_API_URL;

const ExcluiAluno = ({ setAluno, aluno, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${rota}/api/v1/aluno/${aluno.matricula}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok){
        throw new Error("Erro ao excluir");
      }
      
      onDelete();
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <AlertDialog
      open={!!aluno}
      onOpenChange={(open) => {
        if (!open) setAluno(null);
      }}
    >
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir aluno?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o aluno "{aluno?.matricula}"? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel /* onClick={() => onOpenChange(false)} */>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExcluiAluno;
