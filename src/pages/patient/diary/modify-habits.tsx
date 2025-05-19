import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/forms/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select_habit";
import { TextField } from "@/components/ui/text_input_diary";
import BackArrow from "@/components/ui/back_arrow";

const ModifyHabits = () => {
  const navigate = useNavigate();
  const [habitName, setHabitName] = useState("");
  const [measurementType, setMeasurementType] = useState<
    "scale" | "hours" | "times" | "yesno"
  >("scale");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(-1, {
      state: {
        newHabit: {
          id: Date.now().toString(),
          name: habitName,
          measurementType,
        },
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Back Arrow with proper navigation */}
      <div className="mb-6 cursor-pointer" onClick={() => navigate(-1)}>
        <BackArrow />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Criar Novo Hábito</h2>

        <TextField
          label="Nome do Hábito"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tipo de Medição</label>
          <Select
            value={measurementType}
            onValueChange={(value) => setMeasurementType(value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scale">Escala (1-10)</SelectItem>
              <SelectItem value="hours">Horas</SelectItem>
              <SelectItem value="times">Vezes</SelectItem>
              <SelectItem value="yesno">Sim/Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="orange" type="submit" className="w-full">
          Criar Hábito
        </Button>
      </form>
    </div>
  );
};

export default ModifyHabits;
