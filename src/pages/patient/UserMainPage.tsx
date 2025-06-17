import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { X } from "lucide-react";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useState, useEffect } from "react";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import { Button } from "@/components/forms/button";
import SuccessMessage from "@/components/ui/success-message";
import ErrorMessage from "@/components/ui/error-message";
import EditInterestDialog from "../../components/EditInterestsDialog";
import { ConfirmDialog } from "@/components/ui/confirmDialog";
import { ApiService } from "@/api";
import { TypeEnum } from "@/api/models/TypeEnum";

interface InterestAreaResponse {
  observation_id?: number;
  person_id: number | null;
  interest_area: InterestArea;
  is_temporary?: boolean; // Flag para identificar criados localmente
  is_deleted?: boolean; // Flag para identificar deletados localmente
  is_modified?: boolean; // Flag para identificar modificados localmente
  attention_point_date?: string; // ✅ Data quando foi marcado como attention point
  provider_name: string; // ✅ Nome do profissional que marcou
}

export default function UserMainPage() {
  const navigate = useNavigate();

  // Estados principais
  const [userInterestObjects, setUserInterestObjects] = useState<
    InterestAreaResponse[]
  >([]);
  const [originalInterests, setOriginalInterests] = useState<
    InterestAreaResponse[]
  >([]);

  // Para comparar mudanças
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

  // Load user's existing interests on component mount
  useEffect(() => {
    const loadExistingInterests = async () => {
      try {
        // Fetch interests for the current user using their person_id
        const userEntity = await ApiService.apiUserEntityRetrieve();
        const userInterests = await InterestAreasService.apiInterestAreaList(
          userEntity["person_id"],
        );

        console.log("Dados da API:", userInterests);

        setUserInterestObjects(userInterests);
        setOriginalInterests([...userInterests]); // Cópia para comparação
        setHasChanges(false);
      } catch (error) {
        console.error("Error loading user interests:", error);
        setSyncError("Erro ao carregar interesses. Tente novamente.");
      }
    };

    loadExistingInterests();
  }, []);

  // Função para deletar interesse APENAS LOCALMENTE
  const deleteInterestLocally = (interest: InterestAreaResponse) => {
    if (interest.is_temporary) {
      // Se é temporário, apenas remove da lista
      setUserInterestObjects((prev) =>
        prev.filter((i) => i.observation_id !== interest.observation_id),
      );
    } else {
      // Se existe no servidor, marca como deletado
      setUserInterestObjects((prev) =>
        prev.map((i) =>
          i.observation_id === interest.observation_id
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
          interest.observation_id.toString() === interestData.id
            ? {
              ...interest, // Copy all existing properties
              interest_area: {
                ...interest.interest_area, // Copy existing interest_area
                name: interestData.interest_name, // Update name
                triggers: interestData.triggers.map((t) => ({
                  name: t,
                  type: "boolean" as TypeEnum,
                  response: null, // Keep existing response or set to null
                })),
              },
              is_modified: true, // Flag to identify modified interests
            }
          : interest,
        ),
      );
    } else {
      // Criando novo interesse temporário
      const tempInterest: InterestAreaResponse = {
        // observation_id: -Date.now(), // Temporary negative ID to avoid conflicts
        person_id: null,
        interest_area: {
          name: interestData.interest_name, // Corrected from interestData.interest.name
          is_attention_point: false,
          marked_by: [],
          triggers: interestData.triggers.map((t) => ({
            name: t, // Using name instead of trigger_name
            type: "boolean" as TypeEnum, // Default type, can be adjusted later
          })),
        },
        is_temporary: true, // Flag para identificar que é temporário
        provider_name: "", // Required by your interface
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
    // 1. Delete marked interests
    const toDelete = userInterestObjects.filter(
      (i) => i.is_deleted && !i.is_temporary,
    );
    
    for (const interest of toDelete) {
      if (interest.observation_id) {
        await InterestAreasService.apiInterestAreaDestroy(
          interest.observation_id.toString(),
        );
      }
    }

    // 2. Create new temporary interests
    const toCreate = userInterestObjects.filter(
      (i) => i.is_temporary && !i.is_deleted,
    );
    const createdInterests = [];

    for (const interest of toCreate) {
      try {
        const newInterestArea = {
          interest_area: {
            name: interest.interest_area.name,
            triggers: interest.interest_area.triggers?.map((t) => ({
              name: t.name,
              type: "boolean" as TypeEnum,
              response: null,
            })) || [],
            marked_by: [],
            is_attention_point: false,
            shared_with_provider: false,
          },
        };

        const result = await InterestAreasService.apiInterestAreaCreate(
          newInterestArea,
        );

        if (result) {
          createdInterests.push({
            observation_id: result.observation_id,
            person_id: result.person_id,
            interest_area: result.interest_area,
            provider_name: "",
          } as InterestAreaResponse);
        }
      } catch (error) {
        console.error("Error creating interest:", error);
        setSyncError(`Erro ao criar interesse: ${interest.interest_area.name}`);
      }
    }

    // 3. Update modified interests using PUT method
    const toUpdate = userInterestObjects.filter(
      (i) => !i.is_temporary && !i.is_deleted && i.is_modified,
    );
    const updatedInterests = [];

    for (const interest of toUpdate) {
      if (!interest.observation_id) continue;

      try {
        // Prepare the complete interest area object for PUT update
        const updateData = {
          interest_area: {
            name: interest.interest_area.name,
            triggers: interest.interest_area.triggers?.map((t) => ({
              name: t.name,
              type: t.type || ("boolean" as TypeEnum),
              response: t.response || null,
            })) || [],
            is_attention_point: interest.interest_area.is_attention_point || false,
            marked_by: interest.interest_area.marked_by || [],
            shared_with_provider: interest.interest_area.shared_with_provider || false,
          },
        };

        console.log(`Updating interest ${interest.observation_id} with:`, updateData);

        // Use PUT method to update the complete interest area
        const result = await InterestAreasService.apiInterestAreaUpdate(
          interest.observation_id.toString(),
          updateData,
        );

        if (result) {
          updatedInterests.push({
            observation_id: result.observation_id,
            person_id: result.person_id,
            interest_area: result.interest_area,
            provider_name: interest.provider_name || "",
            attention_point_date: interest.attention_point_date,
          } as InterestAreaResponse);
        }
      } catch (error: any) {
        console.error(`Error updating interest ${interest.observation_id}:`, error);
        
        // Provide specific error messages
        if (error?.response?.status === 404) {
          setSyncError(`Interesse não encontrado: ${interest.interest_area.name}`);
        } else if (error?.response?.status === 400) {
          setSyncError(`Dados inválidos para: ${interest.interest_area.name}`);
        } else {
          setSyncError(`Erro ao atualizar: ${interest.interest_area.name}`);
        }
      }
    }

    // 4. Build final state with all successful operations
    const finalInterests = [
      // Keep unchanged interests
      ...userInterestObjects.filter(
        (i) => !i.is_temporary && !i.is_deleted && !i.is_modified,
      ),
      // Add newly created interests
      ...createdInterests,
      // Add updated interests
      ...updatedInterests,
    ];

    // Update local state
    setUserInterestObjects(finalInterests);
    setOriginalInterests([...finalInterests]);
    setHasChanges(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);

  } catch (error: any) {
    console.error("Error syncing with server:", error);
    
    if (error?.message) {
      setSyncError(`Erro ao sincronizar: ${error.message}`);
    } else {
      setSyncError("Erro ao salvar interesses. Tente novamente.");
    }
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
      current.interest_area.triggers?.map((t) => t.name).sort() || [];
    const originalTriggers =
      original.interest_area.triggers?.map((t) => t.name).sort() || [];

    return (
      current.interest_area.name !== original.interest_area.name ||
      JSON.stringify(currentTriggers) !== JSON.stringify(originalTriggers)
    );
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
  // Restaurar estado original e limpar flags
  const restoredInterests = originalInterests.map(interest => ({
    ...interest,
    is_modified: false,
    is_deleted: false,
  }));
  
  setUserInterestObjects(restoredInterests);
  setHasChanges(false);
  setEditionMode(false);
};

  // Filtrar interesses para exibição (excluir os marcados como deletados)
  const visibleInterests = userInterestObjects.filter((i) => !i.is_deleted);

  return (
    <div className="min-h-screen bg-background relative">
      {/* HEADER fixo */}
      <div className="relative z-10 bg-background">
        <HomeBanner
          title="Registro diário"
          subtitle="Adicione seus interesses e acompanhe seu progresso"
          onIconClick={handleBannerIconClick}
        />
        <h2 className="text-titulowindow font-work-sans pl-4 pb-2 mt-4 text-typography">
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
            <div className="w-16 h-16 bg-gray2/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-typography text-lg font-medium mb-2">
              Nenhum interesse selecionado
            </p>
            <p className="text-desc-titulo text-typography/60">
              Adicione seus interesses para começar!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visibleInterests.map((interest) => (
              <div
                key={interest.observation_id}
                onClick={() => {
                  if (editionMode) {
                    handleEditInterest(interest);
                    console.log("Editando interesse:");
                  }
                }}
                className={`
                  bg-card border border-card-border rounded-xl p-5 shadow-sm transition-all duration-200 relative group
                  ${
                    interest.interest_area.is_attention_point
                      ? "border-orange-300 ring-2 ring-orange-100 dark:border-orange-400 dark:ring-orange-900/30"
                      : ""
                  }
                  ${
                    editionMode
                      ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-ring hover:bg-accent/50"
                      : ""
                  }
                `}
              >
                {/* botão de deletar */}
                {editionMode && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <X
                      size={20}
                      className="text-destructive hover:text-destructive/80 cursor-pointer hover:scale-110 transition-all duration-200 bg-card rounded-full p-1 shadow-md border border-card-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInterest(interest);
                      }}
                    />
                  </div>
                )}

                <h3 className="font-work-sans text-topicos2 text-card-foreground mb-2 flex items-center gap-2 flex-wrap">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      interest.interest_area.is_attention_point
                        ? "bg-orange-400"
                        : "bg-gradient-interest-indicator"
                    }`}
                  ></span>
                  <span className="break-words min-w-0">
                    {interest.interest_area.name}
                  </span>
                  {interest.is_temporary && (
                    <span className="ml-2 text-desc-campos bg-yellow text-white px-2 py-1 rounded-full font-inter font-medium flex-shrink-0">
                      Não salvo
                    </span>
                  )}
                  {interest.interest_area.is_attention_point && (
                    <span className="ml-2 text-desc-campos typescriptbg-red-100 text-red-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full font-inter font-medium flex-shrink-0 border border-orange-200 dark:border-orange-700">
                      ⚠️ Atenção
                    </span>
                  )}
                  {interest.is_modified && (
                    <span className="ml-2 text-desc-campos bg-blue-500 text-white px-2 py-1 rounded-full font-inter font-medium flex-shrink-0">
                      Modificado
                    </span>
                  )}
                </h3>

                {/* ✅ Provider Info - quando é attention point */}
                {interest.interest_area.is_attention_point && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-orange-900/20 border border-blue-200 dark:border-orange-800 rounded-lg">
                    <p className="text-desc-campos font-inter text-blue-700 dark:text-orange-300 flex items-center gap-2">
                      <span className="text-blue-500 dark:text-orange-400">
                        👤
                      </span>
                      <span className="font-medium">Marcado por:</span>
                      <span className="font-semibold">
                        {interest.provider_name || "Profissional não informado"}
                      </span>
                    </p>
                    {interest.attention_point_date && (
                      <p className="text-desc-campos font-inter text-blue-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                        📅{" "}
                        {new Date(
                          interest.attention_point_date,
                        ).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  {interest.interest_area.triggers?.map((t, index) => (
                    <div
                      key={`${t.name}-${index}`}
                      className="flex items-start gap-2 text-campos-preenchimento2 font-inter text-card-foreground/70"
                    >
                      <span className="w-1 h-1 bg-card-foreground/40 rounded-full flex-shrink-0 mt-2"></span>
                      <span className="break-words min-w-0">{t.name}</span>
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
      <div className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-gradient-button-background backdrop-blur-sm border-t border-gray2-border/20 z-20">
        {editionMode ? (
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <Button
              variant="outlineWhite"
              onClick={handleCancelChanges}
              className="flex-1 bg-offwhite/50 border-gray2-border/30 text-typography hover:bg-offwhite/70 transition-all duration-200 backdrop-blur-sm text-desc-titulo py-2"
              disabled={isSyncing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              className={`flex-1 bg-gradient-button-save hover:bg-gradient-button-save-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-desc-titulo py-2 ${
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
              className="flex-1 bg-gradient-button-new hover:bg-gradient-button-new-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-desc-titulo py-2"
              disabled={isSyncing}
            >
              + Novo
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-center px-2">
            <Button
              onClick={() => setEditionMode(true)}
              className="bg-gradient-button-edit hover:bg-gradient-button-edit-hover text-white w-full max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-2.5 rounded-xl font-semibold text-desc-titulo"
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
                id: editingInterest.observation_id.toString(),
                interest_name: editingInterest.interest_area.name || "",
                triggers:
                  editingInterest.interest_area.triggers?.map((t) => t.name) ||
                  [],
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
        description={`Tem certeza que deseja excluir "${interestToDelete?.interest_area.name}"?`}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setInterestToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
