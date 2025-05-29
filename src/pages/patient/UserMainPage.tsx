import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { MultiSelectCustom } from "@/components/forms/multi_select_custom";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useInterestAreasConcepts } from "@/utils/conceptLoader";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";

export default function UserMainPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch interest areas from API
  const { 
    interestAreasOptions,
    error: interestAreasError, 
    isLoading: isLoadingInterests 
  } = useInterestAreasConcepts();

  // Load user's existing interests on component mount
  useEffect(() => {
    const loadExistingInterests = async () => {
      try {
        const userInterests = await InterestAreasService.personInterestAreasList();
        const interestIds = userInterests.map(interest => interest.id?.toString() || '');
        setSelectedInterests(interestIds);
      } catch (error) {
        console.error("Error loading user interests:", error);
        // Don't show error for loading existing interests, just start with empty array
      }
    };

    if (!isLoadingInterests && interestAreasOptions.length > 0) {
      loadExistingInterests();
    }
  }, [isLoadingInterests, interestAreasOptions]);

  // Handle interest selection change with automatic saving
  // at each select we save the changes
  const handleInterestChange = async (selectedValues: string[]) => {
    const previousValues = selectedInterests;
    setSelectedInterests(selectedValues);
    setSaveError(null);
    setIsSaving(true);

    try {
      // Find which interests were added and removed
      //  console.log('Selected values:', selectedValues);
      //  console.log('Available options:', interestAreasOptions);

      // Find which interests were added and removed
      const addedInterests = selectedValues.filter(id => !previousValues.includes(id));
      const removedInterests = previousValues.filter(id => !selectedValues.includes(id));

      for (const interestId of addedInterests) {
        // console.log(`Looking for interest with ID: ${interestId}`);
        const interestOption = interestAreasOptions.find(opt => 
          opt.value === interestId
        );

        // console.log('Found option:', interestOption);

        if (interestOption) {
          //console.log("entering interestOption if")
          //Create InterestArea object with correct structure
          const newInterestArea: InterestArea = {
            observation_concept_id: parseInt(interestId), // Use the concept ID from the selected interest
            custom_interest_name: interestOption.label,   // Store the label as custom name
            value_as_string: interestOption.label,        // Optional: store the value as string
            triggers: []                                  // Empty triggers array
          };
          
          const result = await InterestAreasService.personInterestAreasCreate(newInterestArea);
          // console.log(result);
        }
      }

      // removing interests
      if (removedInterests.length > 0) {
        for (const interestId of removedInterests) {
          // console.log(`Removing interest with ID: ${interestId}`);
          const interestOption = interestAreasOptions.find(opt =>
             opt.value === interestId);
          
          if (interestOption) {
            // console.log("entering interestOption if")
            await InterestAreasService.personInterestAreasDestroy(parseInt(interestId));
          }
        }
      }

      console.log('Successfully saved interest changes');
    } catch (error) {
      console.error("Error saving interests:", error);
      setSaveError("Erro ao salvar interesses. Tente novamente.");
      
      // Revert to previous state on error
      setSelectedInterests(previousValues);
    } finally {
      setIsSaving(false);
    }
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
        navigate("/add-professional");
        break;
    }
  };

  return (
    <div className="bg-primary h-full pb-24" style={{ minHeight: "100vh" }}>
      {/* Top banner */}
      <HomeBanner
        title="Registro diário"
        subtitle="Cheque registro dos seus pacientes"
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
          placeholder={isLoadingInterests ? "Carregando..." : "Selecione suas áreas de interesse"}
        />

        {/* Error handling for interest areas */}
        {interestAreasError && (
          <div className="flex justify-center mt-4">
            <div className="inline-block p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
              <p className="whitespace-nowrap">Erro ao carregar áreas de interesse</p>
            </div>
          </div>
        )}


      </div>

      {/* Navigation bar */}
      <BottomNavigationBar
        variant="user"
        initialActiveId="home"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}