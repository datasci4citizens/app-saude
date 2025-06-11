import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import type { PatchedMarkAttentionPoint } from "@/api/models/PatchedMarkAttentionPoint";
import { ProviderService } from "@/api/services/ProviderService";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useNavigate } from "react-router-dom";



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
  provider_name?: string;
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
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 
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

          // Buscar o diário específico diretamente
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
                .map((entry) => ({
                  ...entry,
                  text_content: entry.text || "",
                  text_shared: entry.text_shared || false,
                }))
                .filter((entry) => entry.text_shared),
              interest_areas: diaryData.interest_areas
                .map((area) => ({
                  ...area,
                  provider_name:
                    area.provider_name === loggedProviderName
                      ? "Você"
                      : area.provider_name,
                }))
                .filter((area) => area.shared_with_provider),
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Hora inválida";
    }
  };

  const handleToggleFlag = async (
    areaId: number,
    isCurrentlyFlagged: boolean,
  ) => {
    try {
      console.log(
        "Toggling flag for area:",
        areaId,
        "Current state:",
        isCurrentlyFlagged,
      );
      const updatedArea: PatchedMarkAttentionPoint = {
        area_id: areaId,
        is_attention_point: !isCurrentlyFlagged,
      };
      await InterestAreasService.markObservationAsAttentionPoint(updatedArea);

      setDiary((prevDiary) => {
        if (!prevDiary) return prevDiary;
        return {
          ...prevDiary,
          interest_areas: (prevDiary.interest_areas ?? []).map((area) =>
            area.interest_area_id === areaId
              ? {
                  ...area,
                  is_attention_point: updatedArea.is_attention_point,
                  provider_name: updatedArea.is_attention_point ? "Você" : null,
                }
              : area,
          ),
        };
      });
    } catch (error) {
      console.error("Erro ao atualizar área de interesse:", error);
      setError("Não foi possível atualizar a área de interesse.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      <div className="p-4">
        <Header title="Visualizar Diário" centered={true} />
      </div>

      <div className="flex-1 px-4 overflow-auto m-4">
        {loading && (
          <p className="text-campos-preenchimento2 text-gray2">Carregando...</p>
        )}

        {error && (
          <p className="text-campos-preenchimento2 text-destructive">{error}</p>
        )}

        {!loading && !error && patient && diary && (
          <div className="space-y-6">
            {/* Informações do Paciente */}
            <div className="bg-offwhite p-4 rounded-lg shadow-md">
              <h2 className="text-topicos2 text-typography mb-3">
                Informações do Paciente
              </h2>
              <div className="space-y-2">
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Nome:
                  </span>{" "}
                  {patient.social_name ||
                    patient.first_name + " " + patient.last_name ||
                    "Não informado"}
                </p>
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    ID:
                  </span>{" "}
                  {patient.person_id}
                </p>
              </div>
            </div>

            {/* Informações do Diário */}
            <div className="bg-offwhite p-4 rounded-lg shadow-md">
              <h2 className="text-topicos2 text-typography mb-3">
                Informações do Diário
              </h2>
              <div className="space-y-2">
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Data:
                  </span>{" "}
                  {formatDate(diary.date)}
                </p>
              </div>
            </div>

            {/* Entradas do Diário */}
            <div className="space-y-4">
              <h2 className="text-topicos2 text-typography">
                Observações (texto livre)
              </h2>

              {(!diary.entries || diary.entries.length === 0) && (
                <div className="bg-offwhite p-4 rounded-lg shadow-md">
                  <p className="text-campos-preenchimento2 text-gray2">
                    Nenhuma entrada encontrada neste diário.
                  </p>
                </div>
              )}

              {diary.entries && diary.entries.length > 0 && (
                <div className="space-y-3">
                  {diary.entries.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="bg-offwhite p-4 rounded-lg shadow-md"
                    >
                      {entry.text_content && (
                        <div className="mb-3">
                          <p className="text-campos-preenchimento2 text-typography whitespace-pre-wrap">
                            {entry.text_content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Áreas de Interesse */}
            <div className="space-y-4">
              <h2 className="text-topicos2 text-typography">
                Áreas de Interesse
              </h2>

              {(!diary.interest_areas || diary.interest_areas.length === 0) && (
                <div className="bg-offwhite p-4 rounded-lg shadow-md">
                  <p className="text-campos-preenchimento2 text-gray2">
                    Nenhuma área de interesse encontrada neste diário.
                  </p>
                </div>
              )}

              {diary.interest_areas && diary.interest_areas.length > 0 && (
                <div className="space-y-3">
                  {diary.interest_areas.map((area, areaIndex) => (
                    <div
                      key={area.interest_area_id || areaIndex}
                      className="bg-offwhite p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-topicos2 text-typography">
                          {area.interest_name || `Área ${areaIndex + 1}`}
                        </h3>

                        <button
                          className={`flex items-center text-sm font-medium rounded px-2 py-1 border 
                            ${area.is_attention_point ? "text-destructive border-destructive" : "text-gray2 border-gray3"} 
                            hover:bg-muted transition`}
                          onClick={() =>
                            handleToggleFlag(
                              area.interest_area_id || areaIndex,
                              area.is_attention_point || false,
                            )
                          }
                        >
                          {area.is_attention_point
                            ? "Remover atenção ⚠️"
                            : "Marcar atenção ⚠️"}
                        </button>
                      </div>

                      {area.is_attention_point && area.provider_name && (
                        <p className="text-xs text-destructive mb-2 italic">
                          Marcado por {area.provider_name}
                        </p>
                      )}

                      {area.triggers && area.triggers.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="text-topicos2 text-typography-foreground font-medium">
                            Respostas:
                          </h4>
                          <div className="space-y-2">
                            {area.triggers.map((response, responseIndex) => (
                              <div
                                key={response.trigger_id || responseIndex}
                                className="bg-background p-3 rounded border-l-4 border-primary"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-topicos2 text-typography-foreground">
                                    {response.trigger_name &&
                                    response.value_as_string
                                      ? `${response.trigger_name} : ${response.value_as_string}`
                                      : `Resposta ${responseIndex + 1}`}
                                  </span>
                                  {response.created_at && (
                                    <span className="text-desc-titulo text-gray2">
                                      {formatTime(response.created_at)}
                                    </span>
                                  )}
                                </div>
                                {response.content && (
                                  <p className="text-campos-preenchimento2 text-typography whitespace-pre-wrap">
                                    {response.content}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-campos-preenchimento2 text-gray2">
                          Nenhuma resposta encontrada para esta área.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="acs"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
