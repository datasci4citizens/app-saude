import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/ui/header';
import { Button } from '@/components/forms/button';
import { PersonService } from '@/api/services/PersonService';
import { HelpService } from '@/api/services/HelpService';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import type { PersonRetrieve } from '@/api/models/PersonRetrieve';
import type { ObservationRetrieve } from '@/api/models/ObservationRetrieve';
import { ConfirmDialog } from '@/components/ui/confirmDialog';

export default function ViewHelp() {
  const { personId, helpId } = useParams<{
    personId: string;
    helpId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Data states
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [helpRequest, setHelpRequest] = useState<ObservationRetrieve | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmResolveOpen, setConfirmResolveOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    if (!personId || !helpId) {
      setError('IDs do paciente ou pedido de ajuda não encontrados.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar dados do paciente
      const patientData = await PersonService.apiPersonRetrieve(Number(personId));
      setPatient(patientData);

      // Buscar todos os pedidos de ajuda do provider
      const allHelpRequests = await HelpService.providerHelpList();

      // Encontrar o pedido específico
      const specificHelpRequest = allHelpRequests.find(
        (help: ObservationRetrieve) =>
          help.observation_id === Number(helpId) && help.person === Number(personId),
      );

      if (!specificHelpRequest) {
        setError('Pedido de ajuda não encontrado.');
        return;
      }

      setHelpRequest(specificHelpRequest);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 5) return 'Agora há pouco';
      if (diffInMinutes < 60) return `Há ${diffInMinutes} minutos`;
      if (diffInHours < 24) return `Há ${diffInHours}h`;
      if (diffInDays === 1) return 'Ontem';
      if (diffInDays < 7) return `Há ${diffInDays} dias`;
      return formatDateTime(dateString);
    } catch {
      return 'Data inválida';
    }
  };

  const handleMarkAsResolved = async () => {
    if (!helpId) {
      setError('ID do pedido de ajuda não encontrado.');
      return;
    }

    try {
      setIsResolving(true);
      await HelpService.providerHelpResolveCreate(Number(helpId));
      setSuccess('Pedido marcado como resolvido!');
      setConfirmResolveOpen(false);
      setTimeout(() => {
        navigate(`/provider/patient/${personId}`);
      }, 1500);
    } catch {
      setError('Erro ao marcar como resolvido. Tente novamente.');
    } finally {
      setIsResolving(false);
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

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'home':
        navigate('/acs-main-page');
        break;
      case 'patients':
        navigate('/patients');
        break;
      case 'emergency':
        navigate('/emergencies');
        break;
      case 'profile':
        navigate('/acs-profile');
        break;
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const patientName =
    patient?.social_name ||
    `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() ||
    'Paciente';

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      <Header
        title="Pedido de Ajuda"
        subtitle={patient ? `${patientName} • ID: ${patient.person_id}` : 'Carregando...'}
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
              onRetry={() => fetchData()}
              variant="destructive"
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-destructive/20 border-t-destructive mb-4" />
            <p className="text-gray2 text-sm">Carregando pedido de ajuda...</p>
          </div>
        )}

        {/* Content */}
        {!loading && patient && helpRequest && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-selection to-accent1 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {patientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-card-foreground font-semibold text-base">{patientName}</h2>
                  <p className="text-gray2 text-sm">ID: {patient.person_id}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/provider/patient/${personId}`)}
                className="w-full flex items-center gap-2"
              >
                <span className="text-sm">👤</span>
                Ver perfil completo do paciente
              </Button>
            </div>

            {/* Help Request Details */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <span className="text-destructive text-lg">🚨</span>
                </div>
                <div>
                  <h3 className="text-card-foreground font-semibold text-base">Pedido de Ajuda</h3>
                  <p className="text-gray2 text-sm">{formatDateTime(helpRequest.created_at)}</p>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray2/5 rounded-xl p-4 border border-gray2/10">
                <h4 className="text-card-foreground font-medium text-sm mb-2">
                  Mensagem do paciente:
                </h4>
                <div className="text-card-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {helpRequest.value_as_string || (
                    <span className="text-gray2 italic">
                      Nenhuma mensagem foi fornecida com este pedido de ajuda.
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {helpRequest.observation_source_value && (
                <div className="mt-4 pt-4 border-t border-card-border">
                  <h4 className="text-card-foreground font-medium text-sm mb-2">
                    Informações técnicas:
                  </h4>
                  <p className="text-gray2 text-sm">
                    Fonte: {helpRequest.observation_source_value}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-4 pt-4 border-t border-card-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray2 text-xs">ID do Pedido</p>
                    <p className="text-card-foreground font-medium">
                      #{helpRequest.observation_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray2 text-xs">Tempo decorrido</p>
                    <p className="text-card-foreground font-medium">
                      {getRelativeTime(helpRequest.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  variant="success"
                  className="flex-1 h-11"
                  onClick={() => setConfirmResolveOpen(true)}
                >
                  <span className="mr-2">✅</span>
                  Marcar como resolvido
                </Button>
              </div>

              <Button
                variant="ghost"
                size="full"
                onClick={() => navigate(-1)}
                className="h-10 text-sm"
              >
                ← Voltar
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmResolveOpen}
        title="Marcar como Resolvido"
        description="Esta ação marcará o pedido como resolvido e não poderá ser desfeita. Deseja continuar?"
        confirmText={isResolving ? 'Resolvendo...' : 'Sim, resolver'}
        cancelText="Cancelar"
        disabled={isResolving}
        confirmVariant="default"
        onCancel={() => {
          if (!isResolving) {
            setConfirmResolveOpen(false);
          }
        }}
        onConfirm={handleMarkAsResolved}
      />

      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
