import type React from 'react';
import { useEffect, useState } from 'react';
import { TextField } from '@/components/forms/text_input';
import { SelectField } from '@/components/forms/select_input';
import { Button } from '@/components/forms/button';
import { X, Search, Users, Copy, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog';
import { InterestAreasService, type InterestAreaTrigger, TypeEnum } from '@/api';

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
  triggers: (InterestAreaTrigger & { _id: string })[];
}

interface EditInterestDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: Omit<InterestFormData, 'triggers'> & { triggers: InterestAreaTrigger[] };
  onSave: (
    updatedData: Omit<InterestFormData, 'triggers'> & { triggers: InterestAreaTrigger[] },
  ) => void;
}

// Type options for the dropdown
const TYPE_OPTIONS = [
  { value: TypeEnum.BOOLEAN, label: 'Sim/Não' },
  { value: TypeEnum.TEXT, label: 'Texto' },
  { value: TypeEnum.INT, label: 'Número' },
  { value: TypeEnum.SCALE, label: 'Escala' },
];

interface QuestionItemProps {
  trigger: InterestAreaTrigger & { _id: string };
  index: number;
  onUpdate: (index: number, updatedTrigger: InterestAreaTrigger & { _id: string }) => void;
  onRemove: (index: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ trigger, index, onUpdate, onRemove }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate(index, { ...trigger, name: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { ...trigger, type: e.target.value as TypeEnum });
  };

