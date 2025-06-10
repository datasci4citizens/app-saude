import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { MultiSelectCustom } from "@/components/forms/multi_select_custom";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useState, useEffect } from "react";
import { useInterestAreasConcepts } from "@/utils/conceptLoader";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import { Button } from "@/components/forms/button";

// Extended interface for API response that includes the ID
interface InterestAreaResponse extends InterestArea {
  interest_area_id: number;
  concept_id?: number;
  interest_name?: string;
}

export default function UserMainPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [originalInterests, setOriginalInterests] = useState<string[]>([]);
  const [duplicateInterestError, setDuplicateInterestError] = useState<string | null>(null);
  const [userInterestObjects, setUserInterestObjects] = useState<
    InterestAreaResponse[]
  >([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

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

        // Store the full objects for deletion purposes
        setUserInterestObjects(userInterests);

        // Extract concept IDs for the UI
        const conceptIds = userInterests
          .map((interest) => interest.concept_id?.toString() || "")
          .filter((id) => id !== "");

        setSelectedInterests(conceptIds);
        setOriginalInterests(conceptIds); // Store original interests for comparison
      } catch (error) {
        console.error("Error loading user interests:", error);
      }
    };

    if (!isLoadingInterests && interestAreasOptions.length > 0) {
      loadExistingInterests();
    }
  }, [isLoadingInterests, interestAreasOptions]);

  // Handle interest selection change (just updates local state)
  const handleInterestChange = (selectedValues: string[]) => {
    setSelectedInterests(selectedValues);
    setSyncSuccess(false);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const addedInterests = selectedInterests.filter(
      (id) => !originalInterests.includes(id),
    );
    const removedInterests = originalInterests.filter(
      (id) => !selectedInterests.includes(id),
    );
    return addedInterests.length > 0 || removedInterests.length > 0;
  };

  // Sync changes to server
  const syncInterestsWithServer = async () => {
    const all_interests = await InterestAreasService.personInterestAreasList();
    console.log("All interests from server:", all_interests);

    setSyncError(null);
    setDuplicateInterestError(null);
    setIsSyncing(true);

    try {

      // Find which interests were added and removed
      const addedInterests = selectedInterests.filter(
        (id) => !originalInterests.includes(id),
      );
      const removedInterests = originalInterests.filter(
        (id) => !selectedInterests.includes(id),
      );

      // Check ALL added interests for duplicates BEFORE processing any
      const duplicateInterests: string[] = [];
      
      for (const interestId of addedInterests) {
        const existingInterest = all_interests.find(
          interest_area => interest_area.observation_concept_id === parseInt(interestId)
        );

        if (existingInterest) {
          const interestName = existingInterest.interest_name || "Interesse sem nome";
          duplicateInterests.push(interestName);
        }
      }

      // If we found ANY duplicates, show error and stop processing
      if (duplicateInterests.length > 0) {
        if (duplicateInterests.length === 1) {
          setDuplicateInterestError(`O interesse "${duplicateInterests[0]}" já foi adicionado anteriormente`);
        } else {
          setDuplicateInterestError(`Os seguintes interesses já foram adicionados: ${duplicateInterests.join(", ")}`);
        }
        setIsSyncing(false);
        return; // Stop execution here
      }

      // Create new interests
      for (const interestId of addedInterests) {
        const interestOption = interestAreasOptions.find(
          (opt) => opt.value === interestId,
        );

        if (interestOption) {
          const newInterestArea: InterestArea = {
            observation_concept_id: parseInt(interestId),
          };

          console.log(interestId);
          console.log("new", newInterestArea);

          // Verificar se o interesse já existe
          let interestExists = false;
          let existingInterestName = "";
          for (const interest_area of all_interests) {
            if (interest_area.observation_concept_id === parseInt(interestId)) {
              if(interest_area.interest_name) {
                existingInterestName = interest_area.interest_name;
              } else {
                existingInterestName = "";
              }
              interestExists = true;
              break;
            }
          }

          // Se o interesse já existe, pula para o próximo usando continue
          if (interestExists) {
            if (existingInterestName !== "") {
              setDuplicateInterestError(
                "O interesse " +
                  existingInterestName +
                  " já foi adicionado anteriormente",
              );
            } else {
              setDuplicateInterestError("Nome do interesse não encontrado");
            }
            continue;
          }

          // Cria o interesse se não existir
          const result =
            await InterestAreasService.personInterestAreasCreate(
              newInterestArea,
            );

          // Update our local state with the new interest object
          if (result && "interest_area_id" in result) {
            const newInterestWithId = result as InterestAreaResponse;
            setUserInterestObjects((prev) => [...prev, newInterestWithId]);
          }
        }
      }

      // Remove interests
      for (const conceptId of removedInterests) {
        const interestToDelete = userInterestObjects.find((interest) => {
          const interestConceptId = interest.concept_id?.toString().trim();
          const searchConceptId = conceptId.toString().trim();

          return interestConceptId === searchConceptId;
        });

        if (interestToDelete && interestToDelete.interest_area_id) {
          await InterestAreasService.personInterestAreasDestroy(
            interestToDelete.interest_area_id,
          );

          // Update our local state
          setUserInterestObjects((prev) =>
            prev.filter(
              (interest) =>
                interest.interest_area_id !== interestToDelete.interest_area_id,
            ),
          );
        }
      }

      // Update originalInterests to reflect the current state
      setOriginalInterests([...selectedInterests]);
      setSyncSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSyncSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error syncing interests:", error);
      setSyncError("Erro ao salvar interesses. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  const clearDuplicateError = () => {
    setDuplicateInterestError(null);
  };

  // Navigation functions
  const handleEmergencyClick = () => {
    navigate("/emergency-user");
  };

  const handleAppointmentClick = () => {
    navigate("/reminders");
  };

  const handleBannerIconClick = () => {
    navigate("/diary");
  };

  const handleSelectedInterests = () => {
    navigate("/user-selected-interests");
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        // Already on home
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

  const handleCreateCustomInterest = () => {
    navigate("/user-create-interest");
  };

  return (
    <div className="bg-primary min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <HomeBanner
          title="Registro diário"
          subtitle="Adicione seus interesses e acompanhe seu progresso"
          onIconClick={handleBannerIconClick}
        />

        <div className="px-4 py-5 justify-center gap-4">
          {/* Multiselect - using API data */}
          <MultiSelectCustom
            id="interests"
            name="interests"
            label="Meus Interesses"
            options={interestAreasOptions}
            value={selectedInterests}
            onChange={handleInterestChange}
            isLoading={isLoadingInterests}
            placeholder={
              isLoadingInterests
                ? "Carregando..."
                : "Selecione suas áreas de interesse"
            }
          />

          {/* Sync button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={syncInterestsWithServer}
              className="bg-primary border-selection border-2 hover:bg-secondary/90 text-secondary-foreground px-6 py-3 font-bold uppercase tracking-wide"
              disabled={!hasUnsavedChanges() || isSyncing}
            >
              {isSyncing ? "Enviando..." : "Enviar Interesses"}
            </Button>
          </div>

          {/* Duplicate interest error*/}
          {duplicateInterestError && (
            <div className="bg-destructive border border-destructive rounded-lg p-4 text-white mt-4">
              <div className="flex justify-between items-start">
                <p className="text-sm">{duplicateInterestError}</p>
                <button
                  onClick={clearDuplicateError}
                  className="text-white hover:text-white text-lg font-bold ml-2"
                  aria-label="Fechar aviso"
                >
                  ×
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={clearDuplicateError}
                  className="text-sm text-white hover:text-white underline"
                >
                  Entendi
                </button>
              </div>
            </div>
          )}

          {/* Success message */}
          {syncSuccess && (
            <div className="flex justify-center mt-4">
              <div className="inline-block p-3 bg-green-100 border border-green-500 text-green-700 rounded-md">
                <p className="whitespace-nowrap">
                  Interesses salvos com sucesso!
                </p>
              </div>
            </div>
          )}

          {/* Error handling for interest areas */}
          {interestAreasError && (
            <div className="flex justify-center mt-4">
              <div className="inline-block p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
                <p className="whitespace-nowrap">
                  Erro ao carregar áreas de interesse
                </p>
              </div>
            </div>
          )}

          {/* Error handling for syncing */}
          {syncError && (
            <div className="flex justify-center mt-4">
              <div className="inline-block p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
                <p className="whitespace-nowrap">{syncError}</p>
              </div>
            </div>
          )}
        </div>
        {/* Top banner */}

        {/* Custom interest button */}
        <div>
          <div className="px-4 mb-2 flex justify-center">
            <Button
              onClick={handleSelectedInterests}
              className="bg-selection hover:bg-secondary/90 text-typography flex items-center gap-2 px-6"
            >
              Ver Interesses Selecionados
            </Button>
          </div>

          {/* Custom interest button */}
          <div className="px-4 mb-2 flex justify-center">
            <Button
              onClick={handleCreateCustomInterest}
              className="bg-selection hover:bg-secondary/90 text-typography flex items-center gap-2 px-6"
            >
              Criar Interesse Personalizado
            </Button>
          </div>
        </div>

        {/* Navigation bar */}
        <BottomNavigationBar
          variant="user"
          initialActiveId="home"
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
