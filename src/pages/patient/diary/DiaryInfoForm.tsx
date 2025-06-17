import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DiaryService } from "@/api/services/DiaryService";
import { DateRangeTypeEnum } from "@/api/models/DateRangeTypeEnum";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import { ApiService } from "@/api/services/ApiService";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";
import CollapsibleInterestCard from "@/components/ui/CollapsibleInterestCard";

interface UserInterest {
  observation_id: number;
  provider_name?: string;
  shared?: boolean;
  interest_area: InterestArea;
  triggerResponses?: Record<string, string>;
}

export default function DiaryInfoForm() {
  const navigate = useNavigate();

  // Estados principais
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Estados do formulário
  const [openTriggers, setOpenTriggers] = useState<Record<number, boolean>>({});
  const [timeRange, setTimeRange] = useState<"today" | "sinceLast">(
    "sinceLast",
  );
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
        const formattedInterests: UserInterest[] = interests.map(
          (interest) => ({
            ...interest,
            triggerResponses: {},
          }),
        );

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
        interest.observation_id === interestId
          ? { ...interest, shared }
          : interest,
      ),
    );
  };

  // Função atualizada para lidar com respostas de trigger
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
      // Formata áreas de interesse para a API
      const formattedInterestAreas = userInterests
        .filter((interest) => {
          const triggerResponses = interest.triggerResponses || {};
          return Object.values(triggerResponses).some(
            (response) => response && response.trim() !== "",
          );
        })
        .map((interest) => {
          const triggerResponses = interest.triggerResponses || {};

          // Formata os triggers com respostas
          const triggersWithResponses =
            interest.interest_area.triggers
              ?.filter(
                (trigger) =>
                  triggerResponses[trigger.name] &&
                  triggerResponses[trigger.name].trim() !== "",
              )
              .map((trigger) => ({
                name: trigger.name,
                type: trigger.type || "text",
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

      const diary_shared =
        shareText || userInterests.some((interest) => interest.shared);

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

      // Redireciona após sucesso
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
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-accent2-700">
            A qual período de tempo esse diário se refere?
          </h3>
          <div className="flex flex-col gap-2">
            <RadioCheckbox
              id="today"
              label="Hoje"
              checked={timeRange === "today"}
              onCheckedChange={() => setTimeRange("today")}
            />
            <RadioCheckbox
              id="sinceLast"
              label="Desde o último diário"
              checked={timeRange === "sinceLast"}
              onCheckedChange={() => setTimeRange("sinceLast")}
            />
          </div>
        </section>

        {/* Seção de Interesses do Usuário */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-typography">
              Seus Interesses
            </h3>
            {totalInterests > 0 && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {answeredInterests}/{totalInterests} respondidos
              </span>
            )}
          </div>

          {isLoadingInterests ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-selection border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-typography">Carregando seus interesses...</p>
              </div>
            </div>
          ) : totalInterests === 0 ? (
            <div className="text-center py-8 bg-offwhite-foreground rounded-lg">
              <p className="text-typography text-sm mb-2">
                Você ainda não tem interesses cadastrados.
              </p>
              <Button
                type="button"
                variant="outlineWhite"
                size="sm"
                onClick={() => navigate("/user-main")}
              >
                Adicionar Interesses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userInterests.map((interest) => (
                <CollapsibleInterestCard
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

        {/* Seção de Observações Gerais */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-accent2-700">
              Observações Gerais
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 italic">
                Compartilhar com profissionais
              </span>
              <Switch checked={shareText} onCheckedChange={setShareText} />
            </div>
          </div>
          <TextField
            id="freeText"
            name="freeText"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Descreva como você se sente ou qualquer observação importante..."
            className="border-gray2 border-2 focus:border-selection"
            multiline={true}
            rows={4}
          />
        </section>

        {/* Botão de Submissão */}
        <div className="pt-6 text-center">
          <Button
            variant="orange"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[280px] text-offwhite mx-auto py-3 text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </span>
            ) : (
              "SALVAR DIÁRIO"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
