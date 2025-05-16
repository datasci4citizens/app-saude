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

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex flex-col md:flex-row gap-3 w-full items-center"
            >
              <div className="flex-1 min-w-[200px] w-full">
                <HabitCard title={habit.name} />
              </div>
              <div className="w-full md:w-[200px]">
                <Select
                  value={habit.value}
                  onValueChange={(value) =>
                    handleItemChange(habits, setHabits, habit.id, value)
                  }
                >
                  <SelectTrigger hasSelection={!!habit.value} className="h-10">
                    <SelectValue
                      placeholder={
                        habit.measurementType === "scale"
                          ? "1-10"
                          : habit.measurementType === "yes_no"
                            ? "Sim/Não"
                            : habit.measurementType === "hours"
                              ? "Horas"
                              : "Vezes"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectOptions(habit.measurementType)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <div
            className="flex flex-col md:flex-row gap-3 w-full cursor-pointer items-center"
            onClick={handleAddHabit}
          >
            <div className="flex-1 min-w-[200px]">
              <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full w-14 h-14 flex items-center justify-center">
                <span className="text-2xl text-gray-600">+</span>
              </div>
            </div>
            <div className="w-full md:w-[200px] flex items-center justify-center">
              <span className="text-sm text-gray-500">Adicionar hábito</span>
            </div>
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

        <div className="space-y-3">
          {wellBeingQuestions.map((question) => (
            <div
              key={question.id}
              className="flex flex-col md:flex-row gap-3 w-full items-center"
            >
              <div className="flex-1 min-w-[200px] w-full">
                <HabitCard title={question.name} />
              </div>
              <div className="w-full md:w-[200px]">
                <Select
                  value={question.value}
                  onValueChange={(value) =>
                    handleItemChange(
                      wellBeingQuestions,
                      setWellBeingQuestions,
                      question.id,
                      value,
                    )
                  }
                >
                  <SelectTrigger
                    hasSelection={!!question.value}
                    className="h-10"
                  >
                    <SelectValue
                      placeholder={
                        question.measurementType === "scale"
                          ? "1-10"
                          : question.measurementType === "yesno"
                            ? "Sim/Não"
                            : question.measurementType === "hours"
                              ? "Horas"
                              : "Vezes"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectOptions(question.measurementType)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
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
          {isSubmitting ? "Salvando..." : "SALVAR DIÁRIO"}
        </Button>
      </div>
    </form>
  );
}
