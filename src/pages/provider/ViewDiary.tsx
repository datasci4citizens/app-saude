import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import { ProviderService } from "@/api/services/ProviderService";
import { ErrorMessage } from "@/components/ui/error-message";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import type { TypeEnum } from "@/api/models/TypeEnum";

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
  observation_id?: number;
  marked_by?: string[];
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
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<string>>(
    new Set(),
  );

  const isAttentionPoint = (interest: InterestAreaDetail) => {
    if (!interest || !interest.marked_by) return false;
    const providerName = localStorage.getItem("social_name");
    return interest.marked_by.includes(providerName || "");
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
            setDiary(diaryData);
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

  const handleMarkAsAttentionPoint = async (interestAreaName: string) => {
    if (!personId || !diary) return;
    const interestArea = diary.interest_areas.find(
      (ia) => ia.name === interestAreaName,
    );
    if (!interestArea || !interestArea.observation_id) return;

    try {
      await InterestAreasService.markObservationAsAttentionPoint({
        area_id: interestArea.observation_id,
        is_attention_point: true,
      });

      // Atualizar o estado para refletir a mudança
      setDiary((prevDiary) => {
        if (!prevDiary) return null;
        return {
          ...prevDiary,
          interest_areas: prevDiary.interest_areas.map((ia) => {
            if (ia.name === interestAreaName) {
              const providerName = localStorage.getItem("social_name") || "";
              return {
                ...ia,
                is_attention_point: true,
                marked_by: [...(ia.marked_by || []), providerName],
              };
            }
            return ia;
          }),
        };
      });
    } catch (err) {
      console.error("Failed to mark as attention point:", err);
      setError("Falha ao marcar como ponto de atenção.");
    }
  };

  const handleRemoveAttentionPoint = async (interestAreaName: string) => {
    if (!personId || !diary) return;

    const interestArea = diary.interest_areas.find(
      (ia) => ia.name === interestAreaName,
    );
    if (!interestArea || !interestArea.observation_id) return;

    try {
      await InterestAreasService.markObservationAsAttentionPoint({
        area_id: interestArea.observation_id,
        is_attention_point: false,
      });

      // Atualizar o estado
      setDiary((prevDiary) => {
        if (!prevDiary) return null;
        const providerName = localStorage.getItem("social_name");
        return {
          ...prevDiary,
          interest_areas: prevDiary.interest_areas.map((ia) => {
            if (ia.name === interestAreaName) {
              return {
                ...ia,
                is_attention_point: false,
                marked_by:
                  ia.marked_by?.filter((name) => name !== providerName) || [],
              };
            }
            return ia;
          }),
        };
      });
    } catch (err) {
      console.error("Failed to remove attention point:", err);
      setError("Falha ao remover ponto de atenção.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!diary || !patient) {
    return (
      <div className="p-4">
        <ErrorMessage message="Dados do diário ou paciente não encontrados." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      <Header
        title={`Diário de ${patient.social_name}`}
        subtitle={`Referente a ${new Date(diary.date).toLocaleDateString(
          "pt-BR",
          { timeZone: "UTC" },
        )}`}
        showBackButton
      />

      <main className="flex-grow p-4 space-y-8 mb-20">
        {/* Seção de Entradas do Diário */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Entradas do Diário
          </h3>
          <div className="space-y-4">
            {diary.entries.map((entry) => (
              <div
                key={entry.created_at}
                className="pb-4 border-b border-gray-200 last:border-b-0"
              >
                <p className="text-gray-700 leading-relaxed">{entry.text}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(entry.created_at).toLocaleString("pt-BR", {
                    timeZone: "UTC",
                  })} - {entry.shared ? "Compartilhado" : "Privado"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Áreas de Interesse e Gatilhos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Áreas de Interesse e Gatilhos
          </h3>
          <div className="space-y-6 mt-4">
            {diary.interest_areas.map((interest) => {
              const isExpanded = expandedInterests.has(interest.name);
              const isPoint = isAttentionPoint(interest);

              return (
                <div
                  key={interest.name}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    isPoint
                      ? "bg-red-50 border-2 border-red-200 shadow-md"
                      : "bg-white shadow-sm"
                  }`}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleInterest(interest.name)}
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      {interest.name}
                    </h4>
                    <div className="flex items-center space-x-4">
                      {isPoint ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAttentionPoint(interest.name);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <i className="mgc_delete_line text-xl" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsAttentionPoint(interest.name);
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <i className="mgc_add_line text-xl" />
                        </button>
                      )}
                      <i
                        className={`mgc_down_line text-xl text-gray-500 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {interest.triggers.length > 0 ? (
                        <ul className="space-y-4">
                          {interest.triggers.map((trigger) => (
                            <li
                              key={trigger.name}
                              className="pl-4 border-l-2 border-blue-200"
                            >
                              <p className="font-semibold text-gray-700">
                                {trigger.name}
                              </p>
                              <p className="text-gray-600 italic">
                                Resposta: "{trigger.response}"
                              </p>
                              <span className="text-xs text-gray-400 mt-1 block">
                                {trigger.shared_with_provider
                                  ? "Compartilhado"
                                  : "Não compartilhado"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          Nenhum gatilho registrado para esta área.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavigationBar variant="acs" forceActiveId="patients" />
    </div>
  );
}
