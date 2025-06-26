import React from 'react';
import { User, Settings, LogOut, Check, Calendar } from 'lucide-react';
import type { Account } from './AccountManager';

interface MainAppScreenProps {
  activeAccount: Account | null;
  navigateToAccountSelection: () => void;
}

const MainAppScreen: React.FC<MainAppScreenProps> = ({
  activeAccount,
  navigateToAccountSelection,
}) => {
  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-titulo font-work-sans text-typography mb-2">Nenhuma conta ativa</h2>
          <p className="text-campos-preenchimento text-gray2 mb-4">
            Selecione uma conta para continuar
          </p>
          <button
            onClick={navigateToAccountSelection}
            className="bg-button-primary hover:bg-button-primary-hover text-white px-6 py-3 rounded-lg"
          >
            Selecionar conta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {activeAccount.profilePicture ? (
              <img
                src={activeAccount.profilePicture}
                alt={activeAccount.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-card-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent1 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="ml-3">
              <h2 className="text-topicos2 font-work-sans text-typography">{activeAccount.name}</h2>
              <p className="text-desc-campos text-gray2">{activeAccount.email}</p>
            </div>
          </div>
          <button
            onClick={navigateToAccountSelection}
            className="p-2 rounded-lg bg-gray2/20 hover:bg-gray2/30 transition-colors"
            title="Configurações da conta"
          >
            <Settings className="w-5 h-5 text-typography" />
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6 space-y-6">
        {/* Card de Boas-vindas */}
        <div className="bg-card rounded-xl border border-card-border p-6">
          <h3 className="text-titulowindow font-work-sans text-typography mb-2">
            Bem-vindo(a), {activeAccount.name.split(' ')[0]}!
          </h3>
          <p className="text-campos-preenchimento text-gray2 mb-4">
            {activeAccount.role === 'provider'
              ? 'Gerencie seus pacientes e consultas através do painel profissional.'
              : 'Acompanhe seu progresso e consultas através do seu painel pessoal.'}
          </p>
          <div
            className={`inline-flex items-center px-3 py-2 rounded-full text-desc-campos font-medium ${
              activeAccount.role === 'provider'
                ? 'bg-accent1/20 text-accent1'
                : 'bg-selection/20 text-selection'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                activeAccount.role === 'provider' ? 'bg-accent1' : 'bg-selection'
              }`}
            />
            Conta {activeAccount.role === 'provider' ? 'Profissional' : 'Pessoal'}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-card-border p-4 hover:border-selection/50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-selection/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-selection" />
              </div>
              <h4 className="text-topicos font-work-sans text-typography mb-1">
                {activeAccount.role === 'provider' ? 'Pacientes' : 'Consultas'}
              </h4>
              <p className="text-2xl font-bold text-typography">
                {activeAccount.role === 'provider' ? '24' : '8'}
              </p>
              <p className="text-desc-campos text-gray2 mt-1">
                {activeAccount.role === 'provider' ? 'Ativos' : 'Este mês'}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-card-border p-4 hover:border-accent1/50 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-accent1/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent1" />
              </div>
              <h4 className="text-topicos font-work-sans text-typography mb-1">
                {activeAccount.role === 'provider' ? 'Agenda' : 'Progresso'}
              </h4>
              <p className="text-2xl font-bold text-typography">
                {activeAccount.role === 'provider' ? '12' : '85%'}
              </p>
              <p className="text-desc-campos text-gray2 mt-1">
                {activeAccount.role === 'provider' ? 'Hoje' : 'Completo'}
              </p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-3">
          <h4 className="text-topicos font-work-sans text-typography">Ações Rápidas</h4>

          {activeAccount.role === 'provider' ? (
            // Ações para profissionais
            <>
              <button className="w-full bg-card hover:bg-muted/50 border border-card-border rounded-xl p-4 transition-colors text-left">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-selection/20 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-selection" />
                  </div>
                  <div>
                    <h5 className="text-topicos2 font-work-sans text-typography">Ver Agenda</h5>
                    <p className="text-desc-campos text-gray2">Consultas e compromissos</p>
                  </div>
                </div>
              </button>

              <button className="w-full bg-card hover:bg-muted/50 border border-card-border rounded-xl p-4 transition-colors text-left">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent1/20 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-accent1" />
                  </div>
                  <div>
                    <h5 className="text-topicos2 font-work-sans text-typography">
                      Gerenciar Pacientes
                    </h5>
                    <p className="text-desc-campos text-gray2">Lista e prontuários</p>
                  </div>
                </div>
              </button>
            </>
          ) : (
            // Ações para pacientes
            <>
              <button className="w-full bg-card hover:bg-muted/50 border border-card-border rounded-xl p-4 transition-colors text-left">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-selection/20 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-selection" />
                  </div>
                  <div>
                    <h5 className="text-topicos2 font-work-sans text-typography">
                      Próximas Consultas
                    </h5>
                    <p className="text-desc-campos text-gray2">Agenda de compromissos</p>
                  </div>
                </div>
              </button>

              <button className="w-full bg-card hover:bg-muted/50 border border-card-border rounded-xl p-4 transition-colors text-left">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent1/20 rounded-lg flex items-center justify-center mr-3">
                    <Check className="w-5 h-5 text-accent1" />
                  </div>
                  <div>
                    <h5 className="text-topicos2 font-work-sans text-typography">Meu Progresso</h5>
                    <p className="text-desc-campos text-gray2">Acompanhar evolução</p>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Botão Trocar Conta */}
        <button
          onClick={navigateToAccountSelection}
          className="w-full bg-muted hover:bg-gray2/30 border border-card-border rounded-xl p-4 transition-all duration-200 button-press-effect"
        >
          <div className="flex items-center justify-center text-typography">
            <LogOut className="w-5 h-5 mr-2" />
            <span className="text-topicos2 font-work-sans">Trocar de conta</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainAppScreen;
