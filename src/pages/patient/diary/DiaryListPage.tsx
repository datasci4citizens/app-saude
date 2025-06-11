import React, { useState, useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronRight, PlusCircle, Calendar, FileText, MessageSquare } from "lucide-react";

// Mock services and components for demonstration
const DiaryService = {
  personDiariesList: async () => {
    // Simulate API call with mock data
    return [
      {
        diary_id: 1,
        date: "2025-06-11T14:30:00.000Z",
        entries: JSON.stringify([
          {
            observation_id: 1,
            value_as_string: "Hoje foi um dia produtivo. Consegui finalizar o projeto que estava trabalhando.",
            shared_with_provider: true,
            created_at: "2025-06-11T14:30:00.000Z"
          }
        ]),
        interest_areas: JSON.stringify([
          {
            interest_name: "Produtividade",
            interest_area_id: 1,
            observation_concept_id: 1001,
            value_as_string: null,
            value_as_concept: 999,
            shared_with_provider: false,
            triggers: [
              {
                trigger_name: "Como foi seu dia de trabalho?",
                trigger_id: 1,
                observation_concept_id: 1002,
                value_as_string: "Muito bom, consegui focar bem nas tarefas"
              }
            ]
          }
        ])
      },
      {
        diary_id: 2,
        date: "2025-06-10T16:45:00.000Z",
        entries: JSON.stringify([]),
        interest_areas: JSON.stringify([
          {
            interest_name: "Saúde Mental",
            interest_area_id: 2,
            observation_concept_id: 2001,
            value_as_string: null,
            value_as_concept: 998,
            shared_with_provider: true,
            triggers: [
              {
                trigger_name: "Como está se sentindo hoje?",
                trigger_id: 2,
                observation_concept_id: 2002,
                value_as_string: "Me sinto mais calmo e equilibrado hoje"
              },
              {
                trigger_name: "Praticou algum exercício?",
                trigger_id: 3,
                observation_concept_id: 2003,
                value_as_string: "Sim, fiz uma caminhada de 30 minutos"
              }
            ]
          }
        ])
      }
    ];
  }
};

