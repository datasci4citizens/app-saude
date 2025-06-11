import React, { useEffect, useState } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { X, Search, Users, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { InterestAreasService, type InterestArea, type InterestAreaTrigger } from "@/api";

interface InterestTemplate {
  id: string;
  interest_name: string;
  triggers: InterestAreaTrigger[];
  usage_count?: number;
}

interface EditInterestDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    interest_name: string;
    triggers: string[];
  };
  onSave: (updatedData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => void;
  // Mock data for demonstration - in real app, this would come from an API
  availableTemplates?: InterestTemplate[];
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.interest_name || "");
      setQuestions(initialData.triggers || []);
    } else {
      setName("");
      setQuestions([]);
    }
    setNewQuestion("");
    setSelectedTemplate(null);
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

  const handleClose = () => {
    setName("");
    setQuestions([]);
    setNewQuestion("");
    setShowTemplates(false);
    setTemplateSearch("");
    setSelectedTemplate(null);
    onClose();
  };

  const handleUseTemplate = (template: InterestTemplate) => {
    setName(template.interest_name);
    setQuestions(template.triggers.map(trigger => typeof trigger === "string" ? trigger : (trigger.trigger_name ?? "")));
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setTemplateSearch("");
  };

  const [templateInterests, setTemplateInterests] = useState<InterestTemplate[]>([]);
  useEffect(() => {
    const fetchTemplateInterests = async () => {
      try {
        const response = await InterestAreasService.personInterestAreasList(true);
        const data = response.map((item: InterestArea) => ({
          id: item.interest_area_id?.toString() || "",
          interest_name: item.interest_name ?? "",
          triggers: item.triggers || [],
          usage_count: 0,
        }));
        setTemplateInterests(data);
      } catch (error) {
        setTemplateInterests([]);
      }
    };
    if (open && !initialData) {
      fetchTemplateInterests();
    }
  }, [open, initialData]);

  const filteredTemplates = (templateInterests).filter(template =>
    template.interest_name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    template.triggers.some(trigger =>
      trigger.trigger_name?.toLowerCase().includes(templateSearch.toLowerCase())
    )
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" />
      <DialogContent className="bg-[var(--primary)] text-[var(--typography)] z-[9999] w-[min(90vw,500px)] rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Editar interesse" : "Novo interesse"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {initialData 
              ? "Altere o nome ou as perguntas desta área de interesse."
              : "Crie um novo interesse personalizado com suas próprias perguntas."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Template Selection */}
          {!initialData && (
            <div className="border-b border-gray-200 pb-4">
              <Button
                variant="outlineWhite"
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-center gap-2 text-sm"
              >
                <Users size={16} />
                {showTemplates ? "Ocultar exemplos" : "Escolher de exemplos existentes"}
              </Button>
              
              {showTemplates && (
                <div className="mt-3 space-y-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <TextField
                      id="template-search"
                      name="template-search"
                      placeholder="Buscar exemplos..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="w-full pl-10 text-sm"
                    />
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{template.interest_name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Users size={12} />
                            {template.usage_count}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {template.triggers.length} pergunta{template.triggers.length !== 1 ? 's' : ''}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.triggers.slice(0, 2).map((trigger, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs max-w-[200px] truncate"
                              title={trigger.trigger_name ?? undefined}
                            >
                              {trigger.trigger_name}
                            </span>
                          ))}
                          {template.triggers.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                              +{template.triggers.length - 2} mais
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          className="bg-selection text-white text-xs px-2 py-1 h-auto flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(template);
                          }}
                        >
                          <Copy size={12} />
                          Usar este modelo
                        </Button>
                      </div>
                    ))}
                    
                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                        Nenhum exemplo encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Template Selection Indicator */}
          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Copy size={14} />
                <span className="font-medium">Baseado em modelo existente</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Todas as informações podem ser editadas livremente.
              </p>
            </div>
          )}

          {/* Interest Name Field */}
          <TextField
            id="interest-name"
            name="interest-name"
            placeholder="Nome do interesse"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          {/* Questions Section */}
          <div>
            <label className="block text-base font-semibold text-[var(--typography)] mb-1">
              Perguntas ({questions.length})
            </label>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <TextField
                  id="new-question"
                  name="new-question"
                  placeholder="Nova pergunta"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
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
                  key={`${q}-${index}`}
                  className="bg-selection text-white px-3 py-1 rounded-full flex items-center gap-2 max-w-[240px] animate-fade-in"
                  title={q}
                >
                  <span className="truncate flex-1 min-w-0">
                    {q}
                  </span>
                  <X
                    size={14}
                    className="cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
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
          <Button variant="outlineWhite" onClick={handleClose}>
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