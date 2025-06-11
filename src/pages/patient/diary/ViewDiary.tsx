import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { DiaryService } from "@/api/services/DiaryService";
import CollapsibleInterestCard from "@/components/ui/CollapsibleInterestCard";
import { ErrorMessage } from "@/components/ui/error-message";
import BottomNavigationBar from "@/components/ui/navigator-bar";

// Updated interfaces to match actual server response structure
interface DiaryTrigger {
  trigger_id: number;
  trigger_name: string;
  observation_concept_id: number;
  value_as_string: string | null;
  response?: string;
  shared?: boolean;
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
  text: string;
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
  const [expandedInterests, setExpandedInterests] = useState<Set<number>>(
    new Set(),
  );

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
          // Auto-expand interests that have responses
          const interestsWithResponses =
            response.interest_areas
              ?.filter((area) =>
                area.triggers?.some(
                  (t) => t.value_as_string && t.value_as_string.trim() !== "",
                ),
              )
              .map((area) => area.interest_area_id) || [];
          setExpandedInterests(new Set(interestsWithResponses));
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

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };
  // Get general text entry if available
  const getGeneralTextEntry = (): { text: string; shared: boolean } | null => {
    console.log("Getting general text entry from diary:", diary?.entries);
    if (!diary || !diary.entries || diary.entries.length === 0) {
      console.warn("No diary entries found.");
      return null;
    }

    // Find the general text entry
    for (const entry of diary.entries) {
      // Handle the new format where entry is {text: 'content', text_shared: boolean}
      if (
        entry.text &&
        typeof entry.text === "string" &&
        entry.text.trim() !== ""
      ) {
        return {
          text: entry.text,
          shared: entry.text_shared || false,
        };
      }
      // Handle legacy format with value_as_string
      else if (entry.value_as_string && entry.value_as_string.trim() !== "") {
        return {
          text: entry.value_as_string,
          shared: entry.shared_with_provider || false,
        };
      }
    }

    return null;
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

  // Convert DiaryInterestArea to UserInterest format for CollapsibleInterestCard
  const convertToUserInterest = (diaryInterest: DiaryInterestArea) => {
    return {
      interest_area_id: diaryInterest.interest_area_id,
      interest_name: diaryInterest.interest_name,
      shared: diaryInterest.shared_with_provider,
      triggers:
        diaryInterest.triggers?.map((trigger) => ({
          trigger_id: trigger.trigger_id,
          trigger_name: trigger.trigger_name,
          custom_trigger_name: null,
          observation_concept_id: trigger.observation_concept_id,
          value_as_string: trigger.value_as_string,
          response: trigger.value_as_string || "",
          shared: diaryInterest.shared_with_provider,
        })) || [],
    };
  };

  const clearError = () => {
    setError(null);
  };

  if (isLoading) {
    return (
      <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header title="Visualizar Diário" />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-selection"></div>
        </div>
      </div>

          <div className="fixed bottom-0 left-0 right-0 z-30">
      <BottomNavigationBar
        variant="user"
        initialActiveId="diary"
        onItemClick={handleNavigationClick}
      />
    </div>
    </>
    );
  }

  if (error || !diary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header
          title="Visualizar Diário"
          onBackClick={() => navigate("/diary")}
        />

        <ErrorMessage
          message={error || "Diário não encontrado"}
          variant="destructive"
          onClose={clearError}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray1 hover:bg-gray2 rounded-full text-primary transition-colors"
          >
            Voltar
          </button>
        </div>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
      </div>
    );
  }

  const textEntry = getGeneralTextEntry();
  console.log("Text entry:", textEntry);
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
        <div className="bg-gray1 p-6 rounded-lg text-center my-8">
          <p className="text-gray2 text-lg">Este diário não possui conteúdo.</p>
        </div>
      )}

      {/* Time Range Section */}
      <div className="space-y-3 mb-6 mt-6">
        <h3 className="font-semibold text-lg text-typography mb-1">
          Período de tempo
        </h3>
        <div className="bg-primary p-4 rounded-lg">
          <p>{diary.scope === "today" ? "Hoje" : "Desde o último diário"}</p>
        </div>
      </div>

      {/* Interest Areas Section - Using CollapsibleInterestCard */}
      {diary.interest_areas && diary.interest_areas.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-typography mb-1">
              Seus Interesses
            </h3>
            <p className="text-sm text-typography">
              Clique nos interesses para ver as respostas detalhadas
            </p>
          </div>

          <div className="space-y-4">
            {diary.interest_areas.map((interest) => {
              // Only show interests that have at least one trigger with a response
              const hasResponses = interest.triggers?.some(
                (t) => t.value_as_string && t.value_as_string.trim() !== "",
              );

              if (!hasResponses) return null;

              return (
                <div
                  key={interest.interest_area_id}
                  className="bg-primary border border-gray1 rounded-lg p-4"
                >
                  <CollapsibleInterestCard
                    interest={convertToUserInterest(interest)}
                    isOpen={expandedInterests.has(interest.interest_area_id)}
                    onToggle={() => toggleInterest(interest.interest_area_id)}
                    onResponseChange={() => {}} // Read-only mode
                    onSharingToggle={() => {}} // Read-only mode
                    onTriggerResponseChange={() => {}} // Read-only mode
                  />

                  {/* Sharing status */}
                  <div className="mt-3 pt-3 border-t border-gray1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray2">
                        Status de compartilhamento:
                      </span>
                      <span
                        className={`font-medium ${
                          interest.shared_with_provider
                            ? "text-success"
                            : "text-selection"
                        }`}
                      >
                        {interest.shared_with_provider
                          ? "✓ Compartilhado com profissionais"
                          : "○ Não compartilhado"}
                      </span>
                    </div>
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
            <h3 className="font-semibold text-lg text-typography mb-1">
              Observações Gerais
            </h3>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  textEntry.shared ? "text-success" : "text-selection"
                }`}
              >
                {textEntry.shared
                  ? "✓ Compartilhado com profissionais"
                  : "○ Não compartilhado"}
              </span>
            </div>
          </div>

          <div className="bg-primary p-4 rounded-lg whitespace-pre-wrap min-h-[150px] border border-gray2">
            {textEntry.text}
          </div>
        </div>
      )}

       <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
