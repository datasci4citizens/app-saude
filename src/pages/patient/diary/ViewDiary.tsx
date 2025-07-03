import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/ui/header';
import { ErrorMessage } from '@/components/ui/error-message';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import type { TypeEnum } from '@/api/models/TypeEnum';
import { Clock } from 'lucide-react';
import { PersonalDiaryService } from '@/api';

interface TriggerDetail {
  name: string;
  type?: TypeEnum;
  response: string;
  shared_with_provider?: boolean;
}

interface InterestAreaDetail {
  name: string;
  shared_with_provider: boolean;
  triggers: TriggerDetail[];
  provider_name?: string | null;
  observation_id?: number;
  marked_by?: string[];
}

interface DiaryDetail {
  diary_id: number;
  date: string;
  text: string;
  text_shared: boolean;
  date_range_type: 'today' | 'since_last';
  interest_areas: InterestAreaDetail[];
}

export default function ImprovedViewDiaryEntry() {
  const { diaryId } = useParams<{ diaryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDiaryData = async () => {
      if (!diaryId) return;

      try {
        setIsLoading(true);
        setError(null);

        const diaryData = await PersonalDiaryService.diariesRetrieve(diaryId);
        console.log('Diary API response:', diaryData);

        if (diaryData?.diary_id) {
          const parsedInterestAreas =
            typeof diaryData.interest_areas === 'string'
              ? (JSON.parse(diaryData.interest_areas) as InterestAreaDetail[])
              : (diaryData.interest_areas as InterestAreaDetail[]);
          setDiary({
            diary_id: diaryData.diary_id,
            date: diaryData.date,
            text: diaryData.text,
            text_shared: diaryData.text_shared === 'true',
            date_range_type: diaryData.date_range_type as 'today' | 'since_last',
            interest_areas: parsedInterestAreas,
          });

          // Auto-expand interests that have responses
          const interestsWithResponses =
            parsedInterestAreas
              ?.filter((area: InterestAreaDetail) =>
                area.triggers?.some((t) => t.response && t.response.trim() !== ''),
              )
              .map((area: InterestAreaDetail) => area.name) || [];
          setExpandedInterests(new Set(interestsWithResponses));
        } else {
          console.error('Diary not found or invalid response format:', diaryData);
          setError('Diário não encontrado ou formato inválido.');
        }
      } catch (error) {
        console.error('Error fetching diary:', error);
        setError('Falha ao carregar o diário. Por favor, tente novamente.');
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
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (_e) {
      return dateString;
    }
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

  // Get general text entry if available
  const getGeneralTextEntry = (): {
    text: string;
    shared: boolean;
  } | null => {
    if (!diary || diary.text.trim() === '') {
      return null;
    }

    return {
      text: diary.text,
      shared: diary.text_shared || false,
    };
  };

  // Toggle interest expansion
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

  // Navigation helpers
  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  const clearError = () => setError(null);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-homebg">
        <Header title="📝 Visualizar Diário" onBackClick={() => navigate('/diary')} />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-foreground/20 border-t-primary-foreground" />
            <p className="text-primary-foreground/80 font-medium">Carregando diário...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="flex flex-col h-screen bg-homebg">
        <Header title="📝 Visualizar Diário" onBackClick={() => navigate('/diary')} />
        <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
          <div className="px-4 py-6">
            <ErrorMessage
              message={error || 'Diário não encontrado'}
              variant="destructive"
              onClose={clearError}
              className="mb-6"
            />
            <div className="text-center">
              <button
                onClick={() => navigate('/diary')}
                className="px-6 py-3 bg-homebg text-primary-foreground rounded-lg transition-colors font-medium"
              >
                Voltar aos Diários
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const textEntry = getGeneralTextEntry();
  const time = diary.date ? getTimeFromDate(diary.date) : '';
  const hasContent =
    textEntry?.text ||
    diary.interest_areas?.some((area) =>
      area.triggers?.some((t) => t.response && t.response.trim() !== ''),
    );

  return (
    <div className="flex flex-col h-screen bg-homebg">
      <Header
        title="📝 Visualizar Diário"
        onBackClick={() => navigate('/diary')}
        subtitle={diary.date ? formatDate(diary.date) : 'Data não disponível'}
      />

      <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 pb-24">
            {!hasContent && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-muted-foreground text-lg font-medium">
                  Este diário não possui conteúdo registrado.
                </p>
              </div>
            )}

            {/* Time Range Section */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-lg text-typography mb-1">Período de tempo</h3>
              <div className="bg-card p-4 rounded-lg border border-card-border flex items-center justify-between">
                <span className="text-typography">
                  {diary.date_range_type === 'today' ? 'Dia do registro' : 'Desde o último diário'}
                </span>
                {time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{time}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interest Areas Section */}
            {diary.interest_areas && diary.interest_areas.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg text-typography mb-1">Áreas de Interesse</h3>
                <div className="space-y-4">
                  {diary.interest_areas.map((interest) => {
                    const isExpanded = expandedInterests.has(interest.name);
                    const hasResponses = interest.triggers?.some(
                      (t) => t.response && t.response.trim() !== '',
                    );

                    if (!hasResponses) return null;

                    return (
                      <div
                        key={interest.name}
                        className={`border rounded-xl shadow-sm ${
                          (interest.marked_by?.length ?? 0) > 0
                            ? 'bg-gradient-to-r from-destructive to-accent1 border-accent1'
                            : 'bg-card border-card-border'
                        }`}
                      >
                        <div
                          className="p-5 cursor-pointer hover:bg-accent/30 transition-colors duration-200"
                          onClick={() => toggleInterest(interest.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  (interest.marked_by?.length ?? 0) > 0
                                    ? 'bg-gradient-to-r from-destructive to-accent1'
                                    : 'bg-[var(--gradient-interest-indicator)]'
                                }`}
                              />
                              <h4 className="font-bold text-lg text-card-foreground">
                                {interest.name}
                              </h4>
                              {(interest.marked_by?.length ?? 0) > 0 && (
                                <span className="text-accent1 text-lg">⚠️</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {interest.shared_with_provider && (
                                <span className="text-success text-sm font-medium">
                                  ✓ Compartilhado
                                </span>
                              )}
                              <span
                                className={`transform transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              >
                                ▼
                              </span>
                            </div>
                          </div>

                          {(interest.marked_by?.length ?? 0) > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-accent1 italic">
                                Marcado como ponto de atenção por {interest.marked_by?.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5">
                            <div className="border-t border-card-border pt-4">
                              <div className="space-y-3">
                                <h5 className="font-medium text-sm text-muted-foreground mb-2">
                                  Respostas:
                                </h5>
                                {interest.triggers?.map(
                                  (trigger, index) =>
                                    trigger.response &&
                                    trigger.response.trim() !== '' && (
                                      <div
                                        key={`${trigger.name}-${index}`}
                                        className="bg-card-muted p-3 rounded-lg border-l-4 border-selection"
                                      >
                                        <div className="text-sm">
                                          <span className="font-medium text-card-foreground">
                                            {trigger.name}:
                                          </span>
                                          <span className="ml-2 text-muted-foreground">
                                            {trigger.response}
                                          </span>
                                        </div>
                                      </div>
                                    ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Text Section */}
            {textEntry?.text && (
              <div className="space-y-3 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg text-typography mb-1">Observações Gerais</h3>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        textEntry.shared ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {textEntry.shared
                        ? '✓ Compartilhado com profissionais'
                        : '○ Não compartilhado'}
                    </span>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-lg whitespace-pre-wrap min-h-[150px] border border-card-border text-gray2">
                  {textEntry.text}
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/diary')}
                className="px-8 py-3 bg-selection hover:bg-selection/80 text-white rounded-lg 
                         transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Voltar aos Diários
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationBar variant="user" forceActiveId={getActiveNavId()} />
      </div>
    </div>
  );
}
