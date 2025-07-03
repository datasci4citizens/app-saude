import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/ui/header';
import { PersonService } from '@/api/services/PersonService';
import type { PersonRetrieve } from '@/api/models/PersonRetrieve';
import { ProviderService } from '@/api/services/ProviderService';
import { ErrorMessage } from '@/components/ui/error-message';
import { InterestAreasService } from '@/api/services/InterestAreasService';
import type { PatchedMarkAttentionPoint } from '@/api/models/PatchedMarkAttentionPoint';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import type { TypeEnum } from '@/api/models/TypeEnum';

// Updated interfaces to match new server response structure
interface DiaryEntryDetail {
  text: string;
  shared: boolean;
  created_at: string;
}

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
  scope: string;
  entries: DiaryEntryDetail[];
  interest_areas: InterestAreaDetail[];
}

export default function ViewDiary() {
  const { diaryId, personId } = useParams<{
    diaryId: string;
    personId: string;
  }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInterests, setExpandedInterests] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (diaryId && personId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Buscar dados do paciente
          const patientData = await PersonService.apiPersonRetrieve(Number(personId));
          setPatient(patientData);

          // Buscar o diário específico diretamente
          const diaryData = await ProviderService.providerPatientsDiariesRetrieve(
            diaryId,
            Number(personId),
          );

          console.log('Diary Data:', diaryData);
          if (diaryData) {
            setDiary(diaryData);
          } else {
            setError('Diário não encontrado.');
          }
        } catch (err) {
          console.error('Error fetching diary data:', err);
          setError('Não foi possível carregar os dados do diário.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [diaryId, personId]);

  // Função para limpar erro
  const clearError = () => {
    setError(null);
  };

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

  // Toggle interest expansion - now using name as the identifier
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

  // Get general text entry if available
  const getGeneralTextEntry = (): {
    text: string;
    shared: boolean;
  } | null => {
    if (!diary || !diary.entries || diary.entries.length === 0) {
      return null;
    }

    for (const entry of diary.entries) {
      if (entry.text && entry.text.trim() !== '') {
        return {
          text: entry.text,
          shared: entry.shared, // Provider only sees shared entries
        };
      }
    }

    return null;
  };

  const handleAttentionToggle = async (areaId: number, isCurrentlyFlagged: boolean) => {
    try {
      const request: PatchedMarkAttentionPoint = {
        area_id: areaId,
        is_attention_point: !isCurrentlyFlagged,
      };
      console.log(request);
      await InterestAreasService.markObservationAsAttentionPoint(request);

      // Refresh diary data after toggling
      if (diaryId && personId) {
        const diaryData = await ProviderService.providerPatientsDiariesRetrieve(
          diaryId,
          Number(personId),
        );
        console.log('Updated Diary Data:', diaryData);
        setDiary(diaryData);
      }
    } catch (error) {
      console.error('Erro ao marcar ponto de atenção:', error);
    }
  };

  const location = useLocation();
  const getActiveNavId = () => {
    if (location.pathname.startsWith('/acs-main-page')) return 'home';
    if (location.pathname.startsWith('/appointments')) return 'consults';
    if (location.pathname.startsWith('/patients')) return 'patients';
    if (location.pathname.startsWith('/emergencies')) return 'emergency';
    if (location.pathname.startsWith('/acs-profile')) return 'profile';
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-homebg">
      <Header
        title="Visualizar Diário do Paciente"
        onBackClick={() => navigate(-1)}
        subtitle={
          diary?.date
            ? formatDate(diary.date)
            : patient?.first_name
              ? `${patient.first_name} ${patient.last_name || ''}`.trim()
              : 'Visualização do Diário'
        }
      />

      <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6 pb-24">
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection" />
                  <p className="text-gray2 text-sm">Carregando diário...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <ErrorMessage
                  message={error || 'Erro ao carregar diário'}
                  variant="destructive"
                  onClose={clearError}
                  className="animate-in slide-in-from-top-2 duration-300"
                />
              </div>
            )}

            {!loading && !error && diary && (
              <>
                {/* Patient Info Section */}
                {patient && (
                  <div className="bg-card p-4 rounded-lg border border-card-border mb-6">
                    <h3 className="font-semibold text-lg text-card-foreground mb-3">
                      Informações do Paciente
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Nome:</span>{' '}
                        {patient.social_name ||
                          `${patient.first_name} ${patient.last_name || ''}`.trim() ||
                          'Não informado'}
                      </p>
                      <p>
                        <span className="font-medium">ID:</span> {patient.person_id}
                      </p>
                      {patient.email && (
                        <p>
                          <span className="font-medium">Email:</span> {patient.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* Time Range Section */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-lg text-typography mb-1">Período de tempo</h3>
                  <div className="bg-card p-4 rounded-lg border border-card-border">
                    <span className="text-sm text-typography">
                      {diary.scope === 'today'
                        ? 'Registros do dia de hoje'
                        : 'Registros desde a última entrada'}
                    </span>
                  </div>
                </div>
                {/* Interest Areas Section */}
                {diary.interest_areas && diary.interest_areas.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-lg text-typography mb-1">
                      Áreas de Interesse
                    </h3>
                    <div className="space-y-4">
                      {diary.interest_areas
                        .filter((interest) => interest.shared_with_provider === true)
                        .map((interest) => {
                          // console.log('Interest:', interest);
                          const interestId = interest.observation_id || 0;
                          const isExpanded = expandedInterests.has(interest.name);
                          const hasResponses = interest.triggers?.some(
                            (t) => t.response && t.response.trim() !== '',
                          );
                          return (
                            <div
                              key={interest.name}
                              className="bg-card border border-card-border rounded-xl shadow-sm relative"
                            >
                              <div className="flex items-center justify-between px-5 pt-3 pb-1">
                                {Boolean(interest.marked_by?.length) ? (
                                  <span className="text-destructive text-sm flex items-center gap-1">
                                    <span className="text-destructive">⚠️</span>
                                  </span>
                                ) : (
                                  <span></span>
                                )}

                                <span className="text-success text-sm font-medium">
                                  ✓ Compartilhado
                                </span>
                              </div>

                              <div
                                className="px-5 pb-4 pt-1 cursor-pointer"
                                onClick={() => toggleInterest(interest.name)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <span className="w-2 h-2 bg-gradient-interest-indicator rounded-full flex-shrink-0" />
                                    <h4 className="font-bold text-lg text-card-foreground">
                                      {interest.name}
                                    </h4>
                                  </div>
                                  <span
                                    className={`transform transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  >
                                    ▼
                                  </span>
                                </div>

                                {Boolean(interest.marked_by?.length) && (
                                  <div className="mt-2">
                                    <span className="text-xs text-destructive italic">
                                      Marcado como ponto de atenção por{' '}
                                      {interest.marked_by?.join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {isExpanded && (
                                <div className="px-5 pb-5">
                                  <div className="border-t border-card-border pt-4">
                                    {/* Check if interest area exists */}
                                    {interestId > 0 ? (
                                      <div className="mb-4">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAttentionToggle(
                                              interestId,
                                              Boolean(interest.marked_by?.length),
                                            );
                                          }}
                                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            Boolean(interest.marked_by?.length)
                                              ? 'bg-success text-white hover:bg-success/80'
                                              : 'bg-accent1 text-white hover:bg-accent1/80'
                                          }`}
                                        >
                                          {Boolean(interest.marked_by?.length)
                                            ? 'Remover atenção ✅'
                                            : 'Marcar atenção ⚠️'}
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="mb-4">
                                        <p className="text-sm text-destructive font-medium italic">
                                          Área de interesse deletada
                                        </p>
                                      </div>
                                    )}

                                    {/* Responses */}
                                    {hasResponses ? (
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
                                    ) : (
                                      <p className="text-sm text-muted-foreground italic">
                                        Nenhuma resposta registrada para esta área.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                {/* General Text Section */}{' '}
                {(() => {
                  const textEntry = getGeneralTextEntry();
                  return textEntry?.text ? (
                    <div className="space-y-3 mb-6">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-lg text-typography mb-1">
                          Observações Gerais
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-success">
                            ✓ Compartilhado com profissionais
                          </span>
                        </div>
                      </div>

                      <div className="bg-card p-4 rounded-lg whitespace-pre-wrap min-h-[150px] border border-card-border">
                        {textEntry.text}
                      </div>
                    </div>
                  ) : null;
                })()}
                {/* Action button */}
                <div className="text-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-selection hover:bg-selection/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationBar variant="acs" forceActiveId={getActiveNavId()} />
      </div>
    </div>
  );
}
