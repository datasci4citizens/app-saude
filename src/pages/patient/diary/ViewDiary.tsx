import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { DiaryService } from "@/api/services/DiaryService";
import HabitCard from "@/components/ui/habit-card";

// Updated interfaces to match actual server response structure
interface DiaryTrigger {
  trigger_id: number;
  trigger_name: string;
  observation_concept_id: number;
  value_as_string: string | null;
}

interface DiaryInterestArea {
  interest_area_id: number;
  interest_name: string;
  observation_concept_id: number;
  value_as_string: string | null;
  value_as_concept: number | null;
  shared_with_provider: boolean;
  triggers: DiaryTrigger[];
}

interface DiaryEntry {
  observation_id: number;
  value_as_string: string;
  shared_with_provider: boolean;
  created_at: string;
  observation_concept: number;
}

interface DiaryData {
  diary_id: number;
  date: string;
  scope: string; // 'today' or 'since_last' instead of date_range_type
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
}

export default function ViewDiaryEntry() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaryData = async () => {
      if (!diaryId) return;

      try {
        setIsLoading(true);
        console.log(`Fetching diary with ID: ${diaryId}`);

        // Fetch diary by ID
        const response = await DiaryService.diariesRetrieve2(diaryId);
        console.log("Diary API response:", response);

        if (response) {
          console.log("Diary entries:", response.entries);
          console.log("Diary interest areas:", response.interest_areas);
        }

        if (response && response.diary_id) {
          setDiary(response);
        } else {
          console.error(
            "Diary not found or invalid response format:",
            response,
          );
          setError("Diário não encontrado ou formato inválido.");
        }
      } catch (error) {
        console.error("Error fetching diary:", error);
        setError("Falha ao carregar o diário. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    if (diaryId) {
      fetchDiaryData();
    }
  }, [diaryId]);

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

  // Get general text entry if available
  const getGeneralTextEntry = (): { text: string; shared: boolean } | null => {
    if (!diary || !diary.entries || diary.entries.length === 0) {
      return null;
    }

    // Find the general text entry (usually observation_concept = 999002)
    for (const entry of diary.entries) {
      // If we have text content, return it regardless of concept ID
      if (entry.value_as_string && entry.value_as_string.trim() !== "") {
        return {
          text: entry.value_as_string,
          shared: entry.shared_with_provider,
        };
      }
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header title="Visualizar Diário" />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header
          title="Visualizar Diário"
          onBackClick={() => navigate("/diary")}
        />
        <div className="bg-destructive border border-destructive rounded-lg p-4 text-white mt-6">
          {error || "Diário não encontrado"}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray12 hover:bg-gray2 rounded-full text-white"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const textEntry = getGeneralTextEntry();
  const hasContent =
    (textEntry && textEntry.text) ||
    (diary.interest_areas &&
      diary.interest_areas.some(
        (area) => area.triggers && area.triggers.some((t) => t.value_as_string),
      ));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Header
        title="Visualizar Diário"
        onBackClick={() => navigate(-1)}
        subtitle={diary.date ? formatDate(diary.date) : "Data não disponível"}
      />

      {!hasContent && (
        <div className="bg-gray-50 p-6 rounded-lg text-center my-8">
          <p className="text-gray-500 text-lg">
            Este diário não possui conteúdo.
          </p>
        </div>
      )}

      {/* Time Range Section */}
      <div className="space-y-3 mb-6 mt-6">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
          Período de tempo
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>{diary.scope === "today" ? "Hoje" : "Desde o último diário"}</p>
        </div>
      </div>

      {/* Interest Areas Section - Only show if there are interests with responses */}
      {diary.interest_areas && diary.interest_areas.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Seus Interesses
            </h3>
          </div>

          <div className="space-y-6">
            {diary.interest_areas.map((interest) => {
              // Only show triggers that have responses
              const triggersWithResponses = interest.triggers.filter(
                (t) => t.value_as_string && t.value_as_string.trim() !== "",
              );

              if (triggersWithResponses.length === 0) return null;

              return (
                <div key={interest.interest_area_id} className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <HabitCard
                        title={
                          interest.interest_name ||
                          `Interesse ${interest.interest_area_id}`
                        }
                        className="inline-block w-auto min-w-fit max-w-full"
                      />
                      <span className="text-sm text-gray-500">
                        Compartilhado:{" "}
                        {interest.shared_with_provider ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-gray-200 pl-4">
                    {triggersWithResponses.map((trigger) => (
                      <div key={trigger.trigger_id} className="mt-3 space-y-2">
                        {/* Trigger title as question */}
                        <div className="font-medium text-sm text-neutral-700 mb-1">
                          {trigger.trigger_name ||
                            `Pergunta ${trigger.trigger_id}`}
                        </div>

                        {/* Removed HabitCard for triggers, showing full question instead */}
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                          {trigger.value_as_string}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Text Section - Only show if there's text */}
      {textEntry && textEntry.text && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Observações Gerais
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Compartilhado com profissionais:{" "}
                {textEntry.shared ? "Sim" : "Não"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap min-h-[150px]">
            {textEntry.text}
          </div>
        </div>
      )}
    </div>
  );
}
