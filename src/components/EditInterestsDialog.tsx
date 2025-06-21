import type React from "react";
import { useEffect, useState } from "react";
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
import { InterestAreasService } from "@/api";
import type { InterestArea, InterestAreaTrigger } from "@/api";

// Define clear interfaces
interface InterestTemplate {
  id: string;
  interest_name: string;
  triggers: InterestAreaTrigger[];
  usage_count?: number;
}

interface InterestFormData {
  id?: string;
  interest_name: string;
  triggers: string[];
}

interface EditInterestDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: InterestFormData;
  onSave: (updatedData: InterestFormData) => void;
}

// Template list item component
const TemplateItem = ({
  template,
  onSelect,
}: {
  template: InterestTemplate;
  onSelect: (template: InterestTemplate) => void;
}) => {
  return (
    <div
      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={() => onSelect(template)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(template)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{template.interest_name}</h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Users size={12} />
          {template.usage_count || 0}
        </div>
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
        {template.triggers.length} pergunta
        {template.triggers.length !== 1 ? "s" : ""}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {template.triggers.slice(0, 2).map((trigger) => (
          <span
            key={trigger.name} // Use a stable key
            className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs max-w-[200px] truncate"
            title={trigger.name}
          >
            {trigger.name}
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
          onSelect(template);
        }}
      >
        <Copy size={12} />
        Usar este modelo
      </Button>
    </div>
  );
};

// Question tag component
const QuestionTag = ({
  question,
  onRemove,
}: {
  question: string;
  onRemove: () => void;
}) => (
  <span
    className="bg-selection text-white px-3 py-1 rounded-full flex items-center gap-2 max-w-[240px] animate-fade-in"
    title={question}
  >
    <span className="truncate flex-1 min-w-0">{question}</span>
    <X
      size={14}
      className="cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
      onClick={onRemove}
    />
  </span>
);

// Main component
const EditInterestDialog: React.FC<EditInterestDialogProps> = ({
  open,
  onClose,
  initialData,
  onSave,
}) => {
  // Form state
  const [formData, setFormData] = useState<InterestFormData>({
    interest_name: "",
    triggers: [],
  });
  const [newQuestion, setNewQuestion] = useState("");

  // Template state
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateInterests, setTemplateInterests] = useState<
    InterestTemplate[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          interest_name: initialData.interest_name || "",
          triggers: initialData.triggers || [],
        });
      } else {
        setFormData({ interest_name: "", triggers: [] });
      }
      setNewQuestion("");
      setSelectedTemplate(null);
    }
  }, [open, initialData]);

  // Fetch template interests when dialog opens
  useEffect(() => {
    const fetchTemplateInterests = async () => {
      if (!open || initialData || templateInterests.length > 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = (
          await InterestAreasService.apiInterestAreaList()
        ).filter((item: InterestArea) => item.person_id === null);

        // Map the API response to our template format
        const data = response
          .map((item: InterestArea) => {
            // Handle different response structures
            const interestData = item.interest_area || item;
            const name = interestData?.name || "";
            const triggers = interestData?.triggers || [];

            return {
              id: item.observation_id?.toString() || Math.random().toString(),
              interest_name: name,
              triggers: triggers.map((t: InterestAreaTrigger | string) =>
                typeof t === "string" ? { name: t } : t,
              ) as InterestAreaTrigger[],
              usage_count: 0,
            };
          })
          .filter(
            (template: InterestTemplate) =>
              // Filter out invalid templates
              template.interest_name && template.triggers.length > 0,
          );

        setTemplateInterests(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setError("Não foi possível carregar os modelos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateInterests();
  }, [open, initialData, templateInterests.length]);

  // Filter templates based on search
  const filteredTemplates = templateInterests.filter((template) => {
    if (!template || !templateSearch) return true;

    const nameMatch = template.interest_name
      ?.toLowerCase()
      .includes(templateSearch.toLowerCase());
    const triggerMatch = template.triggers?.some((trigger) =>
      trigger?.name?.toLowerCase().includes(templateSearch.toLowerCase()),
    );

    return nameMatch || triggerMatch;
  });

  // Handlers
  const handleAddQuestion = () => {
    const trimmed = newQuestion.trim();
    if (trimmed && !formData.triggers.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        triggers: [...prev.triggers, trimmed],
      }));
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index),
    }));
  };

  const handleUseTemplate = (template: InterestTemplate) => {
    setFormData({
      id: initialData?.id,
      interest_name: template.interest_name,
      triggers: template.triggers.map((trigger) => trigger.name),
    });
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setTemplateSearch("");
  };

  const handleSubmit = () => {
    if (!formData.interest_name.trim() || formData.triggers.length === 0)
      return;
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ interest_name: "", triggers: [] });
    setNewQuestion("");
    setShowTemplates(false);
    setTemplateSearch("");
    setSelectedTemplate(null);
    onClose();
  };

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
              : "Crie um novo interesse personalizado com suas próprias perguntas."}
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
                {showTemplates
                  ? "Ocultar exemplos"
                  : "Escolher de exemplos existentes"}
              </Button>

              {showTemplates && (
                <div className="mt-3 space-y-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
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
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        Carregando modelos...
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-500">
                        {error}
                      </div>
                    ) : filteredTemplates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum exemplo encontrado
                      </div>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TemplateItem
                          key={template.id}
                          template={template}
                          onSelect={handleUseTemplate}
                        />
                      ))
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
            value={formData.interest_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                interest_name: e.target.value,
              }))
            }
            className="w-full"
          />

          {/* Questions Section */}
          <div>
            <label className="block text-base font-semibold text-[var(--typography)] mb-1">
              Perguntas ({formData.triggers.length})
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
              {formData.triggers.map((question) => (
                <QuestionTag
                  key={question} // Use question as key, assuming it's unique for this component instance
                  question={question}
                  onRemove={() =>
                    handleRemoveQuestion(
                      formData.triggers.findIndex((q) => q === question),
                    )
                  }
                />
              ))}
            </div>

            {formData.triggers.length === 0 && (
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
            disabled={
              !formData.interest_name.trim() || formData.triggers.length === 0
            }
          >
            {initialData ? "Salvar Alterações" : "Criar Interesse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInterestDialog;
