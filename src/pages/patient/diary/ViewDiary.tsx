import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";
import { DiariesService } from "@/api/services/DiariesService";
import HabitCard from "@/components/ui/habit-card";

// Define types based on our actual data model
interface DiaryTrigger {
  trigger_id: number;
  trigger_name?: string;
  value_as_string: string;
}

interface DiaryInterestArea {
  interest_area_id: number;
  interest_name?: string;
  shared_with_provider: boolean;
  triggers: DiaryTrigger[];
}

interface DiaryData {
  id: string;
  created_at: string;
  date_range_type: string;
  text: string;
  text_shared: boolean;
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
        // Fetch diary by ID
        const diaryData = await DiariesService.diariesRetrieve(diaryId);
        setDiary(diaryData);
      } catch (error) {
        console.error("Error fetching diary:", error);
        setError("Failed to load diary. Please try again.");
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

      // Can format as needed for your locale
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <BackArrow onClick={() => navigate(-1)} />
          <h1 className="text-2xl font-bold ml-4">Carregando diário...</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <BackArrow onClick={() => navigate(-1)} />
          <h1 className="text-2xl font-bold ml-4">Erro</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || "Diário não encontrado"}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <BackArrow onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-bold ml-4">Visualizar Diário</h1>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-700">
          {diary.created_at
            ? formatDate(diary.created_at)
            : "Data não disponível"}
        </h2>
      </div>

      {/* Time Range Section */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
          Período de tempo
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            {diary.date_range_type === "TODAY"
              ? "Hoje"
              : "Desde o último diário"}
          </p>
        </div>
      </div>

      {/* Interest Areas Section - Only show if there are interests */}
      {diary.interest_areas && diary.interest_areas.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Seus Interesses
            </h3>
          </div>

          <div className="space-y-6">
            {diary.interest_areas.map((interest) => (
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

                {interest.triggers && interest.triggers.length > 0 && (
                  <div className="ml-4 border-l-2 border-gray-200 pl-4">
                    {interest.triggers.map((trigger) => (
                      <div key={trigger.trigger_id} className="mt-3 space-y-2">
                        <HabitCard
                          title={
                            trigger.trigger_name ||
                            `Pergunta ${trigger.trigger_id}`
                          }
                          className="inline-block w-auto min-w-fit max-w-full text-sm bg-secondary/20"
                        />
                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                          {trigger.value_as_string}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Section - Only show if there's text */}
      {diary.text && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Observações Gerais
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Compartilhado com profissionais:{" "}
                {diary.text_shared ? "Sim" : "Não"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap min-h-[150px]">
            {diary.text}
          </div>
        </div>
      )}
    </div>
  );
}
