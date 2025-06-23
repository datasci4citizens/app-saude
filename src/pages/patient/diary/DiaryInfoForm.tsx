import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DiaryService } from "@/api/services/DiaryService";
import { DateRangeTypeEnum } from "@/api/models/DateRangeTypeEnum";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import type { InterestAreaTrigger } from "@/api/models/InterestAreaTrigger";
import { TypeEnum } from "@/api/models/TypeEnum";
import { ApiService } from "@/api/services/ApiService";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";
import { ChevronDown, Share2, Plus, Minus, Check, X, Calendar, Sparkles, AlertTriangle } from "lucide-react";

interface UserInterest {
  observation_id: number;
  provider_name?: string;
  shared?: boolean;
  interest_area: InterestArea;
  triggerResponses?: Record<string, string>;
}

// Componentes de Trigger melhorados
const BooleanTrigger = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const isYes = value === "true" || value === "sim" || value === "yes";
  const isNo = value === "false" || value === "não" || value === "no";

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange("sim")}
        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
          isYes
            ? "bg-success border-success text-success-foreground shadow-lg"
            : "bg-card border-card-border text-typography hover:border-success/30 hover:bg-success/10"
        }`}
      >
        <Check size={18} className={isYes ? "text-success-foreground" : "text-success"} />
        Sim
      </button>
      <button
        type="button"
        onClick={() => onChange("não")}
        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
          isNo
            ? "bg-destructive border-destructive text-destructive-foreground shadow-lg"
            : "bg-card border-card-border text-typography hover:border-destructive/30 hover:bg-destructive/10"
        }`}
      >
        <X size={18} className={isNo ? "text-destructive-foreground" : "text-destructive"} />
        Não
      </button>
    </div>
  );
};

