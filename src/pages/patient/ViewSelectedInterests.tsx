import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import { Button } from "@/components/forms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterestAreaTrigger } from "@/api/models/InterestAreaTrigger";
import { AccountService } from "@/api";

// Extended interface for API response that includes the ID
interface InterestAreaResponse {
  interest_area_id: number;
  observation_concept_id?: number | null;
  interest_name?: string | null;
  value_as_string?: string | null;
  triggers?: InterestAreaTrigger[];
}

export default function ViewSelectedInterests() {
  const navigate = useNavigate();
  const [userInterests, setUserInterests] = useState<InterestAreaResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user interests on component mount
  useEffect(() => {
    const loadUserInterests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userEntity = await AccountService.accountsRetrieve();
        const interests = (await InterestAreasService.apiInterestAreaList(
          userEntity.person_id,
        )) as InterestAreaResponse[];
        console.log("Loaded interests:", interests);
        setUserInterests(interests);
      } catch (err) {
        console.error("Error loading interests:", err);
        setError("Failed to load your interests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInterests();
  }, []);

  // Handle unlinking/deleting an interest
  const handleUnlinkInterest = async (interestId: number) => {
    try {
      // For both custom and default interests, we call the same delete endpoint
      const userEntity = await AccountService.accountsRetrieve();
      await InterestAreasService.apiInterestAreaDestroy(
        String(interestId),
        userEntity.person_id,
      );

      // Remove from local state after successful delete
      setUserInterests((prev) =>
        prev.filter((interest) => interest.interest_area_id !== interestId),
      );

      // No need for different handling between custom/default at the UI level
      // The server takes care of either deleting custom interests or just unlinking default ones
    } catch (err) {
      console.error("Error removing interest:", err);
      setError("Failed to remove interest. Please try again.");
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/user-main-page");
  };

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  // Handle main navigation
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

  // Check if an interest is custom or default
  const isCustomInterest = (interest: InterestAreaResponse) => {
    //console.log("Checking if interest is custom:", interest);
    return !(interest.observation_concept_id === 2000201);
  };

  return (
    <div className="bg-primary min-h-screen pb-24">
      {/* Header */}
      <div className="p-4">
        <Header title="Interesses Cadastrados" onBackClick={handleBack} />
      </div>

      <div className="px-4 py-2">
        {/* Error display */}
        {error && (
          <div className="p-3 mb-4 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-typography">Carregando seus interesses...</p>
          </div>
        ) : (
          /* Interests list */
          <div className="flex flex-col gap-4">
            {userInterests.length === 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-typography">
                  Você ainda não tem interesses cadastrados.
                </p>
              </div>
            ) : (
              userInterests.map((interest) => (
                <div
                  key={interest.interest_area_id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/user-edit-interest/${interest.interest_area_id}`)
                  }
                >
                  <Card className="bg-offwhite border-none text-typography">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>
                          {interest.interest_name}
                          <span className="text-sm font-normal">
                            {isCustomInterest(interest)
                              ? " (Padrão)"
                              : " (Personalizado)"}
                          </span>
                        </span>

                        <Button
                          variant="orange"
                          size="sm"
                          className="bg-transparent hover:bg-destructive p-1 h-8 w-8 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation(); // This prevents the click from bubbling up to the parent div
                            handleUnlinkInterest(interest.interest_area_id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Show triggers if any */}
                      {interest.triggers && interest.triggers.length > 0 ? (
                        <ul className="text-sm pl-1 space-y-1">
                          {interest.triggers.map((trigger, index) => (
                            <li key={`${trigger.name}-${index}`} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{trigger.name || "Sem descrição"}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic">Sem gatilhos</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()} // Controlled active state
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
