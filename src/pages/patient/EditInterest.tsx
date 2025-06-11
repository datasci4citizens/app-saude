import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import type { InterestAreaTriggerCreate } from "@/api/models/InterestAreaTriggerCreate";
import BottomNavigationBar from "@/components/ui/navigator-bar";

// Extended interface for API response that includes the ID
interface InterestAreaResponse extends InterestArea {
  interest_area_id: number;
}

export default function EditInterest() {
  // Get active navigation item based on current route
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

  const navigate = useNavigate();
  const { interestId } = useParams<{ interestId: string }>();

  // Interest state
  const [interest, setInterest] = useState<InterestAreaResponse | null>(null);

  // New trigger state
  const [newQuestion, setNewQuestion] = useState("");
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Form state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch interest data
  useEffect(() => {
    const fetchInterest = async () => {
      if (!interestId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response =
          (await InterestAreasService.personInterestAreasRetrieve(
            parseInt(interestId),
          )) as InterestAreaResponse;

        setInterest(response);
      } catch (err) {
        console.error("Error fetching interest:", err);
        setError("Erro ao carregar interesse. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterest();
  }, [interestId]);

  // Handle adding a new trigger/question
  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      setQuestionError("Digite uma pergunta");
      return;
    }

    if (!interest) return;

    setError(null);
    setSuccess(null);

    console.log("interest before adding question:", interest);

    try {
      // Create new trigger
      const newTrigger: InterestAreaTriggerCreate = {
        observation_concept_id: 2000301, // Specific concept ID for custom triggers
        trigger_name: newQuestion.trim(),
        value_as_string: null,
      };

      // Add to existing triggers
      const updatedTriggers = [...(interest.triggers || []), newTrigger];

      // Update interest with new triggers
      const updatedInterest: InterestArea = {
        ...interest,
        triggers: updatedTriggers,
      };

      // Update on the server
      console.log("Updating interest with new trigger:");
      console.log(updatedInterest);
      await InterestAreasService.personInterestAreasCreate(updatedInterest);

      // Update local state
      setInterest((prev) =>
        prev
          ? {
              ...prev,
              triggers: updatedTriggers,
            }
          : null,
      );

      // Clear input and show success
      setNewQuestion("");
      setSuccess("Pergunta adicionada com sucesso!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Erro ao adicionar pergunta. Tente novamente.");
    }
  };

  // Handle removing a trigger/question
  const handleRemoveTrigger = async (index: number) => {
    if (!interest || !interest.triggers) return;

    setError(null);
    setSuccess(null);

    try {
      // Create a copy of triggers without the removed one
      const updatedTriggers = interest.triggers.filter((_, i) => i !== index);

      // Update interest with filtered triggers
      const updatedInterest: InterestArea = {
        ...interest,
        triggers: updatedTriggers,
      };

      // Update on the server
      await InterestAreasService.personInterestAreasCreate(updatedInterest);

      // Update local state
      setInterest((prev) =>
        prev
          ? {
              ...prev,
              triggers: updatedTriggers,
            }
          : null,
      );

      setSuccess("Pergunta removida com sucesso!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error removing trigger:", err);
      setError("Erro ao remover pergunta. Tente novamente.");
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/user-selected-interests");
  };

  // Check if this is a custom interest
  const isCustomInterest = () => {
    return !interest?.concept_id && Boolean(interest?.interest_name);
  };

  return (
    <div className="p-4 bg-primary min-h-screen pb-24">
      {/* Header */}
      <Header
        title={
          interest?.interest_name ||
          interest?.value_as_string ||
          "Editar Interesse"
        }
        onBackClick={handleBack}
      />

      <div className="px-4 py-5">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-typography">Carregando informações...</p>
          </div>
        ) : error ? (
          <div className="p-3 mb-4 bg-destructive bg-opacity-10 border border-destructive text-whtie rounded-md">
            <p>{error}</p>
          </div>
        ) : interest ? (
          <>
            {/* Success Message */}
            {success && (
              <div className="p-3 mb-4 bg-green-500 bg-opacity-10 border border-green-500 text-green-600 rounded-md">
                <p>{success}</p>
              </div>
            )}

            {/* Current Triggers */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-typography mb-4">
                Perguntas associadas
              </h2>

              {interest.triggers && interest.triggers.length > 0 ? (
                <div className="space-y-2">
                  {interest.triggers.map((trigger, index) => (
                    <div
                      key={index}
                      className="bg-offwhite p-3 rounded-md flex items-center justify-between"
                    >
                      <span className="text-typography">
                        {trigger.trigger_name || "Sem descrição"}
                      </span>
                      <Button

                        variant="default"
                        size="sm"
                        className="p-1 h-8 w-8 rounded-full text-red-500"
                        onClick={() => handleRemoveTrigger(index)}
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
                          <path d="M18 6L6 18"></path>
                          <path d="M6 6l12 12"></path>
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-typography text-sm italic">
                  Nenhuma pergunta associada a este interesse.
                </p>
              )}
            </div>

            {/* Add New Question */}
            <div className="mt-6">
              <h2 className="text-lg font-medium text-typography mb-4">
                Criar nova pergunta
              </h2>

              <TextField
                id="new-question"
                name="new-question"
                label=""
                value={newQuestion}
                onChange={(e) => {
                  setNewQuestion(e.target.value);
                  if (questionError) setQuestionError(null);
                }}
                placeholder="Nova pergunta"
                error={questionError}
              />

              {/* Add Question Button */}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleAddQuestion}
                  className="bg-primary border border-2 border-selection hover:bg-primary/90 text-typography font-bold py-3 px-6 uppercase"
                  type="button"
                >
                  Adicionar pergunta
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-8">
            <p className="text-typography">Interesse não encontrado.</p>
          </div>
        )}
      </div>
          <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
