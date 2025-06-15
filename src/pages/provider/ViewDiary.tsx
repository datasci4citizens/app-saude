import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import { ProviderService } from "@/api/services/ProviderService";
import { ErrorMessage } from "@/components/ui/error-message";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import { type PatchedMarkAttentionPoint } from "@/api/models/PatchedMarkAttentionPoint";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { TypeEnum } from "@/api/models/TypeEnum";

// Updated interfaces to match new server response structure
interface DiaryEntryDetail {
  text: string;
  shared: boolean;
  created_at: string;
}

interface TriggerDetail {
  name: string;
  type?: TypeEnum;
  response: string;
  shared_with_provider?: boolean;
}

interface InterestAreaDetail {
  name: string;
  shared: boolean;
  triggers: TriggerDetail[];
  is_attention_point?: boolean;
  provider_name?: string | null;
  interest_area_id?: number; // Keeping for backward compatibility
}

interface DiaryDetail {
  diary_id: number;
  date: string;
  scope: string;
  entries: DiaryEntryDetail[];
  interest_areas: InterestAreaDetail[];
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
  const [expandedInterests, setExpandedInterests] = useState<Set<string>>(
    new Set()
  );
  const [localAttentionPoints, setLocalAttentionPoints] = useState<Set<number>>(
    new Set()
  );

  // Funções para gerenciar pontos de atenção no localStorage
  const getAttentionPointsKey = () =>
    `attentionPoints_provider_${
      localStorage.getItem("provider_id") || "unknown"
    }`;

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
        error
      );
    }
    return new Set<number>();
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
            Number(personId)
          );
          setPatient(patientData);

          // Buscar o diário específico diretamente
          const diaryData =
            await ProviderService.providerPatientsDiariesRetrieve(
              diaryId,
              Number(personId)
            );

          if (diaryData) {
            const loggedProviderName =
              localStorage.getItem("fullname") || "Você";

            // Map data to the new structure
            const diaryWithResolvedNames: DiaryDetail = {
              diary_id: diaryData.diary_id,
              date: diaryData.date,
              scope: diaryData.scope || "since_last",
              entries: diaryData.entries
                .map((entry: any) => ({
                  text: entry.text || "",
                  shared: entry.text_shared || entry.shared || false,
                  created_at: entry.created_at || new Date().toISOString(),
                }))
                .filter((entry: any) => entry.shared),
              interest_areas: (diaryData.interest_areas || [])
                .map((area: any) => ({
                  name: area.name || area.interest_name || "",
                  shared: area.shared || area.shared_with_provider || false,
                  triggers: (area.triggers || []).map((trigger: any) => ({
                    name: trigger.name || trigger.trigger_name || "",
                    type: trigger.type || "text",
                    response: trigger.response || trigger.value_as_string || "",
                    shared_with_provider:
                      area.shared || area.shared_with_provider || false,
                  })),
                  is_attention_point: area.is_attention_point || false,
                  provider_name:
                    area.provider_name === loggedProviderName
                      ? "Você"
                      : area.provider_name,
                  interest_area_id: area.interest_area_id || null,
                }))
                .filter((area: any) => area.shared),
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

  // Toggle interest expansion - now using name as the identifier
  const toggleInterest = (interestName: string) => {
    setExpandedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestName)) {
        newSet.delete(interestName);
      } else {
        newSet.add(interestName);
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
      if (entry.text && entry.text.trim() !== "") {
        return {
          text: entry.text,
          shared: entry.shared, // Provider only sees shared entries
        };
      }
    }

    return null;
  };

  const handleAttentionToggle = async (
    areaId: number,
    isCurrentlyFlagged: boolean
  ) => {
    const newAttentionPoints = new Set(localAttentionPoints);

    try {
      const request: PatchedMarkAttentionPoint = {
        area_id: areaId,
        is_attention_point: !isCurrentlyFlagged,
      };
      await InterestAreasService.markObservationAsAttentionPoint(request);

      if (isCurrentlyFlagged) {
        newAttentionPoints.delete(areaId);
      } else {
        newAttentionPoints.add(areaId);
      }

      console.log(
        "Toggling flag for area:",
        areaId,
        "New state:",
        !isCurrentlyFlagged,
        "Saved to server"
      );
    } catch (error) {
      console.error("Erro ao marcar ponto de atenção:", error);
    }

    setLocalAttentionPoints(newAttentionPoints);
  };

  const location = useLocation();
  const getActiveNavId = () => {
    if (location.pathname.startsWith("/acs-main-page")) return "home";
    if (location.pathname.startsWith("/appointments")) return "consults";
    if (location.pathname.startsWith("/patients")) return "patients";
    if (location.pathname.startsWith("/emergencies")) return "emergency";
    if (location.pathname.startsWith("/acs-profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/acs-main-page");
        break;
      case "patients":
        navigate("/patients");
        break;
      case "emergency":
        navigate("/emergencies");
        break;
      case "profile":
        navigate("/acs-profile");
        break;
    }
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
                  const interestId = interest.interest_area_id || 0;
                  const isExpanded = expandedInterests.has(interest.name);
                  const hasResponses =
                    interest.triggers &&
                    interest.triggers.some(
                      (t) => t.response && t.response.trim() !== ""
                    );
                  const isAttentionPointFlag = isAttentionPoint(interestId);

                  return (
                    <div
                      key={interest.name}
                      className="bg-card border border-border rounded-xl shadow-sm"
                    >
                      <div
                        className="p-5 cursor-pointer"
                        onClick={() => toggleInterest(interest.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-2 h-2 bg-gradient-interest-indicator rounded-full flex-shrink-0"></span>
                            <h4 className="font-bold text-lg text-card-foreground">
                              {interest.name}
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
                            {interestId > 0 && (
                              <div className="mb-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAttentionToggle(
                                      interestId,
                                      isAttentionPointFlag
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
                            )}

                            {/* Responses */}
                            {hasResponses ? (
                              <div className="space-y-3">
                                <h5 className="font-medium text-sm text-muted-foreground mb-2">
                                  Respostas:
                                </h5>
                                {interest.triggers?.map(
                                  (trigger, index) =>
                                    trigger.response &&
                                    trigger.response.trim() !== "" && (
                                      <div
                                        key={index}
                                        className="bg-homebg p-3 rounded-lg border-l-4 border-primary"
                                      >
                                        <div className="text-sm">
                                          <span className="font-medium text-foreground">
                                            {trigger.name}:
                                          </span>
                                          <span className="ml-2 text-muted-foreground">
                                            {trigger.response}
                                          </span>
                                        </div>
                                      </div>
                                    )
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
      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
