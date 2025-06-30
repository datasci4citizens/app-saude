import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/forms/button';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import { HelpService } from '@/api/services/HelpService';
import { LinkPersonProviderService } from '@/api/services/LinkPersonProviderService';
import { useApp } from '@/contexts/AppContext';

export default function AcsMainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAccount } = useApp();

  // Data states
  const [emergencyCount, setEmergencyCount] = useState<number>(0);
  const [patientsCount, setPatientsCount] = useState<number>(0);
  //const [todayAppointments, setTodayAppointments] = useState<number>(0);

  // UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userName = currentAccount?.name || 'ACS';
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 12) return 'Bom dia';
    if (currentHour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar contagem de pedidos de ajuda
      const helpResponse = await HelpService.providerHelpCountRetrieve();
      setEmergencyCount(helpResponse.help_count || 0);

      // Buscar contagem de pacientes
      try {
        const patientsResponse = await LinkPersonProviderService.providerPersonsList();
        setPatientsCount(patientsResponse.length || 0);
      } catch {
        setPatientsCount(0);
      }

      // Simular consultas de hoje (placeholder)
      // setTodayAppointments(Math.floor(Math.random() * 5));
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Erro ao carregar informações do dashboard.');
    } finally {
      setLoading(false);
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

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const quickActions = [
    {
      id: 'patients',
      title: 'Gerenciar Pacientes',
      subtitle: 'Ver todos os pacientes vinculados',
      icon: '👥',
      color: 'bg-success',
      textColor: 'text-white',
      onClick: () => navigate('/patients'),
    },
    //{
    //  id: 'emergencies',
    //  title: 'Pedidos de Ajuda',
    //  subtitle: 'Verificar solicitações',
    //  icon: '🚨',
    //  color: 'bg-yellow',
    //  textColor: 'text-white',
    //  onClick: () => navigate('/emergencies'),
    //  badge: emergencyCount > 0 ? emergencyCount : undefined,
    //},
    // {
    //   id: "appointments",
    //   title: "Agenda",
    //   subtitle: "Consultas e compromissos",
    //   icon: "📅",
    //   color: "bg-accent1",
    //   textColor: "text-white",
    //   onClick: () => navigate("/appointments"),
    // },
    // {
    //   id: "reports",
    //   title: "Relatórios",
    //   subtitle: "Acompanhar progresso",
    //   icon: "📊",
    //   color: "bg-success",
    //   textColor: "text-white",
    //   onClick: () => navigate("/reports"),
    // },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      {/* Header with Welcome */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-white/80 text-sm">Como está o seu dia de trabalho?</p>
          </div>

          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-xl">🩺</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2   gap-3">
          <div className="bg-homeblob2 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-offwhite text-2xl font-bold">
              {loading ? '...' : patientsCount}
            </div>
            <div className="text-offwhite text-xs">Pacientes</div>
          </div>

          <div className="bg-homeblob2 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-offwhite  text-2xl font-bold">
              {loading ? '...' : emergencyCount}
            </div>
            <div className="text-offwhite text-xs">Pedidos</div>
          </div>

          {/*<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {loading ? "..." : todayAppointments}
            </div>
            <div className="text-white/80 text-xs">Hoje</div>
          </div>*/}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background rounded-t-3xl px-4 py-6 pb-24 relative z-10">
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
              onRetry={() => fetchDashboardData()}
              variant="destructive"
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-typography font-semibold text-lg mb-4">Ações Rápidas</h2>

          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className={`${action.color} rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden`}
                onClick={action.onClick}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{action.icon}</span>
                    {action.badge && (
                      <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {action.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`${action.textColor} font-semibold text-sm mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`${action.textColor} opacity-80 text-xs`}>{action.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Focus */}
        <div className="mb-8">
          <h2 className="text-typography font-semibold text-lg mb-4">Foco de Hoje</h2>

          <div className="space-y-3">
            <div className="bg-card rounded-2xl p-4 border border-card-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent1/20 rounded-full flex items-center justify-center">
                  <span className="text-accent1">📋</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-card-foreground font-medium text-sm">
                    Revisar pedidos de ajuda
                  </h3>
                  <p className="text-gray2 text-xs">Verificar solicitações dos últimos 3 dias</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/emergencies')}>
                  <span className="mgc_right_line" />
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-card-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-selection/20 rounded-full flex items-center justify-center">
                  <span className="text-selection">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-card-foreground font-medium text-sm">Acompanhar pacientes</h3>
                  <p className="text-gray2 text-xs">Verificar diários e progresso</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
                  <span className="mgc_right_line" />
                </Button>
              </div>
            </div>

            {/*<div className="bg-card rounded-2xl p-4 border border-card-border">
              {/*<div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                  <span className="text-success">📈</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-card-foreground font-medium text-sm">
                    Gerar relatórios
                  </h3>
                  <p className="text-gray2 text-xs">
                    Atualizar registros semanais
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/reports")}
                >
                  <span className="mgc_right_line"></span>
                </Button>
              </div>
            </div>*/}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-accent1/10 rounded-2xl p-4 border border-accent1/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent1/20 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-accent1 text-sm">💡</span>
            </div>
            <div>
              <h3 className="text-accent1 font-medium text-sm mb-1">Dica do Dia</h3>
              <p className="text-typography text-xs leading-relaxed">
                Mantenha contato regular com seus pacientes. Um acompanhamento proativo pode
                prevenir situações de emergência.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigationBar variant="acs" forceActiveId={getActiveNavId()} />
    </div>
  );
}
