import React, { useEffect, useState } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";

interface EditInterestDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    interest_name: string;
    triggers: string[]; // Mudança aqui: direto array de strings
  };
  onSave: (updatedData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => void;
}

const EditInterestDialog: React.FC<EditInterestDialogProps> = ({
  open,
  onClose,
  initialData,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.interest_name || "");
      // Agora funciona direto com array de strings
      setQuestions(initialData.triggers || []);
    } else {
      setName("");
      setQuestions([]);
    }
    setNewQuestion("");
  }, [open, initialData]);

  const handleAddQuestion = () => {
    const trimmed = newQuestion.trim();
    if (trimmed && !questions.includes(trimmed)) {
      setQuestions((prev) => [...prev, trimmed]);
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim() || questions.length === 0) return;
    onSave({
      id: initialData?.id,
      interest_name: name.trim(),
      triggers: questions,
    });
    onClose();
  };

  // Função para resetar o dialog quando fechar
  const handleClose = () => {
    setName("");
    setQuestions([]);
    setNewQuestion("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" />
      <DialogContent className="bg-[var(--primary)] text-[var(--typography)] z-[9999] w-[min(90vw,400px)] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Editar interesse" : "Novo interesse"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {initialData
              ? "Altere o nome ou as perguntas desta área de interesse."
              : "Crie um novo interesse personalizado com suas próprias perguntas."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <TextField
            placeholder="Nome do interesse"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          <div>
            <label className="block text-base font-semibold text-[var(--typography)] mb-1">
              Perguntas ({questions.length})
            </label>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <TextField
                  placeholder="Nova pergunta"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>
              {newQuestion.trim() && (
                <Button
                  onClick={handleAddQuestion}
                  className="bg-selection text-white text-sm px-3 py-1 transition-opacity duration-200"
                >
                  Adicionar
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-hidden hover:overflow-y-auto scrollbar-thin pr-1 transition-all">
              {questions.map((q, index) => (
                <span
                  key={`${q}-${index}`} // Key única usando conteúdo + índice
                  className="bg-selection text-white px-3 py-1 rounded-full flex items-center gap-2 max-w-[240px] truncate animate-fade-in"
                  title={q}
                >
                  {q}
                  <X
                    size={14}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRemoveQuestion(index)}
                  />
                </span>
              ))}
            </div>

            {questions.length === 0 && (
              <p className="text-xs text-gray-500 mt-2 italic">
                Adicione pelo menos uma pergunta para continuar
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            className="bg-selection text-white"
            onClick={handleSubmit}
            disabled={!name.trim() || questions.length === 0}
          >
            {initialData ? "Salvar Alterações" : "Criar Interesse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInterestDialog;
