import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import type { PatchedMarkAttentionPoint } from "@/api/models/PatchedMarkAttentionPoint";
import { ProviderService } from "@/api/services/ProviderService";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import { ErrorMessage } from "@/components/ui/error-message";
import BottomNavigationBar from "@/components/ui/navigator-bar";

interface DiaryEntryDetail {
  id?: number;
  text_content?: string;
  created_at?: string;
  scope?: string;
  value_as_string?: string;
}

interface ResponseDetail {
  trigger_id?: number;
  content?: string;
  created_at?: string;
  trigger_name?: string;
  value_as_string?: string;
}

interface InterestAreaDetail {
  interest_area_id?: number;
  interest_name?: string;
  triggers?: ResponseDetail[];
  is_attention_point?: boolean;
  provider_name?: string | null;
  shared_with_provider?: boolean;
}

interface DiaryDetail {
  diary_id: number;
  date: string;
  scope: string;
  entries: DiaryEntryDetail[];
  interest_areas?: InterestAreaDetail[];
}

export default function ViewDiary() {
  const { diaryId, personId } = useParams<{ diaryId: string; personId: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<number>>(new Set());

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
          const patientData = await PersonService.apiPersonRetrieve(Number(personId));
          setPatient(patientData);
          const diaryData = await ProviderService.providerPatientsDiariesRetrieve(diaryId, Number(personId));
          if (diaryData) {
            const loggedProviderName = localStorage.getItem("fullname") || "Você";
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
                  provider_name: area.provider_name === loggedProviderName ? "Você" : area.provider_name,
                }))
                .filter((area: any) => area.shared_with_provider),
            };
            setDiary(diaryWithResolvedNames);
          } else {
            setError("Diário não encontrado.");
          }
        } catch (err) {
          setError("Não foi possível carregar os dados do diário.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [diaryId, personId]);

  const clearError = () => setError(null);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const toggleInterest = (interestId: number) => {
    setExpandedInterests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) newSet.delete(interestId);
      else newSet.add(interestId);
      return newSet;
    });
  };

  const getGeneralTextEntry = (): { text: string; shared: boolean } | null => {
    if (!diary || !diary.entries || diary.entries.length === 0) return null;
    for (const entry of diary.entries) {
      if (entry.text_content && entry.text_content.trim() !== "") return { text: entry.text_content, shared: true };
    }
    return null;
  };

  const handleAttentionToggle = async (areaId: number, isCurrentlyFlagged: boolean) => {
    try {
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
    } catch {
      setError("Não foi possível atualizar a área de interesse.");
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
            : patient
            ? `${patient.first_name} ${patient.last_name || ""}`.trim()
            : "Visualização do Diário"
        }
      />
      {loading && (
        <div className="flex justify-center items-center py-16">
          <p className="text-lg text-muted-foreground">Carregando diário...</p>
        </div>
      )}
      {error && <ErrorMessage message={error} variant="destructive" onClose={clearError} />}
      {!loading && !error && diary && (
        <>
          {patient && (
            <div className="bg-card p-4 rounded-lg border border-border mb-6">
              <h3 className="font-semibold text-lg text-card-foreground mb-3">Informações do Paciente</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Nome:</span>{" "}
                  {patient.social_name || `${patient.first_name} ${patient.last_name || ""}`.trim() || "Não informado"}
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
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-lg text-typography mb-1">Período de tempo</h3>
            <div className="bg-primary p-4 rounded-lg border border-border">
              <span className="text-sm text-muted-foreground">
                {diary.scope === "today" ? "Registros do dia de hoje" : "Registros desde a última entrada"}
              </span>
            </div>
          </div>
          {diary.interest_areas && diary.interest_areas.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-lg text-typography mb-1">Áreas de Interesse</h3>
              <div className="space-y-4">
                {diary.interest_areas.map((interest) => {
                  if (!interest.interest_area_id) return null;
                  const isExpanded = expandedInterests.has(interest.interest_area_id);
                  const hasResponses = interest.triggers && interest.triggers.some((t) => t.value_as_string);
                  return (
                    <div key={interest.interest_area_id} className="bg-card border border-border rounded-xl shadow-sm">
                      <div className="p-5 cursor-pointer" onClick={() => toggleInterest(interest.interest_area_id!)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-typography text-base font-semibold">{interest.interest_name}</p>
                            {interest.is_attention_point && (
                              <p className="text-sm text-primary">ÁREA DE ATENÇÃO</p>
                            )}
                          </div>
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleAttentionToggle(
                                  interest.interest_area_id!,
                                  interest.is_attention_point || false,
                                );
                              }}
                              className="text-primary underline text-sm"
                            >
                              {interest.is_attention_point ? "Remover da Atenção" : "Marcar como Atenção"}
                            </button>
                            <svg
                              className={`h-4 w-4 text-primary transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {isExpanded && hasResponses && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {interest.triggers!.map((response, idx) => (
                              <div key={idx} className="mb-1">
                                <p className="font-semibold">{response.trigger_name || "Resposta"}</p>
                                <p>{response.value_as_string}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {(() => {
            const generalText = getGeneralTextEntry();
            if (!generalText) return null;
            return (
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg text-typography mb-1">Texto Geral do Diário</h3>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p>{generalText.text}</p>
                </div>
              </div>
            );
          })()}
        </>
      )}
      <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
    </div>
  );
}
