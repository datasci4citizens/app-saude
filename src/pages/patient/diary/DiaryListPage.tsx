import React, {
  useState,
  useEffect,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  PlusCircle,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { DiaryService } from "@/api";
import BottomNavigationBar from "@/components/ui/navigator-bar";

// Mock services and components for demonstration
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

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  ...props
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface DiaryEntry {
  text: string;
  text_shared: boolean;
}

interface DiaryTrigger {
  trigger_id: number;
  value_as_string: string;
  trigger_name: string;
}

interface DiaryInterestArea {
  interest_area_id: number;
  value_as_string: string | null;
  shared_with_provider: boolean;
  triggers: DiaryTrigger[];
  interest_name: string;
  provider_name: string | null;
}

interface DiaryRetrieve {
  diary_id: number;
  date: string;
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<DiaryRetrieve[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await DiaryService.personDiariesList();
        console.log("API response:", response);

        if (Array.isArray(response)) {
          // Transform API response to match local DiaryRetrieve type if needed
          const mapped = response.map((item: any) => ({
            ...item,
            entries: Array.isArray(item.entries)
              ? item.entries
              : typeof item.entries === "string" && item.entries.trim() !== ""
                ? [{ text: item.entries, text_shared: false }]
                : [],
            interest_areas: Array.isArray(item.interest_areas)
              ? item.interest_areas
              : [],
          }));
          setDiaries(mapped);
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
  const groupedDiaries: Record<string, DiaryRetrieve[]> = {};

  diaries.forEach((diary) => {
    const dateKey = formatDate(diary.date);
    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }
    groupedDiaries[dateKey].push(diary);
  });

  // ✨ Updated helper function for new structure
  const getDiarySummary = (diary: DiaryRetrieve): string => {
    // First, try to get text from entries
    if (
      diary.entries &&
      Array.isArray(diary.entries) &&
      diary.entries.length > 0
    ) {
      const textEntry = diary.entries.find(
        (e) => e.text && e.text.trim() !== "",
      );
      if (textEntry && textEntry.text) {
        const summary = textEntry.text;

        // Check if we also have trigger responses
        const hasTriggerResponses = diary.interest_areas?.some(
          (area) =>
            Array.isArray(area.triggers) &&
            area.triggers.some(
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
          : [],
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

  // ✨ Updated helper function for new structure
  const getDiaryCardInfo = (diary: DiaryRetrieve) => {
    const components = [];
    const icons = [];

    // Check for text entry
    const hasTextEntry = diary.entries?.some(
      (e) => e.text && e.text.trim() !== "",
    );

    if (hasTextEntry) {
      components.push("Texto");
      icons.push(
        <FileText
          key="text"
          size={14}
          className="text-blue-500 dark:text-blue-400"
        />,
      );
    }

    // Check for triggers with responses
    const triggerCount =
      diary.interest_areas?.reduce(
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
      icons.push(
        <MessageSquare
          key="triggers"
          size={14}
          className="text-green-500 dark:text-green-400"
        />,
      );
    }

    const title =
      components.length > 0 ? `Diário (${components.join(", ")})` : "Diário";

    return { title, icons };
  };

  // Helper function to get time from date string
  const getTimeFromDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
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
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-white dark:bg-gray-900 min-h-screen pb-24">
        <Header
          title="Diário"
          onBackClick={() => navigate("/user-main-page")}
        />

        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-red-500 dark:text-red-400 mb-4">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 bg-white dark:bg-gray-900 min-h-screen pb-24">
      <Header title="Diário" onBackClick={() => navigate("/user-main-page")} />

      {/* Create new diary button */}
      <div className="flex justify-end my-4">
        <Button
          onClick={handleCreateDiary}
          className="bg-blue-500 dark:bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={16} />
          Novo Diário
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Carregando diários...
            </p>
          </div>
        </div>
      ) : Object.keys(groupedDiaries).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Calendar
            size={48}
            className="text-gray-300 dark:text-gray-600 mb-4"
          />
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4 text-lg">
            Você ainda não possui diários.
          </p>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm max-w-md">
            Comece a registrar seus pensamentos, experiências e respostas aos
            seus interesses.
          </p>
          <Button
            onClick={handleCreateDiary}
            className="bg-green-500 dark:bg-green-600 text-white flex items-center gap-2 px-6 py-3 hover:bg-green-600 dark:hover:bg-green-700"
          >
            <PlusCircle size={16} />
            Criar Primeiro Diário
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {Object.entries(groupedDiaries)
            .sort(([a], [b]) => {
              const [dayA = 0, monthA = 0] = a
                .split("/")
                .map((v) => Number(v) || 0);
              const [dayB = 0, monthB = 0] = b
                .split("/")
                .map((v) => Number(v) || 0);
              return (monthB ?? 0) - (monthA ?? 0) || (dayB ?? 0) - (dayA ?? 0);
            })
            .map(([date, entries]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <Calendar
                    size={16}
                    className="text-blue-500 dark:text-blue-400"
                  />
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Dia {date}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {entries.length} entrada{entries.length > 1 ? "s" : ""}
                  </span>
                </div>

                {entries
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((entry) => {
                    const { title, icons } = getDiaryCardInfo(entry);
                    const time = getTimeFromDate(entry.date);

                    return (
                      <div
                        key={entry.diary_id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-600"
                        onClick={() => handleViewDiary(entry.diary_id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {icons}
                            </div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {time && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {time}
                              </span>
                            )}
                            <ChevronRight
                              size={16}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {getDiarySummary(entry)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}
        </div>
      )}

      {/* NAVEGAÇÃO INFERIOR - Sempre no fundo */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          initialActiveId="diary"
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
