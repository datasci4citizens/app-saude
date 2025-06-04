import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DiariesService } from "@/api/services/DiariesService";
import { DateRangeTypeEnum } from "@/api";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";

// Properly define interface for triggers
interface Trigger {
  trigger_name: string;
  custom_trigger_name: string | null;
  observation_concept_id: number;
  trigger_id: number;
  value_as_string: string | null;
  response?: string;
  shared?: boolean;
}

// Properly define interface for user interests
interface UserInterest extends InterestArea {
  interest_area_id: number;
  interest_name?: string;
  response?: string;
  shared?: boolean;
  triggers?: Trigger[];
}

export default function DiaryInfoForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [timeRange, setTimeRange] = useState<"today" | "sinceLast">(
    "sinceLast",
  );
  const [freeText, setFreeText] = useState("");

  // User interests state
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);

  // Share switch for text
  const [shareText, setShareText] = useState(false);

  // Load user interests
  useEffect(() => {
    const fetchUserInterests = async () => {
      console.log("Starting to fetch user interests...");
      setIsLoadingInterests(true);

      try {
        const interests = await InterestAreasService.personInterestAreasList();
        console.log("Raw interests received:", interests);

        if (!interests || interests.length === 0) {
          console.warn("No interests received from API");
          setUserInterests([]);
          return;
        }

        // Convert to UserInterest format with response tracking
        const formattedInterests: UserInterest[] = interests.map(
          (interest) => ({
            ...interest,
            interest_area_id:
              (interest as any).interest_area_id || Math.random(),
            response: "", // Initialize empty response
            shared: false, // Initialize as not shared
          }),
        );

        console.log("Formatted user interests:", formattedInterests);
        setUserInterests(formattedInterests);
      } catch (error) {
        console.error("Error fetching user interests:", error);
        // Set some test interests for development
        setUserInterests([
          {
            interest_area_id: 1,
            observation_concept_id: null,
            custom_interest_name: "Teste Interesse 1",
            value_as_string: "Teste Interesse 1",
            response: "",
            shared: false,
            triggers: [],
          },
          {
            interest_area_id: 2,
            observation_concept_id: null,
            custom_interest_name: "Teste Interesse 2",
            value_as_string: "Teste Interesse 2",
            response: "",
            shared: false,
            triggers: [],
          },
        ]);
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchUserInterests();
  }, []);

  const handleTriggerResponseChange = (
    interestId: number,
    triggerId: number,
    response: string,
  ) => {
    setUserInterests((prev) =>
      prev.map((interest) =>
        interest.interest_area_id === interestId
          ? {
              ...interest,
              triggers:
                interest.triggers?.map((trigger) =>
                  trigger.trigger_id === triggerId
                    ? { ...trigger, response }
                    : trigger,
                ) || [],
            }
          : interest,
      ),
    );
  };

  // Handle interest response change
  const handleInterestResponseChange = (
    interestId: number,
    response: string,
  ) => {
    setUserInterests((prev) =>
      prev.map((interest) =>
        interest.interest_area_id === interestId
          ? { ...interest, response }
          : interest,
      ),
    );
  };

  // Handle individual interest sharing toggle
  const handleInterestSharingToggle = (interestId: number, shared: boolean) => {
    setUserInterests((prev) =>
      prev.map((interest) =>
        interest.interest_area_id === interestId
          ? { ...interest, shared }
          : interest,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format interest areas according to the expected API structure
      const formattedInterestAreas = userInterests
        .filter(
          (interest) =>
            interest.response?.trim() !== "" ||
            interest.triggers?.some((t) => t.response?.trim() !== ""),
        )
        .map((interest) => {
          // Get triggers with responses
          const triggersWithResponses =
            interest.triggers?.filter(
              (trigger) => trigger.response && trigger.response.trim() !== "",
            ) || [];

          return {
            interest_area_id: interest.interest_area_id,
            value_as_string: interest.response || null,
            shared_with_provider: interest.shared || false,
            triggers: triggersWithResponses.map((trigger) => ({
              trigger_id: trigger.trigger_id,
              value_as_string: trigger.response || "",
            })),
          };
        })
        .filter((interest) => interest.triggers.length > 0); // Only include interests with answered triggers

      let diary_shared = false;
      if (shareText || userInterests.some((interest) => interest.shared)) {
        diary_shared = true;
      }

      const diary = {
        date_range_type:
          timeRange === "today"
            ? DateRangeTypeEnum.TODAY
            : DateRangeTypeEnum.SINCE_LAST,
        text: freeText,
        text_shared: shareText,
        interest_areas: formattedInterestAreas,
      };

      console.log("Submitting diary:", diary);

      await DiariesService.diariesCreate(diary);
      navigate("/diary");
    } catch (error) {
      console.error("Failed to submit diary", error);
      alert("Ocorreu um erro ao salvar o diário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Time Range Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-accent2-700 mb-1">
          A qual período de tempo esse diário se refere?
        </h3>
        <div className="flex flex-col gap-2">
          <RadioCheckbox
            id="today"
            label="Hoje"
            checked={timeRange === "today"}
            onCheckedChange={() => setTimeRange("today")}
            className="py-2"
          />
          <RadioCheckbox
            id="sinceLast"
            label="Desde o último diário"
            checked={timeRange === "sinceLast"}
            onCheckedChange={() => setTimeRange("sinceLast")}
            className="py-2"
          />
        </div>
      </div>

      {/* User Interests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-accent2-700">
            Seus Interesses
          </h3>
        </div>

        {isLoadingInterests ? (
          <div className="flex justify-center py-4">
            <p className="text-typography">Carregando seus interesses...</p>
          </div>
        ) : userInterests.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-typography text-sm">
              Você ainda não tem interesses cadastrados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userInterests.map((interest) => {
              const interestName =
                interest.interest_name ||
                interest.custom_interest_name ||
                interest.value_as_string ||
                "Interesse";

              return (
                <div key={interest.interest_area_id} className="space-y-3">
                  {/* Interest card and switch row */}
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <HabitCard
                        title={interestName}
                        className="inline-block w-auto min-w-fit max-w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-typography">
                        Compartilhar
                      </span>
                      <Switch
                        checked={interest.shared || false}
                        onCheckedChange={(checked) =>
                          handleInterestSharingToggle(
                            interest.interest_area_id,
                            checked,
                          )
                        }
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Render triggers if available */}
                  {interest.triggers && interest.triggers.length > 0 && (
                    <div className="ml-4 space-y-4 border-l-2 border-gray2 pl-4 mt-4">
                      {interest.triggers.map((trigger) => (
                        <div key={trigger.trigger_id} className="space-y-2">
                          {/* Trigger title */}
                          <div className="flex items-center justify-between">
                            <div className="flex">
                              <HabitCard
                                title={
                                  trigger.trigger_name ||
                                  trigger.custom_trigger_name ||
                                  "Pergunta relacionada"
                                }
                                className="inline-block w-auto min-w-fit max-w-full text-sm bg-secondary/20"
                              />
                            </div>
                          </div>

                          {/* Trigger text field */}
                          <TextField
                            id={`trigger-${interest.interest_area_id}-${trigger.trigger_id}`}
                            name={`trigger-${interest.interest_area_id}-${trigger.trigger_id}`}
                            value={trigger.response || ""}
                            onChange={(e) =>
                              handleTriggerResponseChange(
                                interest.interest_area_id,
                                trigger.trigger_id,
                                e.target.value,
                              )
                            }
                            placeholder=""
                            className="border-gray2 border-2 focus:border-selection"
                            multiline={true}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Free Text Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-accent2-700">
            Observações Gerais
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-typography">Compartilhar</span>
            <Switch checked={shareText} onCheckedChange={setShareText} />
          </div>
        </div>
        <TextField
          id="freeText"
          name="freeText"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Descreva como você se sente ou qualquer observação importante..."
          className="border-gray2 border-2 focus:border-selection"
          multiline={true}
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 text-center">
        <Button
          variant="orange"
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-[280px] text-typography mx-auto py-3 text-base"
        >
          {isSubmitting ? "Salvando..." : "SALVAR"}
        </Button>
      </div>
    </form>
  );
}
