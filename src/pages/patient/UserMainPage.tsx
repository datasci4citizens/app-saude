import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { X } from "lucide-react";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useState, useEffect } from "react";
import { useInterestAreasConcepts } from "@/utils/conceptLoader";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import { Button } from "@/components/forms/button";
import SuccessMessage from "@/components/ui/success-message";
import ErrorMessage from "@/components/ui/error-message";
import EditInterestDialog from "../../components/EditInterestsDialog";
import { ConfirmDialog } from "@/components/ui/confirmDialog";

// Extended interface for API response that includes the ID
interface InterestAreaResponse extends InterestArea {
  interest_area_id: number;
  concept_id?: number;
  is_temporary?: boolean; // Flag para identificar criados localmente
  is_deleted?: boolean; // Flag para identificar deletados localmente
}

export default function UserMainPage() {
  const navigate = useNavigate();

  // Estados principais
  const [userInterestObjects, setUserInterestObjects] = useState<
    InterestAreaResponse[]
  >([]);
  const [originalInterests, setOriginalInterests] = useState<
    InterestAreaResponse[]
  >([]); // Para comparar mudanças
  const [editionMode, setEditionMode] = useState(false);
  const [editingInterest, setEditingInterest] =
    useState<InterestAreaResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [interestToDelete, setInterestToDelete] =
    useState<InterestAreaResponse | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Estados de sincronização
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch interest areas from API
  const {
    interestAreasOptions,
    error: interestAreasError,
    isLoading: isLoadingInterests,
  } = useInterestAreasConcepts();

  // Load user's existing interests on component mount
  useEffect(() => {
    const loadExistingInterests = async () => {
      try {
        const userInterests =
          (await InterestAreasService.personInterestAreasList(
            false,
          )) as InterestAreaResponse[];
        setUserInterestObjects(userInterests);
        setOriginalInterests([...userInterests]); // Cópia para comparação
        setHasChanges(false);
      } catch (error) {
        console.error("Error loading user interests:", error);
        setSyncError("Erro ao carregar interesses. Tente novamente.");
      }
    };

    if (!isLoadingInterests && interestAreasOptions.length > 0) {
      loadExistingInterests();
    }
  }, [isLoadingInterests, interestAreasOptions]);

  // Função para deletar interesse APENAS LOCALMENTE
  const deleteInterestLocally = (interest: InterestAreaResponse) => {
    if (interest.is_temporary) {
      // Se é temporário, apenas remove da lista
      setUserInterestObjects((prev) =>
        prev.filter((i) => i.interest_area_id !== interest.interest_area_id),
      );
    } else {
      // Se existe no servidor, marca como deletado
      setUserInterestObjects((prev) =>
        prev.map((i) =>
          i.interest_area_id === interest.interest_area_id
            ? { ...i, is_deleted: true }
            : i,
        ),
      );
    }
    setHasChanges(true);
  };

  // Função para salvar interesse APENAS LOCALMENTE
  const saveInterestLocally = (interestData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => {
    console.log("saveInterestLocally chamado:", interestData);

    if (interestData.id) {
      // Editando interesse existente
      setUserInterestObjects((prev) =>
        prev.map((interest) =>
          interest.interest_area_id.toString() === interestData.id
            ? {
                ...interest,
                interest_name: interestData.interest_name,
                triggers: interestData.triggers.map((t) => ({
                  trigger_name: t,
                })),
              }
            : interest,
        ),
      );
    } else {
      // Criando novo interesse temporário
      const tempInterest: InterestAreaResponse = {
        interest_area_id: Date.now(), // ID temporário único
        interest_name: interestData.interest_name,
        observation_concept_id: 2000000201,
        triggers: interestData.triggers.map((t) => ({ trigger_name: t })),
        is_temporary: true, // Flag para identificar que é temporário
      };

      setUserInterestObjects((prev) => [...prev, tempInterest]);
    }

    console.log("Marcando hasChanges = true");
    setHasChanges(true);
  };

  // Função para sincronizar com servidor (apenas quando clicar em Salvar)
  const syncWithServer = async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      // 1. Deletar interesses marcados como deletados
      const toDelete = userInterestObjects.filter(
        (i) => i.is_deleted && !i.is_temporary,
      );
      for (const interest of toDelete) {
        await InterestAreasService.personInterestAreasDestroy(
          interest.interest_area_id,
        );
      }

      // 2. Criar novos interesses temporários
      const toCreate = userInterestObjects.filter(
        (i) => i.is_temporary && !i.is_deleted,
      );
      const createdInterests = [];

      for (const interest of toCreate) {
        const newInterestArea: InterestArea = {
          interest_name: interest.interest_name,
          observation_concept_id: 2000000201,
          triggers:
            interest.triggers?.map((t) => ({
              trigger_name: t.trigger_name,
              observation_concept_id: 2000000301,
            })) || [],
        };

        const result =
          await InterestAreasService.personInterestAreasCreate(newInterestArea);
        if (result && "interest_area_id" in result) {
          createdInterests.push({
            ...result,
            interest_name: interest.interest_name,
            triggers: interest.triggers,
          } as InterestAreaResponse);
        }
      }

      // 3. Atualizar interesses modificados (deletar e recriar)
      const toUpdate = userInterestObjects.filter(
        (i) =>
          !i.is_temporary &&
          !i.is_deleted &&
          hasInterestChanged(
            i,
            originalInterests.find(
              (o) => o.interest_area_id === i.interest_area_id,
            ),
          ),
      );

      const updatedInterests = [];
      for (const interest of toUpdate) {
        // Deletar versão antiga
        await InterestAreasService.personInterestAreasDestroy(
          interest.interest_area_id,
        );

        // Criar versão nova
        const updatedInterestArea: InterestArea = {
          interest_name: interest.interest_name,
          observation_concept_id: 2000000201,
          triggers:
            interest.triggers?.map((t) => ({
              trigger_name: t.trigger_name,
              observation_concept_id: 2000000301,
            })) || [],
        };

        const result =
          await InterestAreasService.personInterestAreasCreate(
            updatedInterestArea,
          );
        if (result && "interest_area_id" in result) {
          updatedInterests.push({
            ...result,
            interest_name: interest.interest_name,
            triggers: interest.triggers,
          } as InterestAreaResponse);
        }
      }

      // 4. Atualizar estado local com dados finais do servidor
      const finalInterests = [
        ...userInterestObjects.filter(
          (i) => !i.is_temporary && !i.is_deleted && !toUpdate.includes(i),
        ),
        ...createdInterests,
        ...updatedInterests,
      ];

      setUserInterestObjects(finalInterests);
      setOriginalInterests([...finalInterests]);
      setHasChanges(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (error) {
      console.error("Error syncing with server:", error);
      setSyncError("Erro ao salvar interesses. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper para verificar se interesse foi modificado
  const hasInterestChanged = (
    current: InterestAreaResponse,
    original?: InterestAreaResponse,
  ) => {
    if (!original) return false;

    const currentTriggers =
      current.triggers?.map((t) => t.trigger_name).sort() || [];
    const originalTriggers =
      original.triggers?.map((t) => t.trigger_name).sort() || [];

    return (
      current.interest_name !== original.interest_name ||
      JSON.stringify(currentTriggers) !== JSON.stringify(originalTriggers)
    );
  };

  // Navigation functions
  const handleBannerIconClick = () => {
    navigate("/diary");
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
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

  // Handlers para a interface
  const handleEditInterest = (interest: InterestAreaResponse) => {
    setEditingInterest(interest);
    setDialogOpen(true);
  };

  const handleCreateNewInterest = () => {
    setEditingInterest(null);
    setDialogOpen(true);
  };

  const handleDeleteInterest = (interest: InterestAreaResponse) => {
    setInterestToDelete(interest);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (interestToDelete) {
      deleteInterestLocally(interestToDelete);
      setConfirmDeleteOpen(false);
      setInterestToDelete(null);
    }
  };

  const handleSaveInterest = (interestData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => {
    saveInterestLocally(interestData);
    setDialogOpen(false);
    setEditingInterest(null);
  };

  const handleSaveChanges = async () => {
    await syncWithServer();
    setEditionMode(false);
  };

  const handleCancelChanges = () => {
    // Restaurar estado original
    setUserInterestObjects([...originalInterests]);
    setHasChanges(false);
    setEditionMode(false);
  };

  // Filtrar interesses para exibição (excluir os marcados como deletados)
  const visibleInterests = userInterestObjects.filter((i) => !i.is_deleted);

  return (
    <div className="min-h-screen bg-primary relative">
      {/* HEADER fixo */}
      <div className="relative z-10 bg-primary">
        <HomeBanner
          title="Registro diário"
          subtitle="Adicione seus interesses e acompanhe seu progresso"
          onIconClick={handleBannerIconClick}
        />
        <h2 className="text-xl font-semibold pl-4 pb-2 mt-4 text-typography">
          Meus Interesses
        </h2>
      </div>

      {/* ÁREA SCROLLÁVEL - Lista de Interesses */}
      <div
        className="px-4 overflow-y-auto"
        style={{ paddingBottom: "180px", maxHeight: "calc(100vh - 140px)" }}
      >
        {visibleInterests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-foreground text-lg font-medium mb-2">
              Nenhum interesse selecionado
            </p>
            <p className="text-sm text-muted-foreground">
              Adicione seus interesses para começar!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleInterests.map((interest) => (
              <div
                key={interest.interest_area_id}
                onClick={() => {
                  if (editionMode) {
                    handleEditInterest(interest);
                  }
                }}
                className={
                  "bg-card border-border rounded-xl p-5 shadow-sm transition-all duration-200 relative group" +
                  (editionMode
                    ? " cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-ring hover:bg-accent/50"
                    : "")
                }
              >
                {/* botão de deletar */}
                {editionMode && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <X
                      size={20}
                      className="text-red-500 hover:text-red-600 cursor-pointer hover:scale-110 transition-all duration-200 bg-background rounded-full p-1 shadow-md border border-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInterest(interest);
                      }}
                    />
                  </div>
                )}

                <h3 className="font-bold text-lg text-card-foreground mb-2 flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 bg-gradient-interest-indicator rounded-full flex-shrink-0"></span>
                  <span className="break-words min-w-0">
                    {interest.interest_name}
                  </span>
                  {interest.is_temporary && (
                    <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium flex-shrink-0">
                      Não salvo
                    </span>
                  )}
                  {interest.observation_concept_id === 2000000201 &&
                    !interest.is_temporary && (
                      <span className="ml-2 text-xs bg-violet-600 text-white dark:bg-purple-900/50 dark:text-purple-200 px-2 py-1 rounded-full font-medium border border-violet-700 dark:border-purple-700 flex-shrink-0">
                        Personalizado
                      </span>
                    )}
                </h3>
                <div className="space-y-1">
                  {interest.triggers?.map((t, index) => (
                    <div
                      key={`${t.trigger_name}-${index}`}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0 mt-2"></span>
                      <span className="break-words min-w-0">
                        {t.trigger_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MENSAGENS DE SUCESSO/ERRO - Fixas acima dos botões */}
      <div className="fixed bottom-36 left-0 right-0 px-4 z-20">
        {syncSuccess && (
          <div className="flex justify-center">
            <SuccessMessage
              message="Interesses salvos com sucesso!"
              className="animate-in slide-in-from-bottom-5 duration-300 shadow-lg backdrop-blur-sm"
            />
          </div>
        )}
        {syncError && (
          <div className="flex justify-center">
            <ErrorMessage
              message={syncError}
              variant="destructive"
              onClose={() => setSyncError(null)}
              onRetry={() => setSyncError(null)}
              className="animate-in slide-in-from-bottom-5 duration-300 shadow-lg backdrop-blur-sm"
            />
          </div>
        )}
      </div>

      {/* BOTÕES FIXOS - Sempre visíveis acima da navegação */}
      <div className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-gradient-button-background backdrop-blur-sm border-t border-gray-200/20 z-20">
        {editionMode ? (
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={handleCancelChanges}
              className="flex-1 bg-background/50 border-border/30 text-foreground hover:bg-background/70 transition-all duration-200 backdrop-blur-sm text-sm py-2"
              disabled={isSyncing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              className={`flex-1 bg-gradient-button-save hover:bg-gradient-button-save-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm py-2 ${
                !hasChanges ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSyncing || !hasChanges}
            >
              {isSyncing
                ? "..."
                : hasChanges
                  ? "✓ Salvar Mudanças"
                  : "✓ Salvar"}
            </Button>
            <Button
              onClick={handleCreateNewInterest}
              className="flex-1 bg-gradient-button-new hover:bg-gradient-button-new-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm py-2"
              disabled={isSyncing}
            >
              + Novo
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-center px-2">
            <Button
              onClick={() => setEditionMode(true)}
              className="bg-gradient-button-edit hover:bg-gradient-button-edit-hover text-white w-full max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-2.5 rounded-xl font-semibold text-sm"
              disabled={isSyncing}
            >
              ✏️ Editar Interesses
            </Button>
          </div>
        )}
      </div>

      {/* NAVEGAÇÃO INFERIOR - Sempre no fundo */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          initialActiveId="home"
          onItemClick={handleNavigationClick}
        />
      </div>

      {/* DIALOGS */}
      <EditInterestDialog
        open={dialogOpen}
        initialData={
          editingInterest
            ? {
                id: editingInterest.interest_area_id.toString(),
                interest_name: editingInterest.interest_name || "",
                triggers:
                  editingInterest.triggers?.map((t) => t.trigger_name) || [],
              }
            : undefined
        }
        onClose={() => {
          setDialogOpen(false);
          setEditingInterest(null);
        }}
        onSave={handleSaveInterest}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Excluir Interesse"
        description={`Tem certeza que deseja excluir "${interestToDelete?.interest_name}"?`}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setInterestToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
