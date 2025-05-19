import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select_habit";
import { TextField } from "@/components/ui/text_input_diary";
import { Button } from "@/components/forms/button";
import type { DiaryCreate } from "@/api/models/DiaryCreate";
import { DiariesService } from "@/api/services/DiariesService";
import { DateRangeTypeEnum } from "@/api";
import { ConceptService } from "@/api/services/ConceptService";
import { Slider } from "@/components/ui/slider";


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
  const [timeRange, setTimeRange] = useState<"today" | "sinceLast">(
    "sinceLast",
  );
  const [freeText, setFreeText] = useState("");

  const [shareHabits, setShareHabits] = useState(false);
  const [shareWellBeing, setShareWellBeing] = useState(false);
  const [shareText, setShareText] = useState(false);

  const [habits, setHabits] = useState<TrackableItem[]>([]);

  const [wellBeingQuestions, setWellBeingQuestions] = useState<TrackableItem[]>(
    [],
  );

function getSliderParams(measurementType: string) {
  switch (measurementType) {
    case "scale":
      return { min: 1, max: 10, step: 1 };
    case "hours":
      return { min: 1, max: 24, step: 1 };
    case "times":
      return { min: 1, max: 10, step: 1 };
    case "yes_no":  // Add handling for yes/no if needed
    case "yesno":   // Handle both cases if necessary
    default:
      return { min: 0, max: 1, step: 1 }; // Or use different input type
  }
}
  
  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const concepts = await ConceptService.apiConceptList(
          "Wellness",
          "pt",
          "has_value_type",
        );

        const formatted: TrackableItem[] = concepts.map((c) => ({
          id: c.concept_id.toString(),
          name: c.translated_name ?? c.concept_name,
          measurementType: c.related_concept?.concept_code ?? "unknown", // ex: "scale", "yes_no"
          value: c.related_concept?.concept_code,
        }));

        console.log("Conceitos de bem-estar:", formatted);

        setWellBeingQuestions(formatted);
      } catch (error) {
        console.error("Erro ao buscar conceitos de bem-estar", error);
      }
    };

    fetchConcepts();
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
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, value } : item)),
    );
  };

  const handleAddHabit = () => {
    navigate("/modify-habits"); // Changed from '/create-habit' to '/modify-habits'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const diary: DiaryCreate = {
        date_range_type: DateRangeTypeEnum.SINCE_LAST, // FIXME: this should be dynamic
        text: freeText,
        text_shared: shareText,
        habits_shared: shareHabits,
        wellness_shared: shareWellBeing,
        habits: habits.map((habit) => ({
          concept_id: habit.id,
          value: habit.value,
          shared: shareHabits,
        })),
        wellness: wellBeingQuestions.map((q) => ({
          concept_id: q.id,
          value: q.value,
          shared: shareWellBeing,
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

  const renderSelectOptions = (type: TrackableItem["measurementType"]) => {
    switch (type) {
      case "scale":
        return Array.from({ length: 10 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>
            {i + 1}
          </SelectItem>
        ));
      case "yes_no":
        return (
          <>
            <SelectItem value="value_yes">Sim</SelectItem>
            <SelectItem value="value_no">Não</SelectItem>
          </>
        );
      case "hours":
        return Array.from({ length: 24 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>
            {i + 1}h
          </SelectItem>
        ));
      case "times":
        return Array.from({ length: 10 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>
            {i + 1} vez{i !== 0 ? "es" : ""}
          </SelectItem>
        ));
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Time Range Section - Tightened */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
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

    {/* Habits Section */}
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
          Seus Hábitos Personalizados
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Compartilhar com profissionais da saúde
          </span>
          <Switch checked={shareHabits} onCheckedChange={setShareHabits} />
        </div>
      </div>

      <div className="space-y-6">
        {habits.map((habit) => {
          const measurementType = habit.measurementType.toLowerCase();
          const isYesNoType = ["yes_no", "yesno"].includes(measurementType);
          const isScaleType = measurementType === "scale";
          
          // Value parsing and conversion
          const rawValue = habit.value ? parseInt(habit.value) : null;
          const isValid = rawValue !== null && !isNaN(rawValue);

          // Get display value with suffix
          const getDisplayValue = () => {
            if (!isValid) {
              return {
                text: isYesNoType ? "sim ou não" : 
                    isScaleType ? "-/5" :
                    measurementType === "hours" ? "- horas" :
                    measurementType === "times" ? "- vezes" : "-",
                value: "-"
              };
            }

            if (isYesNoType) {
              return { text: rawValue === 1 ? "sim" : "não", value: rawValue.toString() };
            }
            if (isScaleType) {
              const frontendValue = Math.round(rawValue / 2);
              return { text: `${frontendValue}/5`, value: frontendValue.toString() };
            }
            return {
              text: `${rawValue} ${measurementType === "hours" ? "horas" : "vezes"}`,
              value: rawValue.toString()
            };
          };

          const display = getDisplayValue();
          const sliderParams = (() => {
            if (isYesNoType) return { min: 0, max: 1, step: 1 };
            if (isScaleType) return { min: 1, max: 5, step: 1 };
            if (measurementType === "hours") return { min: 1, max: 24, step: 1 };
            if (measurementType === "times") return { min: 1, max: 10, step: 1 };
            return { min: 0, max: 1, step: 1 };
          })();

          return (
            <div key={habit.id} className="space-y-4">
              <HabitCard title={habit.name} />
              
              <div className="flex flex-col gap-2">
                <Slider
                  value={[isValid ? (isScaleType ? parseInt(display.value) : rawValue) : sliderParams.min]}
                  onValueChange={(value) => {
                    let backendValue;
                    if (isYesNoType) {
                      backendValue = value[0].toString();
                    } else if (isScaleType) {
                      backendValue = (value[0] * 2).toString();
                    } else {
                      backendValue = value[0].toString();
                    }
                    handleItemChange(
                      habits,
                      setHabits,
                      habit.id,
                      backendValue
                    );
                  }}
                  min={sliderParams.min}
                  max={sliderParams.max}
                  step={sliderParams.step}
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {sliderParams.min === 0 && isYesNoType ? "não" : sliderParams.min}
                    {isScaleType && "/5"}
                    {measurementType === "hours" && " horas"}
                    {measurementType === "times" && " vezes"}
                  </span>
                  <span className="font-medium text-primary">
                    {display.text}
                  </span>
                  <span>
                    {sliderParams.max === 1 && isYesNoType ? "sim" : sliderParams.max}
                    {isScaleType && "/5"}
                    {measurementType === "hours" && " horas"}
                    {measurementType === "times" && " vezes"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleAddHabit}
        >
          <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-2xl text-gray-600">+</span>
          </div>
          <span className="text-sm text-gray-500">Adicionar hábito</span>
        </div>
      </div>
    </div>

    {/* Well-being Section */}
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg text-neutral-700 mb-1">
          Bem-estar geral:
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Compartilhar com profissionais da saúde
          </span>
          <Switch
            checked={shareWellBeing}
            onCheckedChange={setShareWellBeing}
          />
        </div>
      </div>

      <div className="space-y-6">
        {wellBeingQuestions.map((question) => {
          const measurementType = question.measurementType.toLowerCase();
          const isYesNoType = ["yes_no", "yesno"].includes(measurementType);
          const isScaleType = measurementType === "scale";
          
          // Value parsing and conversion
          const rawValue = question.value ? parseInt(question.value) : null;
          const isValid = rawValue !== null && !isNaN(rawValue);

          // Get display value with suffix
          const getDisplayValue = () => {
            if (!isValid) {
              return {
                text: isYesNoType ? "sim ou não" : 
                    isScaleType ? "-/5" :
                    measurementType === "hours" ? "- horas" :
                    measurementType === "times" ? "- vezes" : "-",
                value: "-"
              };
            }

            if (isYesNoType) {
              return { text: rawValue === 1 ? "sim" : "não", value: rawValue.toString() };
            }
            if (isScaleType) {
              const frontendValue = Math.round(rawValue / 2);
              return { text: `${frontendValue}/5`, value: frontendValue.toString() };
            }
            return {
              text: `${rawValue} ${measurementType === "hours" ? "horas" : "vezes"}`,
              value: rawValue.toString()
            };
          };

          const display = getDisplayValue();
          const sliderParams = (() => {
            if (isYesNoType) return { min: 0, max: 1, step: 1 };
            if (isScaleType) return { min: 1, max: 5, step: 1 };
            if (measurementType === "hours") return { min: 1, max: 24, step: 1 };
            if (measurementType === "times") return { min: 1, max: 10, step: 1 };
            return { min: 0, max: 1, step: 1 };
          })();

          return (
            <div key={question.id} className="space-y-4">
              <HabitCard title={question.name} />
              
              <div className="flex flex-col gap-2">
                <Slider
                  value={[isValid ? (isScaleType ? parseInt(display.value) : rawValue) : sliderParams.min]}
                  onValueChange={(value) => {
                    let backendValue;
                    if (isYesNoType) {
                      backendValue = value[0].toString();
                    } else if (isScaleType) {
                      backendValue = (value[0] * 2).toString();
                    } else {
                      backendValue = value[0].toString();
                    }
                    handleItemChange(
                      wellBeingQuestions,
                      setWellBeingQuestions,
                      question.id,
                      backendValue
                    );
                  }}
                  min={sliderParams.min}
                  max={sliderParams.max}
                  step={sliderParams.step}
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {sliderParams.min === 0 && isYesNoType ? "não" : sliderParams.min}
                    {isScaleType && "/5"}
                    {measurementType === "hours" && " horas"}
                    {measurementType === "times" && " vezes"}
                  </span>
                  <span className="font-medium text-primary">
                    {display.text}
                  </span>
                  <span>
                    {sliderParams.max === 1 && isYesNoType ? "sim" : sliderParams.max}
                    {isScaleType && "/5"}
                    {measurementType === "hours" && " horas"}
                    {measurementType === "times" && " vezes"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Text Section */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg text-neutral-700 mb-1">Texto</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Compartilhar com profissionais da saúde
            </span>
            <Switch checked={shareText} onCheckedChange={setShareText} />
          </div>
        </div>

        <TextField
          size="large"
          multiline
          variant="static-orange"
          className="w-full min-h-[150px]"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 text-center">
        <Button
          variant="orange"
          size="lg"
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-[280px] mx-auto py-3 text-base"
        >
          {isSubmitting ? "Salvando..." : "SALVAR"}
        </Button>
      </div>
    </form>
  );
}
