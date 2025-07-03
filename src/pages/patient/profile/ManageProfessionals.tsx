import { useEffect, useState } from 'react';
import Header from '@/components/ui/header';
import { Button } from '@/components/forms/button';
import { TextField } from '@/components/forms/text_input';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import BottomNavigationBar from '@/components/ui/navigator-bar';
import type { PersonLinkProviderRequest } from '@/api/models/PersonLinkProviderRequest';
import type { ProviderRetrieve } from '@/api/models/ProviderRetrieve';
import {
  PersonProviderLinkingService,
  PersonProviderRelationshipsService,
  UserManagementService,
} from '@/api';

export default function ManageProfessionalsPage() {
  // Data states
  const [providers, setProviders] = useState<ProviderRetrieve[]>([]);
  const [personId, setPersonId] = useState<number | null>(null);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<number | null>(null);

  // Add Professional Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [providerCode, setProviderCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [foundProvider, setFoundProvider] = useState<ProviderRetrieve | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [dialogStep, setDialogStep] = useState<'input' | 'confirm' | 'success'>('input');

  // Unlink Confirmation Dialog states
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [providerToUnlink, setProviderToUnlink] = useState<ProviderRetrieve | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      const userEntity = await UserManagementService.apiUserEntityRetrieve();
      setPersonId(userEntity.person_id);

      // Fetch linked providers
      const result = await PersonProviderRelationshipsService.personProvidersList();
      setProviders(result || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Não foi possível carregar os profissionais vinculados.');
    } finally {
      setLoading(false);
    }
  };

  // Add Professional Dialog Functions
  const openAddDialog = () => {
    setShowAddDialog(true);
    setDialogStep('input');
    setProviderCode('');
    setFoundProvider(null);
    setAddError(null);
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
    setDialogStep('input');
    setProviderCode('');
    setFoundProvider(null);
    setAddError(null);
    setIsSearching(false);
    setIsLinking(false);
  };

  const searchProvider = async () => {
    if (!providerCode || providerCode.length !== 6) {
      setAddError('O código deve ter exatamente 6 dígitos');
      return;
    }

    setIsSearching(true);
    setAddError(null);

    try {
      const request: PersonLinkProviderRequest = { code: providerCode };
      const providerData = await PersonProviderLinkingService.providerByLinkCodeCreate(request);

      // Format provider name
      const fullname = `${providerData.first_name} ${providerData.last_name}`;
      providerData.social_name = providerData.social_name || fullname;

      setFoundProvider(providerData);
      setDialogStep('confirm');
    } catch (err) {
      console.error('Error fetching provider:', err);
      setAddError(
        'Código não encontrado. Verifique se digitou corretamente ou peça um novo código ao profissional.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const confirmLinkProvider = async () => {
    if (!foundProvider || !personId) return;

    setIsLinking(true);
    setAddError(null);

    try {
      const linkRequest: PersonLinkProviderRequest = {
        code: providerCode,
      };
      await PersonProviderLinkingService.personLinkCodeCreate(linkRequest);

      setDialogStep('success');

      // Refresh the providers list
      setTimeout(() => {
        fetchData();
        closeAddDialog();
        setSuccess(`${getProviderName(foundProvider)} foi vinculado com sucesso!`);
      }, 1500);
    } catch (error) {
      console.error('Error linking provider:', error);
      setAddError('Erro ao vincular profissional. Tente novamente.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6);
    setProviderCode(value);
    setAddError(null);
    setFoundProvider(null);
    setDialogStep('input');
  };

  // Updated unlink functions
  const handleUnlink = (provider: ProviderRetrieve) => {
    if (!personId) {
      setError('ID do usuário não encontrado. Tente recarregar a página.');
      return;
    }

    setProviderToUnlink(provider);
    setShowUnlinkDialog(true);
  };

  const confirmUnlink = async () => {
    if (!providerToUnlink || !personId) return;

    setUnlinkingId(providerToUnlink.provider_id);
    setError(null);
    setShowUnlinkDialog(false);

    const providerName = getProviderName(providerToUnlink);

    try {
      await PersonProviderLinkingService.personProviderUnlinkCreate(
        personId,
        providerToUnlink.provider_id,
      );

      setProviders((prev) => prev.filter((p) => p.provider_id !== providerToUnlink.provider_id));
      setSuccess(`${providerName} foi desvinculado com sucesso.`);
    } catch (err) {
      console.error('Error unlinking provider:', err);
      setError(`Erro ao desvincular ${providerName}. Tente novamente.`);
    } finally {
      setUnlinkingId(null);
      setProviderToUnlink(null);
    }
  };

  const cancelUnlink = () => {
    setShowUnlinkDialog(false);
    setProviderToUnlink(null);
  };

  const getProviderName = (provider: ProviderRetrieve): string => {
    return (
      provider.social_name ||
      provider.first_name ||
      provider.last_name ||
      `${provider.first_name || ''} ${provider.last_name || ''}`.trim() ||
      'Profissional sem nome'
    );
  };

  const getProviderInitials = (provider: ProviderRetrieve): string => {
    const name = getProviderName(provider);
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return (
    <div className="flex flex-col min-h-screen bg-homebg">
      <Header title="Gerenciar Profissionais" subtitle="Visualize e gerencie suas conexões" />

      <div className="flex-1 px-4 py-6 bg-background rounded-t-3xl mt-4 relative z-10">
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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection mb-4" />
            <p className="text-gray2 text-sm">Carregando profissionais...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && providers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-gray2/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👨‍⚕️</span>
            </div>
            <h3 className="text-typography font-semibold text-lg mb-3">
              Nenhum profissional vinculado
            </h3>
            <p className="text-gray2 text-sm mb-6 max-w-sm">
              Você ainda não possui profissionais de saúde vinculados. Adicione um para começar a
              receber cuidados personalizados.
            </p>
            <Button variant="orange" onClick={openAddDialog} className="px-8">
              <span className="mr-2">➕</span>
              Adicionar profissional
            </Button>
          </div>
        )}

        {/* Providers List */}
        {!loading && providers.length > 0 && (
          <div className="space-y-6">
            {/* Header with count and add button */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-typography font-semibold text-lg">Profissionais Vinculados</h3>
                <p className="text-gray2 text-sm">
                  {providers.length} {providers.length === 1 ? 'profissional' : 'profissionais'}{' '}
                  conectados
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={openAddDialog}
                className="flex items-center gap-2"
              >
                <span className="text-lg">➕</span>
                Adicionar
              </Button>
            </div>

            {/* Providers Cards */}
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.provider_id}
                  className="bg-card rounded-2xl p-5 border border-card-border hover:border-selection/20 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-selection to-accent1 flex-shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                        {provider.profile_picture ? (
                          <img
                            src={provider.profile_picture}
                            alt={getProviderName(provider)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-selection font-bold text-lg">
                            {getProviderInitials(provider)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1">
                      <h4 className="text-card-foreground font-semibold text-base mb-1">
                        {getProviderName(provider)}
                      </h4>

                      {provider.professional_registration && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-gray2">Registro:</span>
                          <span className="text-xs text-card-foreground font-medium">
                            {provider.professional_registration}
                          </span>
                        </div>
                      )}

                      {provider.specialty_concept && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-gray2">Especialidade:</span>
                          <span className="text-xs text-card-foreground">
                            {provider.specialty_concept}
                          </span>
                        </div>
                      )}

                      {provider.created_at && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray2">Vinculado em:</span>
                          <span className="text-xs text-card-foreground">
                            {formatDate(provider.created_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-card-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-success text-xs font-medium">Conectado</span>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnlink(provider)}
                      disabled={unlinkingId === provider.provider_id}
                      className="px-4 h-8 text-xs"
                    >
                      {unlinkingId === provider.provider_id ? (
                        <div className="flex items-center gap-2">
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

            {/* Info Card */}
            <div className="bg-accent1/10 rounded-2xl p-4 border border-accent1/20 mt-8">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="text-accent1 font-medium text-sm mb-1">Sobre a vinculação</h4>
                  <p className="text-typography text-xs leading-relaxed">
                    Profissionais vinculados podem acessar seus dados do diário, receber pedidos de
                    ajuda e enviar orientações personalizadas. Você pode desvincular a qualquer
                    momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Professional Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4 pb-20">
          <div className="my-8 bg-background rounded-3xl w-full max-w-lg h-full max-h-[90vh] flex flex-col">
            {/* Dialog Header - FIXO */}
            <div className="flex-shrink-0 bg-background rounded-t-3xl border-b border-card-border p-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-typography font-semibold text-lg">Adicionar Profissional</h2>
                <button
                  onClick={closeAddDialog}
                  className="w-8 h-8 rounded-full bg-gray2/10 flex items-center justify-center text-gray2 hover:bg-gray2/20 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center mt-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      dialogStep === 'input' ? 'bg-selection text-white' : 'bg-selection text-white'
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-12 h-1 rounded transition-all duration-300 ${
                      dialogStep === 'confirm' || dialogStep === 'success'
                        ? 'bg-selection'
                        : 'bg-gray2/30'
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      dialogStep === 'confirm' || dialogStep === 'success'
                        ? 'bg-selection text-white'
                        : 'bg-gray2/30 text-gray2'
                    }`}
                  >
                    2
                  </div>
                  <div
                    className={`w-12 h-1 rounded transition-all duration-300 ${
                      dialogStep === 'success' ? 'bg-selection' : 'bg-gray2/30'
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      dialogStep === 'success'
                        ? 'bg-selection text-white'
                        : 'bg-gray2/30 text-gray2'
                    }`}
                  >
                    3
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Content - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Error Message */}
              {addError && (
                <ErrorMessage
                  message={addError}
                  onClose={() => setAddError(null)}
                  variant="destructive"
                  className="mb-4 animate-in slide-in-from-top-2 duration-300"
                />
              )}

              {/* Step 1: Input Code */}
              {dialogStep === 'input' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-selection/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <h3 className="text-typography font-semibold text-base mb-2">
                      Digite o código do profissional
                    </h3>
                    <p className="text-gray2 text-sm">
                      Peça ao profissional para fornecer o código de 6 dígitos
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-4 border border-card-border">
                    <TextField
                      id="providerCode"
                      name="providerCode"
                      label="Código do profissional"
                      value={providerCode}
                      onChange={handleCodeChange}
                      placeholder="000000"
                      type="text"
                      pattern="[A-Fa-f0-9]{6}"
                      maxLength={6}
                      className="text-center text-xl font-mono tracking-widest"
                    />

                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray2">
                        {providerCode.length}/6 dígitos (A-F, a-f, 0-9)
                      </span>
                    </div>
                  </div>

                  <div className="bg-accent1/10 rounded-xl p-4 border border-accent1/20">
                    <div className="flex items-start gap-3">
                      <span className="text-base">💡</span>
                      <div>
                        <h4 className="text-accent1 font-medium text-sm mb-1">
                          Como obter o código?
                        </h4>
                        <p className="text-typography text-xs leading-relaxed">
                          Solicite ao profissional de saúde que compartilhe o código de vinculação
                          de 6 dígitos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={searchProvider}
                    variant="orange"
                    size="full"
                    disabled={isSearching || providerCode.length !== 6}
                    className="h-11"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                        Buscando...
                      </div>
                    ) : (
                      'Buscar profissional'
                    )}
                  </Button>
                </div>
              )}

              {/* Step 2: Confirm Provider */}
              {dialogStep === 'confirm' && foundProvider && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-typography font-semibold text-base mb-2">
                      Profissional encontrado!
                    </h3>
                    <p className="text-gray2 text-sm">Confirme se este é o profissional correto</p>
                  </div>

                  <div className="bg-card rounded-xl p-4 border border-card-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-selection to-accent1 flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                          {foundProvider.profile_picture ? (
                            <img
                              src={foundProvider.profile_picture}
                              alt={foundProvider.social_name || 'Profissional'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">👨‍⚕️</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-card-foreground font-semibold text-base">
                          {getProviderName(foundProvider)}
                        </h4>
                        {foundProvider.professional_registration && (
                          <p className="text-gray2 text-sm mt-1">
                            Registro: {foundProvider.professional_registration}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <span className="w-1.5 h-1.5 bg-success rounded-full" />
                          <span className="text-success text-xs font-medium">
                            Código: {providerCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray2/5 rounded-lg p-3">
                      <p className="text-gray2 text-xs text-center">
                        Ao confirmar, você permitirá que este profissional acesse seus dados de
                        saúde e possa te enviar orientações.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setDialogStep('input')}
                      variant="ghost"
                      className="flex-1 h-11"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={confirmLinkProvider}
                      variant="orange"
                      className="flex-1 h-11"
                      disabled={isLinking}
                    >
                      {isLinking ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                          Vinculando...
                        </div>
                      ) : (
                        'Confirmar vínculo'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {dialogStep === 'success' && foundProvider && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl">🎉</span>
                  </div>

                  <div>
                    <h3 className="text-typography font-semibold text-lg mb-3">
                      Profissional vinculado com sucesso!
                    </h3>
                    <p className="text-gray2 text-sm leading-relaxed">
                      <strong>{getProviderName(foundProvider)}</strong> foi adicionado à sua lista
                      de profissionais.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-4 border border-card-border">
                    <h4 className="text-card-foreground font-medium text-sm mb-3">
                      Agora você pode:
                    </h4>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-selection/10 rounded-full flex items-center justify-center text-xs">
                          🚨
                        </span>
                        <span className="text-gray2 text-sm">Enviar pedidos de ajuda</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-selection/10 rounded-full flex items-center justify-center text-xs">
                          📊
                        </span>
                        <span className="text-gray2 text-sm">Compartilhar dados do diário</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-selection/10 rounded-full flex items-center justify-center text-xs">
                          💬
                        </span>
                        <span className="text-gray2 text-sm">Receber orientações</span>
                      </div>
                    </div>
                  </div>

                  <div className="animate-pulse">
                    <p className="text-gray2 text-xs">Fechando automaticamente...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unlink Confirmation Dialog */}
      <ConfirmDialog
        open={showUnlinkDialog}
        title="⚠️ Desvincular profissional?"
        description={
          providerToUnlink
            ? `Esta ação irá desvincular ${getProviderName(providerToUnlink)} permanentemente.`
            : ''
        }
        confirmText="Desvincular"
        cancelText="Cancelar"
        confirmVariant="destructive"
        onConfirm={confirmUnlink}
        onCancel={cancelUnlink}
        disabled={unlinkingId !== null}
      >
        {providerToUnlink && (
          <div className="space-y-4">
            <div className="bg-gray2/5 rounded-lg p-3">
              <h4 className="font-medium text-foreground mb-2">
                {getProviderName(providerToUnlink)}
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Removerá acesso aos seus dados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Cancelará notificações deste profissional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Interromperá compartilhamento do diário</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ConfirmDialog>

      <BottomNavigationBar variant="user" forceActiveId={getActiveNavId()} />
    </div>
  );
}