const ScaleTrigger = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const numValue = parseInt(value) || 0;
  const maxValue = 10;

  const getScaleColor = (value: number): string => {
    if (value <= 3) return "from-red-400 to-red-600";
    if (value <= 6) return "from-yellow-400 to-orange-500";
    return "from-green-400 to-green-600";
  };

  const getScaleLabel = (value: number): string => {
    if (value === 0) return "Nenhum";
    if (value <= 2) return "Muito baixo";
    if (value <= 4) return "Baixo";
    if (value <= 6) return "Moderado";
    if (value <= 8) return "Alto";
    return "Muito alto";
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="range"
          min="0"
          max={maxValue}
          value={numValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        {Array.from({ length: maxValue + 1 }, (_, i) => (
          <span key={i} className={numValue === i ? "font-bold text-typography" : ""}>
            {i}
          </span>
        ))}
      </div>

      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getScaleColor(numValue)} text-white font-semibold shadow-lg`}>
          <span className="text-2xl">{numValue}</span>
          <span className="text-sm">{getScaleLabel(numValue)}</span>
        </div>
      </div>
    </div>
  );
};

const IntegerTrigger = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const numValue = parseInt(value) || 0;

  const increment = () => onChange(Math.max(0, numValue + 1).toString());
  const decrement = () => onChange(Math.max(0, numValue - 1).toString());

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={decrement}
        className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground 
                   hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
        disabled={numValue <= 0}
      >
        <Minus size={20} className="mx-auto" />
      </button>
      
      <div className="flex flex-col items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === "" || /^\d+$/.test(inputValue)) {
              onChange(inputValue);
            }
          }}
          className="w-20 h-16 text-3xl font-bold text-center border-2 border-input-border 
                     bg-input text-input-foreground rounded-xl focus:border-ring focus:outline-none shadow-inner"
          placeholder="0"
        />
        <span className="text-xs text-muted-foreground font-medium">Quantidade</span>
      </div>

      <button
        type="button"
        onClick={increment}
        className="w-12 h-12 rounded-full bg-homebg text-primary-foreground 
                   hover:opacity-90 transition-opacity shadow-lg"
      >
        <Plus size={20} className="mx-auto" />
      </button>
    </div>
  );
};

const TextTrigger = ({
  trigger,
  value,
  onChange,
}: {
  trigger: InterestAreaTrigger;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <TextField
        id={trigger.name}
        name={trigger.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite sua resposta aqui..."
        multiline={true}
        rows={3}
      />
      <div className="text-right text-xs text-muted-foreground">
        {value.length} caracteres
      </div>
    </div>
  );
};

// Card de Interesse aprimorado - CORRIGIDO
const EnhancedInterestCard = ({
  interest,
  isOpen,
  onToggle,
  onSharingToggle,
  onTriggerResponseChange,
}: {
  interest: UserInterest;
  isOpen: boolean;
  onToggle: () => void;
  onSharingToggle: (shared: boolean) => void;
  onTriggerResponseChange: (triggerName: string, response: string) => void;
}) => {
  const answeredTriggers = interest.interest_area.triggers?.filter(trigger => {
    const response = interest.triggerResponses?.[trigger.name];
    return response && response.trim() !== "";
  }).length || 0;

  const totalTriggers = interest.interest_area.triggers?.length || 0;
  const progressPercentage = totalTriggers > 0 ? (answeredTriggers / totalTriggers) * 100 : 0;

  const getProgressGradient = () => {
    if (progressPercentage === 0) return "from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700";
    if (progressPercentage < 50) return "from-orange-400 to-red-500";
    if (progressPercentage < 100) return "from-yellow-400 to-orange-500";
    return "from-green-400 to-emerald-500";
  };

  const getStatusBadge = () => {
    if (progressPercentage === 0) return { 
      text: "Não iniciado", 
      className: "bg-muted text-muted-foreground" 
    };
    if (progressPercentage < 50) return { 
      text: "Iniciado", 
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" 
    };
    if (progressPercentage < 100) return { 
      text: "Em progresso", 
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" 
    };
    return { 
      text: "Completo", 
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
    };
  };

  const status = getStatusBadge();

  const renderTriggerInput = (trigger: InterestAreaTrigger): JSX.Element => {
    const value: string = interest.triggerResponses?.[trigger.name] || "";
    const onChange = (newValue: string) => {
      console.log('Trigger change:', trigger.name, newValue); // Debug
      onTriggerResponseChange(trigger.name, newValue);
    };

    switch (trigger.type) {
      case TypeEnum.BOOLEAN:
        return <BooleanTrigger value={value} onChange={onChange} />;
      case TypeEnum.SCALE:
        return <ScaleTrigger value={value} onChange={onChange} />;
      case TypeEnum.INT:
        return <IntegerTrigger value={value} onChange={onChange} />;
      case TypeEnum.TEXT:
      default:
        return <TextTrigger trigger={trigger} value={value} onChange={onChange} />;
    }
  };

  const handleSharingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sharing toggle:', !interest.shared); // Debug
    onSharingToggle(!interest.shared);
  };

  return (
    <div className="group card-hover rounded-2xl border overflow-hidden transition-all duration-300 hover-lift 
                    bg-card border-card-border hover:border-ring/30 hover:shadow-hover-lg">
      
      {/* Header */}
      <div
        className="relative p-6 cursor-pointer transition-all duration-300 
                   hover:bg-gradient-to-r hover:from-accent/50 hover:to-muted/50"
        onClick={() => {
          console.log('Card toggle clicked'); // Debug
          onToggle();
        }}
      >
        {/* Overlay sutil */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          interest.interest_area.is_attention_point
            ? 'bg-gradient-to-r from-orange-500/5 to-red-500/5'
            : 'bg-gradient-to-r from-homebg/5 to-selection/5'
        }`} />
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            
            {/* Título e indicadores */}
            <div className="flex items-center gap-3 mb-3">
              {/* Indicator dot */}
              <div className={`relative w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                interest.interest_area.is_attention_point 
                  ? "bg-gradient-to-r from-orange-400 to-red-500 shadow-orange-500/30" 
                  : "bg-[var(--gradient-interest-indicator)] shadow-homebg/30"
              }`}>
                {progressPercentage === 100 && (
                  <div className="absolute inset-0 rounded-full bg-success animate-pulse">
                    <Sparkles size={12} className="absolute inset-0 m-auto text-success-foreground" />
                  </div>
                )}
              </div>
              
              {/* Nome */}
              <h4 className="font-bold text-lg text-typography transition-colors duration-200 
                             group-hover:text-selection">
                {interest.interest_area.name}
              </h4>
              
              {/* Badge de atenção */}
              {interest.interest_area.is_attention_point && (
                <div className="flex items-center gap-1 px-3 py-1 
                              bg-gradient-to-r from-orange-100 to-red-100 
                              dark:from-orange-900/30 dark:to-red-900/30
                              text-orange-800 dark:text-orange-300 
                              text-xs font-medium rounded-full border border-orange-200 
                              dark:border-orange-700 shadow-sm">
                  <AlertTriangle size={12} />
                  <span>Atenção</span>
                </div>
              )}
              
              {/* Badge de status */}
              <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${status.className}`}>
                {status.text}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {answeredTriggers}/{totalTriggers} perguntas respondidas
                </span>
                <div className={`text-lg font-bold ${
                  progressPercentage === 100 ? 'text-success' : 
                  progressPercentage > 50 ? 'text-yellow-500' : 
                  progressPercentage > 0 ? 'text-orange-500' : 
                  'text-muted-foreground'
                }`}>
                  {Math.round(progressPercentage)}%
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out 
                             bg-gradient-to-r ${getProgressGradient()} relative overflow-hidden`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 animate-pulse" />
                  )}
                </div>
                
                {/* Marcadores */}
                <div className="absolute inset-0 flex justify-between items-center px-1">
                  {[25, 50, 75].map(mark => (
                    <div 
                      key={mark}
                      className={`w-0.5 h-1 rounded-full transition-colors ${
                        progressPercentage >= mark 
                          ? 'bg-white/50' 
                          : 'bg-muted-foreground/30'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Controles direita */}
          <div className="flex items-center gap-4 ml-6">
            
            {/* Sharing Toggle */}
            <div className="flex items-center gap-2">
              <Share2 size={16} className={`transition-colors duration-200 ${
                interest.shared 
                  ? 'text-selection' 
                  : 'text-muted-foreground hover:text-typography'
              }`} />
              <Switch
                checked={interest.shared || false}
                onCheckedChange={(checked) => {
                  console.log('Switch changed:', checked); // Debug
                  onSharingToggle(checked);
                }}
                onClick={handleSharingClick}
              />
            </div>
            
            {/* Expand Icon */}
            <div className={`transition-all duration-300 text-muted-foreground 
                             group-hover:text-typography ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-card-border bg-card-muted">
          <div className="p-6 space-y-6">
            {interest.interest_area.triggers?.map((trigger: InterestAreaTrigger, index: number) => (
              <div key={`${trigger.name}-${index}`} className="space-y-3">
                
                {/* Label */}
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-base text-typography">
                    {trigger.name}
                  </label>
                  <span className="text-xs font-medium px-3 py-1 rounded-full 
                                 bg-muted text-muted-foreground">
                    {trigger.type === TypeEnum.BOOLEAN && "✓ Sim/Não"}
                    {trigger.type === TypeEnum.SCALE && "📊 Escala 0-10"}
                    {trigger.type === TypeEnum.INT && "🔢 Número"}
                    {trigger.type === TypeEnum.TEXT && "📝 Texto"}
                  </span>
                </div>
                
                {/* Input container */}
                <div className={`rounded-xl p-4 border transition-all duration-200 ${
                  interest.triggerResponses?.[trigger.name]
                    ? 'bg-card border-ring/30 shadow-inner' 
                    : 'bg-card border-card-border hover:border-ring/20'
                }`}>
                  {renderTriggerInput(trigger)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DiaryInfoForm() {
  const navigate = useNavigate();
  
  // Estados principais
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Estados do formulário
  const [openTriggers, setOpenTriggers] = useState<Record<number, boolean>>({});
  const [timeRange, setTimeRange] = useState<"today" | "sinceLast">("sinceLast");
  const [freeText, setFreeText] = useState("");
  const [shareText, setShareText] = useState(false);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);

  // Carrega interesses do usuário
  useEffect(() => {
    const fetchUserInterests = async () => {
      console.log("Carregando interesses do usuário...");
      setIsLoadingInterests(true);

      try {
        const userEntity = await ApiService.apiUserEntityRetrieve();
        const interests = await InterestAreasService.apiInterestAreaList(
          userEntity["person_id"],
        );
        console.log("Interesses recebidos:", interests);

        if (!interests || interests.length === 0) {
          console.warn("Nenhum interesse encontrado");
          setUserInterests([]);
          return;
        }

        // Formata interesses para incluir triggerResponses vazio
        interface FormattedTrigger {
          name: string;
          type: TypeEnum;
          response: string | null;
        }

        interface FormattedInterestArea {
          triggers: FormattedTrigger[];
          [key: string]: any;
        }

        const formattedInterests: UserInterest[] = interests.map((interest: any): UserInterest => ({
          ...interest,
          interest_area: {
            ...(interest.interest_area as FormattedInterestArea),
            triggers: Array.isArray(interest.interest_area.triggers)
              ? (interest.interest_area.triggers as any[]).map((trigger: any): FormattedTrigger => ({
                  name: String(trigger?.name || trigger || ''),
                  type: trigger?.type || TypeEnum.TEXT,
                  response: trigger?.response || null,
                }))
              : []
          },
          triggerResponses: {} as Record<string, string>,
        }));

        setUserInterests(formattedInterests);
      } catch (error) {
        console.error("Erro ao carregar interesses:", error);
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchUserInterests();
  }, []);

  // Handlers para interesses
  const toggleInterest = (interestId: number) => {
    setOpenTriggers((prev) => ({
      ...prev,
      [interestId]: !prev[interestId],
    }));
  };

  const handleInterestSharingToggle = (interestId: number, shared: boolean) => {
    setUserInterests((prev) =>
      prev.map((interest) =>
        interest.observation_id === interestId ? { ...interest, shared } : interest,
      ),
    );
  };

  const handleTriggerResponseChange = (
    interestId: number,
    triggerName: string,
    response: string,
  ) => {
    setUserInterests((prev) =>
      prev.map((interest) =>
        interest.observation_id === interestId
          ? {
              ...interest,
              triggerResponses: {
                ...(interest.triggerResponses || {}),
                [triggerName]: response,
              },
            }
          : interest,
      ),
    );
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formattedInterestAreas = userInterests
        .filter((interest) => {
          const triggerResponses = interest.triggerResponses || {};
          return Object.values(triggerResponses).some(
            (response) => response && response.trim() !== "",
          );
        })
        .map((interest) => {
          const triggerResponses = interest.triggerResponses || {};

          const triggersWithResponses =
            interest.interest_area.triggers
              ?.filter(
                (trigger) =>
                  triggerResponses[trigger.name] &&
                  triggerResponses[trigger.name]?.trim() !== "",
              )
              .map((trigger) => ({
                name: trigger.name,
                type: trigger.type || TypeEnum.TEXT,
                response: triggerResponses[trigger.name] || "",
              })) || [];

          return {
            name: interest.interest_area.name,
            is_attention_point: interest.interest_area.is_attention_point,
            marked_by: interest.interest_area.marked_by || [],
            triggers: triggersWithResponses,
            interest_area_id: interest.observation_id,
            shared_with_provider: interest.shared,
          };
        })
        .filter((interest) => interest.triggers.length > 0);

      const diary_shared = shareText || userInterests.some((interest) => interest.shared);

      const diary = {
        date_range_type:
          timeRange === "today"
            ? DateRangeTypeEnum.TODAY
            : DateRangeTypeEnum.SINCE_LAST,
        text: freeText,
        text_shared: shareText,
        interest_areas: formattedInterestAreas,
        diary_shared: diary_shared,
      };

      console.log("Enviando diário:", diary);

      await DiaryService.diariesCreate(diary);
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate("/diary");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      setSubmitError(
        "Ocorreu um erro ao salvar o diário. Por favor, tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSubmitError = () => {
    setSubmitError(null);
  };

  // Estatísticas do formulário
  const totalInterests = userInterests.length;
  const answeredInterests = userInterests.filter((interest) => {
    const responses = interest.triggerResponses || {};
    return Object.values(responses).some((resp) => resp && resp.trim() !== "");
  }).length;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8 pb-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mensagens de status */}
        {submitSuccess && (
          <SuccessMessage message="Diário salvo com sucesso! Redirecionando..." />
        )}

        {submitError && (
          <ErrorMessage
            message={submitError}
            onClose={clearSubmitError}
            onRetry={clearSubmitError}
            variant="destructive"
          />
        )}

        {/* Seção de Período de Tempo */}
        <section className="bg-card rounded-xl shadow-md border border-card-border p-6 relative overflow-hidden">
          <h3 className="font-bold text-typography mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-homebg" />
            Período do diário
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTimeRange("today")}
              className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                timeRange === "today"
                  ? "bg-homebg text-primary-foreground shadow-lg border-2 border-homebg"
                  : "bg-transparent text-typography border-2 border-card-border hover:border-homebg/50 hover:bg-accent hover:text-homebg"
              }`}
            >
              🕐 Hoje
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("sinceLast")}
              className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                timeRange === "sinceLast"
                  ? "bg-selection text-primary-foreground shadow-lg border-2 border-selection"
                  : "bg-transparent text-typography border-2 border-card-border hover:border-selection/50 hover:bg-accent hover:text-selection"
              }`}
            >
              📅 Desde o último
            </button>
          </div>
        </section>

        {/* Seção de Interesses do Usuário */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-2xl text-typography">
              🎯 Seus Interesses
            </h3>
            {totalInterests > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground bg-gradient-to-r from-homebg/10 to-selection/10 px-3 py-2 rounded-full font-medium border border-card-border">
                  {answeredInterests}/{totalInterests} respondidos
                </span>
              </div>
            )}
          </div>

          {isLoadingInterests ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-homebg/20 border-t-homebg rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground font-medium">Carregando seus interesses...</p>
              </div>
            </div>
          ) : totalInterests === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-card-border">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-typography text-lg font-medium mb-2">
                Você ainda não tem interesses cadastrados.
              </p>
              <p className="text-muted-foreground mb-6">
                Adicione seus interesses para começar a acompanhar seu progresso!
              </p>
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={() => navigate("/user-main-page")}
              >
                🎯 Adicionar Interesses
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userInterests.map((interest) => (
                <EnhancedInterestCard
                  key={interest.observation_id}
                  interest={interest}
                  isOpen={openTriggers[interest.observation_id] || false}
                  onToggle={() => toggleInterest(interest.observation_id)}
                  onSharingToggle={(shared) =>
                    handleInterestSharingToggle(interest.observation_id, shared)
                  }
                  onTriggerResponseChange={(triggerName, response) =>
                    handleTriggerResponseChange(
                      interest.observation_id,
                      triggerName,
                      response,
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>

          <section className="bg-card rounded-2xl shadow-lg p-6 border border-card-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-typography">
                💭 Observações Gerais
              </h3>
              <div className="flex items-center gap-3">
                <Share2 size={18} className={`transition-colors duration-200 ${
                  shareText ? 'text-selection' : 'text-muted-foreground'
                }`} />
                <span className="text-sm text-muted-foreground font-medium">
                  Compartilhar com profissionais
                </span>
                <Switch checked={shareText} onCheckedChange={setShareText} />
              </div>
            </div>
            
            <div className="space-y-4">
              <TextField
                id="freeText"
                name="freeText"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Descreva como você se sente ou qualquer observação importante..."
                multiline={true}
                rows={4}
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  💡 <span className="italic">Suas observações nos ajudam a entender melhor seu bem-estar</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {freeText.length} caracteres
                </div>
              </div>
            </div>
          </section>

          {/* Botão de Submissão */}
          <div className="pt-8 text-center">
            <Button
              variant="orange"
              size="xl"
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md mx-auto hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  💾 SALVAR DIÁRIO
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* CSS customizado para sliders */}
        <style>{`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--card);
            border: 3px solid var(--homebg);
            cursor: pointer;
            box-shadow: var(--hover-shadow);
            transition: all 0.2s ease;
          }
          
          .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: var(--hover-shadow-lg);
          }
          
          .slider-thumb::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--card);
            border: 3px solid var(--homebg);
            cursor: pointer;
            box-shadow: var(--hover-shadow);
          }
        `}</style>
    </div>
  );
}