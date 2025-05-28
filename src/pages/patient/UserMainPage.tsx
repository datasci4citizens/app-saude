import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import { MultiSelectCustom } from "@/components/forms/multi_select_custom";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import useSWR from "swr";
import { useState } from "react";

import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";

// Fetcher function for interest areas
const interestAreasFetcher = async (): Promise<InterestArea[]> => {
  return await InterestAreasService.personInterestAreasList();
};

export default function UserMainPage() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Fetch interest areas from API
  const { 
    data: interestAreas, 
    error: interestAreasError, 
    isLoading: isLoadingInterests 
  } = useSWR('interest-areas', interestAreasFetcher);

  // Transform API data to options format for MultiSelectCustom
  const interestOptions = interestAreas?.map((area) => ({
    value: area.id?.toString() || '',
    label: area.name || 'Área sem nome'
  })) || [];

  // Handle interest selection change
  const handleInterestChange = (selectedValues: string[]) => {
    setSelectedInterests(selectedValues);
    console.log('Selected interests:', selectedValues);
    
    // Here you could make API calls to save the selected interests
    // For example:
    // selectedValues.forEach(async (interestId) => {
    //   await InterestAreasService.personInterestAreasCreate({
    //     id: parseInt(interestId),
    //     name: interestOptions.find(opt => opt.value === interestId)?.label
    //   });
    // });
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
          options={interestOptions}
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