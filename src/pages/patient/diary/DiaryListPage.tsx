import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { Button } from "@/components/forms/button";
import { DiariesService } from "@/api/services/DiariesService";
import { ChevronRight, PlusCircle } from "lucide-react";

// Updated interface to match server response structure
interface DiaryTrigger {
  trigger_name: string;
  trigger_id: number;
  observation_concept_id: number;
  value_as_string: string | null;
}

interface DiaryInterestArea {
  interest_name: string;
  interest_area_id: number;
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
}

interface DiaryData {
  diary_id: number;
  date: string;
  scope: string;
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        const response = await DiariesService.diariesRetrieve();
        console.log("API response:", response);
        
        if (Array.isArray(response)) {
          // Handle array response
          setDiaries(response);
        } else if (response && response.results && Array.isArray(response.results)) {
          // Handle paginated response
          setDiaries(response.results);
        } else {
          console.error("Unexpected API response format:", response);
          setDiaries([]);
        }
      } catch (error) {
        console.error("Error fetching diaries:", error);
        
        // For development testing, provide a sample diary
        setDiaries([
          {
            diary_id: 12,
            date: "2025-06-04T16:16:56.829929Z",
            scope: "since_last",
            entries: [
              {
                observation_id: 13,
                created_at: "2025-06-04T16:16:56.844846Z",
                value_as_string: "Exemplo de entrada de diário",
                shared_with_provider: true,
              }
            ],
            interest_areas: [
              {
                interest_name: "Hipertensão",
                interest_area_id: 1,
                observation_concept_id: 2000202,
                value_as_string: null,
                value_as_concept: 999502,
                shared_with_provider: false,
                triggers: [
                  {
                    trigger_name: "Alimentação",
                    trigger_id: 2,
                    observation_concept_id: 2000302,
                    value_as_string: "Exemplo de resposta sobre alimentação"
                  }
                ]
              }
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleCreateDiary = () => {
    navigate("/diary/new");
  };

  const handleViewDiary = (id: number) => {
    navigate(`/diary/${id}`);
  };

  // Group diaries by date for display
  const groupedDiaries: Record<string, DiaryData[]> = {};

  diaries.forEach((diary) => {
    const dateObj = new Date(diary.date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dateKey = `${day}/${month}`;

    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }

    groupedDiaries[dateKey].push(diary);
  });

  // Helper function to get summary text
  const getDiarySummary = (diary: DiaryData): string => {
    if (diary.entries && diary.entries.length > 0) {
      return diary.entries[0].value_as_string;
    }
    
    // Look for any trigger responses
    const triggerWithResponse = diary.interest_areas?.flatMap(area => 
      area.triggers.filter(t => t.value_as_string)
    )[0];
    
    if (triggerWithResponse) {
      return triggerWithResponse.value_as_string || "";
    }
    
    return "Sem conteúdo";
  };

  // Helper function to get card title
  const getDiaryCardTitle = (diary: DiaryData): string => {
    if (!diary.interest_areas || diary.interest_areas.length === 0) {
      return "Diário";
    }
    
    // Count filled triggers
    const totalTriggers = diary.interest_areas.reduce((count, area) => 
      count + area.triggers.filter(t => t.value_as_string).length, 0);
      
    if (totalTriggers === 0) {
      return "Diário";
    }
    
    return `Diário (${totalTriggers} resposta${totalTriggers > 1 ? 's' : ''})`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-primary min-h-screen pb-24">
      <Header title="Diário" onBackClick={() => navigate("/user-main-page")} />

      {/* create new diary button */}
      <div className="flex justify-end my-4">
        <Button 
          onClick={handleCreateDiary}
          className="bg-accent text-selection flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Novo Diário
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando diários...</p>
        </div>
      ) : Object.keys(groupedDiaries).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-typography/70 mb-4">
            Você ainda não possui diários.
          </p>
          <Button
            onClick={handleCreateDiary}
            className="bg-secondary text-grey2 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Criar Diário
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {Object.entries(groupedDiaries).map(([date, entries]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-medium text-sm">Dia {date}</h3>

              {entries.map((entry) => (
                <div
                  key={entry.diary_id}
                  className="bg-card rounded-lg p-4 shadow-sm"
                  onClick={() => handleViewDiary(entry.diary_id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">
                      {getDiaryCardTitle(entry)}
                    </h4>
                    <ChevronRight size={16} className="text-gray2" />
                  </div>

                  <p className="text-sm text-typography/80 line-clamp-2">
                    {getDiarySummary(entry)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}