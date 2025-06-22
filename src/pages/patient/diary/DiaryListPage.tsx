import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight,
  PlusCircle,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import { DiaryService } from "@/api";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import Header from "@/components/ui/header";
import { Button } from "@/components/forms/button";

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

interface ApiDiaryItem {
  diary_id: number;
  date: string;
  entries: DiaryEntry[] | string;
  interest_areas: DiaryInterestArea[];
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
  const location = useLocation();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await DiaryService.personDiariesList();
        console.log("API response:", response);

        if (Array.isArray(response)) {
          // Transform API response to match local DiaryRetrieve type if needed
          const mapped = response.map((item: ApiDiaryItem): DiaryRetrieve => ({
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
    } catch (_error) {
      console.warn("Failed to parse date:", dateString);
      return "Data inválida";
    }
  };

  // Group diaries by date for display
  const groupedDiaries: Record<string, DiaryRetrieve[]> = {};

  for (const diary of diaries) {
    const dateKey = formatDate(diary.date);
    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }
    groupedDiaries[dateKey].push(diary);
  }

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
      if (textEntry?.text) {
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

  const getDiaryCardInfo = (diary: DiaryRetrieve) => {
    const components = [];
    const icons = [];

    // Check for text entry
    const hasTextEntry = diary.entries?.some(
      (e) => e.text && e.text.trim() !== "",
    );

    if (hasTextEntry) {
      components.push("Texto");
      icons.push(<FileText key="text" size={14} className="text-accent2" />);
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
        <MessageSquare key="triggers" size={14} className="text-success" />,
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
    } catch (_error) {
      return "";
    }
  };

  // Get active navigation item based on current route
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

  const hasDiaries = Object.keys(groupedDiaries).length > 0;

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-background min-h-screen pb-24">
        <Header
          title="Diário"
          onBackClick={() => navigate("/user-main-page")}
        />

        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-destructive mb-4 font-inter text-campos-preenchimento">
            {error}
          </p>
          <Button onClick={() => window.location.reload()} variant="default">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-background min-h-screen pb-24">
      <Header title="Diário" onBackClick={() => navigate("/user-main-page")} />

      <div className="px-4 md:px-8 py-4">
        {/* Create new diary button - only show if there are existing diaries */}
        {hasDiaries && (
          <div className="flex justify-end my-4">
            <Button
              onClick={handleCreateDiary}
              variant="gradientNew"
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Novo Diário
            </Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-typography/80 font-inter text-campos-preenchimento">
                Carregando diários...
              </p>
            </div>
          </div>
        ) : !hasDiaries ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Calendar size={48} className="text-gray2 mb-4" />
            <p className="text-center text-typography mb-4 font-work-sans text-topicos2">
              Você ainda não possui diários.
            </p>
            <p className="text-center text-typography/70 mb-6 font-inter text-desc-titulo max-w-md">
              Comece a registrar seus pensamentos, experiências e respostas aos
              seus interesses.
            </p>
            <Button
              onClick={handleCreateDiary}
              variant="gradient"
              className="flex items-center gap-2 px-6 py-3"
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
                return (
                  (monthB ?? 0) - (monthA ?? 0) || (dayB ?? 0) - (dayA ?? 0)
                );
              })
              .map(([date, entries]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray2-border pb-2">
                    <Calendar size={16} className="text-accent2" />
                    <h3 className="font-work-sans text-topicos text-typography">
                      Dia {date}
                    </h3>
                    <span className="text-desc-campos font-inter text-typography/60 ml-auto">
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
                          className="bg-card border border-card-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-accent2/50 hover:bg-card/80"
                          onClick={() => handleViewDiary(entry.diary_id)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {icons}
                              </div>
                              <h4 className="font-work-sans text-topicos text-card-foreground">
                                {title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {time && (
                                <span className="text-desc-campos font-inter text-card-foreground/60">
                                  {time}
                                </span>
                              )}
                              <ChevronRight
                                size={16}
                                className="text-card-foreground/40"
                              />
                            </div>
                          </div>

                          <p className="text-campos-preenchimento2 font-inter text-card-foreground/80 line-clamp-2 leading-relaxed">
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
      {/* NAVEGAÇÃO INFERIOR - Sempre no fundo */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
