import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/ui/header';
import { TextField } from '@/components/forms/text_input';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import type { PersonRetrieve } from '@/api/models/PersonRetrieve';
import { TypeEnum } from '@/api';
import {
  DataVocabularyService,
  HelpSystemService,
  PersonManagementService,
  ProviderDiaryAccessService,
} from '@/api';

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

interface HelpRequest {
  id: number;
  created_at: string;
  observation_date: string | null | undefined;
  value_as_string?: string | null | undefined;
  person?: number | null | undefined;
}

export default function ViewPatient() {
  const { id, context } = useParams<{ id: string; context?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Patient data states
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);

  // Diaries states
  const [diaries, setDiaries] = useState<DiaryDetail[]>([]);
  const [diariesLoading, setDiariesLoading] = useState(true);

  // Help requests states
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [helpRequestsLoading, setHelpRequestsLoading] = useState(true);

  // UI states
  const [activeTab, setActiveTab] = useState('diarios');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch patient data
      const patientData = await PersonManagementService.apiPersonRetrieve(Number(id));
      setPatient(patientData);

      // Fetch diaries
      await fetchDiaries(patientData.person_id);

      // Fetch help requests
      await fetchHelpRequests();
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Não foi possível carregar os dados do paciente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiaries = async (personId: number) => {
    try {
      setDiariesLoading(true);
      const diariesData = await ProviderDiaryAccessService.providerPatientsDiariesList(personId);
      console.log('Diaries Data:', diariesData);

      const sortedDiaries = diariesData
        .map((d) => ({
          diary_id: d.diary_id,
          date: d.date,
          text: d.text,
          text_shared: d.text_shared === 'true',
          date_range_type: d.date_range_type as 'today' | 'since_last',
          interest_areas:
            typeof d.interest_areas === 'string'
              ? (JSON.parse(d.interest_areas) as InterestAreaDetail[])
              : d.interest_areas,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

      setDiaries(sortedDiaries);
    } catch (err) {
      console.error('Error fetching diaries:', err);
    } finally {
      setDiariesLoading(false);
    }
  };

  const fetchHelpRequests = async () => {
    if (!id) return;

    try {
      setHelpRequestsLoading(true);
      const allHelpRequests = await HelpSystemService.providerHelpList();
      const resolvedConcept = await DataVocabularyService.apiConceptList(undefined, 'RESOLVED');

      const patientHelpRequests = allHelpRequests
        .filter((help) => help.person === Number(id))
        .filter((help) => {
          // Filter out resolved help requests
          if (!help.value_as_string) return true; // Keep if no value_as_string
          return !resolvedConcept.some((concept) => concept.concept_id === help.value_as_concept);
        });

      ('teste');
      ('teste');

      const formattedHelpRequests: HelpRequest[] = patientHelpRequests.map((help) => ({
        id: help.observation_id,
        created_at: help.created_at,
        observation_date: help.observation_date,
        value_as_string: help.value_as_string,
        person: help.person,
      }));

      formattedHelpRequests.sort((a, b) => {
        const dateA = new Date(a.observation_date || a.created_at).getTime();
        const dateB = new Date(b.observation_date || b.created_at).getTime();
        return dateB - dateA;
      });

      setHelpRequests(formattedHelpRequests);
    } catch (err) {
      console.error('Error fetching help requests:', err);
    } finally {
      setHelpRequestsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (_e) {
      return 'Data inválida';
    }
  };

  const formatDateWithTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_e) {
      return 'Data inválida';
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) return 'Há poucos minutos';
      if (diffInHours < 24) return `Há ${diffInHours}h`;
      if (diffInDays === 1) return 'Ontem';
      if (diffInDays < 7) return `Há ${diffInDays} dias`;
      return formatDate(dateString);
    } catch (_e) {
      return 'Data inválida';
    }
  };

  const getActiveNavId = () => {
    if (location.pathname.startsWith('/acs-main-page')) return 'home';
    if (location.pathname.startsWith('/appointments')) return 'consults';
    if (location.pathname.startsWith('/patients')) return 'patients';
    if (location.pathname.startsWith('/emergencies')) return 'emergency';
    if (location.pathname.startsWith('/acs-profile')) return 'profile';
    return null;
  };

  // Filter data based on search
  const filteredDiaries = diaries.filter(
    (diary) =>
      diary.text?.toLowerCase().includes(searchValue.toLowerCase()) ||
      formatDate(diary.date).includes(searchValue),
  );

  const filteredHelpRequests = helpRequests.filter(
    (help) =>
      help.value_as_string?.toLowerCase().includes(searchValue.toLowerCase()) ||
      formatDate(help.observation_date || help.created_at).includes(searchValue),
  );

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const calculateAge = (birthDatetime?: string | null, yearOfBirth?: number | null) => {
    if (birthDatetime) {
      const birthDate = new Date(birthDatetime);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    if (yearOfBirth) {
      return new Date().getFullYear() - yearOfBirth;
    }
    return null;
  };

  const patientName =
    patient?.social_name ||
    `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() ||
    'Paciente';

  const patientAge = patient ? calculateAge(patient.birth_datetime, patient.year_of_birth) : null;

  const urgentHelpRequests = helpRequests.filter((help) => {
    const helpDate = new Date(help.observation_date || help.created_at);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - helpDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3;
  });

  const getPatientName = (patient: PersonRetrieve): string => {
    return (
      patient.social_name ||
      `${patient.first_name || ''} ${patient.last_name || ''}`.trim() ||
      'Paciente'
    );
  };

  const getPatientInitials = (patient: PersonRetrieve): string => {
    const name = getPatientName(patient);
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      <Header
        title={`Paciente: ${patientName}`}
        subtitle={
          context === 'emergency' ? '🚨 Contexto: Emergência' : `ID: ${patient?.person_id || id}`
        }
      />

      <div className="flex-1 px-4 py-6 bg-background rounded-t-3xl mt-4 relative z-10 pb-24">
        {/* Messages */}
        <div className="space-y-4 mb-6">
          {success && (
            <SuccessMessage
              message={success}
              onClose={clearSuccess}
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}

          {error && (
            <ErrorMessage
              message={error}
              onClose={clearError}
              onRetry={() => fetchAllData()}
              variant="destructive"
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection mb-4" />
            <p className="text-gray2 text-sm">Carregando dados do paciente...</p>
          </div>
        )}

        {!loading && patient && (
          <>
            {/* Patient Info Card */}
            <div className="bg-card rounded-2xl p-5 border border-card-border mb-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {patient.profile_picture ? (
                    <img
                      src={patient.profile_picture}
                      alt={getPatientName(patient)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-selection font-bold text-lg">
                      {getPatientInitials(patient)}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-card-foreground font-semibold text-lg">{patientName}</h2>
                  <p className="text-gray2 text-sm">ID: {patient.person_id}</p>
                  {patientAge !== null && (
                    <p className="text-gray2 text-sm mt-1">Idade: {patientAge} anos</p>
                  )}
                </div>

                {context === 'emergency' && (
                  <div className="bg-destructive/10 px-3 py-1 rounded-full">
                    <span className="text-destructive text-xs font-medium">🚨 Emergência</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-card-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-selection">{diaries.length}</p>
                  <p className="text-gray2 text-xs">Diários</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{helpRequests.length}</p>
                  <p className="text-gray2 text-xs">Pedidos de ajuda</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <TextField
                id="search"
                name="search"
                label="Buscar registros"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar por data, conteúdo..."
                className="w-full"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-card rounded-xl p-1 mb-6 border border-card-border">
              <button
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'diarios'
                    ? 'bg-selection text-white shadow-sm'
                    : 'text-gray2 hover:text-card-foreground hover:bg-card-muted'
                }`}
                onClick={() => setActiveTab('diarios')}
              >
                📖 Diários ({filteredDiaries.length})
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  activeTab === 'ajuda'
                    ? 'bg-destructive text-white shadow-sm'
                    : 'text-gray2 hover:text-card-foreground hover:bg-card-muted'
                }`}
                onClick={() => setActiveTab('ajuda')}
              >
                🚨 Pedidos de Ajuda ({filteredHelpRequests.length})
                {urgentHelpRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                )}
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'diarios' && (
              <div className="space-y-4">
                {diariesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-selection/20 border-t-selection mr-2" />
                    <span className="text-gray2 text-sm">Carregando diários...</span>
                  </div>
                )}

                {!diariesLoading && filteredDiaries.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📖</span>
                    </div>
                    <h3 className="text-typography font-semibold text-base mb-2">
                      {searchValue ? 'Nenhum diário encontrado' : 'Nenhum diário registrado'}
                    </h3>
                    <p className="text-gray2 text-sm">
                      {searchValue
                        ? `Não encontramos diários com "${searchValue}"`
                        : 'Este paciente ainda não possui diários registrados'}
                    </p>
                  </div>
                )}

                {!diariesLoading &&
                  filteredDiaries.length > 0 &&
                  filteredDiaries.map((diary) => {
                    const interestAreas = diary.interest_areas || [];

                    // Count total triggers and answered triggers across all interest areas
                    let totalTriggers = 0;
                    let answeredTriggers = 0;

                    interestAreas.forEach((area) => {
                      const triggers = area.triggers || [];
                      totalTriggers += triggers.length;

                      answeredTriggers += triggers.filter(
                        (trigger) => trigger.response && trigger.response.trim() !== '',
                      ).length;
                    });

                    const progressPercentage =
                      totalTriggers > 0 ? (answeredTriggers / totalTriggers) * 100 : 0;

                    const hasAttentionPoints =
                      interestAreas.some((area) => (area.marked_by?.length ?? 0) > 0) || false;
                    return (
                      <div
                        key={diary.diary_id}
                        className="bg-card rounded-2xl p-4 border border-card-border hover:border-selection/20 transition-all duration-200 cursor-pointer hover:shadow-sm"
                        onClick={() => navigate(`/provider/patient/${id}/diary/${diary.diary_id}`)}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-selection/10 rounded-full flex items-center justify-center">
                            <span className="text-selection text-lg">📖</span>
                          </div>
                          <div>
                            <h4 className="text-card-foreground font-medium text-sm">
                              Diário - {formatDate(diary.date)}
                            </h4>
                            <p className="text-gray2 text-xs">{getRelativeTime(diary.date)}</p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-gray2">
                              <span className="mgc_right_line" />
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray2">Progresso dos interesses</span>
                            <span className="text-sm font-medium text-typography">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-card-muted rounded-full h-2 border border-card-border">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                hasAttentionPoints
                                  ? 'bg-gradient-to-r from-accent1 to-destructive'
                                  : 'bg-gradient-to-r from-selection to-homebg'
                              }`}
                              style={{
                                width: `${progressPercentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Category and entry count - bottom line */}
                        <div className="flex items-center justify-between">
                          <span className="bg-selection/10 text-selection text-xs px-2 py-1 rounded-full font-medium">
                            {diary.date_range_type === 'since_last'
                              ? 'Desde o último'
                              : 'Dia do registro'}
                          </span>
                          <p className="text-gray2 text-xs">
                            {diary.interest_areas?.length || 0}{' '}
                            {diary.interest_areas?.length === 1 ? 'interesse' : 'interesses'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {activeTab === 'ajuda' && (
              <div className="space-y-4">
                {helpRequestsLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-destructive/20 border-t-destructive mr-2" />
                    <span className="text-gray2 text-sm">Carregando pedidos de ajuda...</span>
                  </div>
                )}

                {!helpRequestsLoading && filteredHelpRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚨</span>
                    </div>
                    <h3 className="text-typography font-semibold text-base mb-2">
                      {searchValue ? 'Nenhum pedido encontrado' : 'Nenhum pedido de ajuda'}
                    </h3>
                    <p className="text-gray2 text-sm">
                      {searchValue
                        ? `Não encontramos pedidos com "${searchValue}"`
                        : 'Este paciente não fez pedidos de ajuda ainda'}
                    </p>
                  </div>
                )}

                {!helpRequestsLoading &&
                  filteredHelpRequests.length > 0 &&
                  filteredHelpRequests.map((helpRequest) => {
                    const isUrgent = urgentHelpRequests.some(
                      (urgent) => urgent.id === helpRequest.id,
                    );

                    return (
                      <div
                        key={helpRequest.id}
                        className={`bg-card rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                          isUrgent
                            ? 'border-destructive/30 bg-destructive/5'
                            : 'border-card-border hover:border-destructive/20'
                        }`}
                        onClick={() => navigate(`/provider/help/${id}/${helpRequest.id}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isUrgent ? 'bg-destructive/20' : 'bg-destructive/10'
                              }`}
                            >
                              <span className="text-destructive text-lg">🚨</span>
                            </div>
                            <div>
                              <h4 className="text-card-foreground font-medium text-sm flex items-center gap-2">
                                Pedido de Ajuda
                                {isUrgent && (
                                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                                )}
                              </h4>
                              <p className="text-gray2 text-xs">
                                {formatDateWithTime(
                                  helpRequest.observation_date || helpRequest.created_at,
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-gray2 text-lg">
                            <span className="mgc_right_line" />
                          </span>
                        </div>

                        <div className="bg-gray2/5 rounded-lg p-3">
                          <p className="text-card-foreground text-sm">
                            {helpRequest.value_as_string || 'Pedido de ajuda sem descrição'}
                          </p>
                        </div>

                        {isUrgent && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="bg-destructive/20 text-destructive text-xs px-2 py-1 rounded-full font-medium">
                              ⚠️ Recente
                            </span>
                            <span className="text-gray2 text-xs">
                              {getRelativeTime(
                                helpRequest.observation_date || helpRequest.created_at,
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavigationBar variant="acs" forceActiveId={getActiveNavId()} />
    </div>
  );
}