interface HeaderProps {
  title: string;
  onBackClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBackClick }) => (
  <div className="flex items-center gap-4 mb-6">
    <button 
      onClick={onBackClick}
      className="text-typography hover:text-accent transition-colors"
    >
      ←
    </button>
    <h1 className="text-xl font-semibold text-typography">{title}</h1>
  </div>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Type definitions
interface DiaryRetrieve {
  diary_id: number;
  date: string;
  readonly entries: string;
  readonly interest_areas: string;
}

// Interfaces for parsed data
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

interface ParsedDiaryData {
  diary_id: number;
  date: string;
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<ParsedDiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // In real app, use actual navigation
  };

  // Helper function to safely parse JSON strings
  const safeJsonParse = (jsonString: string, fallback: any = []) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn("Failed to parse JSON:", jsonString, error);
      return fallback;
    }
  };

  // Helper function to parse diary data
  const parseDiaryData = (rawDiary: DiaryRetrieve): ParsedDiaryData => {
    const entries = safeJsonParse(rawDiary.entries, []);
    const interest_areas = safeJsonParse(rawDiary.interest_areas, []);

    return {
      diary_id: rawDiary.diary_id,
      date: rawDiary.date,
      entries,
      interest_areas,
    };
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await DiaryService.personDiariesList();
        console.log("API response:", response);

        if (Array.isArray(response)) {
          const parsedDiaries = response.map(parseDiaryData);
          setDiaries(parsedDiaries);
        } else {
          console.error("Unexpected API response format:", response);
          setError("Formato de resposta inesperado da API");
          setDiaries([]);
        }
      } catch (error) {
        console.error("Error fetching diaries:", error);
        setError("Erro ao carregar diários");
        setDiaries([]);
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

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    } catch (error) {
      console.warn("Failed to parse date:", dateString);
      return "Data inválida";
    }
  };

  // Group diaries by date for display
  const groupedDiaries: Record<string, ParsedDiaryData[]> = {};

  diaries.forEach((diary) => {
    const dateKey = formatDate(diary.date);
    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }
    groupedDiaries[dateKey].push(diary);
  });

  // Helper function to get summary text
  const getDiarySummary = (diary: ParsedDiaryData): string => {
    // First, try to get text from entries
    if (diary.entries && Array.isArray(diary.entries) && diary.entries.length > 0) {
      const textEntry = diary.entries.find(
        (e) => e.value_as_string && e.value_as_string.trim() !== "",
      );
      if (textEntry && textEntry.value_as_string) {
        const summary = textEntry.value_as_string;
        
        // Check if we also have trigger responses
        const hasTriggerResponses = diary.interest_areas?.some((area) =>
          Array.isArray(area.triggers) && area.triggers.some(
            (t) => t.value_as_string && t.value_as_string.trim() !== "",
          ),
        );

        return hasTriggerResponses 
          ? `${summary} (+ respostas de interesses)` 
          : summary;
      }
    }

    // If no text entry, try to get trigger responses
    if (diary.interest_areas && Array.isArray(diary.interest_areas)) {
      const triggersWithResponses = diary.interest_areas.flatMap((area) =>
        Array.isArray(area.triggers) 
          ? area.triggers.filter(
              (t) => t.value_as_string && t.value_as_string.trim() !== "",
            )
          : []
      );

      if (
        triggersWithResponses.length > 0 &&
        triggersWithResponses[0] &&
        triggersWithResponses[0].value_as_string
      ) {
        return triggersWithResponses[0].value_as_string;
      }
    }

    return "Sem conteúdo";
  };

  // Helper function to get card title with icons
  const getDiaryCardInfo = (diary: ParsedDiaryData) => {
    const components = [];
    const icons = [];

    // Check for text entry
    const hasTextEntry = diary.entries?.some(
      (e) => e.value_as_string && e.value_as_string.trim() !== "",
    );

    if (hasTextEntry) {
      components.push("Texto");
      icons.push(<FileText key="text" size={14} className="text-blue-500" />);
    }

    // Check for triggers with responses
    const triggerCount = diary.interest_areas?.reduce(
      (count, area) =>
        count +
        (Array.isArray(area.triggers) 
          ? area.triggers.filter(
              (t) => t.value_as_string && t.value_as_string.trim() !== "",
            ).length
          : 0),
      0,
    ) || 0;

    if (triggerCount > 0) {
      components.push(`${triggerCount} resposta${triggerCount > 1 ? "s" : ""}`);
      icons.push(<MessageSquare key="triggers" size={14} className="text-green-500" />);
    }

    const title = components.length > 0
      ? `Diário (${components.join(", ")})`
      : "Diário";

    return { title, icons };
  };

  // Helper function to get time from date string
  const getTimeFromDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return "";
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-primary min-h-screen pb-24">
        <Header title="Diário" onBackClick={() => navigate("/user-main-page")} />
        
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-red-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 bg-gray-50 min-h-screen">
      <Header title="Diário" onBackClick={() => navigate("/user-main-page")} />

      {/* Create new diary button */}
      <div className="flex justify-end my-4">
        <Button
          onClick={handleCreateDiary}
          className="bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <PlusCircle size={16} />
          Novo Diário
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Carregando diários...</p>
          </div>
        </div>
      ) : Object.keys(groupedDiaries).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Calendar size={48} className="text-gray-300 mb-4" />
          <p className="text-center text-gray-600 mb-4 text-lg">
            Você ainda não possui diários.
          </p>
          <p className="text-center text-gray-500 mb-6 text-sm max-w-md">
            Comece a registrar seus pensamentos, experiências e respostas aos seus interesses.
          </p>
          <Button
            onClick={handleCreateDiary}
            className="bg-green-500 text-white flex items-center gap-2 px-6 py-3 hover:bg-green-600"
          >
            <PlusCircle size={16} />
            Criar Primeiro Diário
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {Object.entries(groupedDiaries)
            .sort(([a], [b]) => {
              const [dayA = 0, monthA = 0] = a.split('/').map((v) => Number(v) || 0);
              const [dayB = 0, monthB = 0] = b.split('/').map((v) => Number(v) || 0);
              return (monthB ?? 0) - (monthA ?? 0) || (dayB ?? 0) - (dayA ?? 0);
            })
            .map(([date, entries]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <Calendar size={16} className="text-blue-500" />
                <h3 className="font-medium text-gray-800">Dia {date}</h3>
                <span className="text-xs text-gray-500 ml-auto">
                  {entries.length} entrada{entries.length > 1 ? "s" : ""}
                </span>
              </div>

              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => {
                const { title, icons } = getDiaryCardInfo(entry);
                const time = getTimeFromDate(entry.date);
                
                return (
                  <div
                    key={entry.diary_id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
                    onClick={() => handleViewDiary(entry.diary_id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {icons}
                        </div>
                        <h4 className="font-medium text-gray-800 text-sm">
                          {title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {time && (
                          <span className="text-xs text-gray-500">{time}</span>
                        )}
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {getDiarySummary(entry)}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}