import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import Header from "@/components/ui/header";
import { DiaryService } from "@/api/services/DiaryService";
import CollapsibleInterestCard, { type UserInterest } from "@/components/ui/CollapsibleInterestCard";
import { ErrorMessage } from "@/components/ui/error-message";
import type { TypeEnum } from "@/api/models/TypeEnum";
import type { DiaryRetrieve } from "@/api/models/DiaryRetrieve";

// Updated interfaces to match new server response structure
interface DiaryTrigger {
  name: string;
  type?: TypeEnum;
  response: string;
}

interface DiaryInterestArea {
  name: string;
  shared: boolean;
  triggers: DiaryTrigger[];
}

interface DiaryEntry {
  text: string;
  text_shared: boolean;
  created_at: string;
}

interface DiaryData {
  diary_id: number;
  date: string;
  scope: string; // 'today' or 'since_last'
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
}

export default function ViewDiaryEntry() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const fetchDiaryData = async () => {
      if (!diaryId) return;

      try {
        // Fetch diary by ID
        const response = await DiaryService.diariesRetrieve2(diaryId);

        if (response?.diary_id) {
          const interestAreas =
            typeof response.interest_areas === "string"
              ? JSON.parse(response.interest_areas)
              : response.interest_areas;

          const diaryData: DiaryData = {
            ...(response as DiaryRetrieve),
            entries:
              typeof response.entries === "string"
                ? JSON.parse(response.entries)
                : response.entries,
            interest_areas: interestAreas,
          };
          setDiary(diaryData);

          // Auto-expand interests that have responses
          const interestsWithResponses =
            interestAreas
              ?.filter((area: DiaryInterestArea) =>
                area.triggers?.some(
                  (t: DiaryTrigger) => t.response?.trim() !== "",
                ),
              )
              .map((area: DiaryInterestArea) => area.name) || [];
          setExpandedInterests(new Set(interestsWithResponses));
        } else {
          setError("Diário não encontrado ou formato inválido.");
        }
      } catch {
        setError("Falha ao carregar o diário. Por favor, tente novamente.");
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
    } catch {
      return dateString;
    }
  };

  // Get general text entry if available
  const getGeneralTextEntry = (): { text: string; shared: boolean } | null => {
    if (!diary?.entries || diary.entries.length === 0) {
      return null;
    }

    // Find the general text entry
    for (const entry of diary.entries) {
      if (entry.text?.trim() !== "") {
        return {
          text: entry.text,
          shared: entry.text_shared || false,
        };
      }
    }

    return null;
  };

  const getActiveNavId = () => {
    const { pathname } = location;
    if (pathname.startsWith("/user-main-page")) return "home";
    if (pathname.startsWith("/reminders")) return "meds";
    if (pathname.startsWith("/diary")) return "diary";
    if (pathname.startsWith("/emergency-user")) return "emergency";
    if (pathname.startsWith("/profile")) return "profile";
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

  // Toggle interest expansion - now using interest name as identifier
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

  // Convert DiaryInterestArea to UserInterest format for CollapsibleInterestCard
  const convertToUserInterest = (
    diaryInterest: DiaryInterestArea,
  ): UserInterest => {
    // Create a map of trigger responses
    const triggerResponses: Record<string, string> = {};
    if (diaryInterest.triggers) {
      for (const trigger of diaryInterest.triggers) {
        if (trigger.response) {
          triggerResponses[trigger.name] = trigger.response;
        }
      }
    }

    return {
      shared: diaryInterest.shared,
      provider_name: undefined,
      interest_area: {
        name: diaryInterest.name,
        is_attention_point: false,
        triggers:
          diaryInterest.triggers?.map((trigger) => ({
            name: trigger.name,
            type: trigger.type,
            response: trigger.response,
          })) || [],
      },
      triggerResponses,
    };
  };

  if (!diary) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Diário" onBackClick={() => navigate(-1)} />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-selection border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-typography">Carregando diário...</p>
          </div>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  const textEntry = getGeneralTextEntry();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Header
        title={`Diário de ${formatDate(diary.date)}`}
        onBackClick={() => navigate(-1)}
      />

      {error && <ErrorMessage message={error} />}

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-5">
          {/* General Text Entry */}
          {textEntry?.text && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-typography">
                  Meu dia
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    textEntry.shared
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {textEntry.shared ? "Compartilhado" : "Não Compartilhado"}
                </span>
              </div>
              <p className="text-typography whitespace-pre-wrap">
                {textEntry.text}
              </p>
            </div>
          )}

          {/* Interest-based Entries */}
          {diary.interest_areas?.map((interest) => (
            <CollapsibleInterestCard
              key={interest.name}
              interest={convertToUserInterest(interest)}
              isOpen={expandedInterests.has(interest.name)}
              onToggle={() => toggleInterest(interest.name)}
              onSharingToggle={() => {
                /* Implement if needed */
              }}
              onTriggerResponseChange={() => {
                /* Implement if needed */
              }}
              readOnly
            />
          ))}
        </div>
      </div>

      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
