import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import type { DiaryCreate } from "@/api/models/DiaryCreate";
import { DiariesService } from "@/api/services/DiariesService";
import { DateRangeTypeEnum } from "@/api";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";

interface UserInterest extends InterestArea {
  interest_area_id: number;
  concept_name?: string;
  response?: string;
  shared?: boolean;
}

interface TrackableItem {
  id: string;
  name: string;
  measurementType: string;
  value?: string | null | undefined;
}

export default function DiaryInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [timeRange, setTimeRange] = useState<"today" | "sinceLast">(
    "sinceLast",
  );
  const [freeText, setFreeText] = useState("");

  // User interests state
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);

  // Share switches for different sections
  const [shareHabits, setShareHabits] = useState(false);
  const [shareInterests, setShareInterests] = useState(false);
  const [shareText, setShareText] = useState(false);

  const [habits, setHabits] = useState<TrackableItem[]>([]);

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

  useEffect(() => {
    if (location.state?.newHabit) {
      setHabits((prev) => [...prev, location.state.newHabit]);
    }
  }, [location.state]);

  const handleItemChange = (
    items: TrackableItem[],
    setItems: React.Dispatch<React.SetStateAction<TrackableItem[]>>,
    itemId: string,
    value: string,
  ) => {
    // console.log("Changing item:", itemId, "to value:", value);
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, value } : item)),
    );
  };

  // Handle interest response change
  const handleInterestResponseChange = (
    interestId: number,
    response: string,
  ) => {
    // console.log("Changing interest response:", interestId, "to:", response);
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
    console.log("Toggling interest sharing:", interestId, "to:", shared);
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
      const diary: DiaryCreate = {
        date_range_type:
          timeRange === "today"
            ? DateRangeTypeEnum.TODAY
            : DateRangeTypeEnum.SINCE_LAST,
        text: freeText,
        text_shared: shareText,
        habits_shared: shareHabits,
        wellness_shared: shareInterests,
        habits: habits
          .filter(
            (habit) =>
              habit.value !== undefined &&
              habit.value !== null &&
              habit.value !== "",
          )
          .map((habit) => ({
            concept_id: habit.id,
            value: habit.value,
            shared: shareHabits,
          })),
        // Include user interests responses in wellness section
        wellness: userInterests
          .filter(
            (interest) =>
              interest.response !== undefined &&
              interest.response !== null &&
              interest.response !== "",
          )
          .map((interest) => ({
            concept_id: interest.interest_area_id.toString(),
            value: interest.response,
            shared: interest.shared || false,
          })),
      };

      console.log("Submitting diary:", diary);

      await DiariesService.diariesCreate(diary);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(-1);
    } catch (error) {
      console.error("Failed to submit diary", error);
      alert("Ocorreu um erro ao salvar o diário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTrackableItem = (
    item: TrackableItem,
    items: TrackableItem[],
    setItems: React.Dispatch<React.SetStateAction<TrackableItem[]>>,
  ) => {
    // Keep your existing renderTrackableItem logic for habits
    return (
      <div key={item.id} className="space-y-4">
        <HabitCard title={item.name} />
      </div>
    );
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
              const interestName = interest.concept_name;

              return (
                <div key={interest.interest_area_id} className="space-y-3">
                  {/* Put card and switch on the same row */}
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <HabitCard
                        title={interestName}
                        className="inline-block w-auto min-w-fit max-w-full"
                      />
                    </div>

                    {/* Individual sharing toggle aligned with the card */}
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

                  {/* Text field below */}
                  <div className="space-y-2">
                    <TextField
                      id={`interest-${interest.interest_area_id}`}
                      name={`interest-${interest.interest_area_id}`}
                      value={interest.response || ""}
                      onChange={(e) =>
                        handleInterestResponseChange(
                          interest.interest_area_id,
                          e.target.value,
                        )
                      }
                      placeholder={`Como você se sente em relação a ${interestName.toLowerCase()}?`}
                      className="border-gray2 border-2 focus:border-selection focus:ring-1 focus:ring-selection"
                    />
                  </div>
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
            <span className="text-sm text-typography">
              Compartilhar com profissionais
            </span>
            <Switch checked={shareText} onCheckedChange={setShareText} />
          </div>
        </div>
        <TextField
          id="freeText"
          name="freeText"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Descreva como você se sente ou qualquer observação importante..."
          className="w-full"
          multiline
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
