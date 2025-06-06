import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";
import { ObservationService } from "@/api/services/ObservationService";
import { ConceptService } from "@/api/services/ConceptService";
import HabitCard from "@/components/ui/habit-card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Define types based on the original form
type TrackableItem = {
  id: string;
  name: string;
  measurementType: string;
  value: string | undefined;
};

type DiaryData = {
  id: string;
  date: string;
  dateRangeType: string;
  text: string;
  textShared: boolean;
  habitsShared: boolean;
  wellnessShared: boolean;
  habits: TrackableItem[];
  wellness: TrackableItem[];
};

export default function ViewDiaryEntry() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        setIsLoading(true);

        // Fetch all observations for this diary
        const observations = await ObservationService.apiObservationList();
        if (!observations) {
          throw new Error("Failed to fetch observations");
        }

        // Filter observations for this specific diary
        const diaryObservations = observations.filter(
          (obs) =>
            obs.observation_date === diaryId || obs.created_at === diaryId,
        );

        if (diaryObservations.length === 0) {
          throw new Error("Diary not found");
        }

        // Get all wellness concepts for reference
        const wellnessConcepts = await ConceptService.apiConceptList(
          "Wellness",
          "pt",
          "has_value_type",
        );

        // Organize diary data
        const habits: TrackableItem[] = [];
        const wellness: TrackableItem[] = [];
        let text = "";
        let dateRangeType = "SINCE_LAST";
        let textShared = false;
        let habitsShared = false;
        let wellnessShared = false;

        // Process each observation
        for (const obs of diaryObservations) {
          const conceptId = obs.observation_concept?.toString();

          switch (Number(conceptId)) {
            case 101: // DIARY_TEXT
              text = obs.value_as_string || "";
              textShared = obs.shared_with_provider || false;
              break;
            case 456: // DIARY_HABITS
              // Find the concept name by ID
              const habitName =
                obs.value_concept_name || `Hábito ${habits.length + 1}`;
              const measurementType = getMeasurementType(obs.value_as_string);

              habits.push({
                id: obs.observation_id.toString(),
                name: habitName,
                measurementType: measurementType,
                value: obs.value_as_string,
              });

              habitsShared = obs.shared_with_provider || false;
              break;
            case 789: // DIARY_WELLNESS
              // Find the matching wellness concept
              const wellnessConcept = wellnessConcepts.find(
                (c) =>
                  c.concept_id.toString() === obs.value_concept_id?.toString(),
              );

              if (wellnessConcept) {
                wellness.push({
                  id: obs.observation_id.toString(),
                  name:
                    wellnessConcept.translated_name ||
                    wellnessConcept.concept_name,
                  measurementType:
                    wellnessConcept.related_concept?.concept_code || "unknown",
                  value: obs.value_as_string,
                });
              }

              wellnessShared = obs.shared_with_provider || false;
              break;
          }
        }

        // Format the diary date
        const diaryDate =
          diaryObservations[0].observation_date ||
          diaryObservations[0].created_at ||
          "";

        setDiary({
          id: diaryId || "",
          date: diaryDate,
          dateRangeType,
          text,
          textShared,
          habitsShared,
          wellnessShared,
          habits,
          wellness,
        });
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

  // Helper function to determine measurement type based on value
  const getMeasurementType = (value: string | undefined): string => {
    if (!value) return "unknown";

    if (value === "value_yes" || value === "value_no") {
      return "yes_no";
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) return "unknown";

    if (numValue >= 1 && numValue <= 10) return "scale";
    if (numValue >= 1 && numValue <= 24) return "hours";

    return "times";
  };

  // Function to format the value for display
  const formatValue = (item: TrackableItem): string => {
    if (!item.value) return "Não informado";

    switch (item.measurementType) {
      case "yes_no":
        return item.value === "value_yes" ? "Sim" : "Não";
      case "scale":
        return `${item.value}/10`;
      case "hours":
        return `${item.value}h`;
      case "times":
        return `${item.value} vez${parseInt(item.value) !== 1 ? "es" : ""}`;
      default:
        return item.value;
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
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
          {formatDate(diary.date)}
        </h2>
      </div>

      {/* Time Range Section */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
          Período de tempo
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            {diary.dateRangeType === "TODAY" ? "Hoje" : "Desde o último diário"}
          </p>
        </div>
      </div>

      {/* Habits Section - Only show if there are habits */}
      {diary.habits.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Hábitos Personalizados
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Compartilhado com profissionais da saúde:{" "}
                {diary.habitsShared ? "Sim" : "Não"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {diary.habits.map((habit) => (
              <div
                key={habit.id}
                className="flex flex-col md:flex-row gap-3 w-full items-center"
              >
                <div className="flex-1 min-w-[200px] w-full">
                  <HabitCard title={habit.name} />
                </div>
                <div className="w-full md:w-[200px] bg-gray-50 p-3 rounded-lg text-center">
                  {formatValue(habit)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Well-being Section - Only show if there are wellness items */}
      {diary.wellness.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-neutral-700 mb-1">
              Bem-estar geral
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Compartilhado com profissionais da saúde:{" "}
                {diary.wellnessShared ? "Sim" : "Não"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {diary.wellness.map((question) => (
              <div
                key={question.id}
                className="flex flex-col md:flex-row gap-3 w-full items-center"
              >
                <div className="flex-1 min-w-[200px] w-full">
                  <HabitCard title={question.name} />
                </div>
                <div className="w-full md:w-[200px] bg-gray-50 p-3 rounded-lg text-center">
                  {formatValue(question)}
                </div>
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
              Texto
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Compartilhado com profissionais da saúde:{" "}
                {diary.textShared ? "Sim" : "Não"}
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
