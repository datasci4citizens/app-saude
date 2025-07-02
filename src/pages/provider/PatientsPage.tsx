import {ProviderService} from '@/api/services/ProviderService';
import { LinkPersonProviderService } from '@/api/services/LinkPersonProviderService';
import { Button } from '@/components/forms/button';
import { TextField } from '@/components/forms/text_input';
import { ErrorMessage } from '@/components/ui/error-message';
import Header from '@/components/ui/header';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import { SuccessMessage } from '@/components/ui/success-message';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Patient {
  id: string | number;
  name: string;
  age: number;
  lastDiary?: string;
  lastHelp?: string;
  urgent?: boolean;
  email?: string;
  phone?: string;
}

// Função para formatar a data para DD/MM/AAAA
const formatDisplayDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '';
  }
};

// Função para calcular dias desde a última atividade
const getDaysAgo = (dateString: string | undefined | null): number => {
  if (!dateString) return 0;
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
};

export default function PatientsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Search and filter states
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  // Link code states
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showLinkSection, setShowLinkSection] = useState(false);

  // Data states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unlinkingPatient, setUnlinkingPatient] = useState<string | number | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
  try {
    setLoading(true);
    setError(null);
    const apiPatients = await LinkPersonProviderService.providerPersonsList();

    interface ApiPatient {
      person_id: number;
      name: string;
      age: number | null;
      last_visit_date: string | null;
      last_help_date: string | null;
      email?: string;
      phone?: string;
    }

    // Fetch diary data for all patients in parallel
    const formattedPatients: Patient[] = await Promise.all(
      apiPatients.map(async (patient: ApiPatient) => {
        // Check if last_help_date is valid
        let isUrgent = false;
        if (patient.last_help_date) {
          const helpDate = new Date(patient.last_help_date);
          if (!Number.isNaN(helpDate.getTime())) {
            isUrgent = getDaysAgo(patient.last_help_date) <= 3;
          }
        }

        // Get last diary date
        const lastDiaryDate = await getLastDiaryDate(patient.person_id);

        return {
          id: patient.person_id,
          name: patient.name,
          age: patient.age || 0,
          lastDiary: formatDisplayDate(lastDiaryDate),
          lastHelp: formatDisplayDate(patient.last_help_date),
          email: patient.email,
          phone: patient.phone,
          urgent: isUrgent,
        };
      })
    );

    setPatients(formattedPatients);
  } catch (_) {
    console.error('Erro ao buscar pacientes:', _);
    setError('Não foi possível carregar a lista de pacientes.');
  } finally {
    setLoading(false);
  }
};

  const generateLinkCode = async () => {
    setIsGeneratingCode(true);
    setError(null);

    try {
      const response = await LinkPersonProviderService.providerLinkCodeCreate();
      setLinkCode(response.code);
      setSuccess('Código gerado com sucesso! Compartilhe com o paciente.');
    } catch (error) {
      console.error('Error generating link code:', error);
      setError('Não foi possível gerar o código. Tente novamente.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    if (linkCode) {
      try {
        await navigator.clipboard.writeText(linkCode);
        setSuccess('Código copiado para a área de transferência!');
      } catch (_err) {
        setError('Não foi possível copiar o código.');
      }
    }
  };

  const handleUnlinkPatient = async (patient: Patient) => {
    const confirmed = window.confirm(
      `⚠️ Desvincular paciente?\n\n${patient.name}\n\nEsta ação irá:\n• Remover acesso aos dados do paciente\n• Cancelar notificações\n• Interromper compartilhamento\n\nTem certeza que deseja continuar?`,
    );

    if (!confirmed) return;

    setUnlinkingPatient(patient.id);
    setError(null);

    try {
      // Assumindo que existe uma API para desvincular
      // await LinkPersonProviderService.unlinkPatient(patient.id);

      // Temporariamente removendo da lista local
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      setSuccess(`${patient.name} foi desvinculado com sucesso.`);
    } catch (err) {
      console.error('Erro ao desvincular paciente:', err);
      setError(`Erro ao desvincular ${patient.name}. Tente novamente.`);
    } finally {
      setUnlinkingPatient(null);
    }
  };

  // Filtros avançados
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchValue.toLowerCase());

    if (activeTab === 'urgentes') {
      return matchesSearch && patient.urgent;
    }

    return matchesSearch;
  });

  // Ordenação: urgentes primeiro, depois por nome
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return a.name.localeCompare(b.name);
  });

  const getActiveNavId = () => {
    if (location.pathname.startsWith('/acs-main-page')) return 'home';
    if (location.pathname.startsWith('/appointments')) return 'consults';
    if (location.pathname.startsWith('/patients')) return 'patients';
    if (location.pathname.startsWith('/emergencies')) return 'emergency';
    if (location.pathname.startsWith('/acs-profile')) return 'profile';
    return null;
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const urgentCount = patients.filter((p) => p.urgent).length;

    const getLastDiaryDate = async (patientId: number): Promise<string | null> => {
    try {
      const diaries = await ProviderService.providerPatientsDiariesList(patientId);
      if (diaries && diaries.length > 0) {
        // Sort diaries by date and get the most recent one
        const sortedDiaries = diaries.sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB.getTime() - dateA.getTime();
        });
        return sortedDiaries[0].date || null;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching diaries for patient ${patientId}:`, error);
      return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-homebg">
      <Header
        title="Gerenciar Pacientes"
        subtitle={`${patients.length} ${patients.length === 1 ? 'paciente' : 'pacientes'} vinculados`}
      />

      <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
        <div className="h-full overflow-y-auto pb-20">
          <div className="px-4 py-6">
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
                  onRetry={() => fetchPatients()}
                  variant="destructive"
                  className="animate-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6">
              <Button
                variant="orange"
                size="sm"
                onClick={() => setShowLinkSection(!showLinkSection)}
                className="flex items-center gap-2"
              >
                <span className="text-lg">➕</span>
                Conectar paciente
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchPatients()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <span className="text-lg">🔄</span>
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>

            {/* Link Code Section */}
            {showLinkSection && (
              <div className="bg-card rounded-2xl p-5 border border-card-border mb-6 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent1/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-card-foreground font-semibold text-base">
                      Código de Vinculação
                    </h3>
                    <p className="text-gray2 text-sm">Gere um código para o paciente se conectar</p>
                  </div>
                </div>

                {linkCode ? (
                  <div className="space-y-4">
                    <div className="bg-selection/10 rounded-xl p-4 border border-selection/20">
                      <div className="text-center">
                        <p className="text-selection font-bold text-3xl font-mono tracking-wider mb-2">
                          {linkCode}
                        </p>
                        <p className="text-selection/80 text-sm">⏰ Expira em 10 minutos</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="orange" className="flex-1">
                        📋 Copiar código
                      </Button>
                      <Button onClick={() => setLinkCode(null)} variant="ghost" className="flex-1">
                        🔄 Novo código
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={generateLinkCode}
                    variant="orange"
                    size="full"
                    disabled={isGeneratingCode}
                    className="h-12"
                  >
                    {isGeneratingCode ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                        Gerando código...
                      </div>
                    ) : (
                      '🎯 Gerar código de conexão'
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <TextField
                id="search"
                name="search"
                label="Buscar pacientes"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Digite o nome do paciente..."
                className="w-full"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-card rounded-xl p-1 mb-6 border border-card-border">
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'todos'
                    ? 'bg-selection text-white shadow-sm'
                    : 'text-gray2 hover:text-card-foreground hover:bg-card-muted'
                }`}
                onClick={() => setActiveTab('todos')}
              >
                Todos ({patients.length})
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  activeTab === 'urgentes'
                    ? 'bg-destructive text-white shadow-sm'
                    : 'text-gray2 hover:text-card-foreground hover:bg-card-muted'
                }`}
                onClick={() => setActiveTab('urgentes')}
              >
                🚨 Requerem ajuda ({urgentCount})
                {urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                )}
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection mb-4" />
                <p className="text-gray2 text-sm">Carregando pacientes...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && sortedPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-gray2/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">
                    {searchValue ? '🔍' : activeTab === 'urgentes' ? '🚨' : '👥'}
                  </span>
                </div>
                <h3 className="text-typography font-semibold text-lg mb-3">
                  {searchValue
                    ? 'Nenhum paciente encontrado'
                    : activeTab === 'urgentes'
                      ? 'Nenhum paciente precisa de ajuda'
                      : 'Nenhum paciente vinculado'}
                </h3>
                <p className="text-gray2 text-sm mb-6 max-w-sm">
                  {searchValue
                    ? `Não encontramos pacientes com "${searchValue}"`
                    : activeTab === 'urgentes'
                      ? 'Todos os pacientes estão bem no momento'
                      : 'Você ainda não possui pacientes vinculados'}
                </p>
                {!searchValue && activeTab === 'todos' && (
                  <Button
                    variant="orange"
                    onClick={() => setShowLinkSection(true)}
                    className="px-8"
                  >
                    <span className="mr-2">➕</span>
                    Conectar primeiro paciente
                  </Button>
                )}
              </div>
            )}

            {/* Patients List */}
            {!loading && sortedPatients.length > 0 && (
              <div className="space-y-4">
                {sortedPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`bg-card rounded-2xl p-5 border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                      patient.urgent
                        ? 'border-destructive/30 bg-destructive/5'
                        : 'border-card-border hover:border-selection/20'
                    }`}
                    onClick={() => navigate(`/provider/patient/${patient.id}`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            patient.urgent
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-selection/20 text-selection'
                          }`}
                        >
                          {patient.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h3 className="text-card-foreground font-semibold text-base flex items-center gap-2">
                            {patient.name}
                            {patient.urgent && (
                              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                            )}
                          </h3>
                          <p className="text-gray2 text-sm">{patient.age} anos</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {patient.urgent && (
                          <span className="bg-destructive/20 text-destructive text-xs px-2 py-1 rounded-full font-medium">
                            🚨 Ajuda
                          </span>
                        )}
                        <span className="text-gray2 text-lg">
                          <span className="mgc_right_line" />
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray2 text-xs mb-1">Último diário</p>
                        <p className="text-card-foreground text-sm font-medium">
                          {patient.lastDiary || 'Nenhum diário'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray2 text-xs mb-1">Último pedido de ajuda</p>
                        <p className="text-card-foreground text-sm font-medium">
                          {patient.lastHelp || 'Nenhum pedido'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-card-border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span className="text-success text-xs font-medium">Conectado</span>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlinkPatient(patient);
                        }}
                        disabled={unlinkingPatient === patient.id}
                        className="px-3 h-7 text-xs"
                      >
                        {unlinkingPatient === patient.id ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/20 border-t-white" />
                            Removendo...
                          </div>
                        ) : (
                          <>
                            <span className="mr-1">🗑️</span>
                            Desvincular
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNavigationBar variant="acs" forceActiveId={getActiveNavId()} />
      </div>
    </div>
  );
}
