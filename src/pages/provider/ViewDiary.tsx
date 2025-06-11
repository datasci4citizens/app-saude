import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import { ProviderService } from "@/api/services/ProviderService";
import { ErrorMessage } from "@/components/ui/error-message";

// Interface para as entradas do diário
interface DiaryEntryDetail {
  id?: number;
  text_content?: string;
  created_at?: string;
  scope?: string;
  value_as_string?: string;
}

// Interface para as respostas das áreas de interesse
interface ResponseDetail {
  trigger_id?: number;
  content?: string;
  created_at?: string;
  trigger_name?: string;
  value_as_string?: string;
}

// Interface para as áreas de interesse
interface InterestAreaDetail {
  interest_area_id?: number;
  interest_name?: string;
  triggers?: ResponseDetail[];
  is_attention_point?: boolean;
  provider_name?: string | null; // Permitir null
  shared_with_provider?: boolean;
}

// Interface para o diário completo
interface DiaryDetail {
  diary_id: number;
  date: string;
  scope: string;
  entries: DiaryEntryDetail[];
  interest_areas?: InterestAreaDetail[];
}

export default function ViewDiary() {
  const { diaryId, personId } = useParams<{
    diaryId: string;
    personId: string;
  }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<number>>(
    new Set(),
  );
  const [localAttentionPoints, setLocalAttentionPoints] = useState<Set<number>>(
    new Set(),
  );

  // Funções para gerenciar pontos de atenção no localStorage
  const getAttentionPointsKey = () =>
    `attentionPoints_provider_${localStorage.getItem("provider_id") || "unknown"}`;

  const loadLocalAttentionPoints = () => {
    try {
      const stored = localStorage.getItem(getAttentionPointsKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn(
        "Erro ao carregar pontos de atenção do localStorage:",
        error,
      );
    }
    return new Set<number>();
  };

  const saveLocalAttentionPoints = (points: Set<number>) => {
    try {
      localStorage.setItem(
        getAttentionPointsKey(),
        JSON.stringify([...points]),
      );
    } catch (error) {
      console.warn("Erro ao salvar pontos de atenção no localStorage:", error);
    }
  };

  const isAttentionPoint = (areaId: number) => {
    return localAttentionPoints.has(areaId);
  };

  // Carregar pontos de atenção quando o componente for montado
  useEffect(() => {
    setLocalAttentionPoints(loadLocalAttentionPoints());
  }, []);

  useEffect(() => {
    if (diaryId && personId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Buscar dados do paciente
          const patientData = await PersonService.apiPersonRetrieve(
            Number(personId),
          );
          setPatient(patientData);

          // Buscar o diário espehcífico diretamente
          const diaryData =
            await ProviderService.providerPatientsDiariesRetrieve(
              diaryId,
              Number(personId),
            );

          if (diaryData) {
            const loggedProviderName =
              localStorage.getItem("fullname") || "Você";
            const diaryWithResolvedNames: DiaryDetail = {
              ...diaryData,
              entries: diaryData.entries
                .map((entry: any) => ({
                  ...entry,
                  text_content: entry.text || "",
                  text_shared: entry.text_shared || false,
                }))
                .filter((entry: any) => entry.text_shared),
              interest_areas: diaryData.interest_areas
                .map((area: any) => ({
                  ...area,
                  provider_name:
                    area.provider_name === loggedProviderName
                      ? "Você"
                      : area.provider_name,
                }))
                .filter((area: any) => area.shared_with_provider),
            };

            setDiary(diaryWithResolvedNames);
          } else {
            setError("Diário não encontrado.");
          }
        } catch (err) {
          console.error("Error fetching diary data:", err);
          setError("Não foi possível carregar os dados do diário.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [diaryId, personId]);

  // Função para limpar erro
  const clearError = () => {
    setError(null);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Toggle interest expansion
  const toggleInterest = (interestId: number) => {
    setExpandedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  // Get general text entry if available
  const getGeneralTextEntry = (): { text: string; shared: boolean } | null => {
    if (!diary || !diary.entries || diary.entries.length === 0) {
      return null;
    }

    for (const entry of diary.entries) {
      if (entry.text_content && entry.text_content.trim() !== "") {
        return {
          text: entry.text_content,
          shared: true, // Provider only sees shared entries
        };
      }
    }

    return null;
  };

  const handleAttentionToggle = (
    areaId: number,
    isCurrentlyFlagged: boolean,
  ) => {
    const newAttentionPoints = new Set(localAttentionPoints);

    if (isCurrentlyFlagged) {
      newAttentionPoints.delete(areaId);
    } else {
      newAttentionPoints.add(areaId);
    }

    setLocalAttentionPoints(newAttentionPoints);
    saveLocalAttentionPoints(newAttentionPoints);

    console.log(
      "Toggling flag for area:",
      areaId,
      "New state:",
      !isCurrentlyFlagged,
      "Saved to localStorage",
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Header
        title="Visualizar Diário do Paciente"
        onBackClick={() => navigate(-1)}
        subtitle={
          diary?.date
            ? formatDate(diary.date)
            : patient?.first_name
              ? `${patient.first_name} ${patient.last_name || ""}`.trim()
              : "Visualização do Diário"
        }
      />

      {loading && (
        <div className="flex justify-center items-center py-16">
          <p className="text-lg text-muted-foreground">Carregando diário...</p>
        </div>
      )}

      {error && (
        <ErrorMessage
          message={error || "Erro ao carregar diário"}
          variant="destructive"
          onClose={clearError}
        />
      )}

      {!loading && !error && diary && (
        <>
          {/* Patient Info Section */}
          {patient && (
            <div className="bg-card p-4 rounded-lg border border-border mb-6">
              <h3 className="font-semibold text-lg text-card-foreground mb-3">
                Informações do Paciente
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Nome:</span>{" "}
                  {patient.social_name ||
                    `${patient.first_name} ${patient.last_name || ""}`.trim() ||
                    "Não informado"}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {patient.person_id}
                </p>
                {patient.email && (
                  <p>
                    <span className="font-medium">Email:</span> {patient.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Time Range Section */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-lg text-typography mb-1">
              Período de tempo
            </h3>
            <div className="bg-primary p-4 rounded-lg border border-border">
              <span className="text-sm text-muted-foreground">
                {diary.scope === "today"
                  ? "Registros do dia de hoje"
                  : "Registros desde a última entrada"}
              </span>
            </div>
          </div>

          {/* Interest Areas Section */}
          {diary.interest_areas && diary.interest_areas.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-lg text-typography mb-1">
                Áreas de Interesse
              </h3>
              <div className="space-y-4">
                {diary.interest_areas.map((interest) => {
                  if (!interest.interest_area_id) return null;

                  const isExpanded = expandedInterests.has(
                    interest.interest_area_id,
                  );
                  const hasResponses =
                    interest.triggers &&
                    interest.triggers.some((t) => t.value_as_string);
                  const isAttentionPointFlag = isAttentionPoint(
                    interest.interest_area_id,
                  );

                  return (
                    <div
                      key={interest.interest_area_id}
                      className="bg-card border border-border rounded-xl shadow-sm"
                    >
                      <div
                        className="p-5 cursor-pointer"
                        onClick={() =>
                          toggleInterest(interest.interest_area_id!)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-2 h-2 bg-gradient-interest-indicator rounded-full flex-shrink-0"></span>
                            <h4 className="font-bold text-lg text-card-foreground">
                              {interest.interest_name}
                            </h4>
                            {isAttentionPointFlag && (
                              <span className="text-destructive text-lg">
                                ⚠️
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-success text-sm font-medium">
                              ✓ Compartilhado
                            </span>
                            <span
                              className={`transform transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            >
                              ▼
                            </span>
                          </div>
                        </div>

                        {isAttentionPointFlag && interest.provider_name && (
                          <div className="mt-2">
                            <span className="text-xs text-destructive italic">
                              Marcado como ponto de atenção por{" "}
                              {interest.provider_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <div className="border-t border-border pt-4">
                            {/* Attention Point Button */}
                            <div className="mb-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAttentionToggle(
                                    interest.interest_area_id!,
                                    isAttentionPointFlag,
                                  );
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  isAttentionPointFlag
                                    ? "bg-destructive text-white hover:bg-destructive/80"
                                    : "bg-orange-500 text-white hover:bg-orange-600"
                                }`}
                              >
                                {isAttentionPointFlag
                                  ? "Remover atenção ⚠️"
                                  : "Marcar atenção ⚠️"}
                              </button>
                            </div>

                            {/* Responses */}
                            {hasResponses ? (
                              <div className="space-y-3">
                                <h5 className="font-medium text-sm text-muted-foreground mb-2">
                                  Respostas:
                                </h5>
                                {interest.triggers?.map(
                                  (trigger, index) =>
                                    trigger.value_as_string && (
                                      <div
                                        key={trigger.trigger_id || index}
                                        className="bg-background p-3 rounded-lg border-l-4 border-primary"
                                      >
                                        <div className="text-sm">
                                          <span className="font-medium text-foreground">
                                            {trigger.trigger_name}:
                                          </span>
                                          <span className="ml-2 text-muted-foreground">
                                            {trigger.value_as_string}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Nenhuma resposta registrada para esta área.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* General Text Section */}
          {(() => {
            const textEntry = getGeneralTextEntry();
            return textEntry && textEntry.text ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg text-typography mb-1">
                    Observações Gerais
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-success">
                      ✓ Compartilhado com profissionais
                    </span>
                  </div>
                </div>

                <div className="bg-primary p-4 rounded-lg whitespace-pre-wrap min-h-[150px] border border-border">
                  {textEntry.text}
                </div>
              </div>
            ) : null;
          })()}

          {/* Action button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-button-edit hover:bg-gradient-button-edit-hover text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Voltar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
