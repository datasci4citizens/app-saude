import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { X, Search, Users, Copy, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  InterestAreasService,
  type InterestAreaTrigger,
  TypeEnum,
} from "@/api";

// Define clear interfaces
interface InterestTemplate {
  id: string;
  interest_name: string;
  triggers: InterestAreaTrigger[];
  usage_count?: number;
}

// Interface for API response items (to replace any)
interface ApiInterestAreaResponse {
  person_id: number | null;
  interest_area?: {
    name?: string;
    triggers?: (InterestAreaTrigger | string)[];
  };
  // Allow additional properties from API
  [key: string]: unknown;
}

interface InterestFormData {
  id?: string;
  interest_name: string;
  triggers: InterestAreaTrigger[];
}

interface EditInterestDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: InterestFormData;
  onSave: (updatedData: InterestFormData) => void;
}

// Type options for the dropdown
const TYPE_OPTIONS = [
  { value: TypeEnum.BOOLEAN, label: "Sim/Não" },
  { value: TypeEnum.TEXT, label: "Texto" },
  { value: TypeEnum.INT, label: "Número" },
  { value: TypeEnum.SCALE, label: "Escala" },
];

interface QuestionItemProps {
  trigger: InterestAreaTrigger;
  index: number;
  onUpdate: (index: number, updatedTrigger: InterestAreaTrigger) => void;
  onRemove: (index: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  trigger,
  index,
  onUpdate,
  onRemove,
}) => {
  const handleNameChange = (name: string) => {
    onUpdate(index, { ...trigger, name });
  };

  const handleTypeChange = (type: TypeEnum) => {
    onUpdate(index, { ...trigger, type });
  };

  return (
    <div className="border border-offwhite2 dark:border-offwhite2 rounded-lg p-3 space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <TextField
            id={`trigger-name-${index}`}
            name={`trigger-name-${index}`}
            placeholder="Nome da pergunta"
            value={trigger.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive p-1"
        >
          <X size={16} />
        </Button>
      </div>

      <div>
        <label className="block text-xs font-medium text-typography dark:text-typography mb-1">
          Tipo de resposta
        </label>
        <select
          value={trigger.type || TypeEnum.TEXT}
          onChange={(e) => handleTypeChange(e.target.value as TypeEnum)}
          className="w-full text-sm border border-offwhite2 dark:border-offwhite2 rounded-md px-3 py-2 bg-offwhite dark:bg-offwhite2 text-typography dark:text-typography"
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Template list item component
const TemplateItem: React.FC<{
  template: InterestTemplate;
  onSelect: (template: InterestTemplate) => void;
}> = ({ template, onSelect }) => {
  return (
    <div
      className="border border-offwhite2 dark:border-offwhite2 rounded-lg p-3 hover:bg-offwhite2 dark:hover:bg-offwhite2 transition-colors cursor-pointer"
      onClick={() => onSelect(template)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(template)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{template.interest_name}</h4>
        <div className="flex items-center gap-1 text-xs text-typography dark:text-typography">
          <Users size={12} />
          {template.usage_count || 0}
        </div>
      </div>

      <div className="text-xs text-typography dark:text-typography mb-2">
        {template.triggers.length} pergunta
        {template.triggers.length !== 1 ? "s" : ""}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {template.triggers.slice(0, 2).map((trigger) => (
          <span
            key={trigger.name}
            className="bg-offwhite2 dark:bg-offwhite2 text-typography dark:text-typography px-2 py-1 rounded text-xs max-w-[200px] truncate"
            title={trigger?.name || ""}
          >
            {trigger?.name || "Pergunta sem nome"}
          </span>
        ))}
        {template.triggers.length > 2 && (
          <span className="text-xs text-offwhite-500 dark:text-offwhite-400 px-2 py-1">
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
        const response = await InterestAreasService.apiInterestAreaList();
        const filteredResponse = response.filter(
          (item: ApiInterestAreaResponse) => item.person_id === null,
        );

        // Map the API response to our template format
        const data = filteredResponse
          .map((item: ApiInterestAreaResponse) => {
            // API response structure differs from InterestArea type
            try {
              // Handle different response structures
              const interestData = item.interest_area || item;
              const name = interestData?.name || "";
              const triggers = interestData?.triggers || [];

              // Ensure triggers is an array and properly formatted
              const formattedTriggers = Array.isArray(triggers)
                ? triggers.map((t: InterestAreaTrigger | string) => {
                    if (typeof t === "string") {
                      return {
                        name: t,
                        type: TypeEnum.TEXT,
                        response: null,
                      };
                    }
                    // Ensure we have a valid trigger object
                    if (t && typeof t === "object") {
                      return {
                        name: String(t.name || ""),
                        type: t.type || TypeEnum.TEXT,
                        response: t.response || null,
                      };
                    }
                    // Fallback for invalid triggers
                    return {
                      name: "Pergunta inválida",
                      type: TypeEnum.TEXT,
                      response: null,
                    };
                  })
                : [];

              return {
                id: String(item.observation_id || Math.random()),
                interest_name: String(name),
                triggers: formattedTriggers,
                usage_count: Number(item.usage_count) || 0,
              };
            } catch (error) {
              console.warn("Error processing template item:", error, item);
              return null;
            }
          })
          .filter(
            (template: InterestTemplate | null): template is InterestTemplate =>
              template !== null &&
              !!template.interest_name &&
              template.triggers.length > 0 &&
              Array.isArray(template.triggers),
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
  const filteredTemplates = templateInterests
    .filter((template) => {
      if (!template || !templateSearch) return true;

      const nameMatch = template.interest_name
        ?.toLowerCase()
        .includes(templateSearch.toLowerCase());
      const triggerMatch = template.triggers?.some((trigger) =>
        trigger?.name?.toLowerCase().includes(templateSearch.toLowerCase()),
      );

      return nameMatch || triggerMatch;
    })
    .filter(
      (template) => template?.interest_name && Array.isArray(template.triggers),
    );

  // Handlers
  const handleAddQuestion = () => {
    const newTrigger: InterestAreaTrigger = {
      name: "",
      type: TypeEnum.TEXT,
      response: null,
    };

    setFormData((prev) => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger],
    }));
  };

  const handleUpdateQuestion = (
    index: number,
    updatedTrigger: InterestAreaTrigger,
  ) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.map((trigger, i) =>
        i === index ? updatedTrigger : trigger,
      ),
    }));
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
      triggers: template.triggers.map((trigger) => ({
        name: trigger.name || "",
        type: trigger.type || TypeEnum.TEXT,
        response: trigger.response || null,
      })),
    });
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setTemplateSearch("");
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.interest_name.trim()) return;

    // Filter out empty triggers
    const validTriggers = formData.triggers.filter((trigger) =>
      trigger.name.trim(),
    );

    if (validTriggers.length === 0) return;

    // Submit with cleaned data
    onSave({
      ...formData,
      triggers: validTriggers,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({ interest_name: "", triggers: [] });
    setShowTemplates(false);
    setTemplateSearch("");
    setSelectedTemplate(null);
    onClose();
  };

  // Check if form is valid
  const isFormValid =
    formData.interest_name.trim() &&
    formData.triggers.length > 0 &&
    formData.triggers.some((trigger) => trigger.name?.trim());

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]" />
      <DialogContent className=" text-[var(--typography)] z-[9999] w-[min(90vw,600px)] rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Editar interesse" : "Novo interesse"}
          </DialogTitle>
          <DialogDescription className="text-sm text-offwhite-500">
            {initialData
              ? "Altere o nome ou as perguntas desta área de interesse."
              : "Crie um novo interesse personalizado com suas próprias perguntas."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Template Selection */}
          {!initialData && (
            <div className="border-b border-offwhite-200 pb-4">
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-offwhite-400"
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

                  <div className="max-h-64 overflow-y-auto space-y-2 border border-offwhite-200 dark:border-offwhite-600 rounded-lg p-2">
                    {isLoading ? (
                      <div className="text-center py-8 text-offwhite-500">
                        Carregando modelos...
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-500">
                        {error}
                      </div>
                    ) : filteredTemplates.length === 0 ? (
                      <div className="text-center py-8 text-offwhite-500">
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
            <div className="rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Copy size={14} />
                <span className="font-medium">Baseado em modelo existente</span>
              </div>
              <p className="text-xs mt-1">
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
            <div className="flex items-center justify-between mb-3">
              <label className="block text-base font-semibold text-[var(--typography)]">
                Perguntas ({formData.triggers.length})
              </label>
              <Button
                onClick={handleAddQuestion}
                className="bg-selection text-white text-sm px-3 py-1 flex items-center gap-1"
              >
                <Plus size={14} />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {formData.triggers.map((trigger, index) => (
                <QuestionItem
                  key={`trigger-${trigger.name || index}`}
                  trigger={trigger}
                  index={index}
                  onUpdate={handleUpdateQuestion}
                  onRemove={handleRemoveQuestion}
                />
              ))}
            </div>

            {formData.triggers.length === 0 && (
              <p className="text-xs text-offwhite-500 mt-2 italic text-center py-8 border border-dashed border-offwhite-300 rounded-lg">
                Clique em "Adicionar" para criar sua primeira pergunta
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
            disabled={!isFormValid}
          >
            {initialData ? "Salvar Alterações" : "Criar Interesse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInterestDialog;