  return (
    <div className="relative rounded-lg border border-border bg-card px-4 py-4 shadow-md group hover:shadow-lg transition-all duration-200">
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="absolute top-3 right-3 w-6 h-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <X size={14} />
      </Button>

      <div className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <TextField
            id={`question-${index}`}
            name={`question-${index}`}
            label="Pergunta"
            placeholder="Ex: Você tem histórico familiar?"
            value={trigger.name || ''}
            onChange={handleNameChange}
            className="focus-within:ring-2 focus-within:ring-accent1"
          />
        </div>

        {/* Response Type */}
        <div className="space-y-2">
          <SelectField
            id={`response-type-${index}`}
            name={`response-type-${index}`}
            label="Tipo de resposta"
            value={trigger.type || TypeEnum.TEXT}
            onChange={handleTypeChange}
            height={10}
            isLoading={false}
            options={TYPE_OPTIONS}
            inDialog={true}
          />
        </div>
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
      className="border border-border rounded-lg p-4 hover:bg-accent/20 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      onClick={() => onSelect(template)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(template)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm text-typography">{template.interest_name}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users size={12} />
          {template.usage_count || 0}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3">
        {template.triggers.length} pergunta
        {template.triggers.length !== 1 ? 's' : ''}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {template.triggers.slice(0, 2).map((trigger, idx) => (
          <span
            key={idx}
            className="bg-accent/10 text-typography px-2 py-1 rounded-md text-xs max-w-[200px] truncate border border-accent/20"
            title={trigger?.name || ''}
          >
            {trigger?.name || 'Pergunta sem nome'}
          </span>
        ))}
        {template.triggers.length > 2 && (
          <span className="text-xs text-muted-foreground px-2 py-1">
            +{template.triggers.length - 2} mais
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        className="bg-primary text-primary-foreground text-xs px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
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

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Main component
const EditInterestDialog: React.FC<EditInterestDialogProps> = ({
  open,
  onClose,
  initialData,
  onSave,
}) => {
  // Form state
  const [formData, setFormData] = useState<InterestFormData>({
    interest_name: '',
    triggers: [],
  });

  // Template state
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateInterests, setTemplateInterests] = useState<InterestTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          interest_name: initialData.interest_name || '',
          triggers: initialData.triggers.map((trigger) => ({
            ...trigger,
            _id: generateId(),
          })),
        });
      } else {
        setFormData({ interest_name: '', triggers: [] });
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
              const name = interestData?.name || '';
              const triggers = interestData?.triggers || [];

              // Ensure triggers is an array and properly formatted
              const formattedTriggers = Array.isArray(triggers)
                ? triggers.map((t: InterestAreaTrigger | string) => {
                    if (typeof t === 'string') {
                      return {
                        name: t,
                        type: TypeEnum.TEXT,
                        response: null,
                      };
                    }
                    // Ensure we have a valid trigger object
                    if (t && typeof t === 'object') {
                      return {
                        name: String(t.name || ''),
                        type: t.type || TypeEnum.TEXT,
                        response: t.response || null,
                      };
                    }
                    // Fallback for invalid triggers
                    return {
                      name: 'Pergunta inválida',
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
              console.warn('Error processing template item:', error, item);
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
        console.error('Error fetching templates:', error);
        setError('Não foi possível carregar os modelos');
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
    .filter((template) => template?.interest_name && Array.isArray(template.triggers));

  // Handlers
  const handleAddQuestion = () => {
    const newTrigger = {
      name: '',
      type: TypeEnum.TEXT,
      response: null,
      _id: generateId(),
    };

    setFormData((prev) => ({
      ...prev,
      triggers: [...prev.triggers, newTrigger],
    }));
  };

  const handleUpdateQuestion = (
    index: number,
    updatedTrigger: InterestAreaTrigger & { _id: string },
  ) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.map((trigger, i) => (i === index ? updatedTrigger : trigger)),
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
        name: trigger.name || '',
        type: trigger.type || TypeEnum.TEXT,
        response: trigger.response || null,
        _id: generateId(),
      })),
    });
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setTemplateSearch('');
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.interest_name.trim()) return;

    // Filter out empty triggers and remove _id for API
    const validTriggers = formData.triggers
      .filter((trigger) => trigger.name.trim())
      .map(({ _id, ...trigger }) => trigger);

    if (validTriggers.length === 0) return;

    // Submit with cleaned data
    onSave({
      ...formData,
      triggers: validTriggers,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({ interest_name: '', triggers: [] });
    setShowTemplates(false);
    setTemplateSearch('');
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
      <DialogContent className=" text-typography z-[9999] w-[min(90vw,600px)] rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? 'Editar interesse' : 'Novo interesse'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Monte um interesse do seu jeito, com perguntas que fazem sentido pra você.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 min-h-0">
          {/* Template Selection Card */}
          {!initialData && (
            <div className="space-y-4">
              <div className="w-full">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="w-full rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 p-4 flex items-center gap-3 text-left group shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
                >
                  <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/25 transition-all duration-300 group-hover:rotate-3">
                    <svg
                      className="w-5 h-5 text-typography transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14-7l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-typography text-base group-hover:text-typography transition-colors duration-300">
                      {showTemplates ? 'Ocultar exemplos' : 'Escolher de exemplos existentes'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Use modelos prontos como base para seu interesse
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-primary transition-all duration-300 ${showTemplates ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {showTemplates && (
                <div className="mt-3 space-y-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    />
                    <TextField
                      id="template-search"
                      name="template-search"
                      placeholder="Buscar exemplos..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-3 bg-muted/30 border border-border rounded-lg p-4">
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Carregando modelos...
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-yellow-600 text-sm">{error}</div>
                    ) : filteredTemplates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
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
              <label className="block text-base font-semibold text-typography">
                Perguntas ({formData.triggers.length})
              </label>
              <Button
                onClick={handleAddQuestion}
                variant="gradientNew"
                className="bg-selection text-white text-sm px-3 py-1 flex items-center gap-1"
              >
                <Plus size={14} />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {formData.triggers.map((trigger, index) => (
                <QuestionItem
                  key={trigger._id}
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
          <Button variant="outlineGray" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            className="bg-selection text-white"
            variant="gradientNew"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {initialData ? 'Salvar Alterações' : 'Criar Interesse'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInterestDialog;
