import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { X } from "lucide-react";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useState, useEffect } from "react";
import { useInterestAreasConcepts } from "@/utils/conceptLoader";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import { Button } from "@/components/forms/button";
import EditInterestDialog from "../../components/EditInterestsDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// Extended interface for API response that includes the ID
interface InterestAreaResponse extends InterestArea {
  interest_area_id: number;
  concept_id?: number;
}

export default function UserMainPage() {
  const navigate = useNavigate();

  // Estados principais
  const [userInterestObjects, setUserInterestObjects] = useState<
    InterestAreaResponse[]
  >([]);
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
          (await InterestAreasService.personInterestAreasList()) as InterestAreaResponse[];
        setUserInterestObjects(userInterests);
      } catch (error) {
        console.error("Error loading user interests:", error);
        setSyncError("Erro ao carregar interesses. Tente novamente.");
      }
    };

    if (!isLoadingInterests && interestAreasOptions.length > 0) {
      loadExistingInterests();
    }
  }, [isLoadingInterests, interestAreasOptions]);

  // Função para deletar interesse do servidor
  const deleteInterestFromServer = async (interest: InterestAreaResponse) => {
    try {
      setIsSyncing(true);
      setSyncError(null);

      if (interest.interest_area_id) {
        await InterestAreasService.personInterestAreasDestroy(
          interest.interest_area_id,
        );

        // Remove do estado local
        setUserInterestObjects((prev) =>
          prev.filter((i) => i.interest_area_id !== interest.interest_area_id),
        );

        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error deleting interest:", error);
      setSyncError("Erro ao excluir interesse. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Função para salvar interesse editado/novo no servidor
  const saveInterestToServer = async (interestData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => {
    try {
      setIsSyncing(true);
      setSyncError(null);

      if (interestData.id) {
        // Editando interesse existente
        const existingInterest = userInterestObjects.find(
          (i) => i.interest_area_id.toString() === interestData.id,
        );

        if (existingInterest) {
          // Atualiza localmente (assumindo que a API não tem endpoint de update)
          setUserInterestObjects((prev) =>
            prev.map((interest) =>
              interest.interest_area_id.toString() === interestData.id
                ? {
                    ...interest,
                    observation_concept_id: 2000301, // Conceito padrão para interesses personalizados
                    interest_name: interestData.interest_name,
                    triggers: interestData.triggers.map((t) => ({
                      trigger_name: t,
                      observation_concept_id: 2000201,
                    })),
                  }
                : interest,
            ),
          );
        }
      } else {
        // Criando novo interesse personalizado
        const newInterestArea: InterestArea = {
          observation_concept_id: 2000301, // Conceito padrão para interesses personalizados
          interest_name: interestData.interest_name,
          triggers: interestData.triggers.map((t) => ({
            trigger_name: t,
            observation_concept_id: 2000201, // Conceito padrão para gatilhos personalizados
          })),
        };

        const result =
          await InterestAreasService.personInterestAreasCreate(newInterestArea);

        if (result && "interest_area_id" in result) {
          const newInterestWithId = {
            ...result,
            interest_name: interestData.interest_name,
            triggers: interestData.triggers.map((t) => ({ trigger_name: t })),
            is_custom: true,
          } as InterestAreaResponse;
          setUserInterestObjects((prev) => [...prev, newInterestWithId]);
        }
      }

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving interest:", error);
      setSyncError("Erro ao salvar interesse. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Navigation functions
  const handleBannerIconClick = () => {
    navigate("/diary");
  };

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
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

  const confirmDelete = async () => {
    if (interestToDelete) {
      await deleteInterestFromServer(interestToDelete);
      setConfirmDeleteOpen(false);
      setInterestToDelete(null);
    }
  };

  const handleSaveInterest = async (interestData: {
    id?: string;
    interest_name: string;
    triggers: string[];
  }) => {
    await saveInterestToServer(interestData);
    setDialogOpen(false);
    setEditingInterest(null);
  };

  const handleSaveChanges = () => {
    // Se houver mudanças pendentes, salvar aqui
    setEditionMode(false);
    setHasChanges(false);

    // Mostrar mensagem de sucesso
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

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
        {userInterestObjects.length === 0 ? (
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
            {userInterestObjects.map((interest) => (
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
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></span>
                  <span className="break-words min-w-0">
                    {interest.interest_name}
                  </span>
                  {interest.is_custom && (
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
          <div className="flex justify-center mb-2">
            <div className="inline-block p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-5 duration-300">
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400 text-sm">
                  ✅
                </span>
                <p className="font-medium text-sm">Interesses salvos!</p>
              </div>
            </div>
          </div>
        )}
        {syncError && (
          <div className="flex justify-center mb-2">
            <div className="inline-block p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-5 duration-300">
              <div className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400 text-sm">
                  ❌
                </span>
                <p className="font-medium text-sm">{syncError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTÕES FIXOS - Sempre visíveis acima da navegação */}
      <div className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-gradient-to-t from-primary via-primary to-transparent backdrop-blur-sm border-t border-gray-200/20 z-20">
        {editionMode ? (
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => setEditionMode(false)}
              className="flex-1 bg-background/50 border-border/30 text-foreground hover:bg-background/70 transition-all duration-200 backdrop-blur-sm text-sm py-2"
              disabled={isSyncing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm py-2"
              disabled={isSyncing}
            >
              {isSyncing ? "..." : "✓ Salvar"}
            </Button>
            <Button
              onClick={handleCreateNewInterest}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm py-2"
              disabled={isSyncing}
            >
              + Novo
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-center px-2">
            <Button
              onClick={() => setEditionMode(true)}
              className="bg-gradient-to-r from-selection to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-full max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-2.5 rounded-xl font-semibold text-sm"
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
          forceActiveId={getActiveNavId()} // Controlled active state
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
