import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  PlusCircle,
  Calendar,
  FileText,
  Target,
  AlertTriangle,
  Share2,
  Clock,
} from 'lucide-react';
import { DiaryService } from '@/api';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import Header from '@/components/ui/header';
import { Button } from '@/components/forms/button';
import { TypeEnum } from '@/api/models/TypeEnum';

// Interfaces atualizadas para a nova estrutura
interface DiaryEntry {
  text: string;
  text_shared: boolean;
}

interface DiaryTrigger {
  trigger_id: number;
  name: string;
  type: TypeEnum;
  response: string;
}

interface DiaryInterestArea {
  interest_area_id: number;
  name: string;
  is_attention_point: boolean;
  shared_with_provider: boolean;
  triggers: DiaryTrigger[];
  provider_name: string | null;
}

interface LocalDiaryRetrieve {
  diary_id: number;
  date: string;
  entries: DiaryEntry[];
  interest_areas: DiaryInterestArea[];
  diary_shared: boolean;
}

export default function ImprovedDiaryListPage() {
  const [diaries, setDiaries] = useState<LocalDiaryRetrieve[]>([]);
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
        console.log('API response:', response);

        if (Array.isArray(response)) {
          // Transform API response to match new structure
          const mapped = response.map((item: unknown) => {
            const typedItem = item as Record<string, unknown>;
            // Handle case where response might be ApiDiaryRetrieve or already processed
            if (
              typeof typedItem.entries === 'string' ||
              typeof typedItem.interest_areas === 'string'
            ) {
              // This is an ApiDiaryRetrieve - parse the JSON strings
              const entries =
                typeof typedItem.entries === 'string'
                  ? typedItem.entries.trim()
                    ? JSON.parse(typedItem.entries)
                    : []
                  : Array.isArray(typedItem.entries)
                    ? typedItem.entries
                    : [];

              const interest_areas =
                typeof typedItem.interest_areas === 'string'
                  ? typedItem.interest_areas.trim()
                    ? JSON.parse(typedItem.interest_areas)
                    : []
                  : Array.isArray(typedItem.interest_areas)
                    ? typedItem.interest_areas
                    : [];

              return {
                diary_id: (typedItem.diary_id as number) || 0,
                date: (typedItem.date as string) || new Date().toISOString(),
                diary_shared: (typedItem.diary_shared as boolean) || false,
                entries: Array.isArray(entries) ? entries : [],
                interest_areas: Array.isArray(interest_areas) ? interest_areas : [],
              };
            }

            // This is already in the expected format or ApiDiaryItemResponse
            return {
              diary_id: (typedItem.diary_id as number) || 0,
              date: (typedItem.date as string) || new Date().toISOString(),
              diary_shared: (typedItem.diary_shared as boolean) || false,
              entries: Array.isArray(typedItem.entries)
                ? typedItem.entries
                : typeof typedItem.entries === 'string' && typedItem.entries.trim() !== ''
                  ? [
                      {
                        text: typedItem.entries,
                        text_shared: false,
                      },
                    ]
                  : [],
              interest_areas: Array.isArray(typedItem.interest_areas)
                ? (typedItem.interest_areas as Record<string, unknown>[]).map(
                    (area: Record<string, unknown>) => ({
                      interest_area_id: (area.interest_area_id as number) || 0,
                      name: (area.interest_name as string) || (area.name as string) || 'Interesse',
                      is_attention_point: (area.is_attention_point as boolean) || false,
                      shared_with_provider: (area.shared_with_provider as boolean) || false,
                      provider_name: (area.provider_name as string) || null,
                      triggers: Array.isArray(area.triggers)
                        ? (area.triggers as Record<string, unknown>[]).map(
                            (trigger: Record<string, unknown>) => ({
                              trigger_id: (trigger.trigger_id as number) || 0,
                              name:
                                (trigger.trigger_name as string) || (trigger.name as string) || '',
                              type: (trigger.type as TypeEnum) || TypeEnum.TEXT,
                              response:
                                (trigger.value_as_string as string) ||
                                (trigger.response as string) ||
                                '',
                            }),
                          )
                        : [],
                    }),
                  )
                : [],
            };
          }) as LocalDiaryRetrieve[];
          setDiaries(mapped);
        } else {
          console.error('Unexpected API response format:', response);
          setError('Formato de resposta inesperado da API');
          setDiaries([]);
        }
      } catch (_error) {
        console.error('Error fetching diaries:', _error);
        setError('Erro ao carregar diários');
        setDiaries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleCreateDiary = () => {
    navigate('/diary/new');
  };

  const handleViewDiary = (id: number) => {
    navigate(`/diary/${id}`);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    } catch (_error) {
      console.warn('Failed to parse date:', dateString);
      return 'Data inválida';
    }
  };

  // Get comprehensive diary statistics
  const getDiaryStats = (diary: LocalDiaryRetrieve) => {
    const hasTextEntry = diary.entries?.some((e) => e.text && e.text.trim() !== '');
    const sharedTextEntry = diary.entries?.some((e) => e.text_shared);

    const interestStats = diary.interest_areas?.reduce(
      (acc, area) => {
        const answeredTriggers =
          area.triggers?.filter((t) => t.response && t.response.trim() !== '') || [];

        return {
          totalInterests: acc.totalInterests + 1,
          answeredTriggers: acc.answeredTriggers + answeredTriggers.length,
          totalTriggers: acc.totalTriggers + (area.triggers?.length || 0),
          attentionPoints: acc.attentionPoints + (area.is_attention_point ? 1 : 0),
          sharedInterests: acc.sharedInterests + (area.shared_with_provider ? 1 : 0),
        };
      },
      {
        totalInterests: 0,
        answeredTriggers: 0,
        totalTriggers: 0,
        attentionPoints: 0,
        sharedInterests: 0,
      },
    ) || {
      totalInterests: 0,
      answeredTriggers: 0,
      totalTriggers: 0,
      attentionPoints: 0,
      sharedInterests: 0,
    };

    const progressPercentage =
      interestStats.totalTriggers > 0
        ? (interestStats.answeredTriggers / interestStats.totalTriggers) * 100
        : 0;

    return {
      hasTextEntry,
      sharedTextEntry,
      progressPercentage,
      ...interestStats,
    };
  };

  // Get diary summary with improved logic
  const getDiarySummary = (diary: LocalDiaryRetrieve): string => {
    // First, try to get text from entries
    if (diary.entries && Array.isArray(diary.entries) && diary.entries.length > 0) {
      const textEntry = diary.entries.find((e) => e.text && e.text.trim() !== '');
      if (textEntry?.text) {
        return textEntry.text.length > 100
          ? `${textEntry.text.substring(0, 100)}...`
          : textEntry.text;
      }
    }

    // If no text entry, get first trigger response
    if (diary.interest_areas && Array.isArray(diary.interest_areas)) {
      for (const area of diary.interest_areas) {
        if (area.triggers && Array.isArray(area.triggers)) {
          for (const trigger of area.triggers) {
            if (trigger.response && trigger.response.trim() !== '') {
              const preview =
                trigger.response.length > 60
                  ? `${trigger.response.substring(0, 60)}...`
                  : trigger.response;
              return `${area.name}: ${preview}`;
            }
          }
        }
      }
    }

    return 'Diário sem conteúdo de texto';
  };

  // Get time from date string
  const getTimeFromDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_error) {
      return '';
    }
  };

  // Filter diaries based on selected filter - REMOVIDO (sempre mostra todos)
  const filteredDiaries = diaries;

  // Group diaries by date
  const groupedDiaries: Record<string, LocalDiaryRetrieve[]> = {};
  for (const diary of filteredDiaries) {
    const dateKey = formatDate(diary.date);
    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }
    groupedDiaries[dateKey].push(diary);
  }

  // Get active navigation item
  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'home':
        navigate('/user-main-page');
        break;
      case 'meds':
        navigate('/reminders');
        break;
      case 'diary':
        navigate('/diary');
        break;
      case 'emergency':
        navigate('/emergency-user');
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  const hasDiaries = Object.keys(groupedDiaries).length > 0;

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 min-h-screen pb-24">
        <Header title="Diário" onBackClick={() => navigate('/user-main-page')} />

        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-center text-destructive mb-4 font-medium">{error}</p>
          <Button onClick={() => window.location.reload()} variant="default">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-homebg">
      <Header title="📝 Diário" onBackClick={() => navigate('/user-main-page')} />

      <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 pb-24">
            {/* Create new diary button */}
            {hasDiaries && (
              <div className="flex justify-end mb-6">
                <Button
                  onClick={handleCreateDiary}
                  variant="gradientNew"
                  size="lg"
                  className="flex items-center gap-2 text-typography"
                >
                  <PlusCircle size={18} className="text-typography" />
                  Novo Diário
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection" />
                  <p className="text-muted-foreground font-medium">Carregando seus diários...</p>
                </div>
              </div>
            ) : !hasDiaries ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-center text-typography mb-4 font-bold text-xl">
                  Você ainda não possui diários.
                </p>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  Comece a registrar seus pensamentos, experiências e respostas aos seus interesses
                  para acompanhar seu bem-estar.
                </p>
                <Button
                  onClick={handleCreateDiary}
                  variant="gradient"
                  size="xl"
                  className="flex items-center gap-2 text-typography"
                >
                  <PlusCircle size={20} />
                  Criar Primeiro Diário
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedDiaries)
                  .sort(([a], [b]) => {
                    const [dayA = 0, monthA = 0] = a.split('/').map((v) => Number(v) || 0);
                    const [dayB = 0, monthB = 0] = b.split('/').map((v) => Number(v) || 0);
                    return monthB - monthA || dayB - dayA;
                  })
                  .map(([date, entries]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-card-border pb-3">
                        <Calendar size={20} className="text-selection" />
                        <h3 className="font-bold text-xl text-typography">Dia {date}</h3>
                        <span className="text-sm text-muted-foreground px-3 py-1 bg-card rounded-full ml-auto border border-card-border">
                          {entries.length} entrada
                          {entries.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {entries
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((diary) => {
                          const stats = getDiaryStats(diary);
                          const time = getTimeFromDate(diary.date);
                          const hasAttentionPoints = stats.attentionPoints > 0;

                          return (
                            <div
                              key={diary.diary_id}
                              className={`bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${
                                hasAttentionPoints
                                  ? 'border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                                  : 'border-card-border hover:border-ring/30 hover:bg-card/90'
                              }`}
                              onClick={() => handleViewDiary(diary.diary_id)}
                            >
                              {/* Header with time, sharing status and attention warning */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {time}
                                    </span>
                                  </div>

                                  {diary.diary_shared && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-full border border-success/20">
                                      <Share2 size={12} />
                                      <span className="text-xs font-medium">Compartilhado</span>
                                    </div>
                                  )}

                                  {hasAttentionPoints && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800">
                                      <AlertTriangle size={12} />
                                      <span className="text-xs font-medium">Requer Atenção</span>
                                    </div>
                                  )}
                                </div>
                                <ChevronRight
                                  size={20}
                                  className="text-muted-foreground group-hover:text-typography transition-colors"
                                />
                              </div>

                              {/* Content indicators */}
                              <div className="flex items-center gap-4 mb-4 flex-wrap">
                                {stats.hasTextEntry && (
                                  <div className="flex items-center gap-2 text-selection">
                                    <FileText size={16} />
                                    <span className="text-sm font-medium">Observações</span>
                                  </div>
                                )}

                                {stats.totalInterests > 0 && (
                                  <div className="flex items-center gap-2 text-selection">
                                    <Target size={16} />
                                    <span className="text-sm font-medium">
                                      {stats.totalInterests} interesse
                                      {stats.totalInterests > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}

                                {stats.attentionPoints > 0 && (
                                  <div className="flex items-center gap-2 text-orange-500">
                                    <AlertTriangle size={16} />
                                    <span className="text-sm font-medium">
                                      {stats.attentionPoints} ponto
                                      {stats.attentionPoints > 1 ? 's' : ''} de atenção
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Interest areas with attention highlights */}
                              {diary.interest_areas && diary.interest_areas.length > 0 && (
                                <div className="mb-4 space-y-2">
                                  {diary.interest_areas.map((area, index) => (
                                    <div
                                      key={`${area.interest_area_id}-${index}`}
                                      className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                                        area.is_attention_point
                                          ? 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                                          : 'bg-card-muted text-muted-foreground border border-card-border'
                                      }`}
                                    >
                                      {area.is_attention_point && <AlertTriangle size={14} />}
                                      <span className="font-medium">{area.name}</span>
                                      <span className="text-xs">
                                        (
                                        {area.triggers?.filter(
                                          (t) => t.response && t.response.trim() !== '',
                                        ).length || 0}
                                        /{area.triggers?.length || 0} respondidas)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Progress bar for interests */}
                              {stats.totalTriggers > 0 && (
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">
                                      Progresso dos interesses
                                    </span>
                                    <span className="text-sm font-medium text-typography">
                                      {Math.round(stats.progressPercentage)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-card-muted rounded-full h-2 border border-card-border">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-500 ${
                                        hasAttentionPoints
                                          ? 'bg-gradient-to-r from-orange-400 to-red-500'
                                          : 'bg-gradient-to-r from-selection to-homebg'
                                      }`}
                                      style={{
                                        width: `${stats.progressPercentage}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Summary text */}
                              <p
                                className={`line-clamp-2 leading-relaxed ${
                                  hasAttentionPoints
                                    ? 'text-orange-800 dark:text-orange-200'
                                    : 'text-typography/80'
                                }`}
                              >
                                {getDiarySummary(diary)}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
